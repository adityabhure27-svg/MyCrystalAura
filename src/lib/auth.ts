import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

/**
 * Gate for the Owner/Admin portal. Admin uses its own credential gate
 * (see src/lib/admin-auth.ts), separate from Clerk (which handles customers).
 * Redirects to the admin sign-in when there is no valid admin session.
 */
export async function requireOwner(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/sign-in");
  }
}
