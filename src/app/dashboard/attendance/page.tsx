import AttendanceWidget from "../components/AttendanceWidget";
import AttendanceHistory from "./components/AttendanceHistory";

export default function AttendancePage() {
  return (
    <div className="max-w-6xl p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Attendance</h1>

      <AttendanceWidget />
      <AttendanceHistory />
    </div>
  );
}
