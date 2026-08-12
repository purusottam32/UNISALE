# UniSale — Project Guidemap

> Read this first. It explains what lives where, why it lives there, and which
> file to open for any given task.

---

## 1. What UniSale is

A **campus-exclusive peer-to-peer marketplace**. Students verify with their
college email, then buy, sell, rent and exchange goods with people at their own
institution.

The product exists because the trade already happens — over WhatsApp groups,
Instagram stories and hostel noticeboards — but with no search, no history, no
identity, and no recourse when something goes wrong.

**The one thing that makes UniSale different is the verified-student wall.**
Almost every product decision in this codebase traces back to it:

| Decision | Why |
|---|---|
| Institutional email + OTP at signup | The wall itself. Without it we're OLX. |
| Listings scoped to your campus by default | Trade you can complete between classes. |
| In-app chat, phone numbers never shown | A privacy guarantee we can only make if identity is verified elsewhere. |
| Mutual ratings after every completed deal | Reputation is the enforcement mechanism when there's no escrow. |
| Trust score computed, never stored | Cannot drift from the signals that produce it. |

Full product context: [`docs/PRD.md`](./PRD.md).
UX rationale for the interface: [`docs/UX.md`](./UX.md).

---

## 2. Repository shape

```
Unisale/
├── docs/                     Product + engineering documentation
│   ├── ARCHITECTURE.md       ← you are here
│   ├── UX.md                 Interface + interaction decisions
│   └── PRD.md                Product requirements
│
├── backend/                  Express + MongoDB API and Socket.io server
│   ├── server.js             Process entry: DB → HTTP → sockets → listen
│   └── src/
│       ├── config/           Env, DB connection, domain vocabulary
│       ├── models/           Mongoose schemas
│       ├── services/         Business logic (the layer that owns the rules)
│       ├── controllers/      HTTP shims: read req, call service, shape res
│       ├── routes/           URL → middleware chain → controller
│       ├── middleware/       Auth, validation, uploads, error handling
│       ├── validators/       Zod request schemas
│       ├── sockets/          Real-time chat + presence handlers
│       ├── utils/            R2 uploads, tokens, email, errors
│       └── docs/             Swagger setup
│
├── src/                      Next.js 16 App Router web app
│   ├── app/                  Routes only — no business logic
│   ├── features/             Domain modules (the bulk of the app)
│   ├── components/           Cross-feature UI: design system + app chrome
│   ├── config/               Catalog, navigation, site constants
│   ├── lib/                  API client, query setup, formatting, errors
│   └── styles/               globals.css — the entire design system
│
└── public/                   Static assets
```

---

## 3. Backend

### 3.1 The layering rule

```
route → middleware → controller → service → model
```

Each layer has exactly one job, and the rule is enforceable by reading:

- **Routes** wire a URL to a middleware chain. No logic.
- **Middleware** authenticates, validates (Zod), and parses uploads.
  Nothing downstream should re-check what middleware already guaranteed.
- **Controllers** are thin. Read `req`, call a service, shape the response.
  If a controller has an `if` about business rules, it belongs in the service.
- **Services** own the rules. They throw `AppError` and know nothing about HTTP.
  This is why sockets and REST can share `sendMessageService` and behave
  identically.
- **Models** are schemas, indexes, hooks and computed virtuals.

**Where to add a feature:** service first, then controller, then route.

### 3.2 Config

`src/config/index.js` is the only place `process.env` is read. Everything else
imports `config`. Missing required variables fail at boot, not at request time.

`src/config/constants.js` holds the domain vocabulary — categories, conditions,
listing types, trust weights. **The frontend mirrors this in
`src/config/catalog.js`. Change one, change the other.**

### 3.3 Data model

| Model | Notes |
|---|---|
| `User` | Profile, interests, denormalised rating, notification prefs. `trustScore` and `trustTier` are **virtuals** — computed on read so they can never go stale. |
| `Listing` | Stored in the `products` collection for backwards compatibility. Carries `views` / `saveCount` / `chatCount`, which feed the ranking. `soldTo` is what unlocks reviews for a deal. |
| `Conversation` | Denormalised `lastMessage` + a per-participant `unread` Map, so the inbox renders from one query instead of N. |
| `Message` | `text` / `image` / `system` kinds; `readAt` drives receipts. |
| `Review` | Compound unique index on `(listing, author)` enforces one review per person per deal. `syncSubjectRating` recomputes the user's average after every write. |
| `Notification` | TTL index expires rows after 60 days so the collection cannot grow forever. |
| `Wishlist`, `Report`, `Otp`, `AllowedDomain` | Supporting collections. |

### 3.4 Ranking

Two algorithms, both in `services/listing.service.js`:

- **`getCampusFeedService`** — the personalised feed. Scores in a Mongo
  aggregation rather than in JS, because sorting a single page in memory
  produces a globally wrong order once you paginate. Signals: recency (decaying
  over 72h), demand (views + 3×saves + 5×chats, log-damped), affinity (category
  matches the user's onboarding interests), quality (photo count + description
  length).
- **`getTrendingListingsService`** — engagement **per hour live** over a 48h
  window. Dividing by age is what stops a week-old listing from squatting on
  the trending rail forever.

### 3.5 Real-time

`sockets/index.js` authenticates the handshake with the same access token as
REST, then delegates to `chat.handlers.js` and `presence.handlers.js`.

Two design points worth knowing:

1. **Sockets and REST share the service layer.** `message:send` and
   `POST /chat/conversations/:id/messages` both call `sendMessageService`.
   The client prefers the socket and silently falls back to REST — some campus
   networks block WebSockets outright, and chat is too important to lose there.
2. **Presence is in-memory and disposable.** `lastActiveAt` on the user document
   is the durable fallback that renders "Active 2h ago" when someone is offline.

---

## 4. Frontend

### 4.1 The three-layer rule

```
app/  →  features/  →  components/ + lib/ + config/
```

- **`app/`** contains routes and nothing else. A page file resolves params,
  sets metadata, optionally server-fetches for SEO, and renders one screen.
  If you find logic in `app/`, it is in the wrong place.
- **`features/<domain>/`** is where the app actually lives. Each feature owns
  its `api.js`, `hooks.js`, `components/` and `screens/`.
- **`components/`, `lib/`, `config/`** are shared and know nothing about any
  specific feature.

**Import direction is one-way.** Features may import from `components`, `lib`
and `config`. Shared code must never import from `features`. Cross-feature
imports are allowed but should be rare and obvious (the listing detail screen
using `features/chat` to start a conversation is the intended kind).

### 4.2 Route groups

Route groups carry the auth policy, so no individual page has to.

| Group | Layout | Contains |
|---|---|---|
| `(auth)` | Its own split-panel layout | `/login`, `/register`, `/verify-email`, `/onboarding` |
| `(browse)` | `AppShell`, **no guard** | `/explore`, `/search`, `/listings/[id]`, `/u/[userId]` |
| `(app)` | `AppShell` + `AuthGuard` | `/feed`, `/sell`, `/saved`, `/messages`, `/notifications`, `/profile`, `/settings`, `/listings/[id]/edit` |
| *(root)* | — | `/` landing, `/not-found` |

`(browse)` exists deliberately: **a marketplace that hides its inventory behind
a signup wall has nothing to convince anyone to sign up with.** Public pages
are readable by anyone and by crawlers; actions inside them (save, message)
prompt for auth at the point of intent.

`AuthGuard` also enforces onboarding — a user with a verified email but no
campus profile is redirected to `/onboarding`, so no screen inside `(app)` ever
has to cope with a half-built account.

### 4.3 Features

| Feature | Owns |
|---|---|
| `auth` | Session context, login/register/OTP/onboarding screens, `AuthGuard`, OAuth token handoff |
| `listings` | Feed, explore, search, detail, sell wizard, edit, filters, cards, gallery |
| `chat` | Socket lifecycle, inbox, conversation thread |
| `saved` | Wishlist with an optimistic save toggle |
| `notifications` | Notification list + the shell badge counts |
| `profile` | Own profile, public profiles, settings, reviews, trust meter |
| `marketing` | The public landing page |

### 4.4 State

Three kinds, three homes — never mixed:

| Kind | Home | Example |
|---|---|---|
| Server data | React Query | Listings, conversations, profile |
| Session | `AuthProvider` (backed by a query) | The signed-in user |
| Navigational | The URL | Filters, search term, active tab |

Filters live in the URL (`features/listings/use-filters.js`) because that makes
a filtered grid shareable, refresh-proof and back-button-navigable — all things
students expect from a results page and none of which `useState` gives you.

Every cache key is declared in `lib/query-keys.js`. Keys are hierarchical, so
invalidating `queryKeys.listings.all` sweeps every narrower key beneath it.

### 4.5 The API client

`lib/api-client.js` is the single axios instance.

Access tokens are short-lived and held in memory + localStorage. The refresh
token is an HttpOnly cookie the browser sends automatically. On a 401 the client
refreshes **once** and replays the original request, queueing any calls that
raced the refresh — so a page load that fires six requests against an expired
token produces one refresh, not six.

### 4.6 The design system

**All of it is in `src/styles/globals.css`.** There is no Tailwind config file
and no `dark:` variant anywhere in the markup.

Every colour is a `--color-*` token declared in `@theme`. Tailwind v4 emits
utilities that *reference* those variables, so re-pointing a token in the light
block re-themes every `bg-surface`, `text-ink` and `border-line` in the app at
once.

**Shadows are the exception and it matters.** Tailwind treats `--shadow-*` as a
build-time constant: it bakes the value into `.shadow-e2` rather than emitting
`var(--shadow-e2)`, so redeclaring a shadow token per theme does nothing. The
shadow tokens therefore point at plain `--elev-*` custom properties, and it is
those that each theme overrides. Do not inline shadow values into `@theme`.

```
canvas → surface → surface-2 → surface-3     backgrounds, furthest to nearest
ink → ink-2 → muted → faint                  text, primary to decorative
line → line-strong                           SEPARATORS ONLY, never box outlines
brand / accent / success / warn / danger / info   each with a -tint companion
```

**Dark is the default.** `@theme` carries the dark palette, so dark is what you
get with no attribute set — including for a first-time visitor whose OS prefers
light. Light is an explicit opt-in, declared once in `:root[data-theme="light"]`.

`data-theme` is single-purpose: a light-override flag. There is no
`[data-theme="dark"]` selector and no `prefers-color-scheme` block. The
three-state toggle (dark / light / system) resolves "system" in JS instead —
`ThemeScript` in the root layout reads `localStorage` before first paint and adds
the light flag when the stored choice is `light`, or is `system` and the OS
prefers light. Keeping resolution in JS is what lets each palette be written
exactly once instead of duplicated across a media query and an attribute.

Two consequences worth knowing: with no JS you get dark, always; and "system" is
now a state the user opts *into* rather than the default, so it is written to
storage rather than expressed by deleting the key.

A box outline is `shadow-e1`, never `border`. A `border` adds a pixel to the box
— which is why nested cards used to misalign — and produces a hairline in both
themes, violating "light gets shadows, dark gets a surface ladder".

`components/ui/` holds the primitives (Button, Badge, Avatar, Field, Sheet,
Skeleton, Tabs, Rating, EmptyState, TrustBadge, icons). Import them from
`@/components/ui`.

`components/layout/` holds the app chrome: `TopBar`, `BottomNav`, `AppShell`,
`SearchBar`, `Logo`, `ThemeToggle`, `Footer`.

---

## 5. Where to make a change

| Task | Files |
|---|---|
| Add a listing field | `backend/src/models/listing.model.js` → `validators/listing.schema.js` → `services/listing.service.js` → `src/features/listings/screens/SellScreen.jsx` |
| Add a category | `backend/src/config/constants.js` **and** `src/config/catalog.js` |
| Change feed ranking | `backend/src/services/listing.service.js` → `getCampusFeedService` |
| Add an API endpoint | service → controller → route → `backend/src/app.js` |
| Add a screen | `src/features/<domain>/screens/` then a thin page in `src/app/` |
| Change colours or spacing | `src/styles/globals.css` only |
| Add a nav item | `src/config/navigation.js` (drives both top bar and tab bar) |
| Add a socket event | `backend/src/sockets/chat.handlers.js` + `src/features/chat/hooks.js` |
| Change safety copy | `src/config/site.js` |

---

## 6. Running it

```bash
# API — terminal 1
cd backend
cp .env.example .env        # then fill in real values
pnpm install
pnpm dev                    # http://localhost:5000, docs at /api/docs

# Web — terminal 2
cp .env.sample .env.local   # then fill in real values
pnpm install
pnpm dev                    # http://localhost:3000
```

`CLIENT_URL` in `backend/.env` must include your web origin, or CORS and the
OAuth redirect will both fail.

```bash
pnpm build       # production build + TypeScript check
pnpm lint        # ESLint over src/
pnpm typecheck   # tsc --noEmit
```

---

## 7. Conventions

- **File naming.** Components `PascalCase.jsx`; hooks, utilities and config
  `kebab-case.js`; route files follow Next.js (`page.tsx`, `layout.tsx`).
- **Languages.** Routes are TypeScript, feature code is JSX. `tsc` runs over
  the route layer during `next build`; ESLint covers the JS/JSX.
- **Comments explain *why*.** The code already says what it does. Comments
  earn their place by recording a trade-off, a constraint, or a decision that
  is not obvious from the syntax.
- **Errors.** Backend throws `AppError(message, status)`. Frontend renders
  through `getErrorMessage()`, which prefers field-level validation messages
  because those are the ones a user can act on.
- **Accessibility is not optional.** One visible focus ring, labelled
  interactive elements, `aria-live` on result counts, and a
  `prefers-reduced-motion` block that disables every animation (PRD §9.4).
