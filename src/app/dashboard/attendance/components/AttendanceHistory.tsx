"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MONTHS_SHORT } from "@/lib/constants";
import ShiftTimeRow from "@/components/ShiftTimeRow";
import OvertimeLabel from "@/components/OvertimeLabel";
import { Badge } from "@/components/ui/badge";
import { calculateOvertimePay, formatDateWithWeekday } from "@/lib/utils";
import { useEmployee } from "@/hooks/useEmployee";

type View = "ALL" | "PENDING" | "APPROVED";
const VIEW = {
  ALL: "ALL",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
} as const;

export default function AttendanceHistory({ userId }: { userId: string }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [view, setView] = useState<View>(VIEW.ALL);
  const { isAdmin } = useAuth();
  const { currentMonth, monthlyAttendance, fetchMonthlyAttendance, pendingShifts, approvedShifts } = useAttendance(userId ?? "");
  const { employeeData } = useEmployee(userId);

  const assignedHours = employeeData?.assigned_hours || 10;
  const baseSalary = employeeData?.base_salary || 0;

  useEffect(() => {
    if (userId) {
      fetchMonthlyAttendance(selectedMonth);
    }
  }, [selectedMonth, userId]);

  const handlePreviousMonth = () => setSelectedMonth((prev) => prev - 1);
  const handleNextMonth = () => setSelectedMonth((prev) => prev + 1);
  const handleViewChange = (newView: View) => setView(newView);

  const listData = useMemo(() => {
    switch (view) {
      case VIEW.PENDING:
        return pendingShifts;
      case VIEW.APPROVED:
        return approvedShifts;
      default:
        return monthlyAttendance;
    }
  }, [view, pendingShifts, approvedShifts, monthlyAttendance]);

  if (!userId) {
    return null;
  }

  return (
    <>
      <Card className="p-3 sticky top-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Monthly History</h2>
          <div className="flex gap-2 items-center">
            <Button disabled={selectedMonth === 1} onClick={handlePreviousMonth}>
              <ChevronLeft />
            </Button>
            <span className="text-md ">{MONTHS_SHORT[selectedMonth]}</span>
            <Button disabled={selectedMonth === currentMonth} onClick={handleNextMonth}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <div className="flex gap-2">
          <Button size={"sm"} variant={view === VIEW.ALL ? "default" : "outline"} onClick={() => handleViewChange("ALL")}>
            All
          </Button>
          <Button size={"sm"} variant={view === VIEW.PENDING ? "default" : "outline"} onClick={() => handleViewChange("PENDING")}>
            Pending{" "}
            <Badge variant={"default"} className="">
              {pendingShifts.length}
            </Badge>
          </Button>
          <Button size={"sm"} variant={view === VIEW.APPROVED ? "default" : "outline"} onClick={() => handleViewChange("APPROVED")}>
            Approved{" "}
          </Button>
        </div>
        <div className="space-y-2">
          {listData.map(({ date, shifts, totalHours }) => {
            const isActive = shifts.some((s) => s.clock_in && !s.clock_out);

            return (
              <div key={date} className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-medium text-gray-700 w-full">{formatDateWithWeekday(date)}</h4>
                  {shifts.length > 0 && !isActive && <OvertimeLabel shifts={shifts} assignedHours={assignedHours} />}
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
                {totalHours > assignedHours && isAdmin && (
                  <div className="text-sm ml-auto flex gap-2">
                    <span>Overtime earned: </span>
                    <span className="font-semibold text-green-600">
                      +₹{calculateOvertimePay(employeeData?.base_salary || 0, totalHours, assignedHours, 30)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          {listData.length === 0 && <div className="h-22 w-full text-center flex items-center justify-center">No data to show</div>}
        </div>
      </Card>
    </>
  );
}
