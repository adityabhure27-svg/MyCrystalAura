import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { PILLARS } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {PILLARS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="font-body text-sm font-medium text-navy/80 transition-colors hover:text-gold-deep"
            >
              {p.title}
            </Link>
          ))}
          <Link
            href="/about"
            className="font-body text-sm font-medium text-navy/80 transition-colors hover:text-gold-deep"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="text-navy/70 transition-colors hover:text-gold-deep"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>

          <Show when="signed-out">
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
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
