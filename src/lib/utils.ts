import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ASSIGNED_TIME = 10;

export const LOCATION_LABEL: Record<string, string> = {
  JC: "AIPL Joy Central",
  SPM: "South Point Mall",
};

export const MONTHS: Record<string, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
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
