"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the bag once the order is confirmed. */
export function ClearBag() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
