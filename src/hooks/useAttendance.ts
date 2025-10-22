import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Attendance } from "@/types";
import { checkLocationPermission } from "@/lib/geolocation";

export function useAttendance(userId: string) {
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];

    // Auto-close previous day shifts
    const { data: openShifts } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
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
      .eq("date", today)
      .order("clock_in", { ascending: false });

    setTodayAttendance(todayData || []);
    const active = todayData?.find((a) => a.clock_in && !a.clock_out);
    setActiveSession(active || null);

    const { data: recentData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .order("date", { ascending: false })
      .order("clock_in", { ascending: false })
      .limit(30);

    setRecentAttendance(recentData || []);
  };

  const startShift = async () => {
    const locationCheck = await checkLocationPermission();

    if (!locationCheck.allowed) {
      alert(locationCheck.error || `You must be within 150m of office. Current distance: ${locationCheck.distance}m`);
      return;
    }
    setLoading(true);
    const now = new Date();
    await supabase.from("attendance").insert({
      employee_id: userId,
      date: now.toISOString().split("T")[0],
      clock_in: now.toTimeString().split(" ")[0],
      location: locationCheck.location,
    });
    await fetchAttendance();
    setLoading(false);
  };

  const endShift = async () => {
    if (!activeSession) return;
    setLoading(true);
    const now = new Date();
    const time = now.toTimeString().split(" ")[0];
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
    recentAttendance,
    loading,
    startShift,
    endShift,
    refetch: fetchAttendance,
  };
}
