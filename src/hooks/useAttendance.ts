import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Attendance } from "@/types";
import { checkLocationPermission } from "@/lib/geolocation";
import { getLocalDate, getLocalTime } from "@/lib/utils";

interface DailyAttendance {
  date: string;
  shifts: Attendance[];
  totalHours: number;
}

export function useAttendance(userId: string) {
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState<DailyAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const currentMonth = new Date().getMonth();

  const fetchMonthlyAttendance = async (monthIndex: number) => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const today = getLocalDate(new Date());
    const startDate = firstDay.toISOString().split("T")[0];
    const endDate = lastDay.toISOString().split("T")[0];

    const { data: monthData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .is("deleted_at", null)
      .order("date", { ascending: false })
      .order("clock_in", { ascending: true });

    // Group by date
    const grouped: Record<string, Attendance[]> = {};
    monthData?.forEach((record) => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });

    // Convert to array with totals
    // const dailyData: DailyAttendance[] = Object.entries(grouped)
    //   .map(([date, shifts]) => {
    //     const totalHours = shifts.reduce((sum, shift) => sum + (shift.hours_worked || 0), 0);
    //     return { date, shifts, totalHours };
    //   })
    //   .sort((a, b) => b.date.localeCompare(a.date));

    const allDates: DailyAttendance[] = [];
    const daysInMonth = lastDay.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateStr = date.toISOString().split("T")[0];
      if (date > today) break;
      const shifts = grouped[dateStr] || []; // Empty array if no attendance
      const totalHours = shifts.reduce((sum, shift) => sum + (shift.hours_worked || 0), 0);

      allDates.push({ date: dateStr, shifts, totalHours });
    }
    setMonthlyAttendance(allDates.reverse());
  };
  const fetchAttendance = async () => {
    const today = getLocalDate();
    // Auto-close previous day shifts
    const { data: openShifts } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .is("deleted_at", null)
      .is("clock_out", null)
      .lt("date", today);

    if (openShifts && openShifts.length > 0) {
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
    }

    // Get today's shifts
    const { data: todayData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      // .is("deleted_at", null)
      .eq("date", today)
      .order("clock_in", { ascending: false });

    setTodayAttendance(todayData || []);
    const active = todayData?.find((a) => a.clock_in && !a.clock_out);
    setActiveSession(active || null);
  };

  const startShift = async () => {
    const locationCheck = await checkLocationPermission();

    if (!locationCheck.allowed) {
      alert(locationCheck.error || `You are not at office location`);
      return;
    }

    setLoading(true);

    const now = new Date();
    const today = getLocalDate(now);

    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("employee_id", userId)
      .eq("date", today)
      .is("clock_out", null)
      .maybeSingle();

    if (existing) {
      alert("You have one active shift");
      setLoading(false);
      return;
    }

    await supabase.from("attendance").insert({
      employee_id: userId,
      date: today,
      clock_in: getLocalTime(now),
      location: locationCheck.location,
    });
    await fetchAttendance();
    setLoading(false);
  };

  const endShift = async () => {
    if (!activeSession) return;
    setLoading(true);
    const now = new Date();
    const time = getLocalTime(now);
    const clockIn = new Date(`1970-01-01T${activeSession.clock_in}`);
    const clockOut = new Date(`1970-01-01T${time}`);
    const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    await supabase
      .from("attendance")
      .update({
        clock_out: time,
        hours_worked: hours,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeSession.id);

    await fetchAttendance();
    setLoading(false);
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
