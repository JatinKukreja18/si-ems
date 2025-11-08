export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "employee";
  base_salary: number;
  created_at: string;
  emp_id: string;
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

export type Employee = Pick<User, "id" | "name" | "email" | "emp_id">;

export interface EmployeeAttendance {
  employee: Employee;
  todayShifts: Attendance[];
  totalHours: number;
  isActive: boolean;
}

export const LOCATIONS = {
  SPM: "SPM",
  JC: "JC",
} as const;

export const LOCATION_FILTERS = {
  ALL: "ALL",
  ...LOCATIONS,
} as const;

export type Location = (typeof LOCATIONS)[keyof typeof LOCATIONS];
export type LocationFilter = (typeof LOCATION_FILTERS)[keyof typeof LOCATION_FILTERS];
