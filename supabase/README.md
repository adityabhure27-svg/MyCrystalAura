# MyCrystalAura — Database

The **central database** that bridges the public website and the Owner Portal.

```
Public Website  <->  Central Database (this)  <->  Owner Portal
```

## Migrations

Apply in order:

| File | What it creates |
| --- | --- |
| `0001_init.sql` | Enums, `profiles`, `categories`, `products`, `product_images`, `customers`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `sessions` + triggers, RLS, grants |
| `0002_analytics_views.sql` | `customer_metrics` (+ segments), `product_performance`, `sales_daily`, `segment_summary` |
| `0003_seed_categories.sql` | The 12 main shop categories |

## Data model at a glance

- **Owner enters once → reflected everywhere.** `products` (with `is_published`
  visibility + `is_featured`) feed shop, category, search, featured, and detail.
- **Customers are created by activity.** A `customers` row is created at
  checkout; `cart_items`/`wishlist_items` are keyed by the auth user.
- **Orders are generated on purchase.** `orders` auto-assigns `order_number`
  (`CA-YYYY-000000`) and carries `payment_status`, `transaction_id`, and
  `delivery_tracking_id`. `order_items` snapshot name + price.
- **Segments are derived, not stored.** `customer_metrics` computes
  `new / first_time_buyer / returning / active / inactive / high_value /
  frequent_buyer` from paid orders — no marketing layer.
- **Owner access** is any `profiles.role = 'owner'`. RLS uses `is_owner()`;
  the public can only read published catalog rows.

## How to apply (MCP is currently blocked)

The Supabase MCP connection points at a different project and the REST API
returns 401 with the provided publishable key, so migrations can't be pushed
from here yet. Apply them one of these ways:

**A. Supabase SQL Editor (fastest)**
Open the project → SQL Editor → paste each file's contents in order → Run.

**B. Supabase CLI**
```bash
supabase link --project-ref cugizvuqjajesncyflfh
supabase db push        # applies supabase/migrations/*
```

**C. psql**
```bash
psql "postgresql://postgres:<DB_PASSWORD>@db.cugizvuqjajesncyflfh.supabase.co:5432/postgres" \
  -f supabase/migrations/0001_init.sql \
  -f supabase/migrations/0002_analytics_views.sql \
  -f supabase/migrations/0003_seed_categories.sql
```

## Make yourself the owner

After signing up once, promote your account:

```sql
update public.profiles set role = 'owner'
where id = (select id from auth.users where email = 'you@example.com');
```

## To unblock automated provisioning from here

Provide **one** of:
- a **valid publishable/anon key** for `cugizvuqjajesncyflfh` (current one 401s), plus a **service-role key** or **DB password**, or
- the Supabase **MCP re-pointed** at this project with a valid access token.
