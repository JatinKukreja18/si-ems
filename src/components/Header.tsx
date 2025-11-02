"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <div className="px-4 py-2 border-b border-gray-500 bg-foreground">
      <div className="container flex items-center justify-between m-auto">
        <Link href={"/"} className="text-md md:text-xl font-bold uppercase text-background flex gap-2 items-center">
          <Image src="/favicon.svg" alt="Header Logo" width={30} height={30} /> EMS
        </Link>
        <Button variant="secondary" size={"sm"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
