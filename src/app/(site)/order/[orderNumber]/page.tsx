import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/queries";
import { ClearBag } from "@/components/clear-bag";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

type OrderItem = {
  id: string;
  product_name_snapshot: string;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export default async function OrderPage(
  props: PageProps<"/order/[orderNumber]">,
) {
  const { orderNumber } = await props.params;
  const { userId } = await auth();
  if (!userId) notFound();

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers!inner(clerk_user_id), order_items(*)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  const ownerClerkId = (
    order as { customers?: { clerk_user_id?: string } } | null
  )?.customers?.clerk_user_id;
  if (!order || ownerClerkId !== userId) notFound();

  const items = (order.order_items ?? []) as OrderItem[];

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <ClearBag />

      <div className="rounded-brand border border-gold/20 bg-white/60 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl text-navy">Order confirmed</h1>
        <p className="mt-2 font-body text-sm text-slate">
          Thank you for your purchase. A confirmation is on its way.
        </p>
        <p className="mt-4 font-body text-sm text-navy">
          Order ID:{" "}
          <span className="font-semibold">{order.order_number}</span>
        </p>
      </div>

      <div className="mt-6 rounded-brand border border-gold/20 bg-white/50 p-6">
        <h2 className="font-heading text-lg text-navy">Summary</h2>
        <ul className="mt-4 divide-y divide-gold/15">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between gap-3 py-2.5 font-body text-sm">
              <span className="text-slate">
                {it.product_name_snapshot} × {it.quantity}
              </span>
              <span className="text-navy">{formatPrice(it.total_price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-gold/15 pt-4 font-body text-sm">
          <div className="flex justify-between text-slate">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate">
            <span>Shipping</span>
            <span>{order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between pt-1 font-semibold text-navy">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
        <p className="mt-4 font-body text-sm">
          Payment: <span className="text-emerald">{order.payment_status}</span> ·
          Status: <span className="text-gold-deep">{order.order_status}</span>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/account/orders"
          className="rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
        >
          Track my orders
        </Link>
        <Link
          href="/shop"
          className="rounded-brand border border-navy/20 px-6 py-3 font-body text-sm font-semibold text-navy hover:border-gold"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
