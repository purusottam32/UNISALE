/**
 * Skip to content.
 *
 * The top bar is seven tab stops before the page even begins — logo, two nav
 * links, search, theme, saved, notifications, chat, avatar menu — and a
 * keyboard user paid that toll on every single navigation, because the app
 * chrome re-mounts on each route. This is the standard escape hatch and it is
 * required by PRD §9.4 (WCAG 2.1 AA, keyboard navigation).
 *
 * It is visually hidden until focused, then paints as a real button in the
 * top-left. `focus:not-sr` is not a thing in this design system, so the
 * geometry is written out: hidden state clips to 1px, focused state restores
 * a normal box.
 */
export default function SkipLink({ href = "#main" }) {
  return (
    <a
      href={href}
      className="
        sr
        focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:m-0 focus:h-auto
        focus:w-auto focus:overflow-visible focus:whitespace-normal focus:rounded-md
        focus:bg-brand focus:px-4 focus:py-2.5 focus:text-button focus:text-brand-fg
        focus:shadow-e2 focus:[clip-path:none]
      "
    >
      Skip to content
    </a>
  );
}
