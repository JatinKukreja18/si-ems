import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Attendance } from "@/types";
import { checkLocationPermission } from "@/lib/geolocation";
import { getDateISO, getLocalTime } from "@/lib/utils";

interface DailyAttendance {
  date: string;
  shifts: Attendance[];
  totalHours: number;
}

export function useAttendance(userId: string) {
  // State
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState<DailyAttendance[]>([]);
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().getMonth();

  const autoCloseOpenShifts = async (todayISO: string) => {
    const { data: openShifts } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .is("deleted_at", null)
      .is("clock_out", null)
      .lt("date", todayISO);

    if (!openShifts?.length) return;

    for (const shift of openShifts) {
      const clockIn = new Date(`${shift.date}T${shift.clock_in}`);
      const midnight = new Date(`${shift.date}T23:59:59`);
      const hours = (midnight.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      await supabase
        .from("attendance")
        .update({
          clock_out: "23:59:59",
          hours_worked: hours,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shift.id);
    }
  };
  const groupShiftsByDate = (shifts: Attendance[]): Record<string, Attendance[]> => {
    return shifts.reduce((acc, record) => {
      if (!acc[record.date]) acc[record.date] = [];
      acc[record.date].push(record);
      return acc;
    }, {} as Record<string, Attendance[]>);
  };

  const generateAllDatesInMonth = (year: number, monthIndex: number, grouped: Record<string, Attendance[]>): DailyAttendance[] => {
    console.log(monthIndex);

    const lastDay = new Date(year, monthIndex + 1, 0);
    const todayDateObj = new Date();
    const allDates: DailyAttendance[] = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);

      const dateStr = date.toISOString().split("T")[0];
      const shifts = grouped[dateStr] || [];
      const totalHours = shifts.reduce((sum, shift) => sum + (shift.hours_worked || 0), 0);

      allDates.push({ date: dateStr, shifts, totalHours });

      // only break after today's date
      if (date >= todayDateObj) break;
    }

    return allDates.reverse();
  };

  const fetchMonthlyAttendance = async (monthIndex: number) => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const { data: monthData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .gte("date", firstDay.toISOString().split("T")[0])
      .lte("date", lastDay.toISOString().split("T")[0])
      .is("deleted_at", null)
      .order("date", { ascending: false })
      .order("clock_in", { ascending: true });

    const grouped = groupShiftsByDate(monthData || []);
    const allDates = generateAllDatesInMonth(year, monthIndex, grouped);

    setMonthlyAttendance(allDates);
  };

  const fetchAttendance = async () => {
    const todayISO = getDateISO(new Date());
    await autoCloseOpenShifts(todayISO);

    const { data: todayData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .eq("date", todayISO)
      .order("clock_in", { ascending: false });

    setTodayAttendance(todayData || []);
    setActiveSession(todayData?.find((a) => a.clock_in && !a.clock_out) || null);
  };

  const startShift = async () => {
    try {
      const locationCheck = await checkLocationPermission();

      if (!locationCheck.allowed) {
        alert(locationCheck.error || "You are not at office location");
        return;
      }

      setLoading(true);
      const now = new Date();
      const todayISO = getDateISO(now);

      // Check for existing active shift
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("employee_id", userId)
        .eq("date", todayISO)
        .is("clock_out", null)
        .is("deleted_at", null)
        .maybeSingle();

      if (existing) {
        alert("You have one active shift");
        setLoading(false);
        return;
      }

      // Insert new shift
      const { error } = await supabase.from("attendance").insert({
        employee_id: userId,
        date: todayISO,
        clock_in: getLocalTime(now),
        location: locationCheck.location,
      });

      if (error) throw error;

      await fetchAttendance();
    } catch (error: any) {
      console.error("Start shift error:", error);
      alert(error.message || "Failed to start shift");
    } finally {
      setLoading(false);
    }
  };

  const endShift = async () => {
    if (!activeSession) return;

    try {
      setLoading(true);

      // Check location before allowing clock out
      const locationCheck = await checkLocationPermission();
      if (!locationCheck.allowed) {
        alert(`You must be at office location to clock out. Current distance: ${locationCheck.distance}m`);
        setLoading(false);
        return;
      }

      const now = new Date();
      const time = getLocalTime(now);

      // Calculate hours
      const clockIn = new Date(`1970-01-01T${activeSession.clock_in}`);
      const clockOut = new Date(`1970-01-01T${time}`);
      const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      const { error } = await supabase
        .from("attendance")
        .update({
          clock_out: time,
          hours_worked: hours,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeSession.id);

      if (error) throw error;

      await fetchAttendance();
    } catch (error: any) {
      console.error("End shift error:", error);
      alert(error.message || "Failed to end shift");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAttendance();
  }, [userId]);

  return {
    activeSession,
    todayAttendance,
    monthlyAttendance,
    loading,
    startShift,
    endShift,
    refetch: fetchAttendance,
    fetchMonthlyAttendance,
    currentMonth,
  };
}
