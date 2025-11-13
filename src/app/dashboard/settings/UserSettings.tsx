import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemContent, ItemTitle, ItemDescription, Item, ItemActions } from "@/components/ui/item";
import { useEmployee } from "@/hooks/useEmployee";

export default function UserSettings({ userId }: { userId: string }) {
  const { employeeData } = useEmployee(userId);
  const [editableField, setEditableField] = useState<string | null>(null);

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
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Mobile</ItemTitle>
            {editableField === "mobile" ? (
              <Input size={10} defaultValue={employeeData.mobile} className="text-sm" autoFocus placeholder="mobile" required />
            ) : (
              <ItemDescription>{employeeData.mobile}</ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            {editableField !== "mobile" && (
              <Button size="sm" onClick={() => setEditableField("mobile")}>
                Edit
              </Button>
            )}
          </ItemActions>
          {editableField === "mobile" && (
            <div className="flex items-center gap-1 w-full -mt-2">
              <Button size="sm" onClick={() => setEditableField("mobile")}>
                Save
              </Button>
              <Button size="sm" variant={"link"} onClick={() => setEditableField(null)}>
                Cancel
              </Button>
            </div>
          )}
        </Item>

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
