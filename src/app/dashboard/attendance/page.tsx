"use client";

import { useAuth } from "@/contexts/AuthContext";
import AttendanceWidget from "../components/AttendanceWidget";
import AttendanceHistory from "./components/AttendanceHistory";
import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";

export default function AttendancePage() {
  const { isAdmin, user } = useAuth();
  const { employeesData } = useEmployees();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedUser = isAdmin ? searchParams.get("user") : user?.id;

  function onEmployeeChange(empId: string) {
    router.replace("/dashboard/attendance?user=" + empId);
  }

  return (
    <div className="max-w-6xl p-8 mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className=" text-3xl font-bold">Attendance</h1>

          <Select defaultValue={selectedUser || ""} onValueChange={onEmployeeChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {employeesData.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="flex flex-col gap-4">
        {!isAdmin && <AttendanceWidget hideTodayShifts={true} />}
        <AttendanceHistory userId={selectedUser || ""} />
      </main>
    </div>
  );
}
