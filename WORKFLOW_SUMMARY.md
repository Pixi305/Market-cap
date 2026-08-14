# Marketcap App — Build Workflow Summary
**Date:** 2026-08-14

---

## Project Overview

Built a full-stack stock investment tracking web app called **Marketcap** from scratch, similar to Google Finance. The app features live stock quotes, watchlists, a portfolio tracker, financial news, user authentication, and a Stripe-powered subscription model.

---

## User Prompts (Chronological)

1. **"Database: setup a database with supabase, i have the mcp connected. I just want to have the ability for user to login/sign up and save stock to watch list. User can only see their own stocks. Payments: I also want to build a pricing page with 2 plans: Free plan / paid plan $15/month - allows user to save stocks to their watchlist. setup stripe recurring payment, i have stripe mcp connected. create a dummy pricing page so i can test the payment in sandbox mode"**

2. **"setup ready to connect api key, setup .env file and gitgnore so i can paste in the api key for stripe"**

3. **"open .env file to paste the key"**

4. **"added the key"**

5. **"on the free tier apple to add 3 stocks to wishlist"**
   *(Allow free tier users to save up to 3 stocks to their watchlist)*

6. **"effect changes to stock add to wishlist on the free tier for 3 to be saved if exceed upgrade plan"**
   *(Verify the 3-stock free tier gate works in the browser)*

7. **"upgrade to pro isn't working (button) check and fix issue"**

8. **"after successful payment it dind't upgrde the tier fix"**

9. **"on my supabase db table for profile. i need table update id (uuid), email - text and is pro true or false"**

10. **"I'm ready now connect to my github and connect to this repo: git@github.com:Pixi305/Market-cap.git"**

11. **"I'm ready now connect to my github and connect to this repo: https://github.com/Pixi305/Market-cap.git"** *(switched to HTTPS)*

12. **"yes done"** *(SSH key added to GitHub)*

13. **"create the summary of my workflow today and all my prompt in a doc file"**

---

## What Was Built

### Tech Stack
- **Framework:** Next.js 16 App Router (TypeScript strict)
- **Styling:** Tailwind CSS v4 with custom design tokens (orange/black/white Finexy palette)
- **Data fetching:** TanStack Query v5 (polling, mutations, cache invalidation)
- **Database & Auth:** Supabase (Postgres + Row Level Security)
- **Payments:** Stripe (Checkout, subscriptions, billing portal)
- **Market data:** Finnhub API (quotes, search, candles, news)
- **Charts:** lightweight-charts v5

---

### Features Built

#### Authentication
- Email/password sign up and login via Supabase Auth
- Protected routes via Next.js middleware
- Auto-creates user profile, watchlist, portfolio, and subscription row on signup

#### Market Data
- Live stock search with debounced autocomplete
- Stock detail page: quote header (price, % change), price chart (1D/1W/1M/1Y), key stats, company profile
- Quote polling every 15–20s, paused when tab is hidden
- Financial news: per-symbol news tab + global market news page
- All Finnhub calls go through Next.js Route Handlers — API key never reaches the browser

#### Watchlist
- Add/remove stocks, persisted to Supabase
- Free tier: max 3 stocks; shows "Upgrade to save more" on the 4th attempt
- Gate enforced on both client (instant UI) and server (API route)

#### Portfolio
- Add/edit/remove holdings (symbol, quantity, avg cost)
- Live portfolio value = quantity × current price
- Day gain/loss calculation

#### Dashboard
- Portfolio value tile, day change tile, watchlist count tile
- Market movers section
- Watchlist preview with live quotes

#### Pricing & Payments
- Free plan: 3-stock watchlist limit
- Pro plan: $15/month, unlimited watchlist
- Stripe Checkout (hosted payment page, test/sandbox mode)
- Post-payment verify-session flow (no webhook needed for local testing): Stripe passes `session_id` in the success redirect URL; server verifies payment, upgrades subscription in DB
- Stripe billing portal for subscription management

---

### Database Schema (Supabase)

| Table | Purpose |
|---|---|
| `profiles` | `id`, `email`, `is_pro`, `stripe_customer_id`, `display_name` |
| `watchlists` | Default watchlist per user |
| `watchlist_items` | Symbols saved to a watchlist |
| `portfolios` | Default portfolio per user |
| `holdings` | Symbol, quantity, avg cost per portfolio |
| `subscriptions` | `plan` (free/pro), `status`, Stripe IDs, period end |

RLS enabled on all tables — users can only see and modify their own data.

---

### Bugs Fixed During Build

| Bug | Root Cause | Fix |
|---|---|---|
| Stripe "Upgrade to Pro" button returning 500 | Price was created on the wrong Stripe account (MCP was connected to a different account) | Created new price on the correct account via Node.js script; updated `NEXT_PUBLIC_STRIPE_PRICE_ID` |
| Post-payment plan not upgrading | `STRIPE_WEBHOOK_SECRET` not set → webhook verification failed | Implemented verify-session pattern: retrieve Checkout session by ID from Stripe, confirm `payment_status === "paid"`, update DB directly |
| verify-session returning 200 but plan still free | `subscriptions` table only had a SELECT RLS policy — the UPDATE was silently blocked | Added `subscriptions_self_update` RLS policy via Supabase migration |

---

### Key Files

```
app/
  (auth)/login, signup, actions.ts     — Auth pages + server actions
  (shell)/page.tsx                     — Dashboard
  (shell)/stock/[symbol]/page.tsx      — Stock detail
  (shell)/watchlist/page.tsx           — Watchlist
  (shell)/portfolio/page.tsx           — Portfolio
  (shell)/news/page.tsx                — Market news
  (shell)/pricing/page.tsx             — Pricing + Stripe upgrade flow
  api/finnhub/*                        — Server-side Finnhub proxies
  api/watchlist/route.ts               — Watchlist CRUD + free tier gate
  api/subscription/route.ts            — Subscription status
  api/stripe/create-checkout-session/  — Create Stripe Checkout
  api/stripe/verify-session/           — Verify payment + upgrade plan
  api/stripe/customer-portal/          — Stripe billing portal
  api/stripe/webhook/                  — Production webhook handler

lib/
  supabase/{client,server,admin}.ts    — Supabase clients
  stripe/server.ts                     — Stripe SDK (server-only)
  finnhub/client.ts                    — Finnhub client (server-only)

hooks/
  useWatchlist.ts, useSubscription.ts, useQuote.ts, usePortfolio.ts, ...

components/
  stock/WatchlistButton.tsx            — 3-state button (sign in / upgrade / add)
  layout/Sidebar.tsx, MobileTabBar.tsx — Navigation
  ...

supabase/migrations/0001_init.sql      — Full schema + RLS + triggers
.env.local                             — API keys (gitignored)
```

---

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FINNHUB_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=        # for production webhooks
NEXT_PUBLIC_STRIPE_PRICE_ID=
NEXT_PUBLIC_SITE_URL=
```

---

### GitHub
Repository: [github.com/Pixi305/Market-cap](https://github.com/Pixi305/Market-cap)
Branch: `main`
Initial commit: 149 files, 13,853 insertions
