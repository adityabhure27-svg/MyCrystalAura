/**
 * CrystalAura content model — mirrors the Brand Anchor Document (v1.0).
 * This is the single source of truth for navigation and static pages until
 * the catalog is backed by Supabase.
 */

export type Pillar = {
  slug: "shop" | "learn" | "experience" | "community";
  title: string;
  tagline: string;
  description: string;
};

export const PILLARS: Pillar[] = [
  {
    slug: "shop",
    title: "Shop",
    tagline: "Authentic products",
    description:
      "Discover authentic crystals, jewellery, and tools for healing, meditation, and conscious living.",
  },
  {
    slug: "learn",
    title: "Learn",
    tagline: "Trusted knowledge",
    description:
      "A dedicated educational space to understand crystals, wellness, meditation, and spiritual practices.",
  },
  {
    slug: "experience",
    title: "Experience",
    tagline: "Immersive wellness",
    description:
      "Healing sessions, workshops, retreats, and immersive wellness experiences.",
  },
  {
    slug: "community",
    title: "Community",
    tagline: "Grow together",
    description:
      "A place where members connect, share, learn, and grow together.",
  },
];

export type Category = {
  name: string;
  items: string[];
};

export const SHOP_CATEGORIES: Category[] = [
  {
    name: "Crystal Jewellery",
    items: [
      "Bracelets",
      "Pendants",
      "Necklaces",
      "Earrings",
      "Rings",
      "Anklets",
      "Malas",
      "Birthstone Jewellery",
      "Custom Jewellery",
    ],
  },
  {
    name: "Raw Crystals",
    items: [
      "Rough Stones",
      "Natural Clusters",
      "Geodes",
      "Mineral Specimens",
      "Display Pieces",
    ],
  },
  {
    name: "Polished Crystals",
    items: [
      "Tumbles",
      "Palm Stones",
      "Towers",
      "Spheres",
      "Hearts",
      "Pyramids",
      "Obelisks",
      "Free Forms",
    ],
  },
  {
    name: "Crystal Home & Office",
    items: [
      "Crystal Trees",
      "Salt Lamps",
      "Crystal Lamps",
      "Decorative Pieces",
      "Desk Decor",
      "Energy Decor",
    ],
  },
  {
    name: "Healing Crystal Kits",
    items: [
      "Chakra Kits",
      "Protection Kits",
      "Love Kits",
      "Wealth Kits",
      "Sleep Kits",
      "Starter Kits",
    ],
  },
  {
    name: "Sound Healing",
    items: [
      "Tibetan Singing Bowls",
      "Crystal Singing Bowls",
      "Bowl Sets",
      "Tuning Forks",
      "Chimes",
      "Mallets",
    ],
  },
  {
    name: "Meditation",
    items: [
      "Meditation Cushions",
      "Meditation Mats",
      "Mala Beads",
      "Meditation Journals",
      "Guided Meditation Resources",
    ],
  },
  {
    name: "Spiritual Products",
    items: [
      "Rudraksha",
      "Yantras",
      "Incense",
      "Camphor",
      "Puja Accessories",
      "Copper & Brass Products",
    ],
  },
  {
    name: "Wellness",
    items: [
      "Essential Oils",
      "Aroma Diffusers",
      "Smudging Products",
      "Palo Santo",
      "Sage",
      "Bath Salts",
    ],
  },
  {
    name: "Astrology",
    items: [
      "Birthstones",
      "Zodiac Stones",
      "Planetary Stones",
      "Nakshatra Stones",
      "Numerology Products",
    ],
  },
  {
    name: "Gifts",
    items: [
      "Gift Boxes",
      "Festival Gifts",
      "Wedding Gifts",
      "Corporate Gifts",
      "Personalized Gifts",
    ],
  },
  {
    name: "DIY Jewellery Supplies",
    items: [
      "Gemstone Beads",
      "Cabochons",
      "Jewellery Findings",
      "Elastic Cords",
      "Wires & Tools",
    ],
  },
];

export const LEARN_AREAS: string[] = [
  "Crystal Basics",
  "Crystal Identification",
  "Crystal Care",
  "Chakra Healing",
  "Crystal Grids",
  "Sound Healing",
  "Meditation",
  "Mindfulness",
  "Spiritual Living",
  "Astrology",
  "Wellness Guides",
];

export const ENCYCLOPEDIA_FIELDS: string[] = [
  "Overview",
  "Scientific Information",
  "Geological Formation",
  "Origin",
  "Color Variations",
  "Chakra Association",
  "Zodiac Association",
  "Traditional Healing Properties",
  "Care Guide",
  "Cleansing Methods",
  "Charging Methods",
  "Buying Guide",
  "FAQs",
];

export const EXPERIENCES: string[] = [
  "Sound Healing Sessions",
  "Guided Meditation",
  "Crystal Healing",
  "Workshops",
  "Retreats",
  "Wellness Events",
  "Consultations",
];

export const COMMUNITY_FEATURES: string[] = [
  "Memberships",
  "Discussion Groups",
  "Learning Circles",
  "Challenges",
  "Events",
  "Success Stories",
  "Practitioner Network",
];

export const BRAND_PROMISE: string[] = [
  "Authentic Products",
  "Trusted Knowledge",
  "Conscious Living",
  "Lifelong Learning",
  "Holistic Transformation",
];

export const COMING_SOON: string[] = [
  "Reiki",
  "Aura Healing",
  "EFT Tapping",
  "Breathwork",
  "Sacred Geometry",
  "Certification Programs",
];
