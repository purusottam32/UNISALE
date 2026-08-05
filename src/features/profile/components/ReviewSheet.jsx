"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/errors";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { Textarea } from "@/components/ui/Field";
import { RatingInput } from "@/components/ui/Rating";
import { useCreateReview } from "../hooks";

/**
 * Post-deal rating.
 *
 * Stars are required, the comment is not: forcing written feedback is the
 * fastest way to get no feedback at all, and a star still moves the seller's
 * average.
 */
export default function ReviewSheet({ open, onClose, deal }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const counterpartyName = deal?.counterparty?.name || "this student";
  const theirRole = deal?.yourRole === "seller" ? "buyer" : "seller";

  const submit = async () => {
    try {
      await createReview.mutateAsync({ listingId: deal.listingId, rating, comment });
      toast.success("Thanks — your rating is live.");
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your rating."));
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`How was ${counterpartyName}?`}
      description={`Your rating helps other students decide who to trade with.`}
      footer={
        <>
          <Button variant="secondary" block onClick={onClose}>
            Not now
          </Button>
          <Button block disabled={rating === 0} loading={createReview.isPending} onClick={submit}>
            Submit rating
          </Button>
        </>
      }
    >
      <div className="space-y-5 pt-2">
        <div className="flex items-center gap-3 rounded-lg bg-surface-2 p-3">
          <Avatar
            src={deal?.counterparty?.avatar?.url || deal?.counterparty?.avatar}
            name={counterpartyName}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{counterpartyName}</p>
            <p className="truncate text-xs text-muted">
              {theirRole === "seller" ? "Sold you" : "Bought"} “{deal?.title}”
            </p>
          </div>
        </div>

        <RatingInput value={rating} onChange={setRating} />

        <Textarea
          label="Add a comment"
          hint="Optional — but a line about the handover helps a lot."
          placeholder={
            theirRole === "seller"
              ? "Item was exactly as described, met at the library gate."
              : "Showed up on time and paid without haggling."
          }
          maxLength={500}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
    </Sheet>
  );
}
