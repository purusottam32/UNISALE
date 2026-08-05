/**
 * The thread view manages its own header, scroll region and composer, so it
 * opts out of the padded container that the rest of the app group uses.
 */
export default function ConversationLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mx-4 -my-5 flex flex-1 flex-col md:-mx-7 md:-my-7">{children}</div>;
}
