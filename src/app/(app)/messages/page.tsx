import type { Metadata } from "next";
import InboxScreen from "@/features/chat/screens/InboxScreen";

export const metadata: Metadata = { title: "Chats" };

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Chats</h1>
      <InboxScreen />
    </div>
  );
}
