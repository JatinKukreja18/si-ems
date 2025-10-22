"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AttendanceWidget from "./components/AttendanceWidget";
import AdminDashboardWidget from "./components/AdminDashboardWidget";
import DashboardHeader from "./components/DashboardHeader";
import { User } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", data.session.user.id).single();

      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  const isAdmin = user?.role === "admin";
  return (
    <div className="p-4">
      <DashboardHeader user={user} />

      {isAdmin ? (
        <AdminDashboardWidget />
      ) : (
        <div className="space-y-4 mb-6">
          <AttendanceWidget userId={user?.id} />
          <Link
            href="/dashboard/attendance"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-semibold"
          >
            Go to Attendance
          </Link>
        </div>
      )}
    </div>
  );
}
