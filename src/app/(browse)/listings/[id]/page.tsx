import type { Metadata } from "next";
import ListingDetailScreen from "@/features/listings/screens/ListingDetailScreen";
import { fetchListing } from "@/lib/server-fetch";

type PageProps = { params: Promise<{ id: string }> };

/**
 * Listing pages are the app's shareable surface — a student pastes one into a
 * hostel WhatsApp group and it has to unfurl with the photo, title and price.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListing(id);

  if (!listing) return { title: "Listing not found" };

  const price = `₹${Number(listing.price || 0).toLocaleString("en-IN")}`;

  return {
    title: `${listing.title} — ${price}`,
    description: listing.description?.slice(0, 160),
    openGraph: {
      title: `${listing.title} — ${price}`,
      description: listing.description?.slice(0, 160),
      images: listing.images?.[0]?.url ? [{ url: listing.images[0].url }] : undefined,
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  // Server-fetched so the page paints with content; the client hook takes over
  // and keeps view counts and status live from there.
  const initialData = await fetchListing(id);

  return <ListingDetailScreen listingId={id} initialData={initialData} />;
}
