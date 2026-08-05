import type { Metadata } from "next";
import PublicProfileScreen from "@/features/profile/screens/PublicProfileScreen";
import { fetchPublicProfile } from "@/lib/server-fetch";

type PageProps = { params: Promise<{ userId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await fetchPublicProfile(userId);

  if (!profile) return { title: "Profile not found" };

  return {
    title: `${profile.name} on UniSale`,
    description: profile.bio || `${profile.name} sells on the ${profile.college} campus marketplace.`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { userId } = await params;
  return <PublicProfileScreen userId={userId} />;
}
