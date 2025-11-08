"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <DashboardHeader />

      {isAdmin ? <p>Admin Settings</p> : <p>Employye Settings</p>}
    </div>
  );
}
