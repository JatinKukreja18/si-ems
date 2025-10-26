"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { MONTHS } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ShiftTimeRow from "../../components/ShiftTimeRow";
import OvertimeLabel from "../../components/OvertimeLabel";

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
    <>
      <Card className="p-4 sticky top-2">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Attendance History</h2>
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
      </Card>
      <Card className="p-4">
        <div className="space-y-2">
          {monthlyAttendance.map(({ date, shifts }) => {
            return (
              <div key={date} className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-medium text-gray-700 w-full">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </h4>
                  <OvertimeLabel shifts={shifts} />
                </div>
                <div className="w-full flex flex-col   gap-2">
                  {shifts?.map((shift) => (
                    <ShiftTimeRow record={shift} key={shift.id} />
                  ))}
                </div>
              </div>
            );
          })}
          {monthlyAttendance.length === 0 && (
            <div className="h-22 w-full text-center flex items-center justify-center">No data to show</div>
          )}
        </div>
      </Card>
    </>
  );
}
