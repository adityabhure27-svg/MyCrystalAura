import Link from "next/link";
import { formatPrice } from "@/lib/queries";
import type { ProductWithImages } from "@/lib/database.types";

export function ProductCard({ product }: { product: ProductWithImages }) {
  const image = product.product_images
    ?.slice()
    .sort((a, b) => a.position - b.position)[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-brand border border-gold/20 bg-white/60 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10"
    >
      <div className="aspect-square overflow-hidden bg-ivory-deep/40">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt ?? product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gold/40">
            <svg width="40" height="46" viewBox="0 0 26 30" fill="none" aria-hidden>
              <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M8 15h10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base text-navy">{product.name}</h3>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="font-body text-sm font-semibold text-navy">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="font-body text-xs text-slate line-through">
              {formatPrice(product.compare_at_price, product.currency)}
            </span>
          )}
          {product.stock <= 0 && (
            <span className="ml-auto rounded-full bg-slate/10 px-2 py-0.5 font-body text-[11px] text-slate">
              Sold out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
