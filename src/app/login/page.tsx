"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isEmail = emailOrMobile.includes("@");
      let email = emailOrMobile;

      if (!isEmail) {
        const { data, error: fetchError } = await supabase.from("users").select("email").eq("mobile", emailOrMobile).single();

        if (fetchError || !data) throw new Error("Mobile number not found");
        email = data.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo_red.svg" alt="Logo" width="100" height="10" />
          <h1 className="text-2xl font-bold mb-6 text-center">EMS Login</h1>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="text"
            placeholder="Email or Mobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            required
          />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
