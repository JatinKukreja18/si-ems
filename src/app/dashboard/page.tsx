"use client";

import Link from "next/link";
import AttendanceWidget from "./components/AttendanceWidget";
import AdminDashboardWidget from "./components/AdminDashboardWidget";
import DashboardHeader from "./components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const isAdmin = user?.role === "admin";
  return (
    <div className="py-4">
      <DashboardHeader />

      {isAdmin ? (
        <AdminDashboardWidget />
      ) : (
        <div className="space-y-4 mb-6">
          <AttendanceWidget />
          <Link
            href="/dashboard/attendance"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-semibold"
          >
            View All Attendance
          </Link>
        </div>
      )}
    </div>
  );
}
