"use client";

import { formatDuration, formatTime, LOCATION_LABEL } from "@/lib/utils";
import { Attendance } from "@/types";
import { ShiftActionsMenu, ShiftActionsMenuMobile } from "../attendance/components/ShiftAction";
import { useState } from "react";

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
  return (
    <div className="flex flex-wrap justify-between bg-muted rounded-lg group">
      <div key={record.id} className="flex flex-1 justify-between items-center py-2 px-2  " onClick={() => setOpen(!open)}>
        {!hideLocation && (
          <>{record.location && <span className="text-xs text-muted-foreground sm:w-auto">{LOCATION_LABEL[record.location]}</span>}</>
        )}
        <span className="text-sm text-muted-foreground text-left">
          {formatTime(record.clock_in)} - {formatTime(record.clock_out)}
        </span>
        <span className={`font-semibold text-sm`}>{formatDuration(record.hours_worked)}</span>
      </div>
      {isAdmin && (
        <div className="w-full">
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
