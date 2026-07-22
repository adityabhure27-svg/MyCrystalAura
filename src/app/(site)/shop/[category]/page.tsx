import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/queries";
import { SHOP_CATEGORIES, CATEGORY_SLUGS } from "@/lib/content";

export async function generateMetadata(
  props: PageProps<"/shop/[category]">,
): Promise<Metadata> {
  const { category } = await props.params;
  const staticMatch = SHOP_CATEGORIES.find(
    (c) => CATEGORY_SLUGS[c.name] === category,
  );
  const title = staticMatch?.name ?? "Category";
  return { title, description: `Shop ${title} at CrystalAura.` };
}

export default async function CategoryPage(
  props: PageProps<"/shop/[category]">,
) {
  const { category } = await props.params;

  // Prefer the seeded static taxonomy for name/subcategories; fall back to DB.
  const staticMatch = SHOP_CATEGORIES.find(
    (c) => CATEGORY_SLUGS[c.name] === category,
  );
  const dbCategory = await getCategoryBySlug(category);
  if (!staticMatch && !dbCategory) notFound();

  const name = staticMatch?.name ?? dbCategory?.name ?? "Category";
  const products = await getProductsByCategory(category);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={name}
        description={
          staticMatch
            ? staticMatch.items.join(" · ")
            : (dbCategory?.description ?? "")
        }
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <Link
          href="/shop"
          className="font-body text-sm text-gold-deep hover:underline"
        >
          ← All categories
        </Link>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center">
            <p className="font-heading text-lg text-navy">
              No products here yet
            </p>
            <p className="mt-2 font-body text-sm text-slate">
              Products added in the Owner Portal will appear here automatically.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
