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
    <div className="max-w-6xl p-4 mx-auto">
      <header className="mb-8 mt-4">
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <h1 className=" text-3xl font-bold">Attendance</h1>
          {isAdmin && (
            <Select defaultValue={selectedUser || ""} onValueChange={onEmployeeChange}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white capitalize">
                <SelectValue placeholder="Select Employee" className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {employeesData.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id} className="capitalize">
                      {employee.name.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </header>

      <main className="flex flex-col gap-4 sm:flex">
        {!isAdmin && <AttendanceWidget hideTodayShifts={true} />}
        <AttendanceHistory userId={selectedUser || ""} />
      </main>
    </div>
  );
}
