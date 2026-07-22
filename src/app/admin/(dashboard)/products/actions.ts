"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parse(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const compareRaw = String(formData.get("compare_at_price") ?? "").trim();
  return {
    name,
    description: String(formData.get("description") ?? "").trim() || null,
    price: Number(formData.get("price") ?? 0),
    compare_at_price: compareRaw ? Number(compareRaw) : null,
    stock: Number(formData.get("stock") ?? 0),
    sku: String(formData.get("sku") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

/** Create (no id) or update (id present) a product. */
export async function saveProduct(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const fields = parse(formData);

  if (!fields.name) {
    redirect(
      `/admin/products/${id || "new"}?error=${encodeURIComponent("Name is required")}`,
    );
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("products")
      .update(fields)
      .eq("id", id);
    if (error) {
      redirect(`/admin/products/${id}?error=${encodeURIComponent(error.message)}`);
    }
  } else {
    const slug = slugify(fields.name) || crypto.randomUUID().slice(0, 8);
    const { error } = await supabase
      .from("products")
      .insert({ ...fields, slug });
    if (error) {
      redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/products");

  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

/** Toggle publish state from the list view. */
export async function setPublished(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("publish") === "true";
  if (!id) redirect("/admin/products");

  const supabase = await createClient();
  await supabase.from("products").update({ is_published: next }).eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
