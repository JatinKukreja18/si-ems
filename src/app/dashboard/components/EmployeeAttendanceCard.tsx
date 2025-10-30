import { Card } from "@/components/ui/card";
import { EmployeeAttendance } from "@/types";
import Link from "next/link";
import OvertimeLabel from "./OvertimeLabel";
import ShiftTimeRow from "./ShiftTimeRow";

export const EmployeeAttendanceCard = ({ data }: { data: EmployeeAttendance }) => {
  const { employee, todayShifts, isActive } = data;

  return (
    <Card className="p-2">
      <Link href={"/dashboard/attendance?user=" + employee.id} key={employee.id} className="flex flex-col gap-1 rounded-lg">
        <div className="px-2 pb-2 flex justify-between">
          <p className="font-semibold capitalize">{employee.name.toLowerCase()}</p>
          {isActive && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-auto mr-1">Active</span>}
          {!isActive && todayShifts.length > 0 && <OvertimeLabel shifts={todayShifts} />}
        </div>

        <div className="flex flex-col gap-2">
          {todayShifts.map((shift) => {
            return <ShiftTimeRow record={shift} key={shift.id} hideLocation />;
          })}
        </div>
      </Link>
    </Card>
  );
};
