"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/auth";

const BUCKET = "product-images";

export async function uploadCrystalImage(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("crystal_id") ?? "");
  const file = formData.get("file") as File | null;
  if (!id || !file || file.size === 0) return;

  const supabase = createAdminClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `crystals/${id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) return;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  await supabase
    .from("crystal_profiles")
    .update({ main_image_url: pub.publicUrl })
    .eq("id", id);

  revalidatePath(`/admin/crystals/${id}`);
  revalidatePath("/learn", "layout");
}

export async function removeCrystalImage(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("crystal_id") ?? "");
  if (!id) return;
  const supabase = createAdminClient();
  await supabase
    .from("crystal_profiles")
    .update({ main_image_url: null })
    .eq("id", id);
  revalidatePath(`/admin/crystals/${id}`);
  revalidatePath("/learn", "layout");
}
