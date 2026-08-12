"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useConversations } from "@/features/chat/hooks";
import { formatCount } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";
import { EditIcon, EyeIcon, HeartIcon, ChatIcon, TrashIcon } from "@/components/ui/icons";
import { useDeleteListing, useUpdateListingStatus } from "../hooks";

/**
 * Seller-side controls, shown in place of the buyer CTA on your own listing.
 *
 * The performance strip matters as much as the buttons: a seller with no
 * messages needs to know whether the problem is reach (few views) or the
 * listing itself (views but no chats), and that is the difference between
 * re-pricing and re-photographing.
 */
export default function OwnerControls({ listing }) {
  const router = useRouter();
  const [soldOpen, setSoldOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateStatus = useUpdateListingStatus();
  const deleteListing = useDeleteListing();

  const setStatus = async (status, buyerId) => {
    try {
      await updateStatus.mutateAsync({ id: listing._id, status, buyerId });
      toast.success(
        status === "sold" ? "Marked as sold." : status === "paused" ? "Listing paused." : "Listing is live again."
      );
      setSoldOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update the listing."));
    }
  };

  const remove = async () => {
    try {
      await deleteListing.mutateAsync(listing._id);
      toast.success("Listing deleted.");
      router.push("/profile?tab=listings");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the listing."));
    }
  };

  return (
    <>
      <div className="space-y-4 rounded-lg border border-line bg-surface p-4">
        <div>
          <h2 className="text-sm font-bold text-ink">Your listing</h2>
          <p className="mt-0.5 text-xs text-muted">
            {listing.status === "active"
              ? "Live and visible on campus."
              : listing.status === "sold"
                ? "Sold — kept in your profile history."
                : "Paused and hidden from search."}
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-line rounded-md bg-surface-2 py-3 text-center">
          <Stat icon={<EyeIcon size={14} />} value={listing.views} label="views" />
          <Stat icon={<HeartIcon size={14} />} value={listing.saveCount} label="saves" />
          <Stat icon={<ChatIcon size={14} />} value={listing.chatCount} label="chats" />
        </div>

        {listing.views > 20 && !listing.chatCount && (
          <p className="rounded-md bg-warn-tint p-2.5 text-xs leading-relaxed text-ink-2">
            Plenty of views but no messages — that usually means the price. Try dropping it, or add
            a clearer photo.
          </p>
        )}

        <div className="space-y-2">
          <Button href={`/listings/${listing._id}/edit`} variant="secondary" block>
            <EditIcon size={16} /> Edit listing
          </Button>

          {listing.status === "active" && (
            <>
              <Button block onClick={() => setSoldOpen(true)}>
                Mark as sold
              </Button>
              <Button variant="ghost" block onClick={() => setStatus("paused")}>
                Pause listing
              </Button>
            </>
          )}

          {listing.status === "paused" && (
            <Button block onClick={() => setStatus("active")}>
              Make it live again
            </Button>
          )}

          {listing.status === "sold" && (
            <Button variant="secondary" block onClick={() => setStatus("active")}>
              Relist this item
            </Button>
          )}

          <Button variant="danger" block onClick={() => setDeleteOpen(true)}>
            <TrashIcon size={16} /> Delete
          </Button>
        </div>
      </div>

      <MarkSoldSheet
        open={soldOpen}
        onClose={() => setSoldOpen(false)}
        listing={listing}
        isPending={updateStatus.isPending}
        onConfirm={(buyerId) => setStatus("sold", buyerId)}
      />

      <Sheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this listing?"
        description="It disappears from search and from your profile. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" block onClick={() => setDeleteOpen(false)}>
              Keep it
            </Button>
            <Button variant="dangerSolid" block loading={deleteListing.isPending} onClick={remove}>
              Delete
            </Button>
          </>
        }
      >
        <p className="py-2 text-sm text-muted">
          If you have simply sold it, use <span className="font-semibold text-ink">Mark as sold</span>{" "}
          instead — that keeps it in your history and lets you rate the buyer.
        </p>
      </Sheet>
    </>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div>
      <span className="flex items-center justify-center gap-1 text-base font-bold text-ink">
        <span className="text-muted">{icon}</span>
        {formatCount(value || 0)}
      </span>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

/**
 * Naming the buyer is what unlocks mutual reviews for the deal, so we surface
 * the people who actually enquired instead of asking the seller to type a name.
 */
function MarkSoldSheet({ open, onClose, listing, onConfirm, isPending }) {
  const { conversations, isLoading } = useConversations({ enabled: open });
  const [buyerId, setBuyerId] = useState(null);

  const candidates = conversations.filter(
    (conversation) => String(conversation.listing?._id) === String(listing._id)
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Who bought it?"
      description="Naming the buyer lets you both leave a rating."
      size="sm"
      footer={
        <>
          <Button variant="secondary" block onClick={() => onConfirm(undefined)} disabled={isPending}>
            Sold elsewhere
          </Button>
          <Button block disabled={!buyerId} loading={isPending} onClick={() => onConfirm(buyerId)}>
            Confirm
          </Button>
        </>
      }
    >
      <div className="space-y-2 pt-1">
        {isLoading && <p className="py-4 text-center text-sm text-muted">Loading your chats…</p>}

        {!isLoading && candidates.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">
            Nobody messaged you about this one. Choose “Sold elsewhere” to close it out.
          </p>
        )}

        {candidates.map((conversation) => {
          const person = conversation.counterparty;
          const selected = buyerId === person?._id;

          return (
            <button
              key={conversation._id}
              type="button"
              onClick={() => setBuyerId(selected ? null : person?._id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors",
                selected ? "border-brand bg-brand-tint" : "border-line hover:border-line-strong"
              )}
            >
              <Avatar src={person?.avatar?.url || person?.avatar} name={person?.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{person?.name}</span>
                <span className="block truncate text-xs text-muted">{person?.college}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
