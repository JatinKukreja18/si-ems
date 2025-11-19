import { supabase } from "@/lib/supabase";
import { Attendance, Employee, EmployeeAttendance, ROLES } from "@/types";
import { useEffect, useState } from "react";

export function useEmployees() {
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data: employees } = await supabase
      .from("users")
      .select("id, name, email, emp_id, mobile, role, base_salary, assigned_hours")
      .in("role", [ROLES.EMPLOYEE, ROLES.MANAGER])
      .order("name", { ascending: true });

    if (!employees) return;

    setEmployeesData(employees);
    setLoading(false);
  };

  return {
    employeesData,
    loading,
  };
}
