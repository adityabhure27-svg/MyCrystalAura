"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/app/(site)/checkout/actions";

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const inputClass =
  "mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold";

export function CheckoutForm() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="text-2xl text-navy">Your bag is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 100;
  const total = subtotal + shipping;
  const cartPayload = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  );

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl text-navy">Checkout</h1>

      <form action={placeOrder} className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <input type="hidden" name="cart" value={cartPayload} />

        {/* Delivery details */}
        <div className="rounded-brand border border-gold/20 bg-white/60 p-6">
          <h2 className="font-heading text-lg text-navy">Delivery details</h2>
          <div className="mt-5 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="font-body text-sm text-navy">
                Full name
                <input name="full_name" required className={inputClass} />
              </label>
              <label className="font-body text-sm text-navy">
                Phone
                <input name="phone" required className={inputClass} />
              </label>
            </div>
            <label className="font-body text-sm text-navy">
              Address line 1
              <input name="address_line_1" required className={inputClass} />
            </label>
            <label className="font-body text-sm text-navy">
              Address line 2 (optional)
              <input name="address_line_2" className={inputClass} />
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="font-body text-sm text-navy">
                City
                <input name="city" required className={inputClass} />
              </label>
              <label className="font-body text-sm text-navy">
                State
                <input name="state" required className={inputClass} />
              </label>
              <label className="font-body text-sm text-navy">
                Pincode
                <input name="pincode" required className={inputClass} />
              </label>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-brand border border-gold/20 bg-white/60 p-6">
          <h2 className="font-heading text-lg text-navy">Order summary</h2>
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li
                key={i.productId}
                className="flex justify-between gap-3 font-body text-sm text-navy"
              >
                <span className="text-slate">
                  {i.name} × {i.quantity}
                </span>
                <span>{inr(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-gold/15 pt-4 font-body text-sm">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : inr(shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-navy">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
          >
            Place order &amp; pay {inr(total)}
          </button>
          <p className="mt-2 text-center font-body text-[11px] text-slate">
            Payment is simulated for this demo.
          </p>
        </div>
      </form>
    </section>
  );
}
