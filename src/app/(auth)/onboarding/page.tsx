import type { Metadata } from "next";
import OnboardingScreen from "@/features/auth/screens/OnboardingScreen";

export const metadata: Metadata = { title: "Set up your profile" };

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
