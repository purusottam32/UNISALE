import { fetchListings } from "@/lib/server-fetch";
import Feed from "@/screens/Feed";

export default async function FeedPage() {
  const initialData = await fetchListings({
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
    allColleges: false,
  });

  return <Feed initialData={initialData} />;
}
