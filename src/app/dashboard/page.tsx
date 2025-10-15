"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p className="text-gray-600 mb-6">Role: {user?.role}</p>

      <div className="space-y-4 mb-6">
        <Link
          href="/dashboard/attendance"
          className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-semibold"
        >
          Go to Attendance
        </Link>
      </div>

      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
        Logout
      </button>
    </div>
  );
}
