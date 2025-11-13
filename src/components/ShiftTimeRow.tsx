"use client";

import { ShiftActionsMenu, ShiftActionsMenuMobile } from "@/app/dashboard/attendance/components/ShiftAction";
import { formatDuration, formatTime, LOCATION_LABEL } from "@/lib/utils";
import { Attendance } from "@/types";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { CheckCircle, CheckCircle2, CheckIcon, CircleMinus, Clock10Icon, Crosshair, CrossIcon, X } from "lucide-react";

export default function ShiftTimeRow({
  record,
  hideLocation = false,
  isAdmin = false,
  onShiftAction,
}: {
  record: Attendance;
  hideLocation?: boolean;
  isAdmin?: boolean;
  onShiftAction?: () => void;
}) {
  const [open, setOpen] = useState(false);
  function onCompletedAction() {
    setOpen(false);
    onShiftAction?.();
  }
  const { id, clock_in, clock_out, status, remote_clockout_reason, location } = record;

  return (
    <div className="flex flex-wrap justify-between bg-muted rounded-lg group">
      <div key={id} className="flex flex-1 justify-between items-center py-2 px-2 flex-wrap " onClick={() => setOpen(!open)}>
        {!hideLocation && <>{location && <span className="text-xs text-muted-foreground sm:w-auto">{LOCATION_LABEL[location]}</span>}</>}
        <span className="text-sm text-muted-foreground text-left">
          {formatTime(clock_in)} - {formatTime(clock_out)}
        </span>
        <div className="flex gap-2 items-center">
          <span className={`font-semibold text-sm`}>{formatDuration(hours_worked)}</span>
          <StatusBadge status={status} />
        </div>
        {remote_clockout_reason && (
          <div className="w-full text-xs p-2  text-center sm:text-right">
            <strong>Closed outside office reason:</strong> {remote_clockout_reason}
          </div>
        )}
      </div>
      {isAdmin && (
        <div className="w-full sm:w-auto ">
          <div className="hidden sm:flex sm:invisible sm:group-hover:visible ">
            <ShiftActionsMenu shift={record} onCompletedAction={onCompletedAction} />
          </div>
          {open && (
            <div className="flex sm:hidden w-full ">
              <ShiftActionsMenuMobile shift={record} onCompletedAction={onCompletedAction} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ status }: { status: Attendance["status"] }) => {
  if (status === "rejected")
    return (
      <Badge variant={"destructive"} className="p-1 leading-tight">
        <CircleMinus /> Rejected
      </Badge>
    );

  if (status === "pending_approval")
    return (
      <Badge variant={"pending"} className="p-1 leading-tight">
        <Clock10Icon /> Pending
      </Badge>
    );

  if (status === "approved") return <CheckCircle2 width={18} className="text-success" />;
};
