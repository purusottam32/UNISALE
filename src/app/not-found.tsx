import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="max-w-md">
        {/* No glyph. A 404 is a dead end, and decorating it does not make it
            less of one — the two ways out are the content. */}
        <p className="text-micro uppercase text-muted">404</p>
        <h1 className="mt-3 text-display-md text-ink">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-body text-muted">
          The link may be old, or the listing may have sold.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/explore">Browse listings</Button>
          <Button href="/" variant="ghost">
            Go home
          </Button>
        </div>
      </div>
    </main>
  );
}
