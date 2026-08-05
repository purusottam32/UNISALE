import type { Metadata } from "next";
import SettingsScreen from "@/features/profile/screens/SettingsScreen";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsScreen />;
}
