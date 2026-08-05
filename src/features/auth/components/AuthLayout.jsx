import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { CheckIcon } from "@/components/ui/icons";

const PROOF = [
  "Only students with a verified college email",
  "Zero commission — you keep every rupee",
  "Chat in-app, never share your number",
];

/**
 * Split auth layout: form on the left, reassurance on the right.
 *
 * The right panel exists because the sign-up ask here is unusually personal —
 * we want an institutional email address. Stating why, next to the field,
 * measurably reduces drop-off at exactly the step where it happens.
 */
export default function AuthLayout({ title, subtitle, children, footer, step }) {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="flex flex-col px-5 py-7 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/explore" className="text-sm font-medium text-muted hover:text-ink">
            Browse first →
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          {step && <StepDots current={step.current} total={step.total} labels={step.labels} />}

          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>}

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </main>
      </div>

      <aside className="relative hidden flex-col justify-center overflow-hidden border-l border-line bg-surface p-14 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-tint blur-3xl"
        />

        <div className="relative">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand">
            Campus-only marketplace
          </p>
          <h2 className="mt-3 text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            Every semester, a small economy moves through your campus.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2">
            Cycles, calculators, hostel kettles, second-year notes. UniSale gives that trade a
            proper home — with people you can actually find on Monday morning.
          </p>

          <ul className="mt-9 space-y-3.5">
            {PROOF.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-ink-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                  <CheckIcon size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/** Progress dots. Knowing the flow is three steps, not ten, keeps people in it. */
function StepDots({ current, total, labels = [] }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              index < current ? "bg-brand" : "bg-surface-3"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-muted">
        Step {current} of {total}
        {labels[current - 1] ? ` · ${labels[current - 1]}` : ""}
      </p>
    </div>
  );
}
