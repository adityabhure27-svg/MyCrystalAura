-- ============================================================================
-- The Aura Crystals — Crystal Jewellery MOC seed
-- Owner + 12 categories + subcategories + 2 crystal profiles + 2 products.
-- Idempotent (on conflict do nothing). Products are seeded 'published' so the
-- storefront shows them immediately; the draft→publish flow still applies.
-- ============================================================================

-- Owner
insert into public.admin_users (name, email, role)
values ('The Aura Crystals Owner', 'admin@mycrystalaura.com', 'owner')
on conflict (email) do nothing;

-- 12 main categories (published)
insert into public.categories (name, slug, display_order, status) values
  ('Crystal Jewellery','crystal-jewellery',1,'published'),
  ('Raw Crystals','raw-crystals',2,'published'),
  ('Polished Crystals','polished-crystals',3,'published'),
  ('Crystal Home & Office','crystal-home-office',4,'published'),
  ('Healing Crystal Kits','healing-crystal-kits',5,'published'),
  ('Sound Healing','sound-healing',6,'published'),
  ('Meditation','meditation',7,'published'),
  ('Spiritual Products','spiritual-products',8,'published'),
  ('Wellness','wellness',9,'published'),
  ('Astrology','astrology',10,'published'),
  ('Gifts','gifts',11,'published'),
  ('DIY Jewellery Supplies','diy-jewellery-supplies',12,'published')
on conflict (slug) do nothing;

-- Subcategories under Crystal Jewellery (MOC)
insert into public.subcategories (category_id, name, slug, display_order, status)
select c.id, v.name, v.slug, v.ord, 'published'
from public.categories c
join (values ('Bracelets','bracelets',1),('Pendants','pendants',2),
             ('Necklaces','necklaces',3),('Earrings','earrings',4),
             ('Rings','rings',5)) as v(name, slug, ord) on true
where c.slug = 'crystal-jewellery'
on conflict (category_id, slug) do nothing;

-- Crystal profiles (published)
insert into public.crystal_profiles (name, slug, overview, chakra_association, zodiac_association, care_instructions, cleansing_methods, charging_methods, status) values
  ('Amethyst','amethyst','A calming violet quartz associated with intuition, clarity, and spiritual growth.','Third Eye · Crown','Pisces · Virgo · Aquarius','Keep away from prolonged direct sunlight to preserve colour.','Running water, moonlight, or sound.','Moonlight or on a selenite plate.','published'),
  ('Rose Quartz','rose-quartz','The stone of universal love — gentle pink quartz for compassion and emotional healing.','Heart','Taurus · Libra','Wipe gently; avoid harsh chemicals.','Moonlight or smudging.','Moonlight; avoid strong sun.','published')
on conflict (slug) do nothing;

-- MOC products (published, featured)
insert into public.products
  (sku, name, slug, short_description, description, category_id, subcategory_id, crystal_profile_id,
   price, stock_quantity, low_stock_threshold, featured, status)
select
  'CRY-JWL-001','Amethyst Energy Bracelet','amethyst-energy-bracelet',
  'Natural amethyst beads · stretch fit · handmade',
  'Handcrafted Amethyst bracelet made with natural crystal beads for calm, clarity and balance.',
  c.id, sb.id, cp.id, 2299, 20, 3, true, 'published'
from public.categories c
join public.subcategories sb on sb.category_id = c.id and sb.slug = 'bracelets'
join public.crystal_profiles cp on cp.slug = 'amethyst'
where c.slug = 'crystal-jewellery'
on conflict (sku) do nothing;

insert into public.products
  (sku, name, slug, short_description, description, category_id, subcategory_id, crystal_profile_id,
   price, stock_quantity, low_stock_threshold, featured, status)
select
  'CRY-JWL-002','Rose Quartz Heart Pendant','rose-quartz-heart-pendant',
  'Rose quartz · gold-tone chain · gift-ready',
  'A heart-cut Rose Quartz pendant on a gold-tone chain — the stone of universal love.',
  c.id, sb.id, cp.id, 1899, 15, 3, true, 'published'
from public.categories c
join public.subcategories sb on sb.category_id = c.id and sb.slug = 'pendants'
join public.crystal_profiles cp on cp.slug = 'rose-quartz'
where c.slug = 'crystal-jewellery'
on conflict (sku) do nothing;
