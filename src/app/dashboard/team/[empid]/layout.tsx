"use client";

import { useParams } from "next/navigation";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();

  // const tabs = [
  //   { label: "Attendance", href: `/dashboard/${params.empId}/attendance` },
  //   { label: "Payroll", href: `/dashboard/${params.empId}/payroll` },
  //   { label: "Settings", href: `/dashboard/${params.empId}/settings` },
  // ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* <div className="border-b mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 border-b-2 transition ${
                pathname === tab.href ? "border-primary font-semibold" : "border-transparent hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div> */}

      {children}
    </div>
  );
}
