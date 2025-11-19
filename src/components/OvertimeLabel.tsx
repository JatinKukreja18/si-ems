import { calculateOverTime } from "@/lib/utils";
import { Attendance } from "@/types";
import React from "react";

export default function OvertimeLabel({ shifts, assignedHours }: { shifts: Attendance[]; assignedHours: number }) {
  if (!shifts) return;
  const { label, numerical, totalHours } = calculateOverTime(shifts, assignedHours);
  console.log(totalHours);
  console.log(assignedHours);

  return (
    <span className={`font-semibold min-w-[8ch] text-right text-sm ${totalHours < assignedHours ? "text-orange-600" : "text-green-600"}`}>
      {label}
    </span>
  );
}
