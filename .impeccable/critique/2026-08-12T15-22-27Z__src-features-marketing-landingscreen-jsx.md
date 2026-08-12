---
target: UniSale landing page
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
timestamp: 2026-08-12T15-22-27Z
slug: src-features-marketing-landingscreen-jsx
---
Method: dual-agent (A: design review · B: detector + browser evidence)

Target: UniSale public landing page — `src/features/marketing/LandingScreen.jsx` + `LandingHeader.jsx`, live at `/`. Mode: **Persuade**.

Caveat on isolation: both assessments shared one Playwright browser, and A's route mock for `/api/listings/trending` was visible to B. This turned out to help rather than harm — it meant B measured the *two-column proof variant*, which the down backend otherwise hides — but the two assessments were not perfectly independent at the browser layer. Their conclusions were reached separately.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Page never says *which* campus it shows; "Live on campus" serves one college's listings to everyone |
| 2 | Match System / Real World | 4 | WhatsApp, OLX, hostel kit, "drafters", "meet between classes" — the student's own mental model |
| 3 | User Control and Freedom | 3 | Dark forced regardless of OS, and the toggle was `hidden sm:grid` — no escape on phones |
| 4 | Consistency and Standards | 2 | `/register` is "Join free" / "Start selling free" / "Create free account"; `/explore` is "Browse" / "Browse listings" / "Look around first" |
| 5 | Error Prevention | 2 | Nothing says verification needs an *institutional* address; a Gmail student enters the funnel and hits the OTP wall |
| 6 | Recognition Rather Than Recall | 3 | Before→after list is strong recognition design, but the "before" column had no label and its only cue failed contrast |
| 7 | Flexibility and Efficiency | n/a | One-decision Persuade surface; the only accelerator worth having (Log in) is in the header |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained ≥1280, but ~45% of three sections is empty and ~220px void before the close read unfinished |
| 9 | Error Recovery | 2 | Outage path is well-designed (page gets *stronger*) but never signalled; "Claim your campus" promises at the moment the product can't deliver |
| 10 | Help and Documentation | 1 | Trust product asking for a college email, with no safety, FAQ, about, privacy or terms — only a mailto |
| **Total** | | **22/36** | **Acceptable (61%)** |

## Design Specificity Verdict

**Authored — but the authorship is almost entirely in the words, not in the design.**

The copy could not be lifted onto another product. "Your campus already trades. / Just not very well." concedes WhatsApp rather than attacking it. The comparison rows name OLX and Instagram stories. "Drafters, calculators, art" is a phrase only an Indian engineering student writes.

Strip the copy and what remains is: sticky glass header with ghost/ghost/filled trio → 72px display + 46ch paragraph + filled-plus-ghost CTA pair + check-marked micro-proofs → full-bleed surface band → sticky heading beside numbered steps with oversized faint numerals → two-column hairline index → oversized close → three-column footer. That is the Linear/Vercel chassis part for part. No motif, no texture, no photography of the product's own world, and on a page about students trading with students, not one human face.

The tell: in the no-proof variant the page is genuinely indistinguishable from B2B SaaS. **The design's identity is on loan from the API.**

Writing 8/10 specific, design 5/10. The redesign killed the template *shape* (six centred bordered boxes) and replaced it with a better template shape. It has not yet earned a visual identity of its own.

**Deterministic scan:** CLI detector returns **0 findings** across `src/features/marketing`, `src/components/layout`, `src/components/ui`, `src/features/listings` (50 files). Verified not a no-op via control files that correctly produced exit 2. Browser-injected detector found **5 rules / 12 instances**: `overused-font` (Inter, 100% of text — invisible to the CLI pass because it's registered via `next/font/google`), `kicker-above-heading` ×2, `skipped-heading` ×1, `image-hover-transform` ×4, `text-occlusion` ×4.

**False positives:** `text-occlusion` ×4 is the stretched-link `a::after` hit area, an empty pseudo-element with no text or background — nothing is visually occluded. `image-hover-transform` ×4 is ProductCard's deliberate signature interaction. Focus rings on card links appear absent but are delegated to the `article` ancestor via `has-[a:focus-visible]:outline-2` — measured 2px solid and passing.

## Overall Impression

The structural work is genuinely good and the writing is excellent. But the page had a **P0 that made it unusable on phones** — the hero overflowed by up to 390px and clipped the headline, the rhetorical turn, and every line of body copy, with `overflow-x: hidden` hiding the evidence. My own earlier verification missed it because the API is down and every mobile check I ran hit the single-column fallback that doesn't have the bug.

Biggest remaining opportunity: the page argues trust and never evidences it.

## What's Working

**The hero's rhetorical structure and its typographic turn.** Conceding the incumbent instead of attacking it is right against WhatsApp, and rendering "Just not very well." in `muted` rather than `brand` is what makes the whole colour system work — the tonal drop turns the sentence as hard as indigo would while leaving the filled button the only saturated object in the viewport.

**The proof column is proof, not decoration.** Four real listings with rupee prices, campus name, relative time and a verified shield, placed *inside* the hero before any claim is made. Against the stock illustration that normally occupies that slot, this shows a live marketplace rather than asserting one.

**The category index.** Ten 20px rows on hairlines carrying more information than the ten emoji tiles they replaced, at a fraction of the chrome. The one section where "editorial, not template" is fully realised.

## Priority Issues

**[P0] Mobile hero horizontally clipped — FIXED**
Measured `scrollWidth` 740 vs `clientWidth` 350–404 at 360/390/414; the `h1` itself was 708px. Phone visitors read "Just not very w" and lost every line of body copy mid-word. Cause: the proof column is a grid item with default `min-width: auto`, so the `.rail` flexbox of four 168px cards set its width and inflated the whole grid. It also fired in the *loading* state, so it hit every phone visitor on first paint regardless of API health. Fix: `min-w-0` on both hero grid children.

**[P1] `-6vw` bleed clipped card text on 1280/1366 laptops — FIXED**
33–34px overflow at 1024 and 1280, cropping the card title and the verified shield — deleting the exact trust signal the page argues for. Correct at 1440, which is why it survived review. Fix: `xl:mr-[calc((100vw-var(--container-max))/-2)]` — reach the gutter, never pass it, and only where a gutter exists.

**[P1] Trust asserted, never evidenced — NOT FIXED (needs your input)**
One mechanism (email verification) stated three times in three registers. No count, no campus list, no name, no face, no review, and nothing about the in-person handover — which is the actual scary moment. `SAFETY_TIPS` in `src/config/site.js` already ships this copy on listing pages. Not actioned because the suggested fix involves publishing social-proof figures I would have to invent.

**[P2] "Before" column failed WCAG AA — FIXED**
`#606060` on `#121212` = **2.98:1** at 14px. `--color-faint`'s documented 3.17:1 is measured against `canvas`; this section sits on `surface`. The page's central argument was in its least legible voice. Fixed to `text-muted` (6.32:1) plus `justify-self-end text-right` so each pair binds across a short gap instead of ~230px.

**[P2] Three names for one button, and the primary CTA sells the wrong verb — NOT FIXED (needs your input)**
`/register` has three labels, `/explore` has three. Worse, the hero primary asks the visitor to **sell** immediately after the proof column beside it triggered buy-side intent. Not actioned because changing the page's primary conversion verb is a product decision, not a defect.

## Persona Red Flags

**Jordan (first-timer):** loudest element says "Start selling free" but he came to buy. "Verified students only" never says *what kind* of email, so a Gmail student can't tell if he qualifies. "Live on campus" shows one college's listings to everyone with no statement of which.

**Riley (stress tester):** reads "Ratings and trust scores on every profile" and finds no profile anywhere on the page. Asks how many students use it — no count. Asks how it makes money given "no commission" — no About, FAQ, terms or privacy. Spots "Verify in 30 seconds" vs "browsing in under a minute" as two different promises.

**Casey (mobile):** got the P0 clipped headline (fixed). Could not leave dark mode — toggle was `hidden sm:grid` (fixed). Category arrows landed at ten different x positions below `sm` because `ml-auto` sat on the `display:none` blurb (fixed). Shares the link into the WhatsApp group this product replaces and it renders as a bare URL — no `og:image`, while `twitter: { card: "summary_large_image" }` declares a card with no image.

## Minor Observations

- No `<main>` landmark, and heading order ran h1 → h3 because "Live on campus" was a `<p>`. Both fixed.
- Light theme's section bands are ~1.02:1 (`#fafafa` → `#ffffff`) vs 1.063:1 in dark — the "value step separates on its own" strategy nearly disappears in light.
- 16 `.skeleton` nodes ship in the SSR HTML, so with JS off the hero's right half is four shimmering rectangles forever.
- No `@supports` fallback for `backdrop-filter` on the sticky header.
- Heading scale inconsistent across peer sections: 32 / 32 / 24 with no rule between the last two.
- 17 interactive elements below 44×44 at 1440 (footer links 17px tall, header controls 36px).

## Questions to Consider

1. **Why isn't the OTP the hero?** The entire thesis is a 6-digit code sent to a college address. A live 6-box input with `@iitb.ac.in` prefilled would make the differentiator visible rather than described — and is the one asset no SaaS template could carry.
2. **What happens to the first student at an empty college?** Should the hero ask *which campus* before anything else?
3. **The safety copy is already written in `site.js` and ships on listing pages. Why isn't it on the page where the fear is actually decided?**
4. **Is the most important asset the OG card rather than the hero?** This product's growth loop runs through the WhatsApp groups it replaces, and a pasted link currently renders as bare text.
5. **Is the empty right-hand 40% restraint, or a two-column layout with one column filled?**
