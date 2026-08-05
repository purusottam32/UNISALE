import type { Metadata } from "next";
import RegisterScreen from "@/features/auth/screens/RegisterScreen";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Join your campus marketplace with your college email. Free, no commission.",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
