"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Attendance } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { formatHours } from "@/lib/utils";

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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Employee Attendance</h2>
        <Link href="/dashboard/admin/attendance" className="hidden sm:block">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {employeesData.map((empData) => (
          <Link
            href={"/dashboard/attendance?user=" + empData.employee.id}
            key={empData.employee.id}
            className="flex justify-between items-center p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-semibold">{empData.employee.name}</p>
              <p className="text-sm text-muted-foreground">{empData.employee.email}</p>
            </div>
            <div className="flex-1">
              {empData.todayShifts.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {empData.todayShifts[0].location === "SPM" ? "South Point Mall" : "AIPL Joy Central"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {empData.isActive && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>}

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className={`text-lg font-bold ${empData.totalHours > 10 ? "text-orange-600" : "text-green-600"}`}>
                  {formatHours(empData.totalHours)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Shifts</p>
                <p className="text-lg font-bold">{empData.todayShifts.length}</p>
              </div>
            </div>
          </Link>
        ))}

        {employeesData.length === 0 && <p className="text-center text-muted-foreground py-8">No employees found</p>}
      </div>
      <Link href="/dashboard/admin/attendance" className="block sm:hidden">
        <Button variant="outline" size="lg" className="w-full">
          View All
        </Button>
      </Link>
    </Card>
  );
}
