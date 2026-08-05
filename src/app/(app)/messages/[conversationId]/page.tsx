import type { Metadata } from "next";
import ConversationScreen from "@/features/chat/screens/ConversationScreen";

export const metadata: Metadata = { title: "Chat" };

type PageProps = { params: Promise<{ conversationId: string }> };

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  return <ConversationScreen conversationId={conversationId} />;
}
