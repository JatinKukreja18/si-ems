import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useGetUserId(isAdmin: boolean, empId: string) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, [empId]);

  const fetchUserId = async () => {
    console.log(empId);
    console.log(isAdmin);

    if (isAdmin && empId) {
      const { data } = await supabase.from("users").select("id").eq("emp_id", empId).single();
      console.log(data);

      setUserId(data?.id || "");
    }
  };

  return {
    userId,
  };
}
