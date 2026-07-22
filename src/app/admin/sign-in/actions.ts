"use server";

import { redirect } from "next/navigation";
import {
  verifyCredentials,
  createAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

export async function adminSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(email, password)) {
    redirect("/admin/sign-in?error=invalid");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function adminSignOut() {
  await clearAdminSession();
  redirect("/admin/sign-in");
}
