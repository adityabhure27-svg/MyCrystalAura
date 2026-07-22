# CrystalAura

India's premium holistic wellness marketplace — authentic crystals, trusted
knowledge, and conscious living. Built from the **Brand Anchor Document (v1.0)**.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` config in `src/app/globals.css`)
- **Supabase** (`@supabase/ssr`) for auth/data — clients in `src/lib/supabase/`
- Fonts: **Cinzel** (headings) + **Poppins** (body) via `next/font`

## Brand system

Defined as Tailwind theme tokens in `src/app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-gold` | `#C8A146` | Primary — Royal Gold |
| `--color-navy` | `#0B1F3A` | Secondary — Deep Navy |
| `--color-ivory` | `#F7F1E6` | Warm Ivory background |
| `--color-emerald` | `#1F7A5C` | Supporting accent |

## Structure

Four pillars from the brand anchor, each a route:

- `/shop` — product taxonomy (`SHOP_CATEGORIES`)
- `/learn` — learning areas + crystal encyclopedia fields
- `/experience` — sessions, workshops, retreats
- `/community` — memberships, circles, practitioner network

Content is driven by `src/lib/content.ts` (single source of truth until the
catalog is backed by Supabase).

## Getting started

```bash
cp .env.example .env.local   # fill in Supabase keys
npm run dev                  # http://localhost:3000
```

## Environment

`.env.local` holds `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Server-only secrets
(`SUPABASE_SERVICE_ROLE_KEY`, DB password) are not committed.

## Not yet built

Catalog data model, auth flows, checkout, and the encyclopedia CMS. The current
build is the brand-anchored shell — schema/migrations are the next step (needs
direct DB or Supabase MCP access to the `cugizvuqjajesncyflfh` project).
