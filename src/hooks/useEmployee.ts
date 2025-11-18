import { supabase } from "@/lib/supabase";
import { User } from "@/types";
import { useEffect, useState } from "react";

export function useEmployee(userId: string) {
  const [employeeData, setEmployeeData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const { data: employee } = await supabase.from("users").select("*").eq("id", userId);

    if (!employee) return;

    setEmployeeData(employee[0]);
    setLoading(false);
  };

  const updateMobile = async (newMobile: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    setUpdating(true);

    try {
      // Check if mobile already exists for another user
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, name")
        .eq("mobile", newMobile)
        .neq("id", userId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking mobile:", checkError);
        return { success: false, error: "Failed to verify mobile number" };
      }

      if (existingUser) {
        return {
          success: false,
          error: `This mobile number is already registered to ${existingUser.name}`,
        };
      }

      // Update the mobile number
      console.log("🔍 Attempting to update mobile...");
      const { data: updateData, error: updateError } = await supabase
        .from("users")
        .update({
          mobile: newMobile,
        })
        .eq("id", userId)
        .select(); // ⭐ ADD THIS to see what was updated

      console.log("🔍 Update result:", { updateData, updateError });

      if (updateError) {
        console.error("Error updating mobile:", updateError);
        return { success: false, error: "Failed to update mobile number" };
      }

      // Refresh employee data
      await fetchEmployee();

      return { success: true };
    } catch (error: any) {
      console.error("Update mobile error:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    } finally {
      setUpdating(false);
    }
  };

  return {
    employeeData,
    loading,
    updating,
    updateMobile,
  };
}
