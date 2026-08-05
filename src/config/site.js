export const site = {
  name: "UniSale",
  tagline: "Your campus marketplace",
  description:
    "Buy, sell and exchange safely with verified students from your own college. No strangers, no commission.",
  url: "https://unisale.in",
  supportEmail: "help@unisale.in",
};

/**
 * Safety guidance shown on listing pages and the first message of every chat.
 * Meeting advice is the cheapest fraud control we have before Phase 2.
 */
export const SAFETY_TIPS = [
  "Meet in a busy campus spot — library steps, canteen, hostel gate.",
  "Inspect the item and test it before you hand over any money.",
  "Pay in person. Never send an advance to someone you have not met.",
  "Keep the conversation inside UniSale so we can act on reports.",
];

/**
 * Trending search terms.
 *
 * Static for now — a real implementation aggregates query logs per campus,
 * which needs a search-events collection we have not built. The UI treats this
 * exactly as it will treat live data, so swapping the source is a one-line
 * change in `useTrendingSearches()`.
 */
export const TRENDING_SEARCHES = [
  "cycle",
  "calculator",
  "study table",
  "iPhone",
  "mattress",
  "lab coat",
  "headphones",
  "drafter",
];

export const REPORT_REASONS = [
  "Item is fake or misrepresented",
  "Suspected scam or fraud",
  "Prohibited item",
  "Offensive or abusive content",
  "Spam or duplicate listing",
  "Something else",
];
