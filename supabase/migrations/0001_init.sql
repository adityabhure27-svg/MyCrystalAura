-- ============================================================================
-- MyCrystalAura — Central Database (core schema)
-- Public Website  <->  Central Database  <->  Owner Portal
-- Domain: Products -> Customers -> Cart -> Orders -> Purchases -> Tracking
-- ============================================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'owner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum
    ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum
    ('unpaid', 'pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Shared helpers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Owner check used by RLS. SECURITY DEFINER so it can read profiles without
-- being blocked by profiles' own RLS (prevents recursive policy evaluation).
create or replace function public.is_owner()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user; role gates Owner Portal access
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'customer',
  full_name  text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- categories — self-referential (main categories + subcategories)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.categories(id) on delete set null,
  name        text not null,
  slug        text not null unique,
  description text,
  position    int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists categories_parent_idx on public.categories(parent_id);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- products — owner enters once; reflected across shop/search/featured/detail
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid references public.categories(id) on delete set null,
  name             text not null,
  slug             text not null unique,
  description      text,
  specifications   jsonb not null default '{}'::jsonb,
  price            numeric(12,2) not null default 0 check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price >= 0),
  currency         text not null default 'INR',
  sku              text unique,
  stock            int  not null default 0 check (stock >= 0),
  is_published     boolean not null default false,   -- visibility
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists products_category_idx  on public.products(category_id);
create index if not exists products_published_idx on public.products(is_published);
create index if not exists products_featured_idx  on public.products(is_featured);
-- Full-text-ish search over name + description
create index if not exists products_search_idx
  on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- product_images — ordered gallery per product
-- ----------------------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  alt        text,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);

-- ----------------------------------------------------------------------------
-- customers — created/updated through customer activity (checkout)
-- ----------------------------------------------------------------------------
create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,  -- null = guest
  email      text not null unique,
  full_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customers_user_idx on public.customers(user_id);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- cart_items & wishlist_items — keyed by auth user (guest carts live client-side)
-- ----------------------------------------------------------------------------
create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   int  not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);
create index if not exists cart_items_user_idx on public.cart_items(user_id);

create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

create table if not exists public.wishlist_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
create index if not exists wishlist_items_user_idx on public.wishlist_items(user_id);

-- ----------------------------------------------------------------------------
-- orders — created automatically when a purchase is made
-- ----------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1000;

create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  order_number         text unique not null,
  customer_id          uuid not null references public.customers(id) on delete restrict,
  status               public.order_status   not null default 'pending',
  payment_status       public.payment_status not null default 'unpaid',
  subtotal             numeric(12,2) not null default 0,
  shipping_amount      numeric(12,2) not null default 0,
  total                numeric(12,2) not null default 0,
  currency             text not null default 'INR',
  transaction_id       text,
  delivery_tracking_id text,
  shipping_address     jsonb,
  notes                text,
  placed_at            timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_status_idx   on public.orders(status);
create index if not exists orders_placed_idx   on public.orders(placed_at);

create or replace function public.set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'CA-' || to_char(now(), 'YYYY') || '-'
      || lpad(nextval('public.order_number_seq')::text, 6, '0');
  end if;
  return new;
end $$;

create trigger orders_set_order_number
  before insert on public.orders
  for each row execute function public.set_order_number();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- order_items — line snapshots (price/name frozen at purchase time)
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(12,2) not null check (unit_price >= 0),
  quantity     int not null check (quantity > 0),
  line_total   numeric(12,2) not null check (line_total >= 0)
);
create index if not exists order_items_order_idx   on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);

-- ----------------------------------------------------------------------------
-- sessions — operational tracking (customer / session / order linkage)
-- ----------------------------------------------------------------------------
create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references public.customers(id) on delete set null,
  user_id      uuid references auth.users(id) on delete set null,
  started_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent   text
);
create index if not exists sessions_customer_idx on public.sessions(customer_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.customers      enable row level security;
alter table public.cart_items     enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.sessions       enable row level security;

-- profiles: self read/update; owner full
create policy profiles_self_read   on public.profiles for select using (id = auth.uid() or public.is_owner());
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_owner_all   on public.profiles for all using (public.is_owner()) with check (public.is_owner());

-- categories: public reads active; owner full
create policy categories_public_read on public.categories for select using (is_active or public.is_owner());
create policy categories_owner_all   on public.categories for all using (public.is_owner()) with check (public.is_owner());

-- products: public reads published; owner full
create policy products_public_read on public.products for select using (is_published or public.is_owner());
create policy products_owner_all   on public.products for all using (public.is_owner()) with check (public.is_owner());

-- product_images: readable if parent product is visible; owner full
create policy product_images_public_read on public.product_images for select using (
  public.is_owner() or exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.is_published
  )
);
create policy product_images_owner_all on public.product_images for all using (public.is_owner()) with check (public.is_owner());

-- customers: owner full; a signed-in customer sees/updates their own record
create policy customers_owner_all on public.customers for all using (public.is_owner()) with check (public.is_owner());
create policy customers_self_read on public.customers for select using (user_id = auth.uid());
create policy customers_self_upsert on public.customers for insert with check (user_id = auth.uid());
create policy customers_self_update on public.customers for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- cart_items: the owning user (and owner can read)
create policy cart_items_user_all  on public.cart_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy cart_items_owner_read on public.cart_items for select using (public.is_owner());

-- wishlist_items: the owning user (and owner can read)
create policy wishlist_user_all  on public.wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy wishlist_owner_read on public.wishlist_items for select using (public.is_owner());

-- orders: owner full; customer reads their own orders
create policy orders_owner_all on public.orders for all using (public.is_owner()) with check (public.is_owner());
create policy orders_self_read on public.orders for select using (
  exists (select 1 from public.customers c where c.id = orders.customer_id and c.user_id = auth.uid())
);

-- order_items: follow parent order visibility
create policy order_items_owner_all on public.order_items for all using (public.is_owner()) with check (public.is_owner());
create policy order_items_self_read on public.order_items for select using (
  exists (
    select 1 from public.orders o
    join public.customers c on c.id = o.customer_id
    where o.id = order_items.order_id and c.user_id = auth.uid()
  )
);

-- sessions: owner full; user sees own
create policy sessions_owner_all on public.sessions for all using (public.is_owner()) with check (public.is_owner());
create policy sessions_self_read on public.sessions for select using (user_id = auth.uid());

-- ============================================================================
-- Grants — PostgREST needs table privileges in addition to RLS.
-- ============================================================================
grant usage on schema public to anon, authenticated, service_role;

-- Public catalog is readable by anonymous visitors
grant select on public.categories, public.products, public.product_images to anon, authenticated;

-- Signed-in users operate on their own commerce rows (RLS scopes the actual access)
grant select, insert, update, delete on
  public.profiles, public.customers, public.cart_items, public.wishlist_items,
  public.orders, public.order_items, public.sessions
  to authenticated;
grant select on public.categories, public.products, public.product_images to authenticated;

-- service_role bypasses RLS but still needs the grants explicitly
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated;
