import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, formatPrice } from "@/lib/queries";

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} at CrystalAura.`,
  };
}

export default async function ProductPage(
  props: PageProps<"/product/[slug]">,
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.product_images
    ?.slice()
    .sort((a, b) => a.position - b.position);
  const hero = images?.[0];
  const specs = (product.specifications ?? {}) as Record<string, unknown>;
  const specEntries = Object.entries(specs);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href="/shop"
        className="font-body text-sm text-gold-deep hover:underline"
      >
        ← Back to Shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-brand border border-gold/20 bg-ivory-deep/40">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.url}
                alt={hero.alt ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gold/30">
                <svg width="72" height="84" viewBox="0 0 26 30" fill="none" aria-hidden>
                  <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          {images && images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt ?? product.name}
                  className="aspect-square w-full rounded-lg border border-gold/15 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl text-navy">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-body text-xl font-semibold text-navy">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <span className="font-body text-sm text-slate line-through">
                  {formatPrice(product.compare_at_price, product.currency)}
                </span>
              )}
          </div>

          <p className="mt-2 font-body text-sm">
            {product.stock > 0 ? (
              <span className="text-emerald">In stock</span>
            ) : (
              <span className="text-slate">Currently unavailable</span>
            )}
          </p>

          {product.description && (
            <p className="mt-6 font-body leading-relaxed text-slate">
              {product.description}
            </p>
          )}

          <button
            type="button"
            disabled={product.stock <= 0}
            className="mt-8 w-full rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
          >
            Add to Cart
          </button>

          {specEntries.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-lg text-navy">Specifications</h2>
              <dl className="mt-4 divide-y divide-gold/15 border-t border-gold/15">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 py-2.5">
                    <dt className="font-body text-sm capitalize text-slate">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-body text-sm text-navy">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
