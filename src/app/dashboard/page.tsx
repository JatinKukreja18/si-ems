"use client";

import Link from "next/link";
import AttendanceWidget from "./components/AttendanceWidget";
import AdminDashboardWidget from "./components/AdminDashboardWidget";
import DashboardHeader from "./components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <DashboardHeader />

      {isAdmin ? (
        <AdminDashboardWidget />
      ) : (
        <div className="space-y-4 mb-6 ">
          <AttendanceWidget />
          <Link href="/dashboard/attendance">
            <Button className="w-full" size={"lg"}>
              View All Attendance <ArrowUpRight />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
