"use client";

import { useEmployee } from "@/hooks/useEmployee";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EmployeePage() {
  const params = useParams();
  const { employeeData, loading, fetchByEmpId } = useEmployee("");

  useEffect(() => {
    if (params.empid) {
      fetchByEmpId(params.empid as string);
    }
  }, [params.empid]);

  if (loading) return <div>Loading...</div>;
  if (!employeeData) return <div>Employee not found</div>;

  return (
    <div>
      <h1>{employeeData.name}</h1>
      <p>EMP ID: {employeeData.emp_id}</p>
    </div>
  );
}
