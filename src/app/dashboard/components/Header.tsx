import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import router from "next/router";
import React from "react";

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b-1 border-gray-500 bg-foreground">
      <span className="text-md md:text-xl font-bold uppercase text-background">SI EMS</span>

      <Button variant="secondary" size={"sm"}>
        Logout
      </Button>
    </div>
  );
}
