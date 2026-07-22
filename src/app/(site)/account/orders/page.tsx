import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/queries";
import type { Order } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export default async function MyOrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/account/orders");

  const supabase = createAdminClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const orders: Order[] = customer
    ? ((
        await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })
      ).data ?? [])
    : [];

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl text-navy">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center">
          <p className="font-heading text-lg text-navy">No orders yet</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-brand border border-gold/20 bg-white/60 p-4"
            >
              <div>
                <p className="font-body text-sm font-semibold text-navy">
                  {o.order_number}
                </p>
                <p className="font-body text-xs text-slate">
                  {new Date(o.created_at).toLocaleDateString("en-IN")} ·{" "}
                  <span className="text-gold-deep">{o.order_status}</span> ·{" "}
                  <span className="text-emerald">{o.payment_status}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-body text-sm font-semibold text-navy">
                  {formatPrice(o.total_amount, o.currency)}
                </span>
                <Link
                  href={`/order/${o.order_number}`}
                  className="font-body text-sm text-gold-deep hover:underline"
                >
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
