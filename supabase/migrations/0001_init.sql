-- ============================================================================
-- The Aura Crystals — Central Database (publishing + commerce)
-- Flow: Admin Portal → Draft → Preview → Publish → Database → Public Website
--
-- Auth model in this app:
--   • Customers authenticate with CLERK  (customers.clerk_user_id)
--   • Admin uses a custom single-owner credential gate (not Supabase auth)
-- Therefore RLS keys on row `status`, NOT on auth.uid():
--   • anon/authenticated (publishable key) may SELECT only status='published'
--   • all writes + all customer/commerce reads happen SERVER-SIDE with the
--     service_role key (bypasses RLS)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin create type public.content_status as enum ('draft','published','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.admin_role     as enum ('owner','admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.customer_status as enum ('active','inactive'); exception when duplicate_object then null; end $$;
do $$ begin create type public.content_type   as enum ('article','guide','video','resource'); exception when duplicate_object then null; end $$;
do $$ begin create type public.section_type   as enum ('hero','trust_strip','category_grid','featured_products','featured_collection','learn','experience','community','brand_story','newsletter'); exception when duplicate_object then null; end $$;
do $$ begin create type public.cart_status    as enum ('active','converted','abandoned'); exception when duplicate_object then null; end $$;
do $$ begin create type public.order_status   as enum ('pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_status as enum ('unpaid','pending','paid','failed','refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type public.inventory_txn_type as enum ('purchase','restock','return','adjustment'); exception when duplicate_object then null; end $$;
do $$ begin create type public.publish_action as enum ('created','updated','published','unpublished','archived'); exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Shared trigger helpers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Stamp published_at the first time a row transitions to 'published'.
create or replace function public.set_published_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and (new.published_at is null) then
    new.published_at = now();
  end if;
  return new;
end $$;

-- ============================================================================
-- 16. admin_users  (single owner initially; audit references point here)
-- ============================================================================
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  email         text not null unique,
  role          public.admin_role not null default 'owner',
  status        text not null default 'active',
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- ============================================================================
-- 11. customers  (linked to a Clerk user)
-- ============================================================================
create table if not exists public.customers (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text unique,
  name          text,
  email         text not null unique,
  phone         text,
  avatar_url    text,
  status        public.customer_status not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_login_at timestamptz
);
create index if not exists customers_clerk_idx on public.customers(clerk_user_id);
create trigger customers_updated before update on public.customers for each row execute function public.set_updated_at();

-- ============================================================================
-- 3. categories
-- ============================================================================
create table if not exists public.categories (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  description       text,
  short_description text,
  image_url         text,
  banner_url        text,
  mobile_banner_url text,
  display_order     int not null default 0,
  status            public.content_status not null default 'draft',
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists categories_status_idx on public.categories(status);
create trigger categories_updated   before update on public.categories for each row execute function public.set_updated_at();
create trigger categories_published before insert or update on public.categories for each row execute function public.set_published_at();

-- ============================================================================
-- 4. subcategories
-- ============================================================================
create table if not exists public.subcategories (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  slug          text not null,
  description   text,
  image_url     text,
  display_order int not null default 0,
  status        public.content_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (category_id, slug)
);
create index if not exists subcategories_category_idx on public.subcategories(category_id);
create trigger subcategories_updated   before update on public.subcategories for each row execute function public.set_updated_at();
create trigger subcategories_published before insert or update on public.subcategories for each row execute function public.set_published_at();

-- ============================================================================
-- 5. collections  (+ 5b. collection_products)
-- ============================================================================
create table if not exists public.collections (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  image_url     text,
  display_order int not null default 0,
  status        public.content_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger collections_updated   before update on public.collections for each row execute function public.set_updated_at();
create trigger collections_published before insert or update on public.collections for each row execute function public.set_published_at();

-- ============================================================================
-- 8. crystal_profiles  (Crystal Encyclopedia)
-- ============================================================================
create table if not exists public.crystal_profiles (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  slug                   text not null unique,
  overview               text,
  scientific_information text,
  geological_formation   text,
  origin                 text,
  colour_variations      text,
  chakra_association      text,
  zodiac_association     text,
  traditional_properties text,
  care_instructions      text,
  cleansing_methods      text,
  charging_methods       text,
  buying_guide           text,
  main_image_url         text,
  status                 public.content_status not null default 'draft',
  published_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create trigger crystal_profiles_updated   before update on public.crystal_profiles for each row execute function public.set_updated_at();
create trigger crystal_profiles_published before insert or update on public.crystal_profiles for each row execute function public.set_published_at();

-- ============================================================================
-- 1. products
-- ============================================================================
create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  sku                 text unique,
  name                text not null,
  slug                text not null unique,
  short_description   text,
  description         text,
  category_id         uuid references public.categories(id) on delete set null,
  subcategory_id      uuid references public.subcategories(id) on delete set null,
  collection_id       uuid references public.collections(id) on delete set null,
  crystal_profile_id  uuid references public.crystal_profiles(id) on delete set null,
  price               numeric(12,2) not null default 0 check (price >= 0),
  sale_price          numeric(12,2) check (sale_price >= 0),
  currency            text not null default 'INR',
  stock_quantity      int not null default 0 check (stock_quantity >= 0),
  low_stock_threshold int not null default 3,
  featured            boolean not null default false,
  status              public.content_status not null default 'draft',
  published_at        timestamptz,
  created_by          uuid references public.admin_users(id) on delete set null,
  updated_by          uuid references public.admin_users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists products_status_idx      on public.products(status);
create index if not exists products_category_idx    on public.products(category_id);
create index if not exists products_subcategory_idx on public.products(subcategory_id);
create index if not exists products_featured_idx    on public.products(featured);
create index if not exists products_search_idx on public.products
  using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,'')));
create trigger products_updated   before update on public.products for each row execute function public.set_updated_at();
create trigger products_published before insert or update on public.products for each row execute function public.set_published_at();

-- ============================================================================
-- 2. product_images
-- ============================================================================
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  alt_text      text,
  is_primary    boolean not null default false,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);

-- 5b. collection_products (join)
create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete cascade,
  display_order int not null default 0,
  primary key (collection_id, product_id)
);

-- ============================================================================
-- 9. content  (Learn: articles / guides / videos / resources)
-- ============================================================================
create table if not exists public.content (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  content_type  public.content_type not null default 'article',
  excerpt       text,
  body          text,
  cover_image   text,
  author_id     uuid references public.admin_users(id) on delete set null,
  crystal_profile_id uuid references public.crystal_profiles(id) on delete set null,
  tags          text[],
  status        public.content_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger content_updated   before update on public.content for each row execute function public.set_updated_at();
create trigger content_published before insert or update on public.content for each row execute function public.set_published_at();

-- ============================================================================
-- 10. experiences
-- ============================================================================
create table if not exists public.experiences (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  type         text,
  description  text,
  cover_image  text,
  host_name    text,
  event_date   date,
  start_time   time,
  end_time     time,
  location     text,
  is_online    boolean not null default false,
  capacity     int,
  price        numeric(12,2),
  status       public.content_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger experiences_updated   before update on public.experiences for each row execute function public.set_updated_at();
create trigger experiences_published before insert or update on public.experiences for each row execute function public.set_published_at();

-- ============================================================================
-- 6. homepage_sections  (+ 7. homepage_section_items)
-- ============================================================================
create table if not exists public.homepage_sections (
  id            uuid primary key default gen_random_uuid(),
  section_type  public.section_type not null,
  title         text,
  subtitle      text,
  description   text,
  image_url     text,
  button_text   text,
  button_link   text,
  display_order int not null default 0,
  is_visible    boolean not null default true,
  status        public.content_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger homepage_sections_updated   before update on public.homepage_sections for each row execute function public.set_updated_at();
create trigger homepage_sections_published before insert or update on public.homepage_sections for each row execute function public.set_published_at();

create table if not exists public.homepage_section_items (
  id            uuid primary key default gen_random_uuid(),
  section_id    uuid not null references public.homepage_sections(id) on delete cascade,
  product_id    uuid references public.products(id) on delete cascade,
  category_id   uuid references public.categories(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  content_id    uuid references public.content(id) on delete cascade,
  display_order int not null default 0
);
create index if not exists hp_section_items_section_idx on public.homepage_section_items(section_id);

-- ============================================================================
-- 12. carts (+ cart_items)
-- ============================================================================
create table if not exists public.carts (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  session_id  text,
  status      public.cart_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists carts_customer_idx on public.carts(customer_id);
create index if not exists carts_session_idx  on public.carts(session_id);
create trigger carts_updated before update on public.carts for each row execute function public.set_updated_at();

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   int not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null,
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

-- ============================================================================
-- 13. orders (+ order_items with snapshots)
-- ============================================================================
create sequence if not exists public.order_seq start 1;

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text unique not null,
  customer_id        uuid references public.customers(id) on delete restrict,
  subtotal           numeric(12,2) not null default 0,
  discount           numeric(12,2) not null default 0,
  tax                numeric(12,2) not null default 0,
  shipping_fee       numeric(12,2) not null default 0,
  total_amount       numeric(12,2) not null default 0,
  currency           text not null default 'INR',
  payment_status     public.payment_status not null default 'unpaid',
  order_status       public.order_status  not null default 'pending',
  shipping_address   jsonb,
  transaction_id     text,
  delivery_tracking_id text,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_status_idx   on public.orders(order_status);
create index if not exists orders_created_idx  on public.orders(created_at);

create or replace function public.set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'MCA-' || to_char(now(),'YYYYMMDD') || '-'
      || lpad(nextval('public.order_seq')::text, 4, '0');
  end if;
  return new;
end $$;
create trigger orders_number  before insert on public.orders for each row execute function public.set_order_number();
create trigger orders_updated before update on public.orders for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid not null references public.orders(id) on delete cascade,
  product_id           uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  sku_snapshot         text,
  unit_price           numeric(12,2) not null,
  quantity             int not null check (quantity > 0),
  total_price          numeric(12,2) not null
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ============================================================================
-- 14. payments
-- ============================================================================
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references public.orders(id) on delete cascade,
  payment_gateway    text,
  gateway_payment_id text,
  amount             numeric(12,2) not null,
  currency           text not null default 'INR',
  status             public.payment_status not null default 'pending',
  paid_at            timestamptz,
  created_at         timestamptz not null default now()
);
create index if not exists payments_order_idx on public.payments(order_id);

-- ============================================================================
-- 15. inventory_transactions
-- ============================================================================
create table if not exists public.inventory_transactions (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  transaction_type public.inventory_txn_type not null,
  quantity         int not null,
  reference_id     uuid,
  note             text,
  created_at       timestamptz not null default now()
);
create index if not exists inventory_txn_product_idx on public.inventory_transactions(product_id);

-- ============================================================================
-- 17. publish_history  (audit trail)
-- ============================================================================
create table if not exists public.publish_history (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null,
  entity_id    uuid not null,
  action       public.publish_action not null,
  published_by uuid references public.admin_users(id) on delete set null,
  published_at timestamptz not null default now()
);
create index if not exists publish_history_entity_idx on public.publish_history(entity_type, entity_id);

-- ============================================================================
-- Row Level Security
--   Catalog tables: anon/authenticated may SELECT published rows only.
--   Everything else: service_role only (server-side).
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'admin_users','customers','categories','subcategories','collections',
    'collection_products','crystal_profiles','products','product_images',
    'content','experiences','homepage_sections','homepage_section_items',
    'carts','cart_items','orders','order_items','payments',
    'inventory_transactions','publish_history'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Public read of published catalog rows
create policy pub_categories        on public.categories        for select using (status = 'published');
create policy pub_subcategories     on public.subcategories     for select using (status = 'published');
create policy pub_collections       on public.collections       for select using (status = 'published');
create policy pub_crystal_profiles  on public.crystal_profiles  for select using (status = 'published');
create policy pub_experiences       on public.experiences       for select using (status = 'published');
create policy pub_content           on public.content           for select using (status = 'published');
create policy pub_homepage_sections on public.homepage_sections for select using (status = 'published' and is_visible);
create policy pub_products          on public.products          for select using (status = 'published');

-- Child tables that ride along with a visible parent (kept simple: public read)
create policy pub_product_images    on public.product_images        for select using (true);
create policy pub_collection_prod   on public.collection_products   for select using (true);
create policy pub_hp_items          on public.homepage_section_items for select using (true);

-- (No anon policies on customers/carts/orders/payments/etc. → service_role only.)

-- ============================================================================
-- Grants  (PostgREST needs table privileges in addition to RLS)
-- ============================================================================
grant usage on schema public to anon, authenticated, service_role;

grant select on
  public.categories, public.subcategories, public.collections,
  public.collection_products, public.crystal_profiles, public.products,
  public.product_images, public.content, public.experiences,
  public.homepage_sections, public.homepage_section_items
  to anon, authenticated;

-- service_role bypasses RLS but still needs explicit privileges
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
