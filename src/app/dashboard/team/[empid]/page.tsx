"use client";

import { useEmployee } from "@/hooks/useEmployee";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import UserForm from "./UserForm";

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
      <UserForm employeeData={employeeData} />
    </div>
  );
}
