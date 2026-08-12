"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/format";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { useMarkNotificationRead, useNotifications } from "../hooks";
import {
  AlertTriangle,
  Bell,
  Handshake,
  MessageCircle,
  PartyPopper,
  Star,
  TrendingDown,
} from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * One icon per notification type, so a glance down the list reads as a shape
 * before it reads as words. Falls back to the bell for a type the client does
 * not know about yet — the API can add one without shipping a UI change.
 */
const TYPE_ICON = {
  message: MessageCircle,
  listing_sold: Handshake,
  review_received: Star,
  wishlist_price_drop: TrendingDown,
  listing_removed: AlertTriangle,
  welcome: PartyPopper,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, isLoading } = useNotifications({ limit: 40 });
  const { markOne, markAll } = useMarkNotificationRead();

  const open = (notification) => {
    if (!notification.readAt) markOne.mutate(notification._id);
    if (notification.href) router.push(notification.href);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[72px] w-full" rounded="rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-muted">{unreadCount} unread</p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAll.mutate()}>
            Mark all read
          </Button>
        )}
      </header>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={iconSize.xl} strokeWidth={ICON_STROKE} />}
          title="Nothing new"
          description="Messages, price drops on saved items, and ratings will land here."
          action={{ label: "Browse listings", href: "/explore" }}
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification._id}>
              <button
                type="button"
                onClick={() => open(notification)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors",
                  notification.readAt
                    ? "border-line bg-surface hover:bg-surface-2"
                    : "border-brand/35 bg-brand-tint hover:brightness-[0.99]"
                )}
              >
                {notification.image ? (
                  <Image
                    src={notification.image}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  (() => {
                    const TypeIcon = TYPE_ICON[notification.type] || Bell;
                    return (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">
                        <TypeIcon size={iconSize.md} strokeWidth={ICON_STROKE} aria-hidden />
                      </span>
                    );
                  })()
                )}

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{notification.title}</span>
                  {notification.body && (
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                      {notification.body}
                    </span>
                  )}
                  <span className="mt-1 block text-[11px] text-muted">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </span>

                {!notification.readAt && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
