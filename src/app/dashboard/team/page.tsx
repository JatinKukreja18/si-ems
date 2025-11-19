"use client";

import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NAVIGATIONS } from "@/lib/constants";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeCard } from "@/components/EmployeeCard";

export default function TeamPage() {
  const { isAdmin } = useAuth();
  const { employeesData } = useEmployees();
  if (!isAdmin) redirect(NAVIGATIONS.DASHBOARD);

  return (
    <div className="max-w-6xl p-4 mx-auto">
      <Suspense>
        <header className="mb-8 mt-4">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <h1 className=" text-3xl font-bold">Team</h1>
          </div>
        </header>

        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {employeesData.map((empData) => (
            <EmployeeCard employee={empData} key={empData.id} />
          ))}

          {employeesData.length === 0 && <p className="text-center text-muted-foreground py-8">No employees found</p>}
        </div>
      </Suspense>
    </div>
  );
}
