"use client";
import { useEffect, useState } from "react";

export default function ShiftTimer({ clockIn, date }: { clockIn: string; date: string }) {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(`${date}T${clockIn}`);
      const diff = Date.now() - start.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockIn, date]);

  return <p className="font-mono text-3xl font-bold text-blue-600">{time}</p>;
}
