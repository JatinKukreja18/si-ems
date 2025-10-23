"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/hooks/useAttendance";
import { formatTime, LOCATION_LABEL, MONTHS } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function AttendanceHistory({ userId }: { userId: string }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { currentMonth, monthlyAttendance, fetchMonthlyAttendance } = useAttendance(userId ?? "");

  useEffect(() => {
    if (userId) {
      fetchMonthlyAttendance(selectedMonth);
    }
  }, [selectedMonth, userId]);

  function onPreviousClick() {
    setSelectedMonth(selectedMonth - 1);
  }

  function onNextClick() {
    setSelectedMonth(selectedMonth + 1);
  }

  if (!userId) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-semibold">Attendance History</h2>
        <div className="flex gap-2 items-center">
          <Button disabled={selectedMonth === 1} onClick={() => onPreviousClick()}>
            <ChevronLeft />
          </Button>
          <span className="text-md ">{MONTHS[selectedMonth + 1]}</span>
          <Button disabled={selectedMonth === currentMonth} onClick={() => setSelectedMonth(selectedMonth + 1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {monthlyAttendance.map((record) => (
          <div key={record.date} className="flex flex-wrap items-center justify-between mb-4">
            <>{console.log(record)}</>

            <h4 className="font-medium text-gray-700 w-full mb-2">
              {new Date(record.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h4>
            <div className="w-full flex flex-col   gap-2">
              <>{console.log(record.shifts)}</>
              {record.shifts?.map((shift) => (
                <div key={shift.id} className="w-full flex justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded ">
                  <span className="text-gray-600">
                    {formatTime(shift.clock_in)} - {formatTime(shift.clock_out || "N/A")}
                  </span>
                  {shift.location && <span className="text-gray-600">{LOCATION_LABEL[shift.location]}</span>}
                  <span
                    className={`font-bold text-lg ${shift.hours_worked && shift.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {shift.hours_worked ? `${shift.hours_worked.toFixed(2)}h` : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {monthlyAttendance.length === 0 && <div className="h-22 w-full text-center flex items-center justify-center">No data to show</div>}
      </div>
    </Card>
  );
}
