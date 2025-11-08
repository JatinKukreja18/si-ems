"use client";

import { redirect, useParams } from "next/navigation";

export default function EmployeePage() {
  const params = useParams();
  redirect(`/dashboard/${params.empid}/attendance`);
}
