"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";
import { Attendance } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";

function DeleteShiftDialog({
  open,
  setOpen,
  shift,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  shift: Attendance;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("attendance")
      .update({
        deleted_by: user?.id,
        delete_reason: reason,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", shift.id);

    if (!error) {
      setOpen(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deleting shift from {shift.date} ({shift.clock_in} - {shift.clock_out})
            </p>
            <Input placeholder="Reason for deletion (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditShiftDialog({
  open,
  setOpen,
  shift,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  shift: Attendance;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [clockIn, setClockIn] = useState(shift.clock_in || "");
  const [clockOut, setClockOut] = useState(shift.clock_out || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    if (!clockIn || !clockOut) {
      alert("Both clock in and clock out times are required");
      return;
    }

    setLoading(true);

    // Calculate hours
    const inTime = new Date(`1970-01-01T${clockIn}`);
    const outTime = new Date(`1970-01-01T${clockOut}`);
    const hours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);

    const { error } = await supabase
      .from("attendance")
      .update({
        clock_in: clockIn,
        clock_out: clockOut,
        hours_worked: hours,
        edited_by: user?.id,
        edit_reason: reason,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", shift.id);

    if (!error) {
      setOpen(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift Times</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Clock In Time</label>
              <Input type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Clock Out Time</label>
              <Input type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Reason for Edit</label>
              <Input placeholder="e.g., Employee forgot to clock out" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ShiftActionsMenu({ shift, onCompletedAction }: { shift: Attendance; onCompletedAction: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit size={14} className="mr-2" />
            Edit Shift
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
            <Trash2 size={14} className="mr-2" />
            Delete Shift
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditShiftDialog open={editOpen} setOpen={setEditOpen} shift={shift} onSuccess={onCompletedAction} />
      <DeleteShiftDialog open={deleteOpen} setOpen={setDeleteOpen} shift={shift} onSuccess={onCompletedAction} />
    </>
  );
}

export function ShiftActionsMenuMobile({ shift, onCompletedAction }: { shift: Attendance; onCompletedAction: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <ButtonGroup className="w-full mt-2 ">
        <Button variant="outline" size={"sm"} className="flex-1" onClick={() => setEditOpen(true)}>
          <Edit size={14} className="mr-1" /> Edit Shift
        </Button>
        <Button variant="destructive" size={"sm"} className="flex-1" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={14} className="mr-1" /> Delete Shift
        </Button>
      </ButtonGroup>
      <EditShiftDialog open={editOpen} setOpen={setEditOpen} shift={shift} onSuccess={onCompletedAction} />
      <DeleteShiftDialog open={deleteOpen} setOpen={setDeleteOpen} shift={shift} onSuccess={onCompletedAction} />
    </>
  );
}
