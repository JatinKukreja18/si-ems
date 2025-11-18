import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemContent, ItemTitle, ItemDescription, Item, ItemActions } from "@/components/ui/item";
import { useEmployee } from "@/hooks/useEmployee";
import { toast } from "sonner";
import EditableField from "@/components/EditableField";

export default function UserSettings({ userId }: { userId: string }) {
  const { employeeData, updating, updateMobile } = useEmployee(userId);

  const validateMobile = (mobile: string): { valid: boolean; error: string | null } => {
    const mobileRegex = /^[0-9]{10}$/;
    const isValid = mobileRegex.test(mobile.replace(/\s/g, ""));
    return {
      valid: isValid,
      error: isValid ? null : "Enter Valid Number",
    };
  };

  if (!employeeData) return;

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <h1 className="text-xl font-bold mb-1 "> {employeeData.name}</h1>
        <p className="text-gray-600 text-sm capitalize">
          <strong>Employee ID:</strong> {employeeData?.emp_id}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ">
        <Item variant="muted" className="col-span-2">
          <ItemContent>
            <ItemTitle>Email</ItemTitle>
            <ItemDescription>{employeeData.email}</ItemDescription>
          </ItemContent>
        </Item>

        <EditableField
          title="Mobile"
          value={employeeData.mobile}
          name="mobile"
          type="tel"
          placeholder="10-digit mobile"
          maxLength={10}
          validate={validateMobile}
          onSave={updateMobile}
          disabled={updating}
        />

        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Assigned Hours</ItemTitle>
            <ItemDescription>{employeeData.assigned_hours}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Salary</ItemTitle>
            <ItemDescription>{employeeData.base_salary}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Joining Date</ItemTitle>
            <ItemDescription>{employeeData.joining_date}</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}
