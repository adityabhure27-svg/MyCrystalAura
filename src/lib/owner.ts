import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Category,
  CrystalProfile,
  CustomerMetrics,
  Order,
  Product,
  ProductWithImages,
  Subcategory,
} from "@/lib/database.types";

/**
 * Admin Portal reads — server-side with the service-role client (full access).
 * Return everything (incl. drafts). Degrade to empty/zero on error.
 */

export type DashboardStats = {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
};

async function count(
  table: "products" | "orders" | "customers",
): Promise<number> {
  const supabase = createAdminClient();
  const { count: c, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return c ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const [products, orders, customers] = await Promise.all([
    count("products"),
    count("orders"),
    count("customers"),
  ]);
  const { data: paid } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("payment_status", "paid");
  const revenue = (paid ?? []).reduce(
    (sum, o: { total_amount: number }) => sum + Number(o.total_amount ?? 0),
    0,
  );
  return { products, orders, customers, revenue };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getProductById(
  id: string,
): Promise<ProductWithImages | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return (data as ProductWithImages | null) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function listCrystalProfiles(): Promise<CrystalProfile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crystal_profiles")
    .select("*")
    .order("name", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getCrystalProfileById(
  id: string,
): Promise<CrystalProfile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crystal_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return (data as CrystalProfile | null) ?? null;
}

export async function listSubcategories(): Promise<Subcategory[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function listOrders(): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return [];
  return data ?? [];
}

export type ProductPerformance = {
  product_id: string;
  name: string;
  slug: string;
  category_id: string | null;
  units_sold: number;
  revenue: number;
};

export async function listProductPerformance(): Promise<ProductPerformance[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_performance")
    .select("*")
    .order("revenue", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data as ProductPerformance[] | null) ?? [];
}

export async function listCustomerMetrics(): Promise<CustomerMetrics[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("customer_metrics")
    .select("*")
    .order("total_spend", { ascending: false })
    .limit(200);
  if (error) return [];
  return (data as CustomerMetrics[] | null) ?? [];
}
