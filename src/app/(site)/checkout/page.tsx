import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { userId } = await auth();

  // Guests can shop freely — auth is required only here, at checkout.
  if (!userId) {
    return (
      <section className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="eyebrow">Complete your order</p>
        <h1 className="mt-3 text-2xl text-navy">Sign in to continue</h1>
        <p className="mx-auto mt-3 max-w-sm font-body text-sm text-slate">
          Your bag is saved. Sign in or create an account to check out — it only
          takes a moment.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <SignInButton
            mode="modal"
            fallbackRedirectUrl="/checkout"
            signUpFallbackRedirectUrl="/checkout"
          >
            <button className="rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory hover:bg-navy-700">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton
            mode="modal"
            fallbackRedirectUrl="/checkout"
            signInFallbackRedirectUrl="/checkout"
          >
            <button className="rounded-brand border border-navy/20 px-6 py-3 font-body text-sm font-semibold text-navy hover:border-gold">
              New here? Create your account
            </button>
          </SignUpButton>
        </div>
      </section>
    );
  }

  return <CheckoutForm />;
}
