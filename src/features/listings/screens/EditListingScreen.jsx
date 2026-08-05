"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CATEGORY_META,
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
  LOCATION_SCOPES,
} from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { getErrorMessage } from "@/lib/errors";
import Button from "@/components/ui/Button";
import { ChoiceGroup, Input, Textarea } from "@/components/ui/Field";
import Chip from "@/components/ui/Chip";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { useListing, useUpdateListing } from "../hooks";
import PhotoUploader from "../components/PhotoUploader";

/**
 * Edit an existing listing.
 *
 * Photos are replace-all rather than incremental: the API swaps the whole set
 * on upload, so the UI shows the current photos as read-only and only sends new
 * ones when the seller explicitly chooses to replace them. Anything less would
 * silently delete images.
 */
export default function EditListingScreen({ listingId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { listing, isLoading } = useListing(listingId);
  const updateListing = useUpdateListing();

  const [form, setForm] = useState(null);
  const [newPhotos, setNewPhotos] = useState([]);
  const [replacePhotos, setReplacePhotos] = useState(false);

  useEffect(() => {
    if (!listing || form) return;
    setForm({
      title: listing.title || "",
      description: listing.description || "",
      category: listing.category || "",
      condition: listing.condition || "",
      type: listing.type || "sale",
      price: listing.price ?? "",
      originalPrice: listing.originalPrice ?? "",
      isNegotiable: listing.isNegotiable ?? true,
      locationScope: listing.locationScope || "on-campus",
      meetupHint: listing.meetupHint || "",
    });
  }, [listing, form]);

  if (isLoading || !form) {
    return <p className="py-20 text-center text-sm text-muted">Loading your listing…</p>;
  }

  const sellerId = listing.seller?._id || listing.seller;
  if (String(sellerId) !== String(user?.id)) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-lg font-bold text-ink">That isn&apos;t your listing</h1>
        <Button href={`/listings/${listingId}`} className="mt-4">
          View the listing
        </Button>
      </div>
    );
  }

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const save = async () => {
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("price", form.type === "giveaway" ? "0" : String(form.price));
    if (form.originalPrice) payload.append("originalPrice", String(form.originalPrice));
    payload.append("isNegotiable", String(form.isNegotiable));
    payload.append("type", form.type);
    payload.append("condition", form.condition);
    payload.append("category", form.category);
    payload.append("locationScope", form.locationScope);
    payload.append("meetupHint", form.meetupHint.trim());

    if (replacePhotos && newPhotos.length > 0) {
      newPhotos.forEach((photo) => payload.append("images", photo.file));
    }

    try {
      await updateListing.mutateAsync({ id: listingId, formData: payload });
      toast.success("Listing updated.");
      router.push(`/listings/${listingId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your changes."));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-1 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <ChevronLeftIcon size={17} /> Back
      </button>

      <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Edit listing</h1>

      <section>
        <h2 className="mb-2 text-[13px] font-medium text-ink-2">Photos</h2>

        {!replacePhotos ? (
          <>
            <div className="grid grid-cols-4 gap-2.5">
              {listing.images?.map((image) => (
                <div
                  key={image.url}
                  className="relative aspect-square overflow-hidden rounded-md border border-line bg-surface-2"
                >
                  <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2.5"
              onClick={() => setReplacePhotos(true)}
            >
              Replace all photos
            </Button>
          </>
        ) : (
          <>
            <PhotoUploader photos={newPhotos} onChange={setNewPhotos} />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setReplacePhotos(false);
                setNewPhotos([]);
              }}
            >
              Keep the current photos instead
            </Button>
          </>
        )}
      </section>

      <Input
        label="Title"
        maxLength={80}
        value={form.title}
        onChange={(event) => set({ title: event.target.value })}
      />

      <Textarea
        label="Description"
        maxLength={1000}
        value={form.description}
        onChange={(event) => set({ description: event.target.value })}
      />

      <div>
        <p className="mb-2 text-[13px] font-medium text-ink-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {LISTING_CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={form.category === category}
              onClick={() => set({ category })}
            >
              <span aria-hidden>{CATEGORY_META[category]?.emoji}</span>
              {category}
            </Chip>
          ))}
        </div>
      </div>

      <ChoiceGroup
        label="Condition"
        options={LISTING_CONDITIONS}
        value={form.condition}
        onChange={(condition) => set({ condition })}
        columns={2}
      />

      <ChoiceGroup
        label="Listing type"
        options={LISTING_TYPES}
        value={form.type}
        onChange={(type) => set({ type })}
        columns={2}
      />

      {form.type !== "giveaway" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            type="number"
            min="0"
            leading="₹"
            value={form.price}
            onChange={(event) => set({ price: event.target.value })}
            hint="Dropping the price alerts everyone who saved this."
          />
          <Input
            label="Original price"
            type="number"
            min="0"
            leading="₹"
            value={form.originalPrice}
            onChange={(event) => set({ originalPrice: event.target.value })}
          />
        </div>
      )}

      <ChoiceGroup
        label="Where will you meet?"
        options={LOCATION_SCOPES}
        value={form.locationScope}
        onChange={(locationScope) => set({ locationScope })}
      />

      <Input
        label="Meet-up hint"
        maxLength={80}
        value={form.meetupHint}
        onChange={(event) => set({ meetupHint: event.target.value })}
      />

      <div className="flex gap-2 pt-2">
        <Button variant="secondary" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="lg" block loading={updateListing.isPending} onClick={save}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
