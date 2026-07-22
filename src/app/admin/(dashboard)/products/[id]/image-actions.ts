"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/auth";

const BUCKET = "product-images";

export async function uploadProductImage(formData: FormData) {
  await requireOwner();
  const productId = String(formData.get("product_id") ?? "");
  const file = formData.get("file") as File | null;
  if (!productId || !file || file.size === 0) return;

  const supabase = createAdminClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  await supabase.from("product_images").insert({
    product_id: productId,
    image_url: pub.publicUrl,
    is_primary: (count ?? 0) === 0,
    display_order: count ?? 0,
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop", "layout");
  revalidatePath("/");
}

export async function deleteProductImage(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("image_id") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  if (!id) return;

  const supabase = createAdminClient();
  const { data: img } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("product_images").delete().eq("id", id);

  // Best-effort removal from storage.
  if (img?.image_url) {
    const marker = `/object/public/${BUCKET}/`;
    const idx = img.image_url.indexOf(marker);
    if (idx >= 0) {
      await supabase.storage
        .from(BUCKET)
        .remove([img.image_url.slice(idx + marker.length)]);
    }
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop", "layout");
  revalidatePath("/");
}
