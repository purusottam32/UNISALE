import { Suspense } from "react";
import type { Metadata } from "next";
import ExploreScreen from "@/features/listings/screens/ExploreScreen";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Explore listings",
  description: "Browse everything students are selling on campus — filter by category, price and condition.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ExploreScreen />
    </Suspense>
  );
}
