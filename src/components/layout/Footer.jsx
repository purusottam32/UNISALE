import Link from "next/link";
import { FOOTER_NAV } from "@/config/navigation";
import { site } from "@/config/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
        </div>

        {FOOTER_NAV.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-[13px] font-semibold text-ink">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {site.name} — built for campus communities.
          </p>
          <a href={`mailto:${site.supportEmail}`} className="transition-colors hover:text-ink">
            {site.supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
