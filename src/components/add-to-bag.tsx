"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";

export function AddToBag({
  product,
  disabled,
}: {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className="mt-8 w-full rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
    >
      {added ? "Added to bag ✓" : "Add to Bag"}
    </button>
  );
}
