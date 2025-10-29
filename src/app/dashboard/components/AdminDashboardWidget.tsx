"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Attendance } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { calculateTotalHours, getTodayDate } from "@/lib/utils";
import ShiftTimeRow from "./ShiftTimeRow";
import { ArrowUpRight } from "lucide-react";
import OvertimeLabel from "./OvertimeLabel";

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
  const [selectedLocation, setSelectedLocation] = useState<"ALL" | "SPM" | "JC">("SPM");

  const { employeesData: employees } = useEmployees();

  const filteredEmployees = employeesData.filter((empData) => {
    if (selectedLocation === "ALL") return true;
    return empData.todayShifts.some((shift) => shift.location === selectedLocation);
  });

  useEffect(() => {
    fetchTodayAttendance();
  }, [employees]);

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
    <>
      <div className="flex gap-2 mb-6">
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
            <EmployeeRow data={empData} key={empData.employee.id} />
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

const EmployeeRow = ({ data }: { data: EmployeeAttendance }) => {
  const { employee, todayShifts } = data;

  return (
    <Card className="p-2">
      <Link href={"/dashboard/attendance?user=" + employee.id} key={employee.id} className="flex flex-col gap-1 rounded-lg">
        <div className="px-2 pb-2 flex justify-between">
          <p className="font-semibold capitalize">{employee.name.toLowerCase()}</p>
          {data.isActive && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-auto mr-1">Active</span>
          )}
          {!data.isActive && todayShifts.length > 0 && <OvertimeLabel shifts={todayShifts} />}
        </div>

        <div className="flex flex-col gap-2">
          {todayShifts.map((shift) => {
            return <ShiftTimeRow record={shift} key={shift.id} hideLocation />;
          })}
        </div>
      </Link>
    </Card>
  );
};
