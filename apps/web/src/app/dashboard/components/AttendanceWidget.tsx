"use client";

import { Card } from "@/components/ui/card";
import { useAttendance } from "@si-ems/shared";
import ClockInOutCard from "./ClockInOutCard";
import { useAuth } from "@/contexts/AuthContext";
import ShiftTimeRow from "./ShiftTimeRow";
import { formatDuration } from "@/lib/utils";

export default function AttendanceWidget({ hideTodayShifts = false }: { hideTodayShifts?: boolean }) {
  const { user } = useAuth();
  if (!user) return null;

  const { activeSession, todayAttendance, loading, startShift, endShift } = useAttendance(user.id || "");

  const todayTotalHours = todayAttendance.reduce((sum, record) => sum + (record.hours_worked || 0), 0);
  return (
    <div className="space-y-4 ">
      <ClockInOutCard
        canMarkAbsent={todayTotalHours === 0}
        activeSession={activeSession}
        loading={loading}
        onStartShift={startShift}
        onEndShift={endShift}
      />

      {!hideTodayShifts && todayAttendance.length > 0 && (
        <Card className="p-4 gap-4">
          <p className="text-md text-muted-foreground">Today's Shifts</p>
          <div className="space-y-2 mb-2">
            {todayAttendance.map((record) => (
              <ShiftTimeRow record={record} key={record.id} />
            ))}
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-bold text-lg">Total Today:</span>
            <span className={`font-bold text-lg ${todayTotalHours > 10 ? "text-orange-600" : "text-green-600"}`}>
              {formatDuration(todayTotalHours)}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
