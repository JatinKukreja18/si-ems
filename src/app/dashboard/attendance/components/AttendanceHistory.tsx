"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MONTHS_SHORT } from "@/lib/constants";
import ShiftTimeRow from "@/components/ShiftTimeRow";
import OvertimeLabel from "@/components/OvertimeLabel";
import { Badge } from "@/components/ui/badge";
import { formatDateWithWeekday } from "@/lib/utils";

type View = "ALL" | "PENDING" | "APPROVED";
const VIEW = {
  ALL: "ALL",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
} as const;

export type Location = (typeof VIEW)[keyof typeof VIEW];

export default function AttendanceHistory({ userId }: { userId: string }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [view, setView] = useState<View>(VIEW.ALL);
  const { isAdmin } = useAuth();
  const { loading, currentMonth, monthlyAttendance, fetchMonthlyAttendance, pendingShifts, approvedShifts } = useAttendance(userId ?? "");

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

  let listData = [];
  switch (view) {
    case VIEW.PENDING:
      listData = pendingShifts;
      break;
    case VIEW.APPROVED:
      listData = approvedShifts;
      break;
    default:
      listData = monthlyAttendance;
      break;
  }

  return (
    <>
      <Card className="p-3 sticky top-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Monthly History</h2>
          <div className="flex gap-2 items-center">
            <Button disabled={selectedMonth === 1} onClick={() => onPreviousClick()}>
              <ChevronLeft />
            </Button>
            <span className="text-md ">{MONTHS_SHORT[selectedMonth]}</span>
            <Button disabled={selectedMonth === currentMonth} onClick={() => onNextClick()}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <div className="flex gap-2">
          <Button size={"sm"} variant={view === VIEW.ALL ? "default" : "outline"} onClick={() => setView("ALL")}>
            All
          </Button>
          <Button size={"sm"} variant={view === VIEW.PENDING ? "default" : "outline"} onClick={() => setView("PENDING")}>
            Pending{" "}
            <Badge variant={"default"} className="">
              {pendingShifts.length}
            </Badge>
          </Button>
          <Button size={"sm"} variant={view === VIEW.APPROVED ? "default" : "outline"} onClick={() => setView("APPROVED")}>
            Approved{" "}
          </Button>
        </div>
        <div className="space-y-2">
          {listData.map(({ date, shifts }) => {
            const isActive = shifts.some((s) => s.clock_in && !s.clock_out);

            return (
              <div key={date} className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-medium text-gray-700 w-full">{formatDateWithWeekday(date)}</h4>
                  {shifts.length > 0 && !isActive && <OvertimeLabel shifts={shifts} />}
                </div>
                <div className="w-full flex flex-col   gap-2">
                  {shifts?.map((shift) => (
                    <ShiftTimeRow
                      record={shift}
                      key={shift.id}
                      isAdmin={isAdmin}
                      onShiftAction={() => fetchMonthlyAttendance(selectedMonth)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {listData.length === 0 && <div className="h-22 w-full text-center flex items-center justify-center">No data to show</div>}
        </div>
      </Card>
    </>
  );
}
