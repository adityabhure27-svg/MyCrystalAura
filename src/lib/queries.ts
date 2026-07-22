import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  ProductWithImages,
} from "@/lib/database.types";

/**
 * Shared read queries for the public website (Server Components).
 * Each returns a safe empty result on error so pages render even before the
 * database is provisioned.
 */

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as ProductWithImages[] | null) ?? [];
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories!inner(slug)")
    .eq("is_published", true)
    .eq("categories.slug", categorySlug)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as ProductWithImages[] | null) ?? [];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) return null;
  return (data as ProductWithImages | null) ?? null;
}

export async function searchProducts(
  term: string,
): Promise<Product[]> {
  const q = term.trim();
  if (!q) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .ilike("name", `%${q}%`)
    .limit(50);
  if (error) return [];
  return data ?? [];
}

/** Format a numeric amount as INR (or the given currency). */
export function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
