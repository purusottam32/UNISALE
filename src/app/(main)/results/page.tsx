import { Suspense } from "react";
import { fetchListings } from "@/lib/server-fetch";
import SearchResults from "@/screens/SearchResults";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = {
    q: typeof params.q === "string" ? params.q : undefined,
    category: typeof params.category === "string" ? params.category : typeof params.cat === "string" ? params.cat : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    condition: typeof params.condition === "string" ? params.condition : undefined,
    minPrice: typeof params.minPrice === "string" ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === "string" ? params.maxPrice : undefined,
    sortBy: typeof params.sortBy === "string" ? params.sortBy : "createdAt",
    sortOrder: typeof params.sortOrder === "string" ? params.sortOrder : "desc",
    page: typeof params.page === "string" ? params.page : "1",
    limit: 12,
    allColleges: typeof params.allColleges === "string" ? params.allColleges : "true",
  };

  const initialData = await fetchListings(filters);

  return (
    <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
      <SearchResults initialData={initialData} />
    </Suspense>
  );
}
