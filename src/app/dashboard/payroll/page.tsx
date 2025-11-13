"use client";

import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";

export default function PayrollPage() {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <DashboardHeader />

      {isAdmin ? <p>Admin Payroll</p> : <p>Employye Payroll</p>}
    </div>
  );
}
