"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SAFETY_TIPS } from "@/config/site";
import { useAuth } from "@/features/auth/auth-context";
import { formatMessageTime, formatPrice } from "@/lib/format";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/components/ui/cn";
import { CheckIcon, ChevronLeftIcon, SendIcon, ShieldIcon } from "@/components/ui/icons";
import { useConversation } from "../hooks";
import { useSocket } from "../socket-provider";

/** Suggested openers — a blank chat box is where most first contacts die. */
const QUICK_REPLIES = [
  "Hi! Is this still available?",
  "Would you take a slightly lower price?",
  "When and where can we meet?",
];

export default function ConversationScreen({ conversationId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const { conversation, messages, isLoading, typingUser, send, setTyping, isLive } =
    useConversation(conversationId);

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const person = conversation?.counterparty;
  const listing = conversation?.listing;
  const isOnline = onlineUsers.has(String(person?._id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: messages.length > 12 ? "auto" : "smooth" });
  }, [messages.length, typingUser]);

  /**
   * Emit `typing:start` once, then a single `typing:stop` after a pause —
   * rather than an event per keystroke.
   */
  const onDraftChange = (value) => {
    setDraft(value);
    setTyping(true);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setTyping(false), 1400);
  };

  const submit = async (event) => {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || isSending) return;

    setIsSending(true);
    setDraft("");
    setTyping(false);

    try {
      await send(body);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-[var(--topbar-h)] z-30 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={() => router.push("/messages")}
            aria-label="Back to chats"
            className="-ml-1 rounded-full p-1.5 text-ink-2 hover:bg-surface-2 lg:hidden"
          >
            <ChevronLeftIcon />
          </button>

          {person ? (
            <Link href={`/u/${person._id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
              <Avatar src={person.avatar?.url || person.avatar} name={person.name} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{person.name}</span>
                <span className="block truncate text-[11px] text-muted">
                  {isOnline ? "Online now" : person.college}
                </span>
              </span>
            </Link>
          ) : (
            <Skeleton className="h-8 w-36" />
          )}

          {!isLive && (
            <span className="shrink-0 rounded-full bg-warn-tint px-2 py-1 text-[10px] font-semibold text-warn">
              Reconnecting
            </span>
          )}
        </div>

        {listing && (
          <div className="border-t border-line bg-surface-2">
            <Link
              href={`/listings/${listing._id}`}
              className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-2"
            >
              {listing.images?.[0]?.url ? (
                <Image
                  src={listing.images[0].url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-md object-cover"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-md bg-surface-3">📦</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-ink">
                  {listing.title}
                </span>
                <span className="block text-xs font-bold text-ink-2">
                  {formatPrice(listing.price)}
                </span>
              </span>
              {listing.status === "sold" && (
                <span className="shrink-0 rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">
                  Sold
                </span>
              )}
            </Link>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={index}
                className={cn("h-10", index % 2 ? "ml-auto w-2/5" : "w-3/5")}
                rounded="rounded-xl"
              />
            ))}
          </div>
        ) : (
          <>
            <SafetyBanner />

            <ul className="mt-4 space-y-2">
              {messages.map((message, index) => {
                const isMine = String(message.sender?._id || message.sender) === String(user?.id);
                const previous = messages[index - 1];
                const startsGroup =
                  !previous ||
                  String(previous.sender?._id || previous.sender) !==
                    String(message.sender?._id || message.sender);

                if (message.kind === "system") {
                  return (
                    <li key={message._id} className="py-2 text-center">
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] text-muted">
                        {message.text}
                      </span>
                    </li>
                  );
                }

                return (
                  <li
                    key={message._id}
                    className={cn("flex", isMine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3.5 py-2",
                        isMine
                          ? "bg-brand text-brand-fg"
                          : "border border-line bg-surface text-ink",
                        startsGroup
                          ? isMine
                            ? "rounded-tr-md"
                            : "rounded-tl-md"
                          : undefined
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
                        {message.text}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 flex items-center justify-end gap-1 text-[10px]",
                          isMine ? "text-brand-fg/70" : "text-muted"
                        )}
                      >
                        {formatMessageTime(message.createdAt)}
                        {isMine && message.readAt && <CheckIcon size={12} />}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {messages.length === 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-center text-xs text-muted">Break the ice:</p>
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => send(reply)}
                    className="mx-auto block rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-2 transition-colors hover:border-brand hover:text-brand"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {typingUser && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <span className="flex gap-0.5" aria-hidden>
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-muted"
                      style={{ animation: `u-fade 1s ${dot * 0.15}s infinite alternate` }}
                    />
                  ))}
                </span>
                {person?.name?.split(" ")[0] || "They"} is typing…
              </p>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      <form
        onSubmit={submit}
        className="sticky bottom-0 border-t border-line bg-surface/96 backdrop-blur-md"
        style={{ paddingBottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 px-4 py-3">
          <textarea
            rows={1}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter adds a line. Standard for chat.
              if (event.key === "Enter" && !event.shiftKey) submit(event);
            }}
            placeholder="Write a message…"
            aria-label="Message"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand-ring"
          />

          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-brand-fg transition-opacity disabled:opacity-40"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

function SafetyBanner() {
  return (
    <div className="flex gap-2.5 rounded-lg border border-line bg-info-tint/60 p-3">
      <span className="mt-0.5 shrink-0 text-info">
        <ShieldIcon size={15} />
      </span>
      <p className="text-xs leading-relaxed text-ink-2">
        {SAFETY_TIPS[0]} Never send money before you have the item in your hands.
      </p>
    </div>
  );
}
