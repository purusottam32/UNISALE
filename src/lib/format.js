/** Indian-format currency, e.g. ₹1,25,000. Marketplace prices are never fractional. */
export const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

/** Compact price for dense card grids: ₹1.2L, ₹65k, ₹450. */
export const formatPriceCompact = (value) => {
  const amount = Number(value || 0);
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return `₹${amount}`;
};

export const formatCount = (value) => {
  const count = Number(value || 0);
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`;
  return String(count);
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "just now" / "12m" / "3h" / "5d" / "12 Mar" — the marketplace convention. */
export const formatRelativeTime = (input) => {
  if (!input) return "";
  const then = new Date(input).getTime();
  if (Number.isNaN(then)) return "";

  const delta = Date.now() - then;
  if (delta < MINUTE) return "just now";
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)}m ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)}h ago`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)}d ago`;

  return new Date(then).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/** Clock time for message bubbles, date for anything older than today. */
export const formatMessageTime = (input) => {
  if (!input) return "";
  const date = new Date(input);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const formatMemberSince = (input) => {
  if (!input) return "";
  return new Date(input).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

/** "3rd year · Computer Science · IIT Bombay", skipping any missing part. */
export const formatCampusLine = (user) => {
  if (!user) return "";
  const suffix = { 1: "st", 2: "nd", 3: "rd" };
  const parts = [];
  if (user.year) parts.push(`${user.year}${suffix[user.year] || "th"} year`);
  if (user.department) parts.push(user.department);
  if (user.college) parts.push(user.college);
  return parts.join(" · ");
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/** Percentage saved against the seller's stated original price. */
export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};
