# UniSale — UX & Interaction Design

Why the interface works the way it does. Written so that a future change can
disagree with a decision on purpose rather than by accident.

> **Research note.** The original plan was to pull reference flows from Mobbin.
> That integration requires a paid plan and returned `402` on every query, so
> the patterns below are drawn from established marketplace conventions
> (Depop, Vinted, Carousell, OfferUp, Facebook Marketplace, Airbnb) rather than
> from screens captured during this work. Anything sourced from a specific
> product is called out as such.

---

## 1. The problem this interface has to solve

UniSale is **two-sided and cold-started**. On day one at a new campus there are
no listings, no ratings, and no reason to trust anyone. Every screen is
therefore doing one of three jobs:

1. **Reduce friction to supply.** Sellers are the scarce side. Listing has to be
   fast enough to do between classes.
2. **Manufacture trust before reputation exists.** Verification badges, campus
   scoping, safety guidance and a legible trust score stand in until ratings
   accumulate.
3. **Make an empty marketplace feel like a beginning, not a failure.** Empty
   states point forward.

---

## 2. Navigation

### Mobile: a five-tab bar with a raised centre action

`Home · Explore · **Sell** · Chats · You`

Universal across marketplace apps for good reason: it keeps the five things
people do reachable with one thumb, and it never buries the primary action in a
menu. **Sell** is raised and brand-coloured because supply is the scarce side —
the ask should never be more than one tap away.

Badge counts sit on Chats. Nothing else gets a badge; a badge that fires for
everything trains people to ignore all of them.

### Desktop: search takes the centre of the bar

On a large screen the tab bar is redundant, so the top bar carries the weight:
logo and nav left, **search centre**, account actions right. Search gets the
prime position because on desktop people arrive with intent — they know what
they want and they type it.

Both are driven by one source, `src/config/navigation.js`, so they cannot drift.

---

## 3. Onboarding

The hardest ask in the product is "give us your college email". It is also the
thing that makes UniSale work. The flow is built entirely around lowering the
cost of that ask.

### Browse before you sign up

`/explore`, `/search`, `/listings/[id]` and `/u/[userId]` are public. A signup
wall in front of an empty inventory has nothing to persuade anyone with. Auth is
requested **at the point of intent** — when you save or message — where the
value is already obvious.

### Three visible steps

```
Register → Verify email → Campus profile → Feed
   1/3          2/3            3/3
```

Progress dots appear on every step. Knowing the flow is three screens rather
than an open-ended series is the difference between finishing and abandoning.

### Step 1 — Register

- Google OAuth first, email second. One tap beats three fields.
- A **checkmark appears live** when the email matches a known institutional
  pattern (`.ac.in`, `.edu`, `.edu.in`) — instant confirmation you are eligible.
- The "why we need this" explainer sits **directly under the email field**, not
  in a help page. Explaining a requirement where it is asked is what reduces
  drop-off at the step where it happens.

### Step 2 — Verify email

Six separate boxes rather than one input, because the details are what make this
step feel effortless:

- digits advance the caret automatically
- Backspace on an empty box steps back
- **pasting the whole code fills every box** — the single most common action
- `autocomplete="one-time-code"` so iOS and Android offer the autofill chip
- submits automatically on the sixth digit, guarded against double-firing
- **"Open my inbox →"** deep-links to Gmail or Outlook based on the email domain
- resend is on a 45-second timer, visible as a countdown rather than a dead
  button

### Step 3 — Campus profile

Three small screens rather than one long form:

1. **Campus** (college, department, year) — scopes the feed.
2. **Interests** — up to six categories. This is the **cold-start fix**: with no
   behavioural signal on day one, self-declared interest is the only
   personalisation available, and it feeds `affinityScore` in the feed ranker.
3. **Photo and bio** — explicitly **optional and skippable**. Nobody should be
   blocked from a marketplace by a profile picture.

---

## 4. Discovery

### Two columns on mobile, always

A single wide column shows too few items per screen for browsing to feel
productive. Every major marketplace converges on two.

### Card hierarchy: photo → price → title → condition → seller

Ordered by how people actually scan a grid. **Price is larger than the title**
because on second-hand goods price is the filter; the title is confirmation.
Condition sits on the image as an overlay badge because it is the first thing a
buyer asks.

### Filters live in a sheet, not a sidebar

Browsing is continuous; filtering is deliberate and occasional. A permanent
sidebar taxes every session to serve a few. The sheet also gives the grid full
width on every breakpoint.

Inside the sheet, changes are **drafted and applied on confirm** — results never
reshuffle while you are still making up your mind.

### Active filters are always visible as removable pills

This is what prevents the "why are there no results?" dead end. The cause is on
screen and one tap from gone.

### Empty states scale the search outward

Zero results never terminates. It offers the next-widest move:

```
No results on your campus  →  "Search all colleges"
No results anywhere        →  "Browse everything" / "Sell one instead"
```

---

## 5. Selling

Four steps, photo-first:

```
Photos → Details → Price → Review & publish
```

- **Photos come first because they are the commitment device.** A seller who has
  uploaded a picture finishes the listing. Asking for a title first invites
  people to bail on a blank text field.
- Images are **compressed in the browser** before upload. Phone photos run
  4–8MB; on campus wifi that is the difference between a listing that publishes
  and one that times out.
- The first slot is labelled **Cover**, and photos are **drag-reorderable** —
  the cover is the only image most buyers will ever see.
- Text fields are **drafted to localStorage** between steps. A mistap or a dead
  battery should not cost the whole listing. Photos are not persisted: `File`
  objects don't survive serialisation, and re-picking is quicker than a broken
  restore.
- Condition options carry **descriptions, not just labels** ("Good — light wear,
  works perfectly"). Vague condition is the number one cause of disputes at
  handover.
- Step 4 renders the draft **in the same card shape it will have in the grid**,
  so there is no gap between preview and reality.

---

## 6. Listing detail

The most important conversion surface in the product.

- **Desktop:** two columns with a sticky right rail, so "Message seller" stays on
  screen however long the description runs.
- **Mobile:** the same CTA pinned above the tab bar.
- **Seller card gathers every trust signal in one place** — name, campus,
  rating, verification tier, member-since, and a computed responsiveness label
  ("Usually replies within an hour"). Buyers care far more about "replies fast"
  than about an exact number, so the median is bucketed into a phrase.
- **Safety guidance is on the page, not in a policy.** With no escrow in the
  MVP, the handover is where things go wrong, and advice at the moment of intent
  is the cheapest fraud control available (PRD §16).
- **"More like this"** below the fold, same campus only — a recommendation you
  cannot act on is noise.

### Seller view

The same page swaps the buyer CTA for owner controls, including a performance
strip: **views · saves · chats**. A seller with no messages needs to know
whether the problem is reach or the listing itself — and when views are high but
chats are zero, the page says so and suggests re-pricing. That is the difference
between a seller who fixes their listing and one who concludes the app doesn't
work.

Marking an item sold asks **who bought it**, choosing from the students who
actually enquired. Naming the buyer is what unlocks mutual reviews for that deal.

---

## 7. Chat

- **Threads are grouped around the listing** they concern. A seller with five
  items cannot parse "is this still available?" without knowing which item.
- **Quick replies** on an empty thread ("Is this still available?", "Would you
  take a lower price?", "When can we meet?"). A blank chat box is where most
  first contacts die.
- **Typing indicators are debounced** — one `start`, one `stop` after a pause,
  not an event per keystroke — with a client-side timeout in case `stop` is lost.
- **Enter sends, Shift+Enter adds a line.** Standard, and worth matching.
- **A visible "Reconnecting" chip** when the socket drops. Messages still send
  over REST underneath; the user is told the truth either way.
- Safety guidance opens every conversation.

---

## 8. Trust

Trust is the product. It is surfaced as an earned tier rather than a raw number:

```
🌱 New Member  →  ✅ Verified Student  →  🛡️ Trusted Seller
```

A tier is legible and hard to game; a 0–100 number invites optimisation.

On your **own** profile the score is expanded into `TrustMeter` — a checklist of
the signals you have and have not earned, each with an action. A bare number
tells a seller nothing; a checklist is the only version people act on. It hides
itself above 85, where the remaining items are just elapsed time.

**Reviews only exist for real deals.** The listing must be sold and you must be
the recorded seller or buyer. That is what stops drive-by rating attacks. Stars
are required; the written comment is not — demanding prose is the fastest way to
get no feedback at all.

The prompt to rate appears **at the top of the feed**, because nobody navigates
to a rating form on their own.

---

## 9. Visual system

**Light by default.** Second-hand goods sell on their photos, and photos read
better against a light canvas. Dark follows the OS, with an explicit toggle that
cycles light → dark → system. "System" is a real third state: someone who never
touches it should follow their phone's night mode; someone who explicitly chose
light at midnight should keep light.

**Emerald as the brand colour.** It reads as savings and reuse — which is the
actual story ("perfectly usable goods get thrown away every semester") — and it
avoids the blue that students already associate with the scam-heavy general
marketplaces UniSale is defined against.

**Rupees are formatted Indian-style** (₹1,25,000) and compacted in dense grids
(₹1.2L, ₹65k).

**Accessibility** (PRD §9.4): one visible focus ring everywhere, labelled
interactive elements, `aria-live` on result counts, `aria-pressed` on toggles,
and a `prefers-reduced-motion` block that disables every animation in the app.

---

## 10. Deliberate omissions

| Not built | Why |
|---|---|
| Infinite-scroll-only pagination | Every grid also has an explicit **Load more** button, so the list stays reachable when `IntersectionObserver` never fires. |
| A tour or coach marks | If a screen needs a tour, the screen is wrong. |
| Push notifications | Web Push is Phase 2 (PRD §15). In-app + email cover the MVP. |
| Image messages in chat | Schema supports `kind: "image"`; no UI yet. Text closes deals. |
| Saved searches | Phase 3. Categories plus interests cover the same intent for now. |
