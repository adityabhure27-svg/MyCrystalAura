"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

function parse(formData: FormData) {
  const saleRaw = String(formData.get("sale_price") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "draft");
  return {
    name: String(formData.get("name") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim() || null,
    short_description:
      String(formData.get("short_description") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    subcategory_id: String(formData.get("subcategory_id") ?? "") || null,
    crystal_profile_id: String(formData.get("crystal_profile_id") ?? "") || null,
    price: num(formData.get("price")),
    sale_price: saleRaw ? num(formData.get("sale_price")) : null,
    stock_quantity: num(formData.get("stock_quantity")),
    low_stock_threshold: num(formData.get("low_stock_threshold")) || 3,
    featured: formData.get("featured") === "on",
    status: (statusRaw === "published" ? "published" : "draft") as
      | "draft"
      | "published",
  };
}

function revalidateStorefront() {
  revalidatePath("/admin/products");
  revalidatePath("/shop", "layout");
  revalidatePath("/");
}

export async function saveProduct(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const fields = parse(formData);
  if (!fields.name) {
    redirect(
      `/admin/products/${id || "new"}?error=${encodeURIComponent("Name is required")}`,
    );
  }

  const supabase = createAdminClient();

  if (id) {
    const { error } = await supabase
      .from("products")
      .update(fields)
      .eq("id", id);
    if (error)
      redirect(`/admin/products/${id}?error=${encodeURIComponent(error.message)}`);
  } else {
    const slug = slugify(fields.name) || crypto.randomUUID().slice(0, 8);
    const { error } = await supabase
      .from("products")
      .insert({ ...fields, slug });
    if (error)
      redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/products");
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidateStorefront();
  redirect("/admin/products");
}

/** Toggle publish state from the list view (draft <-> published). */
export async function setPublished(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const publish = formData.get("publish") === "true";
  if (!id) redirect("/admin/products");
  const supabase = createAdminClient();
  await supabase
    .from("products")
    .update({ status: publish ? "published" : "draft" })
    .eq("id", id);
  revalidateStorefront();
}
