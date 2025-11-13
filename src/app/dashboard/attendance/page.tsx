"use client";

import { useAuth } from "@/contexts/AuthContext";

import { useParams } from "next/navigation";
import EmployeeSelector from "./components/EmployeeSelector";
import AttendanceHistory from "./components/AttendanceHistory";
import { Suspense } from "react";
import AttendanceWidget from "@/components/widgets/AttendanceWidget";

export default function AttendancePage() {
  const { isAdmin, user } = useAuth();

  const selectedUser = user?.id || "";

  return (
    <div className="max-w-6xl p-4 mx-auto">
      <Suspense>
        <header className="mb-8 mt-4">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <h1 className=" text-3xl font-bold">Attendance</h1>
            {isAdmin && <EmployeeSelector selectedUser={selectedUser} />}
          </div>
        </header>

        <main className="flex flex-col gap-4 sm:flex">
          {!isAdmin && <AttendanceWidget hideTodayShifts={true} />}
          <AttendanceHistory userId={selectedUser} />
        </main>
      </Suspense>
    </div>
  );
}
