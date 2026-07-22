"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function BagPage() {
  const { items, setQty, remove, subtotal, ready } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl text-navy">Your Bag</h1>

      {ready && items.length === 0 && (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center">
          <p className="font-heading text-lg text-navy">Your bag is empty</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-gold/15">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gold/15 bg-ivory-deep/40">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-heading text-base text-navy hover:text-gold-deep"
                  >
                    {item.name}
                  </Link>
                  <span className="font-body text-sm text-slate">
                    {inr(item.price)}
                  </span>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <div className="flex items-center rounded-lg border border-gold/25">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQty(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-navy hover:text-gold-deep"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center font-body text-sm text-navy">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQty(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-navy hover:text-gold-deep"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="font-body text-xs text-slate hover:text-navy"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="font-body text-sm font-semibold text-navy">
                  {inr(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-brand border border-gold/20 bg-white/60 p-6">
            <h2 className="font-heading text-lg text-navy">Summary</h2>
            <div className="mt-4 flex justify-between font-body text-sm text-slate">
              <span>Subtotal</span>
              <span className="font-semibold text-navy">{inr(subtotal)}</span>
            </div>
            <p className="mt-1 font-body text-xs text-slate">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 block rounded-brand bg-gold px-6 py-3 text-center font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center font-body text-sm text-gold-deep hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
