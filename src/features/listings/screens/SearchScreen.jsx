"use client";

import { useState } from "react";
import { useListings } from "../hooks";
import { useListingFilters } from "../use-filters";
import { EmptyState } from "@/components/ui/States";
import SearchBar from "@/features/search/SearchBar";
import FilterBar from "../components/FilterBar";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import { Search, SearchX } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

export default function SearchScreen() {
  const { filters, setFilters, query, apiParams } = useListingFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { listings, totalItems, isLoading, hasMore, loadMore, isFetchingMore, error, refetch } =
    useListings(apiParams, { enabled: Boolean(query) });

  return (
    <div className="space-y-5">
      <div className="md:hidden">
        <SearchBar />
      </div>

      {query ? (
        <header>
          <h1 className="text-headline text-ink">Results for “{query}”</h1>
        </header>
      ) : (
        <EmptyState
          icon={<Search size={iconSize.xl} strokeWidth={ICON_STROKE} />}
          title="What are you after?"
          description="Search for cycles, calculators, textbooks, hostel kit — anything students trade."
          action={{ label: "Browse everything", href: "/explore" }}
        />
      )}

      {query && (
        <>
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
                icon={<SearchX size={iconSize.xl} strokeWidth={ICON_STROKE} />}
                title={`No results for “${query}”`}
                description={
                  filters.allColleges
                    ? "Nobody is selling this right now. Try a simpler word — 'cycle' beats 'Hero Sprint 26 inch'."
                    : "Nothing on your campus. Students at other colleges may have it."
                }
                action={
                  filters.allColleges
                    ? { label: "Browse all listings", href: "/explore" }
                    : { label: "Search all colleges", onClick: () => setFilters({ allColleges: true }) }
                }
              />
            }
          />
        </>
      )}

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
