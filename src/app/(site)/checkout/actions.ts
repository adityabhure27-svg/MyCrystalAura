"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

type CartLine = { productId: string; quantity: number };

/**
 * Create an order from the client bag. The bag is re-priced server-side (never
 * trust client prices), the customer is upserted by clerk_user_id, stock is
 * decremented, and payment is mocked (paid) — a real gateway plugs in here.
 */
export async function placeOrder(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/checkout");

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    `${userId}@clerk.local`;
  const clerkName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;

  const address = {
    full_name: String(formData.get("full_name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address_line_1: String(formData.get("address_line_1") ?? ""),
    address_line_2: String(formData.get("address_line_2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    pincode: String(formData.get("pincode") ?? ""),
  };

  let cart: CartLine[] = [];
  try {
    cart = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    /* ignore */
  }
  cart = cart.filter((i) => i.productId && i.quantity > 0);
  if (cart.length === 0) redirect("/bag");

  const supabase = createAdminClient();

  // Upsert the customer record for this Clerk user.
  let customerId: string | undefined;
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  customerId = existing?.id;
  if (!customerId) {
    const { data: created } = await supabase
      .from("customers")
      .insert({
        clerk_user_id: userId,
        email,
        name: clerkName ?? (address.full_name || null),
        phone: address.phone || null,
      })
      .select("id")
      .single();
    customerId =
      created?.id ??
      (
        await supabase
          .from("customers")
          .select("id")
          .eq("email", email)
          .maybeSingle()
      ).data?.id;
  }
  if (!customerId) redirect("/bag?error=customer");

  // Re-price from the DB (published products only).
  const ids = cart.map((i) => i.productId);
  const { data: products } = await supabase
    .from("products")
    .select("id,name,sku,price,sale_price,stock_quantity")
    .in("id", ids)
    .eq("status", "published");
  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  const lines = cart
    .map((i) => {
      const p = byId.get(i.productId);
      if (!p) return null;
      const unit =
        p.sale_price != null && p.sale_price < p.price ? p.sale_price : p.price;
      const qty = Math.min(i.quantity, p.stock_quantity);
      if (qty <= 0) return null;
      return {
        product_id: p.id,
        product_name_snapshot: p.name,
        sku_snapshot: p.sku,
        unit_price: unit,
        quantity: qty,
        total_price: unit * qty,
      };
    })
    .filter(Boolean) as Array<{
    product_id: string;
    product_name_snapshot: string;
    sku_snapshot: string | null;
    unit_price: number;
    quantity: number;
    total_price: number;
  }>;
  if (lines.length === 0) redirect("/bag");

  const subtotal = lines.reduce((s, l) => s + l.total_price, 0);
  const shipping_fee = subtotal >= 5000 ? 0 : 100;
  const tax = 0;
  const total_amount = subtotal + shipping_fee + tax;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      subtotal,
      shipping_fee,
      tax,
      total_amount,
      payment_status: "pending",
      order_status: "pending",
      shipping_address: address,
    })
    .select("id, order_number")
    .single();
  if (error || !order) redirect("/bag?error=order");

  await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));

  // Stock is decremented on payment confirmation, not on order creation.
  redirect(`/checkout/pay/${order.order_number}`);
}

/**
 * UPI collect — no gateway yet: the customer pays the merchant VPA and confirms
 * with their reference. We trust the confirmation and mark the order paid; the
 * owner verifies against the bank statement.
 */
export async function confirmPayment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const orderNumber = String(formData.get("order_number") ?? "");
  const reference = String(formData.get("reference") ?? "").trim();
  if (!orderNumber) redirect("/bag");

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, payment_status, customers!inner(clerk_user_id), order_items(product_id, quantity)",
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  const ownerClerk = (
    order as { customers?: { clerk_user_id?: string } } | null
  )?.customers?.clerk_user_id;
  if (!order || ownerClerk !== userId) redirect("/bag");
  if (order.payment_status === "paid") redirect(`/order/${orderNumber}`);

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: "confirmed",
      transaction_id: reference || "UPI-" + crypto.randomUUID().slice(0, 10),
    })
    .eq("id", order.id);

  // Decrement stock now that payment is confirmed.
  const items = (order.order_items ?? []) as Array<{
    product_id: string | null;
    quantity: number;
  }>;
  for (const it of items) {
    if (!it.product_id) continue;
    const { data: p } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", it.product_id)
      .maybeSingle();
    if (p) {
      await supabase
        .from("products")
        .update({
          stock_quantity: Math.max(0, p.stock_quantity - it.quantity),
        })
        .eq("id", it.product_id);
      await supabase.from("inventory_transactions").insert({
        product_id: it.product_id,
        transaction_type: "purchase",
        quantity: -it.quantity,
        reference_id: order.id,
      });
    }
  }

  redirect(`/order/${orderNumber}`);
}
