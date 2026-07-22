"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function BagBadge() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/bag"
      aria-label={`Bag${count ? `, ${count} items` : ""}`}
      className="relative text-navy/70 transition-colors hover:text-gold-deep"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 8h12l-1 12H7L6 8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 8a3 3 0 0 1 6 0"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-body text-[10px] font-semibold text-navy">
          {count}
        </span>
      )}
    </Link>
  );
}
