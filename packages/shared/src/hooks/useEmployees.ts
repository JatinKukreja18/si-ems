import { supabase } from "../lib/supabase";
import { Employee } from "../types";
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
      .select("id, name, email")
      .eq("role", "employee")
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
