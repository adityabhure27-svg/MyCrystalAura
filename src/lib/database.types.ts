/**
 * The Aura Crystals database types.
 *
 * Hand-authored to match supabase/migrations. Once the schema is live, these
 * can be regenerated with `supabase gen types typescript`.
 *
 * NOTE: written as `type` aliases (not `interface`) on purpose — with the
 * Supabase generic helpers, interfaces can collapse the schema to `never`.
 */

export type UserRole = "customer" | "owner";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type CustomerSegment =
  | "new"
  | "first_time_buyer"
  | "returning"
  | "active"
  | "inactive"
  | "high_value"
  | "frequent_buyer";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  specifications: Json;
  price: number;
  compare_at_price: number | null;
  currency: string;
  sku: string | null;
  stock: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
  created_at: string;
};

export type Customer = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_amount: number;
  total: number;
  currency: string;
  transaction_id: string | null;
  delivery_tracking_id: string | null;
  shipping_address: Json | null;
  notes: string | null;
  placed_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
};

export type CustomerMetrics = {
  customer_id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  order_count: number;
  total_spend: number;
  first_purchase: string | null;
  last_purchase: string | null;
  segment: CustomerSegment;
};

/** Helper: a product with its ordered image gallery joined in. */
export type ProductWithImages = Product & { product_images: ProductImage[] };
