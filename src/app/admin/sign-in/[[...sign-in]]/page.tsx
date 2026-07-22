import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Admin Sign In" };

/**
 * Secure admin entry point. Separate from the customer /sign-in. Admin accounts
 * are provisioned (role set in Clerk), not self-registered, so no sign-up link.
 * After sign-in, users land on /admin where requireOwner() checks the role.
 */
export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy px-5 py-16">
      <div className="text-center">
        <Logo tone="light" />
        <p className="eyebrow mt-4 text-gold-soft">Admin Access</p>
      </div>
      <SignIn
        routing="path"
        path="/admin/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/admin"
      />
    </div>
  );
}
