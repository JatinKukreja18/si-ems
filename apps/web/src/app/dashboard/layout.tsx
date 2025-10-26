"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Header from "./components/Header";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <>
      <Header />
      <div className="container m-auto">{children}</div>
    </>
  );
}
