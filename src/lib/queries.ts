import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Category,
  Product,
  ProductWithImages,
} from "@/lib/database.types";

/**
 * Public storefront reads (Server Components). Run server-side with the
 * service-role client and are scoped to status='published'. Each returns a safe
 * empty result on error so pages render even if the DB is unreachable.
 */

export async function getPublishedCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) return null;
  return (data as Category | null) ?? null;
}

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductWithImages[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as ProductWithImages[] | null) ?? [];
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithImages[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories!inner(slug)")
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as ProductWithImages[] | null) ?? [];
}

export type ProductDetail = ProductWithImages & {
  crystal_profiles: { id: string; name: string; slug: string } | null;
};

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), crystal_profiles(id,name,slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) return null;
  return (data as ProductDetail | null) ?? null;
}

export async function searchProducts(term: string): Promise<Product[]> {
  const q = term.trim();
  if (!q) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .ilike("name", `%${q}%`)
    .limit(50);
  if (error) return [];
  return data ?? [];
}

export async function getPublishedCrystalProfiles(): Promise<
  import("@/lib/database.types").CrystalProfile[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crystal_profiles")
    .select("*")
    .eq("status", "published")
    .order("name", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getCrystalProfileBySlug(
  slug: string,
): Promise<import("@/lib/database.types").CrystalProfile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crystal_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) return null;
  return (data as import("@/lib/database.types").CrystalProfile | null) ?? null;
}

export async function getProductsByCrystalProfile(
  profileId: string,
): Promise<ProductWithImages[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("status", "published")
    .eq("crystal_profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as ProductWithImages[] | null) ?? [];
}

/** Format a numeric amount as INR (or the given currency). */
export function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
