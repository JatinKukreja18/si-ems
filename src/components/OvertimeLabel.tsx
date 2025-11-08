import { calculateOverTime } from "@/lib/utils";
import { Attendance } from "@/types";
import React from "react";

export default function OvertimeLabel({ shifts }: { shifts: Attendance[] }) {
  if (!shifts) return;
  const { label, numerical } = calculateOverTime(shifts);

  return (
    <span className={`font-semibold min-w-[8ch] text-right text-sm ${numerical < 0 ? "text-orange-600" : "text-green-600"}`}>{label}</span>
  );
}
