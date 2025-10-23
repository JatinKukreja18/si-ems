import { Attendance } from "@/types";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import ShiftTimer from "./ShiftTimer";
import { getTodayDate } from "@/lib/utils";

interface ClockInOutCardProps {
  activeSession: Attendance | null;
  loading: boolean;
  onStartShift: () => void;
  onEndShift: () => void;
}

export default function ClockInOutCard({ activeSession, loading, onStartShift, onEndShift }: ClockInOutCardProps) {
  const canStartShift = !activeSession;
  const canClockOut = !!activeSession;
  const isClocking = !!activeSession;

  return (
    <Card className="p-4 md:p-4 ">
      <h2 className="text-xl font-semibold">{getTodayDate()}</h2>

      {isClocking && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-2">Current Shift Time:</p>
          <ShiftTimer clockIn={activeSession.clock_in!} date={activeSession.date} />
        </div>
      )}

      <div className="flex gap-4">
        <Button size={"lg"} className="md:flex-none flex-1" onClick={onStartShift} disabled={loading || !canStartShift}>
          {isClocking ? "Shift in Progress" : "Start Shift"}
        </Button>
        <Button size={"lg"} variant={"destructive"} className="md:flex-none flex-1" onClick={onEndShift} disabled={loading || !canClockOut}>
          End Shift
        </Button>
      </div>
    </Card>
  );
}
