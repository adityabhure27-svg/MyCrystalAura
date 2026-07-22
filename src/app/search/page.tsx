import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { formatPrice, searchProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Search",
  description: "Search authentic crystals and wellness products at CrystalAura.",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const term = typeof q === "string" ? q : "";
  const results = term ? await searchProducts(term) : [];

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={term ? `Results for “${term}”` : "Search"}
        description={
          term
            ? `${results.length} product${results.length === 1 ? "" : "s"} found`
            : "Find authentic crystals, jewellery, and wellness essentials."
        }
      />

      <section className="mx-auto max-w-3xl px-5 py-12">
        <form action="/search" method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={term}
            placeholder="Search products…"
            className="flex-1 rounded-brand border border-gold/25 bg-white/70 px-4 py-3 font-body text-sm text-navy outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
          >
            Search
          </button>
        </form>

        {term && results.length === 0 && (
          <p className="mt-10 text-center font-body text-sm text-slate">
            No products matched “{term}”. Try a different term.
          </p>
        )}

        {results.length > 0 && (
          <ul className="mt-8 divide-y divide-gold/15">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-gold-deep"
                >
                  <span className="font-body text-sm text-navy">
                    {product.name}
                  </span>
                  <span className="font-body text-sm font-semibold text-navy">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
