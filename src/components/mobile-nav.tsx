"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/learn", label: "Learn" },
  { href: "/experience", label: "Experience" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About Us" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center text-navy"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-cream shadow-xl">
            <div className="flex items-center justify-between border-b border-gold/15 px-5 py-4">
              <span className="font-heading text-lg text-navy">
                The Aura Crystals
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-navy"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col p-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-body text-base text-navy hover:bg-ivory-deep"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-2 border-t border-gold/15 p-3">
              <Show when="signed-in">
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 font-body text-base text-navy hover:bg-ivory-deep"
                >
                  My Orders
                </Link>
                <div className="flex items-center gap-3 px-3 py-3">
                  <UserButton />
                  <span className="font-body text-sm text-slate">Account</span>
                </div>
              </Show>
              <Show when="signed-out">
                <div className="flex flex-col gap-2 px-1">
                  <SignInButton mode="modal">
                    <button className="w-full rounded-brand border border-navy/20 px-4 py-2.5 font-body text-sm font-medium text-navy">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full rounded-brand bg-navy px-4 py-2.5 font-body text-sm font-medium text-ivory">
                      Create account
                    </button>
                  </SignUpButton>
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
