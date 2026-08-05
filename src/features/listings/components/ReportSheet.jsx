"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { REPORT_REASONS } from "@/config/site";
import { getErrorMessage } from "@/lib/errors";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { Textarea } from "@/components/ui/Field";
import Chip from "@/components/ui/Chip";

/**
 * Reporting flow for listings and users.
 *
 * Preset reasons do the work: they take the effort out of reporting (so people
 * actually do it) and give moderators a consistent field to triage on.
 */
export default function ReportSheet({ open, onClose, onSubmit, targetLabel = "listing", isPending }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const composed = [reason, details.trim()].filter(Boolean).join(" — ");
  const canSubmit = composed.length >= 5;

  const submit = async () => {
    try {
      await onSubmit(composed);
      toast.success("Report sent. Our team will review it.");
      setReason("");
      setDetails("");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send that report."));
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Report this ${targetLabel}`}
      description="Reports are anonymous. We review every one."
      size="sm"
      footer={
        <>
          <Button variant="secondary" block onClick={onClose}>
            Cancel
          </Button>
          <Button variant="dangerSolid" block disabled={!canSubmit} loading={isPending} onClick={submit}>
            Send report
          </Button>
        </>
      }
    >
      <div className="space-y-4 pt-1">
        <div className="flex flex-wrap gap-2">
          {REPORT_REASONS.map((option) => (
            <Chip
              key={option}
              active={reason === option}
              onClick={() => setReason(reason === option ? "" : option)}
            >
              {option}
            </Chip>
          ))}
        </div>

        <Textarea
          label="Anything else we should know?"
          placeholder="Add any detail that helps us investigate."
          maxLength={400}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
      </div>
    </Sheet>
  );
}
