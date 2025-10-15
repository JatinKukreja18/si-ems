"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ClockInOutCard from "@/app/dashboard/attendance/components/ClockInClockOut";
import { Attendance } from "@/types";

export default function AttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // useEffect(() => {
  //   // if (!activeSession?.clock_in || activeSession?.clock_out) {
  //   //   setElapsedTime("00:00:00");
  //   //   return;
  //   // }

  //   const interval = setInterval(() => {
  //     const clockInTime = new Date(`${activeSession.date}T${activeSession.clock_in}`);
  //     const now = new Date();
  //     const diff = now.getTime() - clockInTime.getTime();

  //     const hours = Math.floor(diff / (1000 * 60 * 60));
  //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  //     setElapsedTime(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [activeSession]);

  const fetchAttendance = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const today = new Date().toISOString().split("T")[0];

    // Auto-end any shifts that weren't closed before midnight
    const { data: openShifts } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", session.session.user.id)
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

    // Get all today's shifts
    const { data: todayData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", session.session.user.id)
      .eq("date", today)
      .order("clock_in", { ascending: false });

    setTodayAttendance(todayData || []);

    const active = todayData?.find((a) => a.clock_in && !a.clock_out);
    setActiveSession(active || null);

    const { data: recentData } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", session.session.user.id)
      .order("date", { ascending: false })
      .order("clock_in", { ascending: false })
      .limit(30);

    setRecentAttendance(recentData || []);
  };
  const handleClockIn = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const now = new Date();
    const time = now.toTimeString().split(" ")[0];
    const date = now.toISOString().split("T")[0];

    await supabase.from("attendance").insert({
      employee_id: session.session.user.id,
      date,
      clock_in: time,
    });

    await fetchAttendance();
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    const now = new Date();
    const time = now.toTimeString().split(" ")[0];

    if (!activeSession) return;

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

  const todayTotalHours = todayAttendance.reduce((sum, record) => sum + (record.hours_worked || 0), 0);
  console.log(activeSession);

  return (
    <div className="max-w-6xl p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Attendance</h1>

      <ClockInOutCard loading={loading} onEndShift={handleClockOut} onStartShift={handleClockIn} activeSession={activeSession} />

      <div className="p-8 mb-6 border-2 rounded-lg shadow-lg">
        {/* <h2 className="mb-4 text-xl font-semibold">Clock In/Out</h2> */}

        {/* {isClocking && (
          <div className="p-6 mb-6 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
            <p className="mb-2 text-sm text-gray-600">Current Session Time:</p>
            <p className="font-mono text-5xl font-bold tracking-wider text-blue-600">{elapsedTime}</p>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleClockIn}
            disabled={loading || !canClockIn}
            className="px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {canClockIn ? "Start New Session" : "Session Active"}
          </button>
          <button
            onClick={handleClockOut}
            disabled={loading || !canClockOut}
            className="px-8 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            End Session
          </button>
        </div> */}

        {todayAttendance.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="mb-3 text-sm text-gray-600">Today's Sessions:</p>
            {todayAttendance.map((record, idx) => (
              <div key={record.id} className="mb-2 text-gray-800">
                <span className="font-semibold">Session {todayAttendance.length - idx}: </span>
                {record.clock_in} - {record.clock_out || "In Progress"}
                {record.hours_worked && (
                  <span className={`ml-2 font-semibold ${record.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}>
                    ({record.hours_worked.toFixed(2)}h)
                  </span>
                )}
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-300">
              <span className="text-lg font-bold">Total Today: </span>
              <span className={`font-bold text-xl ${todayTotalHours > 10 ? "text-orange-600" : "text-green-600"}`}>
                {todayTotalHours.toFixed(2)}h
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-2 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Attendance History</h2>
        <div className="space-y-2">
          {recentAttendance.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 rounded bg-gray-50 hover:bg-gray-100">
              <span className="font-medium text-gray-700">{record.date}</span>
              <span className="text-gray-600">
                {record.clock_in} - {record.clock_out || "N/A"}
              </span>
              <span
                className={`font-bold text-lg ${record.hours_worked && record.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}
              >
                {record.hours_worked ? `${record.hours_worked.toFixed(2)}h` : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
