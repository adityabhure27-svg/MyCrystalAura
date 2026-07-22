"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductWithImages } from "@/lib/database.types";

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function FeaturedProductCard({
  product,
}: {
  product: ProductWithImages;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.product_images
    ?.slice()
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.display_order - b.display_order,
    )[0];
  const onSale =
    product.sale_price != null && product.sale_price < product.price;
  const current = onSale ? product.sale_price! : product.price;
  const soldOut = product.stock_quantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-brand border border-gold/15 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10">
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="aspect-square overflow-hidden bg-ivory-deep/40">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.image_url}
              alt={image.alt_text ?? product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gold/40">
              <svg width="46" height="53" viewBox="0 0 26 30" fill="none" aria-hidden>
                <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M8 15h10" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
              </svg>
            </div>
          )}
        </div>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading text-base text-navy hover:text-gold-deep">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="mt-1 font-body text-xs text-slate">
            {product.short_description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-body text-sm font-semibold text-navy">
              {inr(current)}
            </span>
            {onSale && (
              <span className="font-body text-xs text-slate line-through">
                {inr(product.price)}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: current,
                image: image?.image_url ?? null,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1400);
            }}
            className="rounded-md bg-navy px-3 py-1.5 font-body text-[11px] font-semibold uppercase tracking-wide text-ivory transition-colors hover:bg-navy-700 disabled:opacity-50"
          >
            {soldOut ? "Sold out" : added ? "Added ✓" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
