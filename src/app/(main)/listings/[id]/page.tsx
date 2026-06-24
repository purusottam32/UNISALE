import { fetchListingById } from "@/lib/server-fetch";
import ListingDetail from "@/screens/ListingDetail";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await fetchListingById(id);

  return <ListingDetail initialData={initialData} />;
}

