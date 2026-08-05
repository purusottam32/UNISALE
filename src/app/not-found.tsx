import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
      <div>
        <p className="text-5xl" aria-hidden>
          🧭
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.02em] text-ink">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-2 text-sm text-muted">
          The link may be old, or the listing may have sold.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link
            href="/explore"
            className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-fg"
          >
            Browse listings
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-semibold text-ink"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
