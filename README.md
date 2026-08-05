# UniSale

**A campus-exclusive marketplace for college students.** Verify with your college
email, then buy, sell, rent and exchange with people at your own institution —
no strangers, no commission, no sharing your phone number.

---

## Why it exists

Every campus already runs a small economy: cycles, calculators, textbooks,
hostel kettles and second-year notes change hands every semester. Today that
trade happens over WhatsApp groups, Instagram stories and physical noticeboards
— with no search, no history, no identity, and no recourse when something goes
wrong.

UniSale gives that trade a real home. The one thing that makes it different from
OLX or Facebook Marketplace is the **verified-student wall**: institutional email
verification creates a walled garden that general marketplaces cannot replicate
without rebuilding their identity layer.

---

## Features

**Trust**
- College email + 6-digit OTP verification, or Google OAuth
- Computed trust score and earned tiers (New Member → Verified Student → Trusted Seller)
- Mutual post-deal ratings, restricted to the actual buyer and seller
- Listing and user reporting, with an admin moderation queue

**Marketplace**
- Photo-first four-step sell wizard with browser-side image compression
- Personalised campus feed (recency + demand + interest affinity + listing quality)
- Trending rail scored by engagement per hour live
- Full-text search, filter sheet, URL-synced filters, infinite scroll
- Saved items with automatic price-drop notifications
- "More like this" recommendations, scoped to your campus

**Communication**
- Real-time chat over Socket.io with typing indicators, read receipts and presence
- Automatic REST fallback when WebSockets are blocked
- Threads grouped by listing; in-app notifications with unread badges

**Experience**
- Light and dark themes, following the OS or an explicit choice
- Mobile tab bar with a raised Sell action; responsive up to desktop
- WCAG 2.1 AA focus handling, labelled controls, reduced-motion support

---

## Tech stack

| | |
|---|---|
| **Web** | Next.js 16 (App Router), React 19, Tailwind CSS 4, TanStack Query 5, react-hook-form, socket.io-client |
| **API** | Node.js, Express 4, MongoDB Atlas + Mongoose 8, Socket.io 4 |
| **Auth** | JWT access + refresh rotation, HttpOnly cookies, Google OAuth 2.0, bcrypt |
| **Media** | Cloudflare R2 + Sharp, compressed client-side before upload |
| **Validation** | Zod on every request body and query |
| **Security** | Helmet, CORS allowlist, per-route rate limiting, Zod sanitisation |
| **Docs** | Swagger / OpenAPI at `/api/docs` |

---

## Getting started

**Requirements:** Node.js 20+, pnpm, a MongoDB Atlas cluster, a Cloudflare R2
bucket, and SMTP credentials for OTP email.

```bash
# ── API ── terminal 1
cd backend
cp .env.example .env          # fill in real values
pnpm install
pnpm dev                      # http://localhost:5000 · docs at /api/docs

# ── Web ── terminal 2
cp .env.sample .env.local     # fill in real values
pnpm install
pnpm dev                      # http://localhost:3000
```

> `CLIENT_URL` in `backend/.env` must include your web origin, or both CORS and
> the Google OAuth redirect will fail. The first entry in that list is treated
> as the canonical web app.

### Scripts

| Command | Does |
|---|---|
| `pnpm dev` | Web app in development |
| `pnpm build` | Production build + TypeScript check |
| `pnpm lint` | ESLint over `src/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm api:dev` | Run the backend from the repo root |

---

## Project structure

```
Unisale/
├── docs/          ARCHITECTURE.md · UX.md · PRD.md
├── backend/       Express API + Socket.io
│   └── src/       config · models · services · controllers · routes
│                  middleware · validators · sockets · utils
├── src/           Next.js web app
│   ├── app/       Routes only — (auth) · (browse) · (app) groups
│   ├── features/  auth · listings · chat · saved · notifications · profile
│   ├── components/ ui (design system) · layout (app chrome)
│   ├── config/    catalog · navigation · site
│   ├── lib/       api-client · query-keys · format · errors
│   └── styles/    globals.css — the whole design system
└── public/
```

---

## Documentation

| Document | Read it for |
|---|---|
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | **Start here.** What lives where, the layering rules, and which file to open for any given change. |
| [docs/UX.md](./docs/UX.md) | Why the interface behaves the way it does — navigation, onboarding, selling, trust. |
| [docs/PRD.md](./docs/PRD.md) | Product requirements, personas, roadmap, success metrics. |

---

## API surface

| Group | Endpoints |
|---|---|
| Auth | `POST /auth/register` `/verify-otp` `/resend-otp` `/login` `/logout` `/refresh` `/complete-profile` · `GET /auth/me` `/auth/google` |
| Listings | `GET /listings` `/listings/feed` `/listings/trending` `/listings/search` `/listings/:id` `/listings/:id/similar` · `POST /listings` · `PATCH /listings/:id` `/listings/:id/status` · `DELETE /listings/:id` · `POST /listings/:id/report` |
| Users | `GET /users/:id` `/users/:id/listings` `/users/:id/reviews` · `PATCH /users/me/notifications` `/users/me/interests` · `POST /users/:id/report` · `DELETE /users/me` |
| Chat | `GET /chat/conversations` `/chat/unread` `/chat/conversations/:id` · `POST /chat/conversations` `/chat/conversations/:id/messages` · `PATCH /chat/conversations/:id/read` `/archive` |
| Reviews | `GET /reviews/pending` `/reviews/user/:userId` · `POST /reviews` |
| Wishlist | `GET /wishlist` `/wishlist/ids` · `POST /wishlist` · `DELETE /wishlist/:listingId` |
| Notifications | `GET /notifications` `/notifications/badges` · `PATCH /notifications/:id/read` `/read-all` |
| Admin | `GET /admin/metrics` `/users` `/listings` `/reports` `/domains` · moderation actions |

**Socket events** — `conversation:join` · `message:send` · `message:new` ·
`message:read` · `typing:start` / `typing:stop` · `notification:new` ·
`presence:online` / `presence:offline`

Interactive reference: `http://localhost:5000/api/docs`

---

## Roadmap

Shipped here: MVP (PRD Phase 1) plus most of Phase 2 — ratings, wishlist with
price-drop alerts, trust scores and in-app notifications.

Next: web push, multi-campus rollout, seller analytics, featured listings,
rentals and a student services marketplace. See [docs/PRD.md](./docs/PRD.md) §15.
