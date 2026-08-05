import Badge from "./Badge";
import { ShieldIcon, VerifiedIcon } from "./icons";

const TIER_TONE = {
  trusted: "success",
  verified: "brand",
  new: "neutral",
};

/**
 * The trust tier a seller has earned (PRD §10.2). Rendering the tier rather
 * than the raw 0-100 score keeps it legible and stops students gaming a number.
 */
export default function TrustBadge({ tier, isEmailVerified, size = "md" }) {
  const key = tier?.key || (isEmailVerified ? "verified" : "new");
  const label = tier?.label || (isEmailVerified ? "Verified Student" : "New Member");

  return (
    <Badge
      tone={TIER_TONE[key] || "neutral"}
      icon={key === "trusted" ? <ShieldIcon size={13} /> : <VerifiedIcon size={13} />}
      className={size === "sm" ? "px-2 py-0.5 text-[10px]" : undefined}
    >
      {label}
    </Badge>
  );
}
