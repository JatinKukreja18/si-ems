"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LOCATION_FILTERS, LocationFilter } from "@/types";
import { getTodayDate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { EmployeeAttendanceCard } from "../EmployeeAttendanceCard";
import { useAdminAttendance } from "@/hooks/useAdminAttendance";
import { ROUTES } from "@/lib/constants";
import { LocationSelector } from "./LocationSelector";

export default function AdminDashboardWidget() {
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>(LOCATION_FILTERS.ALL);

  const { employeesData, loading } = useAdminAttendance();

  const filteredEmployees = employeesData.filter((empData) => {
    if (selectedLocation === LOCATION_FILTERS.ALL) return true;
    return empData.todayShifts.some((shift) => shift.location === selectedLocation);
  });

  if (loading) return <Card className="p-6">Loading...</Card>;

  return (
    <>
      <LocationSelector selectedLocation={selectedLocation} onLocationChange={(location) => setSelectedLocation(location)} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{getTodayDate()}</h2>
          <Link href={ROUTES.ATTENDANCE} className="hidden sm:block">
            <Button size="sm">
              View All Attendance <ArrowUpRight />
            </Button>
          </Link>
        </div>

        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredEmployees.map((empData) => (
            <EmployeeAttendanceCard data={empData} key={empData.employee.id} />
          ))}

          {filteredEmployees.length === 0 && <p className="text-center text-muted-foreground py-8">No employees found</p>}
        </div>
        <Link href={ROUTES.ATTENDANCE} className="block sm:hidden">
          <Button size="lg" className="w-full">
            View All Attendance <ArrowUpRight />
          </Button>
        </Link>
      </div>
    </>
  );
}
