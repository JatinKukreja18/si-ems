import { formatDuration, formatTime, LOCATION_LABEL } from "@/lib/utils";
import { Attendance } from "@/types";

export default function ShiftTimeRow({ record, hideLocation = false }: { record: Attendance; hideLocation?: boolean }) {
  return (
    <div key={record.id} className="flex justify-between items-center py-2 px-3  bg-muted/50 rounded-lg">
      {!hideLocation && (
        <>{record.location && <span className="text-sm text-muted-foreground sm:w-auto">{LOCATION_LABEL[record.location]}</span>}</>
      )}
      <span className="text-sm text-muted-foreground text-left">
        {formatTime(record.clock_in)} - {formatTime(record.clock_out)}
      </span>
      <span className={`font-semibold text-sm`}>{formatDuration(record.hours_worked)}</span>
    </div>
  );
}
