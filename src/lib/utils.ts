import { Attendance } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONSTANTS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOCATION_LABEL: Record<string, string> = {
  JC: "AIPL Joy Central",
  SPM: "South Point Mall",
};

export const formatTime = (time: string | null) => {
  if (!time) return "in progress";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatHours = (totalHours: number, hideZeroHours?: boolean) => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  if (hideZeroHours && hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const formatDuration = (hours: number | null) => {
  if (!hours) return "-";
  const totalMinutes = Math.round(hours * 60);

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
};

export const getTodayDate = () => {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options as Intl.DateTimeFormatOptions).format(today);
  return formattedDate;
};

export const calculateTotalHours = (shifts: Attendance[]) => {
  return shifts.reduce((sum, shift) => {
    if (shift.hours_worked) {
      // Completed shift
      return sum + shift.hours_worked;
    } else if (shift.clock_in && !shift.clock_out) {
      // Active shift - calculate current duration
      const clockIn = new Date(`${shift.date}T${shift.clock_in}`);
      const now = new Date();
      const hours = (now.getTime() - clockIn.getTime()) / CONSTANTS.MS_PER_HOUR;
      return sum + hours;
    }
    return sum;
  }, 0);
};

export const calculateOverTime = (shifts: Attendance[]) => {
  const totalHours = calculateTotalHours(shifts);
  const difference = totalHours - CONSTANTS.ASSIGNED_HOURS;
  const differenceLabel = `${difference < 0 ? "-" : "+"} ${formatHours(Math.abs(difference), true)}`;

  return {
    label: differenceLabel,
    numerical: difference,
  };
};

export function getDateISO(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateDisplay(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`; // DD-MM-YYYY for display
}

export function getLocalTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export const formatDateWithWeekday = (dateString: string) => {
  const d = new Date(dateString);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  return `${month} ${day}, ${weekday}`;
};
