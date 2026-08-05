import { SAFETY_TIPS } from "@/config/site";
import { ShieldIcon } from "@/components/ui/icons";

/**
 * Meeting guidance on every listing.
 *
 * With no escrow or payments in the MVP, the handover is where things go wrong,
 * and clear advice at the moment of intent is the cheapest fraud control we
 * have (PRD §16).
 */
export default function SafetyNote({ compact = false }) {
  return (
    <aside className="rounded-lg border border-line bg-info-tint/60 p-4">
      <h2 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="text-info">
          <ShieldIcon size={16} />
        </span>
        Stay safe on campus
      </h2>

      <ul className="mt-2 space-y-1.5">
        {(compact ? SAFETY_TIPS.slice(0, 2) : SAFETY_TIPS).map((tip) => (
          <li key={tip} className="flex gap-2 text-xs leading-relaxed text-ink-2">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-info" />
            {tip}
          </li>
        ))}
      </ul>
    </aside>
  );
}
