export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "employee";
  base_salary: number;
  created_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  location?: string | null;
  clock_in: string | null;
  clock_out: string | null;
  hours_worked: number | null;
  created_at: string;
  updated_at: string;
}

export type Employee = Pick<User, "id" | "name" | "email">;

export interface EmployeeAttendance {
  employee: Employee;
  todayShifts: Attendance[];
  totalHours: number;
  isActive: boolean;
}
