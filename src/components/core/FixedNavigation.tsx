import Link from "next/link";
import { Calendar1, CalendarPlus, HouseIcon, ReceiptIndianRupee } from "lucide-react";
import { NAVIGATIONS } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function FixedNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center shadow-lg">
      <div className="flex-1">
        <Link
          href={NAVIGATIONS.DASHBOARD}
          className={`flex flex-col items-center text-foreground  hover:opacity-80 ${
            pathname === NAVIGATIONS.DASHBOARD ? "font-bold text-brand" : ""
          }`}
          prefetch={false}
        >
          <HouseIcon className={pathname === NAVIGATIONS.DASHBOARD ? "text-brand" : ""} />

          <span className={`text-xs mt-1 ${pathname === NAVIGATIONS.DASHBOARD ? "font-bold text-brand" : "text-foreground font-medium"}`}>
            Home
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <Link
          href={NAVIGATIONS.LEAVES}
          className={`flex flex-col items-center text-foreground  hover:opacity-80 ${
            pathname === NAVIGATIONS.DASHBOARD ? "font-bold text-brand" : ""
          }`}
          prefetch={false}
        >
          <CalendarPlus className={pathname === NAVIGATIONS.LEAVES ? "text-brand" : ""} />
          <span className={`text-xs mt-1 ${pathname === NAVIGATIONS.LEAVES ? "font-bold text-brand" : "text-foreground font-medium"}`}>
            Leaves
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <Link
          className={`flex flex-col items-center text-foreground  hover:opacity-80 ${
            pathname === NAVIGATIONS.DASHBOARD ? "font-bold text-brand" : ""
          }`}
          prefetch={false}
          href={NAVIGATIONS.ATTENDANCE}
        >
          <Calendar1 className={pathname === NAVIGATIONS.ATTENDANCE ? "text-brand" : ""} />
          <span className={`text-xs mt-1 ${pathname === NAVIGATIONS.ATTENDANCE ? "font-bold text-brand" : "text-foreground font-medium"}`}>
            Attendance
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <Link href={NAVIGATIONS.PAYROLL} className={`flex flex-col items-center hover:opacity-80 `}>
          <ReceiptIndianRupee className={pathname === NAVIGATIONS.PAYROLL ? "text-brand" : ""} />
          <span className={`text-xs mt-1 ${pathname === NAVIGATIONS.PAYROLL ? "font-bold text-brand" : "text-foreground font-medium"}`}>
            Payroll
          </span>
        </Link>
      </div>
    </nav>
  );
}
