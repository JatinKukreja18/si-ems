"use client";

import Link from "next/link";
import AttendanceWidget from "@/components/widgets/AttendanceWidget";
import AdminDashboardWidget from "./components/AdminDashboardWidget/AdminDashboardWidget";
import DashboardHeader from "./components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar1, CalendarPlus, ReceiptIndianRupee } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <DashboardHeader />

      {isAdmin ? (
        <AdminDashboardWidget />
      ) : (
        <div className="space-y-4 mb-6 grid gap-2 ">
          <AttendanceWidget />
          <Link href={ROUTES.ATTENDANCE}>
            <Button className="w-full" size={"lg"}>
              View All Attendance <ArrowUpRight />
            </Button>
          </Link>
          <div className="grid grid-cols-3 gap-4">
            <Card className="flex items-center justify-center">
              <Link href={ROUTES.LEAVES} className="flex items-center gap-1">
                <CalendarPlus /> Leaves
              </Link>
            </Card>
            <Card className="flex items-center justify-center">
              <Link href={ROUTES.ATTENDANCE} className="flex items-center gap-1">
                <Calendar1 />
                Attendance
              </Link>
            </Card>
            <Card className="flex items-center justify-center">
              <Link href={ROUTES.PAYROLL} className="flex items-center gap-1">
                <ReceiptIndianRupee /> Payroll
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
