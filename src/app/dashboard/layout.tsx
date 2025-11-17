"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FixedNavigation from "@/components/core/FixedNavigation";
import { Loader } from "@/components/Loader";

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

  if (loading)
    return (
      <div className="flex items-center flex-col justify-center h-screen ">
        <Loader />
      </div>
    );

  return (
    <>
      <Header />
      <main className="container m-auto pb-20">{children}</main>
      <FixedNavigation />
    </>
  );
}
