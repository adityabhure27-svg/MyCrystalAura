/**
 * The Aura Crystals database types — match supabase/migrations (the publish-flow
 * schema). Written as `type` aliases (not `interface`) on purpose.
 */

export type ContentStatus = "draft" | "published" | "archived";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
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
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  banner_url: string | null;
  mobile_banner_url: string | null;
  display_order: number;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  collection_id: string | null;
  crystal_profile_id: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  stock_quantity: number;
  low_stock_threshold: number;
  featured: boolean;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type CrystalProfile = {
  id: string;
  name: string;
  slug: string;
  overview: string | null;
  chakra_association: string | null;
  zodiac_association: string | null;
  traditional_properties: string | null;
  care_instructions: string | null;
  cleansing_methods: string | null;
  charging_methods: string | null;
  main_image_url: string | null;
  status: ContentStatus;
};

export type Customer = {
  id: string;
  clerk_user_id: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  shipping_fee: number;
  total_amount: number;
  currency: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_address: Json | null;
  transaction_id: string | null;
  delivery_tracking_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerMetrics = {
  customer_id: string;
  name: string | null;
  email: string;
  order_count: number;
  total_spend: number;
  first_purchase: string | null;
  last_purchase: string | null;
  segment: CustomerSegment;
};

/** A product with its ordered image gallery. */
export type ProductWithImages = Product & { product_images: ProductImage[] };
