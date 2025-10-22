import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOCATION_LABEL: Record<string, string> = {
  JC: "AIPL Joy Central",
  SPM: "South Point Mall",
};
