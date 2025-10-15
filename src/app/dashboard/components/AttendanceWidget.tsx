"use client";

import { Card } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import ClockInOutCard from "./ClockInOutCard";

// ⭐ NEW - Helper function to format time
const formatTime = (time: string | null) => {
  if (!time) return "In Progress";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function AttendanceWidget({ userId }: { userId: string | undefined }) {
  const { activeSession, todayAttendance, loading, startShift, endShift } = useAttendance(userId || "");

  if (!userId) return null;

  const todayTotalHours = todayAttendance.reduce((sum, record) => sum + (record.hours_worked || 0), 0);

  return (
    <div className="space-y-4">
      <ClockInOutCard activeSession={activeSession} loading={loading} onStartShift={startShift} onEndShift={endShift} />

      {todayAttendance.length > 0 && (
        <Card className="p-4">
          <p className="text-md text-muted-foreground">Today's Shifts:</p>
          <div className="space-y-2 mb-2">
            {todayAttendance.map((record, idx) => (
              <div key={record.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="font-semibold text-sm">Shift {todayAttendance.length - idx}</span>
                {/* ⭐ CHANGED - using formatTime */}
                <span className="text-sm text-muted-foreground">
                  {formatTime(record.clock_in)} - {formatTime(record.clock_out)}
                </span>
                <span className={`font-semibold ${record.hours_worked && record.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}>
                  {record.hours_worked ? `${record.hours_worked.toFixed(2)}h` : "-"}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-bold text-lg">Total Today:</span>
            <span className={`font-bold text-2xl ${todayTotalHours > 10 ? "text-orange-600" : "text-green-600"}`}>
              {todayTotalHours.toFixed(2)}h
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
