import Link from "next/link";
import { Logo } from "@/components/logo";
import { BagBadge } from "@/components/bag-badge";
import { MobileNav } from "@/components/mobile-nav";
import { HeaderAuth } from "@/components/header-auth";
import { PILLARS } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-1.5">
          <MobileNav />
          <Logo />
        </div>

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

        <div className="flex items-center gap-3 sm:gap-4">
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

          <BagBadge />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
