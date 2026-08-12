"use client";

import { useState } from "react";
import { useListings } from "../hooks";
import { useListingFilters } from "../use-filters";
import { EmptyState } from "@/components/ui/States";
import FilterBar from "../components/FilterBar";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import { FilterX } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

export default function ExploreScreen() {
  const { filters, setFilters, apiParams } = useListingFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { listings, totalItems, isLoading, hasMore, loadMore, isFetchingMore, error, refetch } =
    useListings(apiParams);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-display-md text-ink">Explore</h1>
        <p className="mt-1 text-body-sm text-muted">
          Everything on sale across campus, newest first.
        </p>
      </header>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onOpenFilters={() => setFiltersOpen(true)}
        totalItems={totalItems}
        isLoading={isLoading}
      />

      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        isFetchingMore={isFetchingMore}
        error={error}
        onRetry={refetch}
        emptyState={
          <EmptyState
            icon={<FilterX size={iconSize.xl} strokeWidth={ICON_STROKE} />}
            title="Nothing matches those filters"
            description={
              filters.allColleges
                ? "Try removing a filter or searching for a broader term."
                : "Your campus has nothing like this right now. Widening to all colleges usually helps."
            }
            action={
              filters.allColleges
                ? { label: "Clear filters", onClick: () => setFilters({ ...filters, category: "", condition: "", type: "", minPrice: "", maxPrice: "" }) }
                : { label: "Search all colleges", onClick: () => setFilters({ allColleges: true }) }
            }
            secondaryAction={{ label: "Sell something instead", href: "/sell" }}
          />
        }
      />

      <FilterPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApply={setFilters}
        resultCount={totalItems}
        isCounting={isLoading}
      />
    </div>
  );
}
