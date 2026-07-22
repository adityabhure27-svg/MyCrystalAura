import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SHOP_CATEGORIES, CATEGORY_SLUGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Discover authentic crystals, jewellery, sound healing, meditation, and spiritual products for conscious living.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Authentic products, curated with intention"
        description="Every piece is chosen for authenticity and quality — from raw crystals and jewellery to sound healing and meditation essentials."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/shop/${CATEGORY_SLUGS[category.name]}`}
              className="group block rounded-brand border border-gold/20 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <h2 className="font-heading text-lg text-navy group-hover:text-gold-deep">
                {category.name}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-gold/25 bg-ivory px-3 py-1 font-body text-xs text-navy/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center font-body text-sm text-slate">
          Select a category to browse its products.
        </p>
      </section>
    </>
  );
}
