import { Suspense } from "react";
import type { Metadata } from "next";
import SearchScreen from "@/features/listings/screens/SearchScreen";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchScreen />
    </Suspense>
  );
}
