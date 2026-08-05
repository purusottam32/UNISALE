import { Suspense } from "react";
import type { Metadata } from "next";
import ProfileScreen from "@/features/profile/screens/ProfileScreen";

export const metadata: Metadata = { title: "Your profile" };

export default function ProfilePage() {
  // Reads `?tab=` to restore the selected tab on a shared or refreshed URL.
  return (
    <Suspense fallback={null}>
      <ProfileScreen />
    </Suspense>
  );
}
