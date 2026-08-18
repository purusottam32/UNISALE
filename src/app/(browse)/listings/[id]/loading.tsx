import { DetailSkeleton } from "@/features/listings/screens/ListingDetailScreen";

/**
 * The listing page is a server component that awaits `fetchListing` before it
 * renders anything, so a tap on a card produced no feedback at all until the
 * API answered — on campus wifi that reads as a dead link, and the second tap
 * is a wasted request. This paints the detail layout immediately instead.
 */
export default function ListingLoading() {
  return <DetailSkeleton />;
}
