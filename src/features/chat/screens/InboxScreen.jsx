"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMessageTime } from "@/lib/format";
import Avatar from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/States";
import { ConversationRowSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { useConversations } from "../hooks";
import { useSocket } from "../socket-provider";
import { ImageOff, MessageCircle } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Conversation list.
 *
 * Threads are grouped around the listing they concern, because a seller with
 * five items needs to know *what* each buyer is asking about before they can
 * make sense of the message.
 */
export default function InboxScreen({ activeId = null }) {
  const { conversations, isLoading } = useConversations();
  const { onlineUsers } = useSocket();

  if (isLoading) {
    return (
      <div className="divide-y divide-line">
        {Array.from({ length: 5 }, (_, index) => (
          <ConversationRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle size={iconSize.xl} strokeWidth={ICON_STROKE} />}
        title="No chats yet"
        description="When you message a seller — or someone asks about your listing — the conversation shows up here."
        action={{ label: "Find something to buy", href: "/explore" }}
        secondaryAction={{ label: "Sell an item", href: "/sell" }}
      />
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
      {conversations.map((conversation) => {
        const person = conversation.counterparty;
        const listing = conversation.listing;
        const unread = conversation.unreadCount > 0;
        const isOnline = onlineUsers.has(String(person?._id));

        return (
          <li key={conversation._id}>
            <Link
              href={`/messages/${conversation._id}`}
              className={cn(
                "flex items-center gap-3 p-3 transition-colors hover:bg-surface-2",
                String(activeId) === String(conversation._id) && "bg-surface-2"
              )}
            >
              <span className="relative shrink-0">
                <Avatar
                  src={person?.avatar?.url || person?.avatar}
                  name={person?.name}
                  size="lg"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface bg-success"
                    title="Online now"
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      unread ? "font-bold text-ink" : "font-semibold text-ink-2"
                    )}
                  >
                    {person?.name || "Student"}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">
                    {formatMessageTime(conversation.lastMessageAt)}
                  </span>
                </span>

                <span
                  className={cn(
                    "mt-0.5 block truncate text-[13px]",
                    unread ? "font-medium text-ink-2" : "text-muted"
                  )}
                >
                  {conversation.lastMessage?.text || "Say hello"}
                </span>

                {listing && (
                  <span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-surface-2 py-0.5 pl-0.5 pr-2.5">
                    {listing.images?.[0]?.url ? (
                      <Image
                        src={listing.images[0].url}
                        alt=""
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-surface-3 text-faint">
                        <ImageOff size={11} strokeWidth={ICON_STROKE} aria-hidden />
                      </span>
                    )}
                    <span className="truncate text-[11px] text-muted">{listing.title}</span>
                  </span>
                )}
              </span>

              {unread && (
                <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-brand-fg">
                  {conversation.unreadCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
