import type { Metadata } from "next";
import DesignSystemScreen from "@/features/design-system/DesignSystemScreen";

export const metadata: Metadata = {
  title: "Design system",
  description: "Living reference for every UniSale design token.",
  robots: { index: false, follow: false },
};

/**
 * Living style guide.
 *
 * This is the acceptance test for the token layer: if a token cannot be seen
 * and interacted with here, it does not exist as far as the product is
 * concerned. Kept out of the app shell deliberately — it is a reference
 * document, not a screen.
 */
export default function DesignSystemPage() {
  return <DesignSystemScreen />;
}
