import type { Metadata } from "next";
import EditListingScreen from "@/features/listings/screens/EditListingScreen";

export const metadata: Metadata = { title: "Edit listing" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  return <EditListingScreen listingId={id} />;
}
