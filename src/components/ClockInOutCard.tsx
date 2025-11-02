import { Attendance } from "@/types";

import ShiftTimer from "../app/dashboard/components/ShiftTimer";
import { getTodayDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ClockInOutCardProps {
  activeSession: Attendance | null;
  loading: boolean;
  onStartShift: () => void;
  onEndShift: (reason?: string) => void;
}
const REMOTE_REASONS = ["Forgot to close", "Phone battery died", "Other"];

export default function ClockInOutCard({ activeSession, loading, onStartShift, onEndShift }: ClockInOutCardProps) {
  const [showRemoteDialog, setShowRemoteDialog] = useState(false);
  const [remoteReason, setRemoteReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedReason, setSelectedReason] = useState(""); // ⭐ NEW
  const [customReason, setCustomReason] = useState("");
  const canStartShift = !activeSession;
  const canEndShift = !!activeSession;
  const isClocking = !!activeSession;
  const handleEndShift = async () => {
    setSubmitting(true);
    try {
      await onEndShift(); // Try normal end shift
    } catch (error: any) {
      if (error.message === "LOCATION_REQUIRED") {
        // Show dialog for remote clock-out
        setShowRemoteDialog(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoteClockOut = async () => {
    const finalReason = selectedReason === "Other" ? customReason : selectedReason;

    if (!finalReason.trim()) {
      alert("Please provide a reason");
      return;
    }

    setSubmitting(true);
    try {
      await onEndShift(finalReason);
      setShowRemoteDialog(false);
      setSelectedReason("");
      setCustomReason("");
    } catch (error: any) {
      alert(error.message || "Failed to end shift");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="p-4 md:p-4 ">
        <h2 className="text-xl font-semibold">{getTodayDate()}</h2>

        {isClocking && (
          <div className="p-4 bg-linear-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Current Shift Time:</p>
            <ShiftTimer clockIn={activeSession.clock_in!} date={activeSession.date} />
          </div>
        )}

        <div className="flex gap-4">
          <Button size={"lg"} className="md:flex-none flex-1" onClick={onStartShift} disabled={loading || !canStartShift}>
            {isClocking ? "Shift in Progress" : loading ? "Starting" : "Start Shift"}
          </Button>
          <Button
            size={"lg"}
            variant={"destructive"}
            className="md:flex-none flex-1"
            onClick={handleEndShift}
            disabled={loading || !canEndShift}
          >
            End Shift
          </Button>
        </div>
      </Card>

      <Dialog open={showRemoteDialog} onOpenChange={setShowRemoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remote Clock Out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">You're not at the office location. Please select a reason for remote clock-out.</p>

            {/* ⭐ NEW - Radio buttons for predefined reasons */}
            <div className="space-y-2">
              {REMOTE_REASONS.map((reason) => (
                <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4"
                    disabled={submitting}
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {/* ⭐ NEW - Show input only when "Other" is selected */}
            {selectedReason === "Other" && (
              <Input
                placeholder="Please specify reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRemoteDialog(false);
                setSelectedReason("");
                setCustomReason("");
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleRemoteClockOut} disabled={submitting}>
              {submitting ? "Ending..." : "End Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
