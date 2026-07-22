import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role (secret) key.
 *
 * Bypasses RLS — NEVER import this into a Client Component. Used for admin
 * writes and for reads of customer/commerce data. Public catalog reads also go
 * through this (server-side) and are scoped to status='published' in the query.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
