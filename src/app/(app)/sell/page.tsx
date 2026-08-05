import type { Metadata } from "next";
import SellScreen from "@/features/listings/screens/SellScreen";

export const metadata: Metadata = { title: "Sell an item" };

export default function SellPage() {
  return <SellScreen />;
}
