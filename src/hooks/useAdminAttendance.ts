import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { calculateTotalHours, getDateISO } from "@/lib/utils";
import { useEmployees } from "./useEmployees";
import { EmployeeAttendance } from "@/types";

export function useAdminAttendance() {
  const [employeesData, setEmployeesData] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { employeesData: employees } = useEmployees();

  const fetchTodayAttendance = async () => {
    if (!employees) return;

    setLoading(true);
    const today = getDateISO();

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("date", today)
      .is("deleted_at", null)
      .order("clock_in", { ascending: false });

    const employeesWithAttendance = employees.map((emp) => {
      const shifts = attendance?.filter((a) => a.employee_id === emp.id) || [];
      const totalHours = calculateTotalHours(shifts);
      const isActive = shifts.some((s) => s.clock_in && !s.clock_out);

      return { employee: emp, todayShifts: shifts, totalHours, isActive };
    });

    setEmployeesData(employeesWithAttendance);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, [employees]);

  return { employeesData, loading, refetch: fetchTodayAttendance };
}
