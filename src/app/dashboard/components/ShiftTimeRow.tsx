import { formatDuration, formatTime, LOCATION_LABEL } from "@/lib/utils";
import { Attendance } from "@/types";

export default function ShiftTimeRow({ record }: { record: Attendance }) {
  return (
    <div key={record.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
      {record.location && <span className="text-sm text-muted-foreground sm:w-auto">{LOCATION_LABEL[record.location]}</span>}
      <span className="text-sm text-muted-foreground text-left">
        {formatTime(record.clock_in)} - {formatTime(record.clock_out)}
      </span>
      <span className={`font-semibold ${record.hours_worked && record.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}>
        {formatDuration(record.hours_worked)}
      </span>
    </div>
  );
}
