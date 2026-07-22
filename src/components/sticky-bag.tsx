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

/** Persistent checkout affordance on mobile — only visible when the bag has items. */
export function StickyBag() {
  const { count, subtotal, ready } = useCart();
  if (!ready || count === 0) return null;

  return (
    <Link
      href="/bag"
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-3 rounded-brand bg-navy px-4 py-3 text-ivory shadow-lg md:hidden"
    >
      <span className="flex items-center gap-2 font-body text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {count} {count === 1 ? "item" : "items"} · {inr(subtotal)}
      </span>
      <span className="rounded-md bg-gold px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-navy">
        View Bag
      </span>
    </Link>
  );
}
