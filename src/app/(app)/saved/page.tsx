import type { Metadata } from "next";
import SavedScreen from "@/features/saved/screens/SavedScreen";

export const metadata: Metadata = { title: "Saved items" };

export default function SavedPage() {
  return <SavedScreen />;
}
