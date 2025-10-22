"use client";

import { checkLocationPermission } from "@/lib/geolocation";
import { User } from "@/types";
import React, { useEffect, useState } from "react";

const LOCATION_LABEL: Record<string, string> = {
  JC: "AIPL Joy Central",
  SPM: "South Point Mall",
};

export default function DashboardHeader({ user }: { user: User | null }) {
  const [location, setLocation] = useState<string | undefined>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = async () => {
    const result = await checkLocationPermission();
    setLocation(result.location);
    setChecking(false);
  };

  const locationText = checking ? (
    "Getting location..."
  ) : location ? (
    <span>
      You are at <span className=" font-bold">{LOCATION_LABEL[location]}</span>
    </span>
  ) : (
    <span className="text-red-500">You are not at Work Location</span>
  );
  console.log(location);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between  mb-6 gap-4">
      <div className="">
        <h1 className="text-xl font-bold mb-1 ">Welcome, {user?.name}</h1>
        <p className="text-gray-600 text-sm capitalize">Role: {user?.role}</p>
      </div>
      <div className="sm:ml-auto text-md">Location: {locationText}</div>
    </div>
  );
}
