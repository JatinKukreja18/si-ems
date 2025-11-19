"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployee } from "@/hooks/useEmployee";
import { toast } from "sonner";
import { Employee, User } from "@/types";
import { redirect } from "next/navigation";
import { NAVIGATIONS } from "@/lib/constants";

interface UserFormProps {
  employeeData: User;
}

export default function UserForm({ employeeData }: UserFormProps) {
  const { updating, updateEmployee } = useEmployee("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    base_salary: "",
    assigned_hours: "",
    joining_date: "",
  });

  // Sync form with fetched data
  useEffect(() => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || "",
        email: employeeData.email || "",
        mobile: employeeData.mobile || "",
        role: employeeData.role || "employee",
        base_salary: employeeData.base_salary?.toString() || "",
        assigned_hours: employeeData.assigned_hours?.toString() || "",
        joining_date: employeeData.joining_date || "",
      });
    }
  }, [employeeData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    if (!formData.mobile.trim() || !/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error("Valid 10-digit mobile is required");
      return;
    }

    // Prepare updates
    const updates: Partial<User> = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      base_salary: formData.base_salary ? parseFloat(formData.base_salary) : null,
      assigned_hours: formData.assigned_hours ? parseFloat(formData.assigned_hours) : null,
      joining_date: formData.joining_date || null,
    };
    console.log(updates);

    const result = await updateEmployee(updates, employeeData.id);

    if (result.success) {
      toast.success("Employee updated successfully");
    } else {
      toast.error(result.error || "Failed to update employee");
    }
  };

  const handleReset = () => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || "",
        email: employeeData.email || "",
        mobile: employeeData.mobile || "",
        role: employeeData.role || "employee",
        base_salary: employeeData.base_salary?.toString() || "",
        assigned_hours: employeeData.assigned_hours?.toString() || "",
        joining_date: employeeData.joining_date || "",
      });
    }
  };

  if (!employeeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Employee not found</p>
        </CardContent>
      </Card>
    );
  }

  console.log(formData.role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{employeeData.name}</CardTitle>
        <CardDescription>EMP ID: {employeeData.emp_id}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} disabled={true} required />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={true}
                required
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                maxLength={10}
                disabled={true}
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} disabled={updating}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Base Salary */}
            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary (₹)</Label>
              <Input
                id="base_salary"
                type="number"
                value={formData.base_salary}
                onChange={(e) => handleChange("base_salary", e.target.value)}
                disabled={updating}
                placeholder="25000"
              />
            </div>

            {/* Assigned Hours */}
            <div className="space-y-2">
              <Label htmlFor="assigned_hours">Assigned Hours/Day</Label>
              <Input
                id="assigned_hours"
                type="number"
                step="0.5"
                value={formData.assigned_hours}
                onChange={(e) => handleChange("assigned_hours", e.target.value)}
                disabled={updating}
                placeholder="8"
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input
                id="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={(e) => handleChange("joining_date", e.target.value)}
                disabled={updating}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={() => redirect(NAVIGATIONS.TEAM)} disabled={updating}>
            Back
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
