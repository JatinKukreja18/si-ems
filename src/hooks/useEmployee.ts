import { supabase } from "@/lib/supabase";
import { User } from "@/types";
import { useEffect, useState } from "react";

export function useEmployee(id: string) {
  const [employeeData, setEmployeeData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const { data: employee } = await supabase.from("users").select("*").eq("id", id);

    if (!employee) return;

    setEmployeeData(employee[0]);
    setLoading(false);
  };

  return {
    employeeData,
    loading,
  };
}
