export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const CONSTANTS = {
  ASSIGNED_HOURS: 10,
  MINUTES_PER_HOUR: 60,
  MS_PER_HOUR: 1000 * 60 * 60,
} as const;

export const SPM = {
  latitude: 28.448002743026226,
  longitude: 77.09921455975022,
};
export const JC = {
  latitude: 28.405074663351474,
  longitude: 77.06046136788333,
};

export const ROUTES = {
  DASHBOARD: "/dashboard",
  ATTENDANCE: "/attendance",
  APPROVALS: "/approvals",
  PAYROLL: "/payroll",
  LEAVES: "/leaves",
  SETTINGS: "/settings",
};

export const NAVIGATIONS = {
  DASHBOARD: ROUTES.DASHBOARD,
  ATTENDANCE: ROUTES.DASHBOARD + ROUTES.ATTENDANCE,
  APPROVALS: ROUTES.DASHBOARD + ROUTES.APPROVALS,
  PAYROLL: ROUTES.DASHBOARD + ROUTES.PAYROLL,
  LEAVES: ROUTES.DASHBOARD + ROUTES.LEAVES,
  SETTINGS: ROUTES.DASHBOARD + ROUTES.SETTINGS,
};
