"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Attendance } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { ASSIGNED_TIME, formatHours, getTodayDate } from "@/lib/utils";
import ShiftTimeRow from "./ShiftTimeRow";
import { ArrowUpRight } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface EmployeeAttendance {
  employee: Employee;
  todayShifts: Attendance[];
  totalHours: number;
  isActive: boolean;
}

export default function AdminDashboardWidget() {
  const [employeesData, setEmployeesData] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { employeesData: employees } = useEmployees();
  useEffect(() => {
    fetchTodayAttendance();
  }, [employees]);

  const calculateTotalHours = (shifts: Attendance[]) => {
    return shifts.reduce((sum, shift) => {
      if (shift.hours_worked) {
        // Completed shift
        return sum + shift.hours_worked;
      } else if (shift.clock_in && !shift.clock_out) {
        // Active shift - calculate current duration
        const clockIn = new Date(`${shift.date}T${shift.clock_in}`);
        const now = new Date();
        const hours = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }
      return sum;
    }, 0);
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (!employees) return;

    const { data: attendance } = await supabase.from("attendance").select("*").eq("date", today).order("clock_in", { ascending: false });

    const employeesWithAttendance: EmployeeAttendance[] = employees.map((emp) => {
      const shifts = attendance?.filter((a) => a.employee_id === emp.id) || [];
      console.log(shifts);

      const totalHours = calculateTotalHours(shifts);
      const isActive = shifts.some((s) => s.clock_in && !s.clock_out);

      return {
        employee: emp,
        todayShifts: shifts,
        totalHours,
        isActive,
      };
    });

    setEmployeesData(employeesWithAttendance);
    setLoading(false);
  };

  if (loading) return <Card className="p-6">Loading...</Card>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{getTodayDate()}</h2>
        <Link href="/dashboard/attendance" className="hidden sm:block">
          <Button size="sm">
            View All Attendance <ArrowUpRight />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {employeesData.map((empData) => (
          <EmployeeRow data={empData} />
        ))}

        {employeesData.length === 0 && <p className="text-center text-muted-foreground py-8">No employees found</p>}
      </div>
      <Link href="/dashboard/attendance" className="block sm:hidden">
        <Button size="lg" className="w-full">
          View All Attendance <ArrowUpRight />
        </Button>
      </Link>
    </div>
  );
}

const EmployeeRow = ({ data }: { data: EmployeeAttendance }) => {
  const { employee, todayShifts, totalHours } = data;
  const difference = totalHours - ASSIGNED_TIME;

  return (
    <Card className="p-0">
      <Link href={"/dashboard/attendance?user=" + employee.id} key={employee.id} className="flex flex-col gap-2 bg-muted/50 rounded-lg">
        <div className="p-4 pb-2 flex justify-between">
          <p className="font-semibold capitalize">{employee.name.toLowerCase()}</p>
          {data.isActive ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-auto mr-1">Active</span>
          ) : (
            <>
              {totalHours !== 0 && difference !== 0 && (
                <p className={`font-semibold text-right text-sm ${difference < 0 ? "text-orange-600" : "text-green-600"}`}>
                  {difference < 0 ? "-" : "+"}
                  {formatHours(Math.abs(difference), true)}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 px-1 mb-4">
          {todayShifts.map((shift) => {
            return (
              <>
                <ShiftTimeRow record={shift} />
              </>
            );
          })}
        </div>
      </Link>
    </Card>
  );
};
