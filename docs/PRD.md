# UniSale — Product Requirements Document (PRD)

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** May 2026  
**Document Owner:** Product Team  
**Classification:** Internal — Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Mission](#3-product-vision--mission)
4. [Target Users & Personas](#4-target-users--personas)
5. [Market Analysis](#5-market-analysis)
6. [Product Scope & Goals](#6-product-scope--goals)
7. [User Stories & Requirements](#7-user-stories--requirements)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Feature Specifications](#10-feature-specifications)
11. [Information Architecture](#11-information-architecture)
12. [User Flows](#12-user-flows)
13. [API Requirements Summary](#13-api-requirements-summary)
14. [Analytics & Success Metrics](#14-analytics--success-metrics)
15. [Phased Roadmap](#15-phased-roadmap)
16. [Risk & Mitigation](#16-risk--mitigation)
17. [Out of Scope](#17-out-of-scope)
18. [Appendix](#18-appendix)

---

## 1. Executive Summary

UniSale is a **campus-exclusive peer-to-peer marketplace** built specifically for college students. It enables verified students to buy, sell, rent, and exchange products and services safely within their campus ecosystem. Unlike generic marketplaces (OLX, Facebook Marketplace), UniSale enforces institutional identity verification, creating a high-trust, hyperlocal commerce layer on top of existing college communities.

The platform targets a market of **40M+ college students in India** who currently rely on fragmented, unsafe channels (WhatsApp groups, Telegram channels, Instagram stories) for peer-to-peer commerce.

**Core Value Proposition:**
- Trust through verified college identity
- Hyperlocal relevance (on-campus transactions)
- Student-centric affordability
- Community-driven discovery

---

## 2. Problem Statement

### 2.1 Current State of Affairs

College students engage in P2P commerce daily but lack a safe, organized platform to do so. The current channels students use are:

| Channel | Problem |
|---|---|
| WhatsApp Groups | No search, no trust, spam-heavy, no transaction history |
| Facebook Marketplace | Mixed public/student users, safety concerns, no campus filters |
| OLX / Quikr | No student verification, scam-heavy, not campus-specific |
| Instagram Stories | Ephemeral, no discovery, no buyer protection |
| Physical Notice Boards | Zero reach, no images, no contact system |

### 2.2 Pain Points (Validated)

**For Sellers:**
- No reliable channel to reach campus buyers
- No way to price items correctly without data
- No system to build reputation/trust
- Time-consuming to manage interested buyers across multiple platforms

**For Buyers:**
- Cannot find campus-specific items
- Cannot verify seller identity
- Risk of scam or fraud
- No price benchmarking for used campus goods

**For the Campus Ecosystem:**
- Perfectly usable goods get thrown away every semester
- No data on campus commerce trends
- No channel for student businesses to reach peers

### 2.3 The Opportunity

Every college campus is a **self-contained micro-economy** with:
- Regular inventory churn (semester start/end, hostel clearances, graduations)
- High volume of budget-conscious repeat buyers
- Built-in community trust (same institution = lower stranger risk)
- Predictable seasonal demand spikes

This micro-economy has **zero dedicated infrastructure** today.

---

## 3. Product Vision & Mission

### 3.1 Vision

> "Build the trusted commerce ecosystem for every college campus in India."

### 3.2 Mission

> "Empower every college student to buy, sell, and exchange safely within their campus community — making student life more affordable and sustainable."

### 3.3 Strategic Pillars

**Trust First** — Every user is a verified student. This is non-negotiable.

**Hyperlocal by Design** — Products and discovery are scoped to campus first, then city, then nationwide.

**Community-Driven Commerce** — Social signals (ratings, activity feeds, trending) drive discovery over algorithmic ranking.

**Student Economic Empowerment** — Enable students to monetize skills, goods, and services — not just offload used items.

---

## 4. Target Users & Personas

### Persona 1: The Hostel Freshman — "Riya"

- **Age:** 18
- **Context:** Just moved into a college hostel from a small town. On a tight budget.
- **Goals:** Find affordable hostel essentials (table lamp, extension board, cycle) from seniors at low cost.
- **Frustrations:** Doesn't know seniors. WhatsApp groups are overwhelming.
- **UniSale Role:** Primary buyer in the first semester.

### Persona 2: The Graduating Senior — "Arjun"

- **Age:** 22
- **Context:** Final year. Moving out. Has 3 years of accumulated hostel goods.
- **Goals:** Sell laptop, cycle, books, furniture before moving out.
- **Frustrations:** OLX gets random strangers. Doesn't want to deal with outside buyers.
- **UniSale Role:** High-volume power seller during graduation season.

### Persona 3: The Student Entrepreneur — "Sneha"

- **Age:** 20
- **Context:** Makes hand-crafted accessories and earns by selling to classmates.
- **Goals:** Reach more buyers on campus. Build a reliable student customer base.
- **Frustrations:** Instagram reach is inconsistent. No proper storefront.
- **UniSale Role:** Recurring seller / premium account candidate.

### Persona 4: The Tech Enthusiast — "Rohan"

- **Age:** 21
- **Context:** CS student. Upgrades gear frequently. Buys and resells gaming peripherals.
- **Goals:** Find fellow students interested in buying/swapping tech gear.
- **Frustrations:** No platform where he can trust the buyer will actually pay and not ghost.
- **UniSale Role:** Power buyer + seller in electronics category.

---

## 5. Market Analysis

### 5.1 Addressable Market (India)

| Segment | Numbers |
|---|---|
| Total college students in India | ~40 million |
| Students with smartphones | ~35 million |
| Students in hostels (primary users) | ~10 million |
| Tier-1 + Tier-2 city campuses (initial target) | ~500 universities |

### 5.2 Competitive Landscape

| Product | Type | Strengths | Weaknesses vs UniSale |
|---|---|---|---|
| OLX | General P2P marketplace | Scale, brand recognition | No student verification, spam-heavy |
| Facebook Marketplace | Social-first P2P | Existing social graph | No campus isolation, mixed trust |
| Quikr | General classifieds | Brand recall | No moderation, dated UX |
| WhatsApp Groups | Informal | Existing user habit | No structure, no discovery, ephemeral |
| Campus Telegram channels | Informal | Community trust | No product, no verification |

### 5.3 Competitive Advantage

UniSale wins on **trust moats** — institutional email/ID verification creates a walled garden that general platforms cannot replicate without rebuilding their identity layer.

---

## 6. Product Scope & Goals

### 6.1 Product Goals (Year 1)

| Goal | Metric | Target |
|---|---|---|
| User Acquisition | Verified student sign-ups | 10,000 in first 3 months (single campus) |
| Listing Volume | Active listings at any time | 1,000+ per campus |
| Transaction Velocity | Buyer-seller conversations started per day | 100+ |
| Retention | D30 retention | >25% |
| Trust | Reported fraud/scam rate | <0.5% |

### 6.2 MVP Scope (Phase 1)

**In Scope:**
- Authentication (college email + Google OAuth)
- Listing creation with image upload
- Browse + search + filter
- In-app chat (buyer ↔ seller)
- User profile with listing history
- Basic category system

**Out of Scope (Phase 1):**
- Ratings/reviews
- Offer Zone
- Payment gateway integration
- Delivery system
- AI features
- Campus ambassador portal

---

## 7. User Stories & Requirements

### 7.1 Authentication & Onboarding

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| AUTH-01 | As a student, I want to sign up using my college email so that I'm verified as a real student | P0 | Only .edu / institutional domains accepted; OTP verification required |
| AUTH-02 | As a user, I want to log in with Google so I don't have to remember a password | P0 | OAuth2 flow completes; college email must be the Google account |
| AUTH-03 | As a new user, I want to complete my profile with college name, year, and department | P1 | Profile form with required fields; cannot post listings without complete profile |
| AUTH-04 | As a user, I want to upload my student ID for additional trust verification | P2 | Optional upload; triggers "Verified Student" badge after manual review |

### 7.2 Listings

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| LIST-01 | As a seller, I want to create a product listing with title, description, price, images, and category | P0 | Form validates all required fields; minimum 1 image; max 5 images at 5MB each |
| LIST-02 | As a seller, I want to mark my item's condition (New / Like New / Good / Fair) | P0 | Condition selector required; shown prominently on listing card |
| LIST-03 | As a seller, I want to edit or delete my listing at any time | P0 | Edit/delete accessible from seller's own listing; soft delete in DB |
| LIST-04 | As a seller, I want to mark a listing as "Sold" once completed | P0 | Sold listings no longer appear in search but remain in seller's profile history |
| LIST-05 | As a seller, I want to set my listing as available for rent (not just sale) | P2 | Toggle between "Sell" and "Rent" mode; rent listings show per-day/week price |

### 7.3 Discovery & Search

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| DISC-01 | As a buyer, I want to browse listings scoped to my campus by default | P0 | Default feed shows listings from same college; "All Colleges" toggle available |
| DISC-02 | As a buyer, I want to search listings by keyword | P0 | Full-text search on title + description; results ranked by relevance |
| DISC-03 | As a buyer, I want to filter by price range, category, and condition | P0 | All 3 filter types functional; filters combinable; result count shown |
| DISC-04 | As a buyer, I want to see trending items on my campus | P1 | Trending algorithm based on views + saves in past 48h |
| DISC-05 | As a buyer, I want to save items to a wishlist | P1 | Save button on listing card; saved items accessible from profile |

### 7.4 Communication

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| CHAT-01 | As a buyer, I want to message a seller directly from the listing without sharing my phone number | P0 | In-app chat opens from listing; no phone number required or shown |
| CHAT-02 | As a seller, I want to receive and manage messages for all my listings | P0 | Unified inbox showing all conversations, grouped by listing |
| CHAT-03 | As a user, I want to receive push notifications when I get a new message | P1 | Web push notifications; email fallback |

### 7.5 Ratings & Trust

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| RATE-01 | As a buyer, I want to rate a seller after a transaction | P1 | Rating prompt after marking deal complete; 1-5 star + optional text |
| RATE-02 | As a seller, I want to rate a buyer after a transaction | P1 | Mutual rating system; both parties prompted |
| RATE-03 | As a user, I want to see a seller's average rating before engaging | P1 | Rating badge shown on profile and listing cards |

### 7.6 Administration & Safety

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| ADMIN-01 | As a moderator, I want to review reported listings and take action | P0 | Admin panel; report queue; actions: warn / remove / ban |
| ADMIN-02 | As a user, I want to report a listing or user for fraud or abuse | P0 | Report button on listings and profiles; reason required |
| ADMIN-03 | As an admin, I want to manage verified college email domains | P0 | Domain whitelist CRUD in admin panel |

---

## 8. Functional Requirements

### 8.1 Authentication System

- College email OTP verification (SMTP or SendGrid)
- Google OAuth 2.0 (restricted to college-domain Google accounts)
- JWT-based session management (access + refresh token pattern)
- Token refresh on expiry; force logout on suspicious activity
- Account deactivation and deletion (GDPR-compliant)

### 8.2 User Profile System

- Unique username + display name
- Avatar upload (max 2MB, jpg/png/webp)
- College, department, year fields
- Bio (max 160 characters)
- Active listings count, completed deals count
- Average rating (computed field)
- Member since date
- Optional: Student ID verification upload

### 8.3 Listing System

- Title (max 80 characters)
- Description (max 1000 characters, markdown supported)
- Price (numeric, required for sales; optional for exchange)
- Type: Sale / Rent / Exchange / Giveaway
- Condition: New / Like New / Good / Fair / For Parts
- Category (from system-defined taxonomy)
- Images: 1–5 images, max 5MB each, auto-compressed on upload
- Location scope: On-Campus / Near-Campus / City
- Status: Active / Sold / Paused / Deleted

### 8.4 Search & Discovery

- Full-text search (MongoDB Atlas Search or MeiliSearch)
- Filters: category, price range, condition, listing type, college
- Sort: Newest / Price Low-High / Price High-Low / Most Viewed
- Trending feed: listings with highest interaction rate in past 48h
- "Near You" feed: listings from same campus prioritized

### 8.5 Messaging System

- Real-time chat via WebSocket (Socket.io)
- Message types: text, image
- Read receipts and typing indicators
- Chat linked to specific listing
- Archived chats for sold listings

### 8.6 Notification System

- In-app notifications (bell icon)
- Push notifications (Web Push API)
- Email notifications (configurable per type)
- Types: new message, price drop on wishlist item, new listing matching saved search

### 8.7 Admin Panel

- User management: search, view, warn, suspend, delete
- Listing management: search, view, approve, remove
- Domain whitelist management
- Report queue
- Platform analytics dashboard
- Offer Zone management

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Metric | Target |
|---|---|
| Page load time (LCP) | < 2.5 seconds |
| API response time (P95) | < 500ms |
| Image load time (listing card) | < 1 second (with CDN) |
| Search result latency | < 300ms |
| WebSocket message delivery | < 100ms (same region) |

### 9.2 Scalability

- API must handle 10,000 concurrent users at launch
- Horizontal scaling via stateless Node.js services
- MongoDB Atlas auto-scaling clusters
- CDN for all static assets and user-uploaded images

### 9.3 Security

- HTTPS enforced everywhere (HSTS)
- All passwords hashed with bcrypt (cost factor ≥ 12)
- JWT secrets rotated every 90 days
- Rate limiting on all public endpoints
- Input sanitization on all user-submitted fields (Zod)
- File upload validation (type, size, MIME sniffing)
- XSS, CSRF, and NoSQL injection protection

### 9.4 Accessibility

- WCAG 2.1 Level AA compliance
- Screen reader support for primary flows
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1 on all text

---

## 10. Feature Specifications

### 10.1 Campus Feed Algorithm

**Ranking Signals:**
- Recency (posted in last 72h gets a boost)
- Engagement rate (views + saves + chat starts / hours live)
- Campus match (same college = highest priority)
- Listing quality score (multiple images + description > 100 chars)

**Personalization (Phase 2):**
- User's previously viewed categories
- Saved categories and interaction history

### 10.2 Trust Score System (Phase 2)

Every user accumulates a Trust Score (0–100):

| Signal | Points |
|---|---|
| College email verified | +20 |
| Student ID verified | +20 |
| Profile complete (avatar, bio, college) | +15 |
| Average rating ≥ 4.0 (min 3 ratings) | +20 |
| Account age > 90 days | +10 |
| Zero active reports/bans | +15 |

Displayed as: 🔥 Trusted / ✅ Verified / 🌱 New Member

### 10.3 Image Processing Pipeline

All uploaded images must be:
1. Validated (file type, MIME type, size)
2. Virus-scanned
3. Resized to 3 variants: thumbnail (300×300), medium (800×600), full (1600×1200)
4. Converted to WebP format
5. Stored in cloud storage (AWS S3 or Cloudflare R2)
6. Served via CDN with proper cache-control headers

---

## 11. Information Architecture

```
UniSale
├── Public (Unauthenticated)
│   ├── Landing Page
│   ├── Sign Up
│   ├── Log In
│   └── About
│
└── App (Authenticated)
    ├── Home (Campus Feed)
    ├── Explore
    │   ├── All Listings
    │   ├── By Category
    │   └── Offer Zone
    ├── Search Results
    ├── Listing Detail
    ├── Create Listing
    ├── Messages
    │   └── Conversation View
    ├── Wishlist
    ├── Notifications
    └── Profile
        ├── My Listings
        ├── My Purchases
        └── Settings
```

---

## 12. User Flows

### 12.1 New User Onboarding

```
Landing Page → "Get Started" → Enter College Email → OTP Sent
→ Enter OTP (verified) → Create Password → Complete Profile
→ Homepage (Campus Feed)
```

### 12.2 Seller Flow

```
Homepage → "Sell Something" FAB → Upload Images → Fill Details
→ Select Category + Condition → Preview → Publish
→ Listing Live → Receive Messages → Mark Sold → Rate Buyer
```

### 12.3 Buyer Flow

```
Homepage/Search → Browse/Filter → Click Listing
→ View Detail → View Seller Profile → "Message Seller"
→ Chat → Agree → Meet on Campus → Mark Purchased → Rate Seller
```

---

## 13. API Requirements Summary

### 13.1 Core Endpoint Groups

| Group | Key Endpoints |
|---|---|
| Auth | POST /auth/register, /auth/verify-otp, /auth/login, /auth/refresh, /auth/google |
| Users | GET /users/:id, PATCH /users/me, DELETE /users/me |
| Listings | GET /listings, POST /listings, GET /listings/:id, PATCH /listings/:id, DELETE /listings/:id |
| Search | GET /search?q=&category=&price_min=&price_max=&condition= |
| Messages | GET /conversations, GET /conversations/:id/messages, POST /conversations/:id/messages |
| Ratings | POST /ratings, GET /users/:id/ratings |
| Wishlist | GET /wishlist, POST /wishlist, DELETE /wishlist/:listing_id |
| Reports | POST /reports |
| Upload | POST /upload/image (returns CDN URL) |

### 13.2 WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `message:send` | Client → Server | Send a new chat message |
| `message:receive` | Server → Client | Incoming message delivery |
| `message:read` | Client → Server | Mark messages as read |
| `typing:start/stop` | Client → Server | Typing indicator |
| `notification:new` | Server → Client | New in-app notification |

---

## 14. Analytics & Success Metrics

### 14.1 North Star Metric

> **Weekly Active Listing Interactions** — unique buyer-seller conversations started per week per campus.

### 14.2 Key Metrics by Category

**Acquisition:** New sign-ups per day, sign-up completion rate, source attribution

**Engagement:** DAU/MAU ratio (target > 0.15), sessions per user per week, chat initiation rate

**Supply:** New listings per day, active listing ratio, seller repeat rate (30 days)

**Health:** Report rate, fraud confirmed rate, user ban rate, error rate

**Business (Phase 2+):** Featured listing revenue, premium account conversion, LTV per segment

---

## 15. Phased Roadmap

### Phase 0 — Pre-Launch (Weeks 1–4)
- Finalize tech stack and architecture
- Set up dev + staging environments
- Design system finalized
- Recruit 20 beta users from target campus

### Phase 1 — MVP Launch (Weeks 5–12)
- Authentication (email OTP + Google OAuth)
- Listing CRUD with image upload
- Browse + search + filter
- In-app real-time chat
- Basic moderation tools
- Admin panel (minimal)

**Go/No-Go Gate:** 500 verified users AND 200 active listings within 30 days of launch.

### Phase 2 — Growth Features (Months 3–5)
- Ratings & reviews
- Offer Zone
- Wishlist + price drop notifications
- Trust Score system
- Campus ambassador portal
- Push notifications

### Phase 3 — Network Effect (Months 6–9)
- Multi-campus rollout (5 campuses)
- Trending feeds per campus
- Leaderboards + Verified Seller badges
- Seller analytics dashboard
- Featured listings (first monetization)

### Phase 4 — Ecosystem (Month 10+)
- Rentals marketplace
- Student services marketplace
- Notes exchange
- AI-powered pricing recommendations
- AI scam detection in chat
- Premium seller accounts

---

## 16. Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Cold start (no listings at launch) | High | Critical | Pre-seed 50+ listings via beta users; incentivize early sellers with badges |
| Fake student sign-ups | Medium | High | Strict institutional email verification; optional ID upload |
| Scam/fraud | Medium | Critical | Report system; meeting suggestions (public places); fraud detection Phase 2 |
| Low seller retention | High | High | Seller analytics; push notifications on listing views; re-engagement campaigns |
| User data breach | Low | Critical | Security-by-design; pen testing before launch; minimal PII storage |

---

## 17. Out of Scope

The following are explicitly **not** part of this PRD:

- In-app payment processing or escrow
- Campus delivery / logistics network
- International campuses
- Faculty or non-student users
- Mobile native apps (iOS/Android) — PWA only in MVP
- Live auctions / bidding
- Non-college-affiliated ads before Phase 3

---

## 18. Appendix

### 18.1 Category Taxonomy (Initial)

- Electronics (Laptops, Phones, Peripherals, Cameras, Audio)
- Books & Notes (Textbooks, Reference Books, Notes, Study Materials)
- Furniture (Tables, Chairs, Shelves, Mattresses)
- Hostel Essentials (Bedding, Kitchen, Appliances, Storage)
- Fashion (Clothing, Footwear, Accessories)
- Sports & Fitness (Cycles, Equipment, Gym Gear)
- Stationery & Supplies (Drawing Instruments, Calculators, Art Supplies)
- Gadgets & Accessories (Earphones, Chargers, Cables, Power Banks)
- Services (Tutoring, Design, Photography, Repair)
- Other

### 18.2 Glossary

| Term | Definition |
|---|---|
| Listing | A product or service posted for sale, rent, or exchange |
| Trust Score | Computed reputation metric for each user (0–100) |
| Offer Zone | Time-limited campaign featuring discounted campus listings |
| Campus Feed | Personalized discovery feed scoped to user's campus |
| Verified Student | User who has completed college email + optional ID verification |
| Power Seller | User with 10+ completed transactions and avg rating ≥ 4.0 |
