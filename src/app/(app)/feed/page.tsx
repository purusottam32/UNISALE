import type { Metadata } from "next";
import FeedScreen from "@/features/listings/screens/FeedScreen";

export const metadata: Metadata = { title: "Campus feed" };

export default function FeedPage() {
  return <FeedScreen />;
}
