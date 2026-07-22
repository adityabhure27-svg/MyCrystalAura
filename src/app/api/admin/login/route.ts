import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, buildSessionCookie } from "@/lib/admin-auth";

/**
 * Native form POST target for admin login. Using a Route Handler (not a server
 * action) means the sign-in form submits on a plain button click without any
 * client JS — robust regardless of hydration.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!verifyCredentials(email, password)) {
    return NextResponse.redirect(
      new URL("/admin/sign-in?error=invalid", req.url),
      { status: 303 },
    );
  }

  const cookie = buildSessionCookie();
  const res = NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
