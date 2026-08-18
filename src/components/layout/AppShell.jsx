import BottomNav from "./BottomNav";
import SkipLink from "./SkipLink";
import TopBar from "./TopBar";

/**
 * Chrome for every authenticated page: header, mobile tab bar, and the bottom
 * padding that keeps content clear of the tab bar and the iOS home indicator.
 */
export default function AppShell({ children, width = "default" }) {
  const maxWidth =
    width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-[1400px]" : "max-w-[1220px]";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SkipLink />
      <TopBar />

      {/*
        `flex flex-col` on both `main` and its container is load-bearing, not
        tidiness: the conversation thread sizes itself with `flex-1` so its
        composer sits at the bottom of the viewport. While this wrapper was a
        plain block it shrink-wrapped its content, `flex-1` resolved against no
        height, and the composer floated mid-page on any screen taller than the
        thread.

        The bottom padding clears the mobile tab bar — which is `lg:hidden`, so
        reserving space for it on desktop only left dead scroll at the foot of
        every page. On desktop the container's own `py-7` is the page's bottom
        breathing room, which is also what lets the chat composer sit flush
        against the viewport edge once the thread cancels that padding.
      */}
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 flex-col pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+16px)] outline-none lg:pb-0"
      >
        <div className={`mx-auto flex w-full flex-1 flex-col px-4 py-5 md:px-7 md:py-7 ${maxWidth}`}>
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
