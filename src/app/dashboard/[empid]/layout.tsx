// app/dashboard/[empId]/layout.tsx
"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Employee } from "@/types";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data } = await supabase.from("users").select("*").eq("emp_id", params.empId).single();
      setEmployee(data);
    };
    fetchEmployee();
  }, [params.empId]);

  const tabs = [
    { label: "Attendance", href: `/dashboard/${params.empId}/attendance` },
    { label: "Payroll", href: `/dashboard/${params.empId}/payroll` },
    { label: "Settings", href: `/dashboard/${params.empId}/settings` },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Employee Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{employee?.name}</h1>
        <p className="text-muted-foreground">
          {params.empId} • {employee?.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 border-b-2 transition ${
                pathname === tab.href ? "border-primary font-semibold" : "border-transparent hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}
