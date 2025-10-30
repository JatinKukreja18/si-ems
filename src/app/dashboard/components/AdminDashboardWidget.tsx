"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Attendance } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { calculateTotalHours, getDateISO, getTodayDate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { EmployeeAttendanceCard } from "./EmployeeAttendanceCard";

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
  const [selectedLocation, setSelectedLocation] = useState<"ALL" | "SPM" | "JC">("ALL");

  const { employeesData: employees } = useEmployees();

  const filteredEmployees = employeesData.filter((empData) => {
    if (selectedLocation === "ALL") return true;
    return empData.todayShifts.some((shift) => shift.location === selectedLocation);
  });

  useEffect(() => {
    fetchTodayAttendance();
  }, [employees]);

  const fetchTodayAttendance = async () => {
    const today = getDateISO();

    if (!employees) return;

    setLoading(true);
    const { data: attendance } = await supabase.from("attendance").select("*").eq("date", today).order("clock_in", { ascending: false });

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
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button className="w-full" variant={selectedLocation === "ALL" ? "default" : "outline"} onClick={() => setSelectedLocation("ALL")}>
          All
        </Button>
        <Button variant={selectedLocation === "SPM" ? "default" : "outline"} onClick={() => setSelectedLocation("SPM")} className="flex-1">
          South Point Mall
        </Button>
        <Button variant={selectedLocation === "JC" ? "default" : "outline"} onClick={() => setSelectedLocation("JC")} className="flex-1">
          AIPL Joy Central
        </Button>
      </div>
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
          {filteredEmployees.map((empData) => (
            <EmployeeAttendanceCard data={empData} key={empData.employee.id} />
          ))}

          {filteredEmployees.length === 0 && <p className="text-center text-muted-foreground py-8">No employees found</p>}
        </div>
        <Link href="/dashboard/attendance" className="block sm:hidden">
          <Button size="lg" className="w-full">
            View All Attendance <ArrowUpRight />
          </Button>
        </Link>
      </div>
    </>
  );
}
