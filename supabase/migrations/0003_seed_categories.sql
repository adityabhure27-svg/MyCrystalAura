-- ============================================================================
-- MyCrystalAura — Seed the 12 main shop categories (Brand Anchor taxonomy)
-- Idempotent: safe to re-run. Subcategories can be added via the Owner Portal.
-- ============================================================================

insert into public.categories (name, slug, position) values
  ('Crystal Jewellery',      'crystal-jewellery',      1),
  ('Raw Crystals',           'raw-crystals',           2),
  ('Polished Crystals',      'polished-crystals',      3),
  ('Crystal Home & Office',  'crystal-home-office',    4),
  ('Healing Crystal Kits',   'healing-crystal-kits',   5),
  ('Sound Healing',          'sound-healing',          6),
  ('Meditation',             'meditation',             7),
  ('Spiritual Products',     'spiritual-products',     8),
  ('Wellness',               'wellness',               9),
  ('Astrology',              'astrology',             10),
  ('Gifts',                  'gifts',                 11),
  ('DIY Jewellery Supplies', 'diy-jewellery-supplies',12)
on conflict (slug) do nothing;
