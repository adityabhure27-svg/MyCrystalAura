# The Aura Crystals — Database

The **central database** bridging the public website, customer portal, and admin portal.

```
Admin Portal → Draft → Preview → Publish → Database → Public Website
```

## Auth model (important for RLS)

- **Customers** authenticate with **Clerk** (`customers.clerk_user_id`).
- **Admin** uses a custom single-owner credential gate (not Supabase auth).

So RLS keys on row **`status`**, not `auth.uid()`:
- Anon/authenticated (publishable key) may **SELECT only `status = 'published'`** catalog rows.
- **All writes and all customer/commerce reads happen server-side with the
  `service_role` key** (bypasses RLS).

## Migrations — apply in order

| File | What it creates |
| --- | --- |
| `0001_init.sql` | 20 tables + enums + triggers + RLS + grants: `admin_users`, `customers`, `categories`, `subcategories`, `collections` (+`collection_products`), `crystal_profiles`, `products`, `product_images`, `content`, `experiences`, `homepage_sections` (+`homepage_section_items`), `carts` (+`cart_items`), `orders` (+`order_items` w/ snapshots), `payments`, `inventory_transactions`, `publish_history` |
| `0002_views.sql` | `customer_metrics` (segments), `product_performance`, `sales_daily` |
| `0003_seed_moc.sql` | Owner + 12 categories + Crystal Jewellery subcategories + Amethyst/Rose Quartz profiles + the **2 MOC products** (published) |

Every content table has `status ('draft'|'published'|'archived')` + `published_at`
(auto-stamped on first publish). The public website queries `status = 'published'`.

## How to apply (MCP/REST currently return 401 from here)

**Supabase SQL Editor (simplest):** open the project → SQL Editor → paste each
file's contents **in order** (`0001` → `0002` → `0003`) → Run.

Or via CLI once linked:
```bash
supabase link --project-ref cugizvuqjajesncyflfh
supabase db push
```

## To let the app read/write the DB, provide:

1. A **valid publishable/anon key** for `cugizvuqjajesncyflfh` (current one 401s) →
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. The **service-role key** (Settings → API → `service_role`) →
   `SUPABASE_SERVICE_ROLE_KEY` (server-only; used for admin writes + customer reads)

Set both in `.env.local` and on Vercel (Production). Then the storefront shows
the seeded MOC products and the admin CMS can publish.
