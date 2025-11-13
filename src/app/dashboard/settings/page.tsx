"use client";

import { useAuth } from "@/contexts/AuthContext";
import UserSettings from "./UserSettings";

export default function SettingsPage() {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  return <div className="p-4">{user && <UserSettings userId={user.id} />}</div>;
}
