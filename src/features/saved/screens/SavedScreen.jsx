"use client";

import { EmptyState } from "@/components/ui/States";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import ListingGrid from "@/features/listings/components/ListingGrid";
import { useSavedListings } from "../hooks";
import { Heart } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

export default function SavedScreen() {
  const { listings, isLoading } = useSavedListings();

  const active = listings.filter((listing) => listing.status === "active");
  const gone = listings.filter((listing) => listing.status !== "active");

  if (isLoading) return <ProductGridSkeleton count={6} />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Saved</h1>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll tell you if the price drops on anything here.
        </p>
      </header>

      <ListingGrid
        listings={active}
        emptyState={
          <EmptyState
            icon={<Heart size={iconSize.xl} strokeWidth={ICON_STROKE} />}
            title="Nothing saved yet"
            description="Tap the heart on any listing to keep it here and get notified when its price drops."
            action={{ label: "Start browsing", href: "/explore" }}
          />
        }
      />

      {gone.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-ink">No longer available</h2>
          <div className="opacity-65">
            <ListingGrid listings={gone} />
          </div>
        </section>
      )}
    </div>
  );
}
