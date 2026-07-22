import { redirect } from "next/navigation";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

/**
 * Auth helpers backed by Clerk. Two roles only: customer (default) and admin.
 * Admin is granted via the Clerk user's `publicMetadata.role = "admin"`.
 */

export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function getRole(): Promise<"admin" | "customer" | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin" ? "admin" : "customer";
}

/**
 * Gate for the Owner/Admin portal. Redirects to sign-in if signed out, or home
 * if the signed-in user is not an admin. Returns the admin user id on success.
 */
export async function requireOwner(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/owner");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (user.publicMetadata?.role !== "admin") redirect("/?denied=admin");

  return userId;
}
