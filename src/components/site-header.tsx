import Link from "next/link";
import { Logo } from "@/components/logo";
import { PILLARS } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {PILLARS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="font-body text-sm font-medium text-navy/80 transition-colors hover:text-gold-deep"
            >
              {p.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
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
          <Link
            href="/shop"
            className="rounded-brand bg-navy px-4 py-2 font-body text-sm font-medium text-ivory transition-colors hover:bg-navy-700"
          >
            Explore Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
