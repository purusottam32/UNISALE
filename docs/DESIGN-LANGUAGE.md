# UniSale Design Language

**Status:** Proposed · **Author:** Design + Frontend · **Supersedes:** the interim
token set in `src/styles/globals.css`

---

## 0. Research log — what was actually consulted

Honesty first, because a design rationale is worthless if you can't audit its
sources.

| Source | Status | What I got |
|---|---|---|
| **Mobbin MCP** | ❌ **Blocked** | `402 — requires a paid plan`, on all three tools (`search_screens`, `search_flows`, `search_sections`), both platforms, every query. Not a transient error. **0 references.** |
| **Dribbble** | ⚠️ **Effectively blocked** | Tag pages render client-side; fetches return an empty document. I could see that `/tags/marketplace-app` reports 400+ shots, but **could not view a single shot**. **0 usable references.** |
| **Behance** | ❌ **Blocked** | HTTP 403 on project search. Search results confirmed a *"Student Swap — Campus Buy & Sell"* case study exists, but the page is unreachable. **0 references.** |
| **Token-level design system extractions** | ✅ **10 systems** | Full hex/type/space/radius/elevation specs for Linear, Airbnb, Stripe, Apple, Raycast, Notion, Nike, Vercel, Pinterest, Shopify, Revolut, Superhuman, Framer. |
| **Motion research** | ✅ | Duration/easing guidance, cross-referenced. |
| **Baymard Institute** | ✅ | 93 product-list usability guidelines, 35 specific to filtering. |
| **Arc / CRED** | ✅ (secondary) | Written analyses, not token specs. |

**I did not hit the requested quotas (20 Mobbin / 30 Dribbble / 10 Behance) and
cannot pretend otherwise.** What I got instead is arguably better for this job:
*measured* specs from thirteen shipped products — exact hex values, type scales
with per-token letter-spacing, and elevation stacks — rather than screenshots I
would have to eyeball. Dribbble shots are aspirational concepts; these are what
billion-dollar products actually ship.

If Mobbin access is restored, the flows worth studying first are: Airbnb search
& filter, Depop/Vinted listing creation, and Stripe Checkout.

---

## 1. Reference ranking

Ranked by relevance to *a premium two-sided marketplace where user-supplied
photography is the content*.

| # | Reference | Why it ranks here |
|---|---|---|
| **1** | **Airbnb** | The closest structural analog: a two-sided marketplace where amateur photography is the product. Solves exactly our problem. |
| **2** | **Linear** | The definitive modern craft benchmark. Its type discipline is the single most transferable asset in this list. |
| **3** | **Apple** | The reference for "the chrome disappears so the product can speak" — which *is* the marketplace problem. |
| 4 | Pinterest | Discovery grid at scale; "get out of the photograph's way." |
| 5 | Nike | Editorial commerce; extreme typographic contrast; product card anatomy. |
| 6 | Stripe | Premium restraint; tabular numerals for money. |
| 7 | Vercel | The best *modern* elevation model (stacked micro-shadows + inset hairline). |
| 8 | Raycast | The reference dark theme: surface ladder, zero shadows. |
| 9 | Revolut | Premium via colour-blocking and oversized display type. |
| 10 | Notion / Superhuman / Shopify / Framer | Supporting evidence on weight, radius, section rhythm. |

### Why the top three work

**Airbnb — restraint as a strategy.** Display type caps at 22–28px at weights
500–600. That is *deliberately modest* for a hero. Why it works: their listings
are photographs shot by hosts on phones — inconsistent, uncontrolled, sometimes
poor. Loud typography would compete with that imagery and lose. Their elevation
system is a **single** shadow tier, applied only on hover. Depth comes from
white-on-white surface separation and corner clipping. **Directly applicable:
our listings are photographs shot by students on phones. Same constraint, same
answer.**

**Linear — tracking is the whole trick.** `display-xl` is 80px/600 at
**−3.0px** letter-spacing; the ladder runs −1.8 at 56px, −1.0 at 40px, −0.6 at
28px, and reaches 0 by 14px. Body weights sit in a narrow 400–510 band — never
700. The accent (`#5e6ad2`) appears *only* on the brand mark, primary CTAs,
focus rings and link emphasis, "never decoratively." Why it works: aggressive
negative tracking at display sizes reads as *typographic confidence* — the type
is set the way a magazine masthead is set, not the way a Bootstrap `<h1>` is.
This is the cheapest, highest-yield premium signal available, and it costs
nothing to implement.

**Apple — one accent, one shadow, zero decorative gradients.** Exactly one
interactive colour (`#0066cc`). Exactly one shadow, reserved for product
imagery. Atmosphere comes from photography, never from CSS. Body is 17px, not
16 — a deliberately slower reading pace. Section rhythm is 80px. Why it works:
every removal makes the remaining elements louder. When only one thing is blue,
that blue *means* "this is the action."

---

## 2. The seven principles the evidence actually supports

Not opinions — patterns that recur across independently-built systems.

### P1 · Negative tracking on display type is the universal premium signal
**Evidence: 8/8 systems that document it.** Linear −3.0px@80px · Notion
−2px@80px · Framer −5.5px@110px · Vercel −2.4px@48px · Stripe −1.4px@56px ·
Revolut −2.72px@136px · Apple −0.28px@56px · Airbnb −0.44px@22px.
The ratio holds at roughly **−0.03em to −0.04em at display sizes, easing to 0 by
14px.**

### P2 · Weight restraint, not weight escalation
Vercel caps at **600, "never 700 or heavier."** Linear lives in **400–510**.
Stripe sets display at **300**. Superhuman uses "sub-default" **460/540**.
Nobody in the premium tier reaches for 800/900. Heavy type is how mass-market
retail shouts; restraint is how premium speaks.

### P3 · Elevation is dead; surface separation replaced it
**Linear, Raycast, Nike, Revolut, Pinterest: literally zero drop shadows.**
Airbnb: one tier, hover only. Apple: one, product imagery only. Depth comes from
a *surface ladder* (dark mode) or *hairlines + corner clipping* (light mode).
Where shadow survives, it is **Vercel's model — several tiny stacked offsets
plus an inset hairline**, never one big soft blur.

> ⚠️ **This contradicts the brief.** You asked to "prefer shadows over
> outlines." The evidence says the premium tier went the other way, because
> large soft shadows are the visual signature of Material Design 2 — the exact
> look you also asked to avoid. **§4.5 proposes a synthesis** that satisfies
> the intent (depth without boxy outlines) using the modern technique.

### P4 · One accent, spent sparingly
**Unanimous, 6/6 systems that state a principle.** Airbnb: "single accent
voltage." Apple: "no secondary brand color." Pinterest: "reserved exclusively
for primary actions." Linear: "never decoratively." Revolut: featured card only.
Raycast: a white pill. The accent is a *flashlight*, not paint.

### P5 · Photography-first; the chrome recedes
Nike: "photography speaks, the chrome doesn't." Pinterest: "get out of the
photograph's way." Apple: "product renders carry all visual weight; UI recedes."
Airbnb: "photography provides visual hierarchy instead" of typography.
**For UniSale this is the load-bearing principle.** Our content is a second-hand
cycle photographed against a hostel wall. Every pixel of chrome we add competes
with it.

### P6 · Generous section rhythm is the luxury tell
Linear 96px · Raycast 96px · Notion 64/96/120px · Shopify 64–128px ("whitespace
is the brand's most valuable asset") · Vercel up to 192px. Meanwhile *card
gutters* stay tight — Airbnb explicitly compresses to 16px "to maintain scan
efficiency." **Air between sections, density within grids.**

### P7 · Money gets tabular figures
Stripe: "any cell rendering currency, transaction amounts, or numeric counts
uses `font-feature-settings: 'tnum'`." Non-negotiable for a marketplace — a
price column that shifts as digits change reads as amateur.

---

## 3. The UniSale thesis

> **A quiet, confident frame around student photography.**

Not "Apple meets Airbnb meets CRED meets Linear" as a mood board — as a specific
division of labour:

- **Airbnb** gives us the *structure*: how a marketplace grid breathes.
- **Linear** gives us the *typography*: tracking, weight ceiling, hairlines.
- **Apple** gives us the *discipline*: one accent, one elevation idea, no decoration.
- **CRED** gives us the *one permitted indulgence*: a single moment of delight
  per journey — the publish confirmation, the first sale. CRED's lesson is
  double-edged; its own design community critique is that it prioritises UI over
  UX. **We take its craft ceiling and reject its ornament budget.**

**The feeling is calm competence, not spectacle.** A student should be able to
list a cycle in forty seconds at 11pm on hostel wifi and feel the app is on
their side. Nothing should feel like it is performing at them.

### The three tests
1. **The squint test.** Blur the screen. The photograph and the price must be
   the only things you can identify. If chrome survives the squint, remove it.
2. **The one-blue test.** Anything indigo must be an action. If it is indigo and
   not clickable, it is a bug.
3. **The removal test.** Delete any element. If nothing breaks, it stays deleted.

---

## 4. Tokens

### 4.1 Colour — light

Your brief specified Indigo primary / Slate secondary / Emerald accent /
`#FAFAFA` canvas. **The research validates that instinct precisely:** Linear
`#5e6ad2`, Stripe `#533afd`, Notion `#5645d4` and Revolut `#494fdf` are *all*
indigo-violet in the same hue band. You independently landed on the premium
cohort's colour. We keep it and use slate (blue-tinted) rather than neutral grey
so the neutrals harmonise with the indigo rather than fighting it.

```
── Brand ────────────────────────────────────────────
indigo-50    #EEF0FF    tint fills, selected chips
indigo-100   #E0E4FF    hover on tint
indigo-300   #A5B4FC    dark-mode links
indigo-400   #818CF8    dark-mode primary
indigo-600   #4F46E5    ★ PRIMARY — light-mode actions
indigo-700   #4338CA    pressed / high-contrast text
indigo-900   #312E81    deep band backgrounds

── Accent (success, trust, "verified", price-drop) ──
emerald-50   #ECFDF5
emerald-400  #34D399    dark-mode accent
emerald-500  #10B981    decorative only on light — see contrast table
emerald-700  #047857    ★ light-mode accent text & fills

── Neutrals (Slate) ─────────────────────────────────
canvas       #FAFAFA    page background
surface      #FFFFFF    cards, sheets
surface-2    #F1F5F9    inset wells, inputs
surface-3    #E2E8F0    pressed states
hairline     #E7E7EA    dividers (decorative)
hairline-2   #CBD5E1    input borders
ink          #18181B    headings, prices
ink-2        #3F3F46    body copy
muted        #64748B    metadata, captions
faint        #94A3B8    disabled, placeholder-adjacent only

── Semantic ─────────────────────────────────────────
warn         #B45309
danger       #BE123C
danger-fill  #E11D48    (white text)
info         #4338CA
```

### 4.2 Colour — dark ("true premium dark")

The research is emphatic: premium dark is **near-black**, not Material's
`#121212` grey. Linear `#08090a` · Raycast `#07080a` · Framer `#090909` ·
Shopify `#0a0a0a`. Depth comes from a **surface ladder**, each step lighter
reading as one step closer — Raycast: *"no drop-shadow elevation at all."*

```
canvas       #08090B
surface      #0F1114
surface-2    #16181C
surface-3    #1D2025
hairline     rgba(255,255,255,0.08)
hairline-2   rgba(255,255,255,0.14)
ink          #F4F5F7
ink-2        #C3C8D1
muted        #8B919D
primary      #818CF8   (indigo-400)
accent       #34D399   (emerald-400)
```

### 4.3 Verified contrast

Computed, not estimated. WCAG AA needs **4.5:1** body text, **3:1** large text
and UI state.

| Pair | Ratio | Verdict |
|---|---|---|
| ink on canvas | **16.97** | AAA |
| ink-2 on canvas | **10.01** | AAA |
| muted on canvas | **4.56** | AA ✓ (tight — do not lighten) |
| muted on surface | **4.76** | AA ✓ |
| faint on canvas | 2.46 | ✗ **decorative / disabled only** |
| white on indigo-600 | **6.29** | AA ✓ — primary button |
| indigo-600 on canvas | **6.02** | AA ✓ — links, focus ring |
| white on indigo-700 | **7.90** | AAA — pressed |
| emerald-700 on canvas | **5.25** | AA ✓ |
| white on emerald-700 | **5.48** | AA ✓ |
| emerald-500 on canvas | 3.61 | ✗ **large text / icons only** |
| danger on canvas | **6.02** | AA ✓ |
| white on danger-fill | **4.70** | AA ✓ |
| **dark** ink on canvas | **18.26** | AAA |
| dark muted on canvas | **6.29** | AA ✓ |
| dark indigo-400 on canvas | **6.68** | AA ✓ |
| dark canvas on indigo-400 | **6.68** | AA ✓ — inverted button |
| dark emerald-400 on canvas | **10.36** | AAA |

> **Trap avoided:** the obvious emerald (`#10B981`) fails at 3.61:1 on light and
> 3.77:1 as a button fill. Shipping it as accent *text* would have been an
> accessibility bug hiding behind a pretty colour. Light mode uses
> **`#047857`**; `#10B981` survives only for dark mode and large glyphs.

### 4.4 Typography

**Inter Variable**, with the OpenType features Linear and Raycast both enable
globally — `cv01` (single-storey `a` alternates), `ss03`, `calt`, `kern`, plus
**`tnum` on every price** (P7).

Why Inter over a bespoke face: Linear ships "Linear Display," Airbnb ships
"Cereal," Vercel ships "Geist" — a custom face is a company-scale asset. Inter
with the right features and *the right tracking* is indistinguishable at these
sizes, and it is already installed. **Tracking is what buys the premium feel
(P1), not the font name.**

Tracking follows a strict ramp: **−0.04em at display, easing to 0 at 14px.**

| Token | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `display-2xl` | 72 | 600 | 1.02 | −0.040em |
| `display-xl` | 56 | 600 | 1.05 | −0.038em |
| `display-lg` | 40 | 600 | 1.08 | −0.034em |
| `display-md` | 32 | 600 | 1.12 | −0.028em |
| `headline` | 24 | 600 | 1.20 | −0.022em |
| `title` | 20 | 600 | 1.28 | −0.016em |
| `subtitle` | 17 | 500 | 1.40 | −0.011em |
| `body-lg` | 17 | 400 | 1.55 | −0.006em |
| `body` | 16 | 400 | 1.58 | 0 |
| `body-sm` | 14 | 400 | 1.50 | 0 |
| `caption` | 13 | 400 | 1.45 | 0 |
| `micro` | 11 | 600 | 1.40 | **+0.06em** uppercase |
| `button` | 15 | 550 | 1.00 | −0.008em |

**Price tokens — always `tnum`, always weight 600:**

| Token | Size | Tracking | Use |
|---|---|---|---|
| `price-hero` | 40 | −0.030em | product detail |
| `price-lg` | 28 | −0.024em | checkout total |
| `price-md` | 20 | −0.018em | ★ card price |
| `price-sm` | 16 | −0.010em | inline, chat |

**Weight ceiling: 600.** Never 700+ (P2). Inter's variable axis also gives us
550 for buttons — a "sub-default" weight in Superhuman's sense, subtly warmer
than 500 and less shouty than 600.

### 4.5 Space

4px base, 8px rhythm. Section air is generous, grid gutters are tight (P6).

```
0.5→2  1→4  2→8  3→12  4→16  5→20  6→24  8→32  10→40  12→48  16→64  20→80  24→96  32→128
```

| Context | Value |
|---|---|
| Grid gutter (mobile / desktop) | **12 / 16** — tight, for scan efficiency |
| Card padding | 16 |
| Section rhythm (mobile / desktop) | **56 / 96** |
| Hero top/bottom | 128 |
| Page max-width | 1240 |
| Control height (sm / md / lg) | 36 / 44 / 52 |

### 4.6 Radius

Two-tier, following Pinterest's model (16 for components, 32 for large surfaces)
softened toward Airbnb's ladder.

```
xs   6    badges, tags
sm   10   inputs, small buttons
md   14   buttons, chips
lg   20   ★ cards — the signature radius
xl   28   sheets, modals, hero panels
2xl  36   full-bleed feature panels
pill 999  primary CTAs, filter chips, avatars
```

### 4.7 Elevation — the synthesis

**Resolving the P3 conflict.** You want depth without outlines; the research
rejects big soft shadows. The answer both satisfy is **Vercel's stacked
micro-shadow + inset hairline**: several tiny offsets read as *light*, not as a
drop shadow. It gives the "floating" quality you're after without the
Material-2 look.

```
e0  none                                          resting cards
e1  0 0 0 1px rgba(15,23,42,.05) inset,
    0 1px 2px rgba(15,23,42,.04)                  inputs, chips
e2  0 0 0 1px rgba(15,23,42,.05) inset,
    0 2px 4px rgba(15,23,42,.04),
    0 8px 16px -6px rgba(15,23,42,.06)            ★ card hover
e3  0 0 0 1px rgba(15,23,42,.06) inset,
    0 4px 8px rgba(15,23,42,.04),
    0 16px 32px -8px rgba(15,23,42,.10)           dropdowns, popovers
e4  0 0 0 1px rgba(15,23,42,.06) inset,
    0 24px 48px -12px rgba(15,23,42,.18)          modals, sheets
```

**Dark mode uses no shadows at all.** Elevation = climb the surface ladder
(`surface` → `surface-2` → `surface-3`) plus a `rgba(255,255,255,.08)` hairline.
This is Raycast's model and it is the correct one — shadows are invisible on
near-black.

**Glassmorphism, strictly rationed.** Exactly two places, both where content
scrolls *underneath* chrome and the blur communicates that relationship:
the sticky top bar and the mobile tab bar. `backdrop-filter: blur(20px)
saturate(180%)` over a 92%-opaque surface (Apple's exact recipe). **Nowhere
else.** Glass on a card is decoration; glass on a scroll boundary is
information.

### 4.8 Motion

Durations and curves from the motion research, cross-checked against the
150–300ms consensus and "under 80ms feels broken."

```
instant   100ms  cubic-bezier(0.4, 0, 0.2, 1)     press, tap feedback
fast      160ms  cubic-bezier(0.4, 0, 0.2, 1)     hover, colour, opacity
base      240ms  cubic-bezier(0.32, 0.72, 0, 1)   ★ the house curve
entrance  300ms  cubic-bezier(0.16, 1, 0.3, 1)    scroll reveal, card enter
sheet     380ms  cubic-bezier(0.32, 0.72, 0, 1)   drawers, bottom sheets
exit      160ms  cubic-bezier(0.4, 0, 1, 1)       leaving — always faster than entering
```

**Why `cubic-bezier(0.32, 0.72, 0, 1)` is the house curve.** It decelerates hard
and settles without overshoot — the difference between "animated" and
"physical." Ease-*in* is banned for UI: it "makes interfaces feel sluggish."

**Framer Motion defaults:**
```ts
const base    = { duration: 0.24, ease: [0.32, 0.72, 0, 1] };
const enter   = { duration: 0.30, ease: [0.16, 1,    0.3, 1] };
const sheet   = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 };
const delight = { type: "spring", stiffness: 500, damping: 22 }; // celebration ONLY
```

**Rules:**
- Springs are for **celebration only** — publish success, first sale, rating
  submitted. Never for navigation.
- **Exit is always faster than entrance.** Users have already decided.
- Card hover: `y: -3, scale: 1.006` — under 4px and under 1%. Airbnb-scale, not
  Dribbble-scale.
- Image zoom on hover: `scale: 1.04` over 500ms. The photo moves; the frame
  never does.
- **Stagger caps at 6 children × 35ms.** Beyond that the last item feels broken.
- Every animation respects `prefers-reduced-motion`. Non-negotiable.

---

## 5. Component principles

### Listing card — the atom
Anatomy, ordered by how people actually scan a marketplace grid:

```
4:5 photograph, radius lg, full-bleed, zero padding
  ↳ condition badge, top-left, glass-on-photo
  ↳ save heart, top-right
price-md (tnum, weight 600, ink)          ← LARGER THAN THE TITLE
title, body-sm, ink-2, 2-line clamp
campus · time, caption, muted
```

**Price above title, and larger.** On second-hand goods price is the filter;
the title is confirmation. This inverts the retail convention deliberately — and
matches Nike's PDP anatomy, where price is a distinct row, not a subtitle.

Resting state: **no shadow, no border** — just the photo's own corner clipping
(Airbnb, Nike, Pinterest all resting-flat). Hover lifts to `e2`.

### Search — "magical"
Not a bigger box. Concretely: recent searches on focus (marketplace search is
overwhelmingly repeat searches), results grouped **Listings / Categories /
Sellers**, 260ms debounce, keyboard-navigable with `↑↓ Enter Esc`, thumbnail +
price in every suggestion row, and a persistent "See all N results" footer.
Command-palette ergonomics, marketplace content.

### Filters — Baymard-informed
Their research (700+ observed usability problems, 35 filtering-specific
guidelines) yields three rules we follow:
1. **Every attribute shown on a card must be filterable.** 38% of sites fail
   this and it directly causes abandonment. Our cards show condition, price,
   category, campus — all four filter.
2. **Applied filters must be visible and individually removable** on the results
   page, not buried in a panel.
3. **Live result counts before applying**, so a filter never leads to a dead end.

### Empty states
Illustration-free by default — an emoji glyph, a sentence, and **the next
action**. Zero results always offers the next-widest move (campus → all
colleges → browse all). An empty marketplace is a supply problem; the CTA is
always "list something."

### Loading
Skeletons that mirror **exact** final geometry, so nothing shifts on arrival.
Shimmer at 1.4s linear. Never a centred spinner on a page that has known layout.

---

## 6. What this changes

The interim system already shipped is emerald-primary, monochrome-neutral,
custom-icon, and animation-light. Migrating to this language means:

| Area | Change | Effort |
|---|---|---|
| Tokens | Emerald-primary → indigo-primary + emerald accent; neutrals → slate | **Low** — `globals.css` only; utilities re-point automatically |
| Typography | Add the tracking ramp, price tokens, `tnum`, weight ceiling | **Low–Med** |
| Radius | 8/12/16 → 6/10/14/20/28 | **Low** |
| Elevation | Flat/`shadow-md` → the e0–e4 stack | **Low** |
| Icons | Custom set → **Lucide** (as briefed) | **Med** — mechanical |
| Motion | CSS keyframes → **Framer Motion** | **Med–High** — the real work |
| Components | shadcn/ui primitives underneath | **Med** |
| **New surfaces** | **Cart · Checkout · Orders · Dashboard · 404 · error states** | **High — these do not exist yet** |

> **Scope flag.** Your page list includes **Cart, Checkout and Orders.** The PRD
> puts payments explicitly *out of scope* ("no in-app payment processing or
> escrow"), and the product's safety model is built on cash-in-person handover.
> Building checkout means either (a) real payments — a large piece of work with
> compliance implications — or (b) a reservation/offer flow that *looks* like
> checkout without money moving. **These are very different products.** I've
> flagged it rather than guessing; see the question below.

---

## 7. Open decision — the stack

The brief specifies **React + Vite + React Router**. The repo is currently
**Next.js 16 (App Router)** — migrated there deliberately in commit `8c59a2d`.

Everything else you listed (TypeScript, Tailwind, Framer Motion, shadcn/ui,
Lucide, TanStack Query, React Hook Form, Zod) works **identically** on either.
The only real difference is routing and rendering — and for a marketplace that
difference is load-bearing: listing pages currently server-render for SEO and
link previews, which is how a pasted listing unfurls in a hostel WhatsApp group.
Vite + React Router is client-only by default and would lose that.

**My recommendation: keep Next.js, adopt every other library in the list.** But
it's your call, and it changes the shape of all the work that follows.
