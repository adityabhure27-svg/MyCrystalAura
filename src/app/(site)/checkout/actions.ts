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
      payment_status: "paid", // mock payment
      order_status: "confirmed",
      shipping_address: address,
      transaction_id: "MOCK-" + crypto.randomUUID().slice(0, 12),
    })
    .select("id, order_number")
    .single();
  if (error || !order) redirect("/bag?error=order");

  await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));

  // Decrement stock + record inventory movement.
  for (const l of lines) {
    const p = byId.get(l.product_id)!;
    await supabase
      .from("products")
      .update({ stock_quantity: Math.max(0, p.stock_quantity - l.quantity) })
      .eq("id", l.product_id);
    await supabase.from("inventory_transactions").insert({
      product_id: l.product_id,
      transaction_type: "purchase",
      quantity: -l.quantity,
      reference_id: order.id,
    });
  }

  redirect(`/order/${order.order_number}`);
}
