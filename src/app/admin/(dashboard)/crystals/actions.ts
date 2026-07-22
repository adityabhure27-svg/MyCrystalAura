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

const FIELDS = [
  "overview",
  "scientific_information",
  "geological_formation",
  "origin",
  "colour_variations",
  "chakra_association",
  "zodiac_association",
  "traditional_properties",
  "care_instructions",
  "cleansing_methods",
  "charging_methods",
  "buying_guide",
] as const;

function parse(formData: FormData) {
  const out: Record<string, unknown> = {
    name: String(formData.get("name") ?? "").trim(),
    status:
      String(formData.get("status") ?? "draft") === "published"
        ? "published"
        : "draft",
  };
  for (const f of FIELDS) {
    out[f] = String(formData.get(f) ?? "").trim() || null;
  }
  return out as { name: string; status: "draft" | "published" } & Record<
    string,
    unknown
  >;
}

function revalidateLearn() {
  revalidatePath("/admin/crystals");
  revalidatePath("/learn", "layout");
}

export async function saveCrystal(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const fields = parse(formData);
  if (!fields.name) {
    redirect(
      `/admin/crystals/${id || "new"}?error=${encodeURIComponent("Name is required")}`,
    );
  }

  const supabase = createAdminClient();
  if (id) {
    const { error } = await supabase
      .from("crystal_profiles")
      .update(fields)
      .eq("id", id);
    if (error)
      redirect(`/admin/crystals/${id}?error=${encodeURIComponent(error.message)}`);
  } else {
    const slug = slugify(fields.name) || crypto.randomUUID().slice(0, 8);
    const { error } = await supabase
      .from("crystal_profiles")
      .insert({ ...fields, slug });
    if (error)
      redirect(`/admin/crystals/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateLearn();
  redirect("/admin/crystals");
}

export async function deleteCrystal(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/crystals");
  const supabase = createAdminClient();
  await supabase.from("crystal_profiles").delete().eq("id", id);
  revalidateLearn();
  redirect("/admin/crystals");
}

export async function setCrystalPublished(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const publish = formData.get("publish") === "true";
  if (!id) redirect("/admin/crystals");
  const supabase = createAdminClient();
  await supabase
    .from("crystal_profiles")
    .update({ status: publish ? "published" : "draft" })
    .eq("id", id);
  revalidateLearn();
}
