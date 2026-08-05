import BottomNav from "./BottomNav";
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
      <TopBar />

      <main
        className="flex-1"
        style={{ paddingBottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 16px)" }}
      >
        <div className={`mx-auto w-full px-4 py-5 md:px-7 md:py-7 ${maxWidth}`}>{children}</div>
      </main>

      <BottomNav />
    </div>
  );
}

/** Full-bleed variant for the chat thread, which manages its own scrolling. */
export function AppShellBleed({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopBar />
      <main className="flex flex-1 flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
