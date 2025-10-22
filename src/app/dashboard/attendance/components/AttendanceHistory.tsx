"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/hooks/useAttendance";
import { formatTime, LOCATION_LABEL, MONTHS } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function AttendanceHistory() {
  const { user, loading: authLoading } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { currentMonth, monthlyAttendance, fetchMonthlyAttendance } = useAttendance(user?.id ?? "");

  useEffect(() => {
    if (user?.id) {
      fetchMonthlyAttendance(selectedMonth);
    }
  }, [selectedMonth, user?.id]);

  function onPreviousClick() {
    setSelectedMonth(selectedMonth - 1);
  }

  function onNextClick() {
    setSelectedMonth(selectedMonth + 1);
  }

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-semibold">Attendance History</h2>
        <div className="flex gap-2 items-center">
          <Button disabled={selectedMonth === 1} onClick={() => onPreviousClick()}>
            <ChevronLeft />
          </Button>
          <span className="text-md ">{MONTHS[selectedMonth + 1]}</span>
          <Button disabled={selectedMonth === currentMonth} onClick={() => setSelectedMonth(selectedMonth + 1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {monthlyAttendance.map((record) => (
          <div key={record.date} className="flex flex-wrap items-center justify-between mb-4">
            <>{console.log(record)}</>

            <h4 className="font-medium text-gray-700 w-full mb-2">
              {new Date(record.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h4>
            <div className="w-full flex flex-col   gap-2">
              <>{console.log(record.shifts)}</>
              {record.shifts?.map((shift) => (
                <div key={shift.id} className="w-full flex justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded ">
                  <span className="text-gray-600">
                    {formatTime(shift.clock_in)} - {formatTime(shift.clock_out || "N/A")}
                  </span>
                  {shift.location && <span className="text-gray-600">{LOCATION_LABEL[shift.location]}</span>}
                  <span
                    className={`font-bold text-lg ${shift.hours_worked && shift.hours_worked > 10 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {shift.hours_worked ? `${shift.hours_worked.toFixed(2)}h` : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {monthlyAttendance.length === 0 && <div className="h-22 w-full text-center flex items-center justify-center">No data to show</div>}
      </div>
    </Card>
  );
}

// 'use client';

// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Attendance } from '@/types';

// interface User {
//   id: string;
//   name: string;
//   role: string;
// }

// interface DailyAttendance {
//   date: string;
//   shifts: Attendance[];
//   totalHours: number;
// }

// const formatTime = (time: string | null) => {
//   if (!time) return 'N/A';
//   const [hours, minutes] = time.split(':');
//   const hour = parseInt(hours);
//   const ampm = hour >= 12 ? 'PM' : 'AM';
//   const displayHour = hour % 12 || 12;
//   return `${displayHour}:${minutes} ${ampm}`;
// };

// const LOCATION_LABEL: Record<string, string> = {
//   JC: "AIPL Joy Central",
//   SPM: "South Point Mall",
// };

// export default function AttendanceHistoryPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [dailyAttendance, setDailyAttendance] = useState<DailyAttendance[]>([]);
//   const [allEmployees, setAllEmployees] = useState<{ id: string; name: string }[]>([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchAttendanceForMonth();
//     }
//   }, [user, currentMonth, selectedEmployeeId]);

//   const fetchUser = async () => {
//     const { data } = await supabase.auth.getSession();
//     if (!data.session) {
//       router.push('/login');
//       return;
//     }

//     const { data: userData } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', data.session.user.id)
//       .single();

//     setUser(userData);

//     // If admin, fetch all employees
//     if (userData?.role === 'admin') {
//       const { data: employees } = await supabase
//         .from('users')
//         .select('id, name')
//         .eq('role', 'employee')
//         .order('name');

//       setAllEmployees(employees || []);
//       if (employees && employees.length > 0) {
//         setSelectedEmployeeId(employees[0].id);
//       }
//     }
//   };

//   const fetchAttendanceForMonth = async () => {
//     setLoading(true);
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);

//     const startDate = firstDay.toISOString().split('T')[0];
//     const endDate = lastDay.toISOString().split('T')[0];

//     // Determine which employee to fetch
//     const employeeId = user?.role === 'admin' ? selectedEmployeeId : user?.id;

//     const { data: attendance } = await supabase
//       .from('attendance')
//       .select('*')
//       .eq('employee_id', employeeId)
//       .gte('date', startDate)
//       .lte('date', endDate)
//       .order('date', { ascending: false })
//       .order('clock_in', { ascending: true });

//     // Group by date
//     const grouped: Record<string, Attendance[]> = {};
//     attendance?.forEach((record) => {
//       if (!grouped[record.date]) {
//         grouped[record.date] = [];
//       }
//       grouped[record.date].push(record);
//     });

//     // Convert to array with totals
//     const dailyData: DailyAttendance[] = Object.entries(grouped).map(([date, shifts]) => {
//       const totalHours = shifts.reduce((sum, shift) => sum + (shift.hours_worked || 0), 0);
//       return { date, shifts, totalHours };
//     });

//     setDailyAttendance(dailyData);
//     setLoading(false);
//   };

//   const goToPreviousMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
//   };

//   const goToNextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
//   };

//   const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
//   const monthTotal = dailyAttendance.reduce((sum, day) => sum + day.totalHours, 0);

//   if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Attendance History</h1>

//       {/* Month Navigation */}
//       <div className="flex items-center justify-between mb-6">
//         <Button onClick={goToPreviousMonth} variant="outline" size="icon">
//           <ChevronLeft />
//         </Button>
//         <h2 className="text-2xl font-semibold">{monthName}</h2>
//         <Button onClick={goToNextMonth} variant="outline" size="icon">
//           <ChevronRight />
//         </Button>
//       </div>

//       {/* Admin: Employee Selector */}
//       {user.role === 'admin' && allEmployees.length > 0 && (
//         <div className="mb-6">
//           <label className="text-sm font-medium mb-2 block">Select Employee:</label>
//           <select
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//             className="w-full md:w-64 px-4 py-2 border rounded-lg bg-background"
//           >
//             {allEmployees.map((emp) => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Month Summary */}
//       <Card className="p-6 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-sm text-muted-foreground">Total Working Days</p>
//             <p className="text-3xl font-bold">{dailyAttendance.length}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-muted-foreground">Total Hours</p>
//             <p className={`text-3xl font-bold ${monthTotal > dailyAttendance.length * 10 ? 'text-orange-600' : 'text-green-600'}`}>
//               {monthTotal.toFixed(1)}h
//             </p>
//           </div>
//         </div>
//       </Card>

//       {/* Daily Attendance List */}
//       {loading ? (
//         <Card className="p-8 text-center">Loading...</Card>
//       ) : dailyAttendance.length === 0 ? (
//         <Card className="p-8 text-center text-muted-foreground">
//           No attendance records for this month
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {dailyAttendance.map((day) => (
//             <Card key={day.date} className="p-4">
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h3 className="font-semibold text-lg">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
//                   <p className="text-sm text-muted-foreground">{day.shifts.length} shift{day.shifts.length > 1 ? 's' : ''}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-muted-foreground">Total</p>
//                   <p className={`text-xl font-bold ${day.totalHours > 10 ? 'text-orange-600' : 'text-green-600'}`}>
//                     {day.totalHours.toFixed(2)}h
//                   </p>
//                 </div>
//               </div>

//               {/* Shifts for this day */}
//               <div className="space-y-2">
//                 {day.shifts.map((shift, idx) => (
//                   <div key={shift.id} className="flex justify-between items-center p-3 bg-muted/50 rounded text-sm">
//                     <span className="font-medium">Shift {idx + 1}</span>
//                     <span className="text-muted-foreground">
//                       {formatTime(shift.clock_in)} - {formatTime(shift.clock_out)}
//                     </span>
//                     {shift.location && (
//                       <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
//                         {LOCATION_LABEL[shift.location] || shift.location}
//                       </span>
//                     )}
//                     <span className={`font-semibold ${shift.hours_worked && shift.hours_worked > 10 ? 'text-orange-600' : 'text-green-600'}`}>
//                       {shift.hours_worked ? `${shift.hours_worked.toFixed(2)}h` : 'In Progress'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
