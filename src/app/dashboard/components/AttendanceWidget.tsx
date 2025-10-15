"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Attendance } from "@/types";
import ClockInOutCard from "./ClockInOutCard";

export default function AttendanceWidget({ userId }: { userId: string | undefined }) {
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveShift();
  }, [userId]);

  const fetchActiveShift = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", userId)
      .eq("date", today)
      .order("clock_in", { ascending: false });

    const active = data?.find((a) => a.clock_in && !a.clock_out);
    setActiveSession(active || null);
  };

  const handleStartShift = async () => {
    setLoading(true);
    const now = new Date();
    await supabase.from("attendance").insert({
      employee_id: userId,
      date: now.toISOString().split("T")[0],
      clock_in: now.toTimeString().split(" ")[0],
    });
    await fetchActiveShift();
    setLoading(false);
  };

  const handleEndShift = async () => {
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

    await fetchActiveShift();
    setLoading(false);
  };

  if (!userId) {
    return null;
  }
  return <ClockInOutCard activeSession={activeSession} loading={loading} onStartShift={handleStartShift} onEndShift={handleEndShift} />;
}
