"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Attendance } from "@/types";

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

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

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

  const formatHours = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];

    // Get all employees
    const { data: employees } = await supabase.from("users").select("id, name, email").eq("role", "employee");

    if (!employees) return;

    // Get today's attendance for all employees
    const { data: attendance } = await supabase.from("attendance").select("*").eq("date", today).order("clock_in", { ascending: false });

    // Combine data
    const employeesWithAttendance: EmployeeAttendance[] = employees.map((emp) => {
      const shifts = attendance?.filter((a) => a.employee_id === emp.id) || [];
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
          <div key={empData.employee.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="font-semibold">{empData.employee.name}</p>
              <p className="text-sm text-muted-foreground">{empData.employee.email}</p>
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
          </div>
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
