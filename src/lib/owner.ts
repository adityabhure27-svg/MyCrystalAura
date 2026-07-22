import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  CustomerMetrics,
  Order,
  Product,
  ProductWithImages,
} from "@/lib/database.types";

/**
 * Owner Portal reads. RLS restricts these to users with the owner role, so
 * they return everything (including unpublished products). Each degrades to a
 * safe empty/zero value on error so the portal renders before data exists.
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
  const supabase = await createClient();
  const { count: c, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return c ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const [products, orders, customers] = await Promise.all([
    count("products"),
    count("orders"),
    count("customers"),
  ]);

  const { data: paid } = await supabase
    .from("orders")
    .select("total")
    .eq("payment_status", "paid");
  const revenue = (paid ?? []).reduce(
    (sum, o: { total: number }) => sum + Number(o.total ?? 0),
    0,
  );

  return { products, orders, customers, revenue };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return (data as ProductWithImages | null) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function listOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false })
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_performance")
    .select("*")
    .order("revenue", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data as ProductPerformance[] | null) ?? [];
}

export async function listCustomerMetrics(): Promise<CustomerMetrics[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customer_metrics")
    .select("*")
    .order("total_spend", { ascending: false })
    .limit(200);
  if (error) return [];
  return (data as CustomerMetrics[] | null) ?? [];
}
