import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, formatPrice } from "@/lib/queries";
import { AddToBag } from "@/components/add-to-bag";

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.short_description ??
      product.description ??
      `${product.name} at The Aura Crystals.`,
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.product_images
    ?.slice()
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.display_order - b.display_order,
    );
  const hero = images?.[0];
  const onSale =
    product.sale_price != null && product.sale_price < product.price;
  const current = onSale ? product.sale_price! : product.price;
  const inStock = product.stock_quantity > 0;

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
                src={hero.image_url}
                alt={hero.alt_text ?? product.name}
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
                  src={img.image_url}
                  alt={img.alt_text ?? product.name}
                  className="aspect-square w-full rounded-lg border border-gold/15 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl text-navy">{product.name}</h1>
          {product.short_description && (
            <p className="mt-2 font-body text-slate">
              {product.short_description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="font-body text-xl font-semibold text-navy">
              {formatPrice(current, product.currency)}
            </span>
            {onSale && (
              <span className="font-body text-sm text-slate line-through">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>

          <p className="mt-2 font-body text-sm">
            {inStock ? (
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

          {product.crystal_profiles && (
            <Link
              href={`/learn/crystal/${product.crystal_profiles.slug}`}
              className="mt-4 inline-block font-body text-sm font-medium text-gold-deep hover:underline"
            >
              Learn about {product.crystal_profiles.name} →
            </Link>
          )}

          <AddToBag
            disabled={!inStock}
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: current,
              image: hero?.image_url ?? null,
            }}
          />
        </div>
      </div>
    </section>
  );
}
