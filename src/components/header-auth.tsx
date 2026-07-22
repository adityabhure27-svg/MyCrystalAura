"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

/**
 * Client-side auth control for the header. Uses the `useUser` hook (client
 * context) rather than server `auth()`, so it works on public pages that are
 * intentionally NOT covered by clerkMiddleware — avoiding the Clerk handshake
 * redirect on the storefront.
 */
export function HeaderAuth() {
  const { isSignedIn } = useUser();

  if (isSignedIn) return <UserButton />;

  return (
    <div className="hidden items-center gap-3 md:flex">
      <SignInButton mode="modal">
        <button
          type="button"
          className="font-body text-sm font-medium text-navy/80 transition-colors hover:text-gold-deep"
        >
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button
          type="button"
          className="rounded-brand bg-navy px-4 py-2 font-body text-sm font-medium text-ivory transition-colors hover:bg-navy-700"
        >
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
