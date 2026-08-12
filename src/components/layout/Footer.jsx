import Link from "next/link";
import { FOOTER_NAV } from "@/config/navigation";
import { site } from "@/config/site";
import Logo from "./Logo";

/**
 * No `border-t`. The footer sits on `surface` while the section above it sits
 * on `canvas`, and at full-bleed width that value step separates the two on its
 * own — a hairline on top of it is the same edge drawn twice. The internal rule
 * above the copyright line is a genuine separator, so that one stays.
 */
export default function Footer() {
  return (
    <footer className="mt-24 bg-surface">
      <div className="container-page divide-y divide-line">
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed text-muted">
              {site.description}
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              {/* `micro` is the eyebrow token — 11px, 600, +0.06em uppercase.
                  This is exactly what it exists for. */}
              <h2 className="text-micro uppercase text-muted">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-ink-2 transition-colors duration-[--duration-fast] hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-caption text-muted">
          <p>
            © {new Date().getFullYear()} {site.name} — built for campus communities.
          </p>
          <a
            href={`mailto:${site.supportEmail}`}
            className="transition-colors duration-[--duration-fast] hover:text-ink"
          >
            {site.supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
