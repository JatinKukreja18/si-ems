import AttendanceWidget from "../components/AttendanceWidget";
import ClockInOutCard from "../components/ClockInOutCard";
import AttendanceHistory from "./components/AttendanceHistory";

export default function AttendancePage() {
  return (
    <div className="max-w-6xl p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Attendance</h1>

      <main className="flex flex-col gap-4">
        <AttendanceWidget hideTodayShifts={true} />
        <AttendanceHistory />
      </main>
    </div>
  );
}
