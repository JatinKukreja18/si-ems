import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemContent, ItemTitle, ItemDescription, Item, ItemActions } from "@/components/ui/item";

interface EditableFieldProps {
  title: string;
  value: string | number | null;
  name: string;
  type?: "text" | "tel" | "email" | "number";
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  validate?: (value: string) => { valid: boolean; error?: string | null };
  onSave: (value: string) => Promise<{ success: boolean; error?: string }>;
  formatDisplay?: (value: string | number | null) => string;
  className?: string;
}

export default function EditableField({
  title,
  value,
  name,
  type = "text",
  placeholder,
  disabled = false,
  maxLength,
  validate,
  onSave,
  formatDisplay,
  className,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    const formData = new FormData(e.currentTarget);
    const newValue = formData.get(name) as string;

    // Validate if validator provided
    if (validate) {
      const validation = validate(newValue);
      if (!validation.valid) {
        alert(validation.error || "Invalid input");
        return;
      }
    }

    // No change, just close
    if (newValue === String(value)) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    const result = await onSave(newValue);
    setSaving(false);

    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.error || "Failed to update");
    }
  };

  const displayValue = formatDisplay ? formatDisplay(value) : value;

  return (
    <Item variant="muted" className={className}>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type={type}
              name={name}
              defaultValue={String(value || "")}
              className="text-sm"
              autoFocus
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={saving || disabled}
              required
            />
            <div className="flex items-center gap-1 w-full">
              <Button type="submit" size="sm" disabled={saving || disabled}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" size="sm" variant="link" onClick={() => setIsEditing(false)} disabled={saving || disabled}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <ItemDescription>{displayValue || "N/A"}</ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        {!isEditing && !disabled && (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}
