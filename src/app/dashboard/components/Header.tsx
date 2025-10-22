"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import React from "react";

export default function Header() {
  const router = useRouter();

  // ⭐ NEW - Add this handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <div className="px-4 py-2 border-b-1 border-gray-500 bg-foreground">
      <div className="container flex items-center justify-between m-auto">
        <span className="text-md md:text-xl font-bold uppercase text-background">SI EMS</span>

        <Button variant="secondary" size={"sm"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
