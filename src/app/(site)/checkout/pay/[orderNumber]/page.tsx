import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/queries";
import { UPI_ID, UPI_PAYEE, upiLink } from "@/lib/payment";
import { confirmPayment } from "@/app/(site)/checkout/actions";

export const metadata: Metadata = {
  title: "Pay with UPI",
  robots: { index: false, follow: false },
};

export default async function PayPage(
  props: PageProps<"/checkout/pay/[orderNumber]">,
) {
  const { orderNumber } = await props.params;
  const { userId } = await auth();
  if (!userId) notFound();

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers!inner(clerk_user_id)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  const ownerClerk = (
    order as { customers?: { clerk_user_id?: string } } | null
  )?.customers?.clerk_user_id;
  if (!order || ownerClerk !== userId) notFound();
  if (order.payment_status === "paid") redirect(`/order/${orderNumber}`);

  const link = upiLink({
    amount: Number(order.total_amount),
    note: `Order ${order.order_number}`,
  });
  const qr = await QRCode.toDataURL(link, { margin: 1, width: 240 });

  return (
    <section className="mx-auto max-w-md px-5 py-12">
      <h1 className="text-2xl text-navy">Pay with UPI</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Order {order.order_number} ·{" "}
        <span className="font-semibold text-navy">
          {formatPrice(order.total_amount)}
        </span>
      </p>

      <div className="mt-6 rounded-brand border border-gold/20 bg-white/70 p-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="UPI QR code"
          className="mx-auto h-52 w-52 rounded-lg border border-gold/15"
        />
        <p className="mt-3 font-body text-sm text-slate">
          Scan with any UPI app, or
        </p>
        <a
          href={link}
          className="mt-3 inline-block rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
        >
          Pay {formatPrice(order.total_amount)} with UPI app
        </a>
        <div className="mt-4 rounded-lg bg-ivory-deep/50 px-4 py-2 font-body text-sm">
          <span className="text-slate">UPI ID: </span>
          <span className="font-semibold text-navy">{UPI_ID}</span>
          <span className="block text-xs text-slate">{UPI_PAYEE}</span>
        </div>
      </div>

      <form
        action={confirmPayment}
        className="mt-6 rounded-brand border border-gold/20 bg-white/60 p-6"
      >
        <input type="hidden" name="order_number" value={order.order_number} />
        <label className="font-body text-sm text-navy">
          UPI reference / UTR (after paying)
          <input
            name="reference"
            placeholder="e.g. 4179XXXXXXX"
            className="mt-1.5 w-full rounded-brand border border-gold/25 bg-white px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold"
          />
        </label>
        <button
          type="submit"
          className="mt-4 w-full rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
        >
          I&apos;ve paid — confirm order
        </button>
        <p className="mt-2 text-center font-body text-[11px] text-slate">
          Payment is verified manually against the merchant statement.
        </p>
      </form>
    </section>
  );
}
