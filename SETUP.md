# CrystalAura — Setup & Deploy

Everything needed to connect the database and ship to
`https://my-crystal-aura.vercel.app`. Steps marked **[You]** need your
credentials; **[Claude]** steps I handle in a session opened in this folder.

---

## Will connecting Supabase disconnect StallSpot?

**No — as long as you run the connect command from THIS (`crystalaura`) folder.**

- `--scope project` writes the connection into a `.mcp.json` in the folder you
  run it from. Each project reads only its own `.mcp.json`.
- StallSpot's lives in `stallspot/.mcp.json` (project `xsqpxdpcwfpjjxjlmdzi`).
  This command creates a separate `crystalaura/.mcp.json`
  (project `cugizvuqjajesncyflfh`). StallSpot's file is never touched.
- ⚠️ Only risk: running it while inside the `stallspot` folder would overwrite
  StallSpot's `supabase` entry. Don't run it there.

---

## Step 1 — Connect Supabase to CrystalAura  **[You]**

In a terminal (note the `cd` first):

```bash
cd C:/Users/adity/OneDrive/Desktop/crystalaura
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=cugizvuqjajesncyflfh"
```

Creates `crystalaura/.mcp.json`. StallSpot untouched.

## Step 2 — Open Claude in this folder  **[You]**

Start Claude Code **from inside `crystalaura`** (the earlier session was rooted
in `stallspot` and can't see this connection). On first use, approve the
**Supabase authorization** popup in the browser.

## Step 3 — Provision the database  **[Claude]**

I apply the migrations in order and verify:

```
supabase/migrations/0001_init.sql            # tables, RLS, grants, triggers
supabase/migrations/0002_analytics_views.sql # segments + analytics views
supabase/migrations/0003_seed_categories.sql # 12 shop categories
```

Then I fetch the **valid publishable key** from the project (this replaces the
old key that returns 401).

### Make yourself the owner (after you sign up once)
```sql
update public.profiles set role = 'owner'
where id = (select id from auth.users where email = 'you@example.com');
```

## Step 4 — Log into Vercel  **[You]**

```bash
cd C:/Users/adity/OneDrive/Desktop/crystalaura
vercel login
```

## Step 5 — Deploy  **[Claude]**

I link to the `my-crystal-aura` project, set env vars, and deploy:

```bash
vercel link                                   # → my-crystal-aura
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel deploy --prod
```

---

## Minimum you need to do

1. Run **Step 1** (in this folder).
2. Do **Step 2** (open a session here + approve the browser popup).
3. Run **`vercel login`** (Step 4).

I handle the database and the deploy.

## Fallback (no new session)

Paste a **valid publishable/anon key** and a **service-role key** from the
Supabase dashboard (Settings → API), and I'll wire the app and guide the
migrations manually.

---

## Current status

- ✅ App scaffolded (Next 16 · React 19 · Tailwind v4 · `@supabase/ssr`)
- ✅ Public site renders (Home / Shop / Learn / Experience / Community)
- ✅ Central DB schema authored (`supabase/migrations/`) — **not yet applied**
- ✅ Git repo on `main`, `next build` passes, Vercel CLI installed
- ⏳ Blocked on: valid Supabase key + `vercel login`
- 🔜 Next build target: **Owner Portal** (products/orders/customers/analytics)
