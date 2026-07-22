import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries";
import { FeaturedProductCard } from "@/components/featured-product-card";

const INTENTIONS = [
  { label: "Calm & Balance", d: "M12 3c3 3 5 5 5 8a5 5 0 0 1-10 0c0-3 2-5 5-8Z" },
  { label: "Love & Connection", d: "M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5C19 15.5 12 20 12 20Z" },
  { label: "Focus & Clarity", d: "M12 4v2m0 12v2m8-8h-2M6 12H4m13.6-5.6-1.4 1.4M7.8 16.2l-1.4 1.4m11.2 0-1.4-1.4M7.8 7.8 6.4 6.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" },
  { label: "Protection", d: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" },
  { label: "Confidence", d: "M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.9 1-5.5-4-3.9L9.5 8 12 3Z" },
  { label: "Spiritual Growth", d: "M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" },
  { label: "Abundance", d: "M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10Z" },
  { label: "Just Curious", d: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7m0 3h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" },
];

const VALUES = [
  { t: "Authentic", d: "100% genuine crystals" },
  { t: "Holistic", d: "Balance your mind, body & soul" },
  { t: "Mindful", d: "Products for conscious living" },
  { t: "Sustainable", d: "Ethical sourcing & eco-friendly" },
  { t: "Community", d: "Join a like-minded healing community" },
];

const UNIVERSE = [
  { t: "Crystal Encyclopedia", d: "A–Z guide of crystals and their properties" },
  { t: "Care & Cleansing", d: "Cleanse, charge and care for your crystals" },
  { t: "Guides & Articles", d: "Practical guides for mindful living" },
  { t: "Find Your Crystal", d: "Discover crystals that align with your intentions" },
  { t: "Rituals & Practices", d: "Simple rituals to invite positive energy" },
];

const TRUST = [
  "Ethically Sourced",
  "Secure Payments",
  "Fast Shipping",
  "Easy Returns",
  "Happy Customers",
];

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2 md:gap-10 md:py-20">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl leading-[1.08] text-navy sm:text-5xl md:text-6xl">
              Nature&apos;s Energy.
              <br />
              <span className="italic text-gold">Your Transformation.</span>
            </h1>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-slate">
              Authentic crystals, conscious living and mindful experiences to
              heal, balance and elevate your aura.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="w-full rounded-brand bg-navy px-7 py-3.5 text-center font-body text-sm font-semibold uppercase tracking-wide text-ivory transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Shop Crystals
              </Link>
              <Link
                href="/learn"
                className="w-full rounded-brand border border-navy/25 px-7 py-3.5 text-center font-body text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:border-gold hover:text-gold-deep sm:w-auto"
              >
                Explore the Universe ✦
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {[
                "100% Genuine Crystals",
                "Secure Payments",
                "Loved by 10,000+ Customers",
                "Easy Returns & Exchange",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold">✦</span>
                  <span className="font-body text-xs leading-snug text-navy/70">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual (placeholder until product photography is uploaded) */}
          <div className="relative order-1 md:order-2">
            <div
              className="aspect-[4/3] rounded-brand border border-gold/20"
              style={{
                background:
                  "radial-gradient(120% 120% at 70% 20%, rgba(200,161,70,0.22), rgba(247,244,238,0.6) 55%, rgba(236,229,214,0.9))",
              }}
            >
              <div className="flex h-full items-center justify-center text-gold/40">
                <svg width="120" height="138" viewBox="0 0 26 30" fill="none" aria-hidden>
                  <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                  <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M2 9l6 6M24 9l-6 6M8 15h10" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.7" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-4 right-4 rounded-brand bg-navy px-5 py-3 text-center shadow-lg">
              <p className="font-heading text-sm tracking-wide text-ivory">
                Energy. Balance.
              </p>
              <p className="font-heading text-sm tracking-wide text-gold">
                Transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Intention */}
      <section className="bg-ivory-deep/30 py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="eyebrow">Find what calls to you</p>
          <h2 className="mt-2 text-3xl text-navy">Shop by Intention</h2>
          <div className="mx-auto mt-10 flex max-w-3xl gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-y-8 md:overflow-visible md:pb-0">
            {INTENTIONS.map((it) => (
              <Link
                key={it.label}
                href="/shop"
                className="group flex w-20 shrink-0 flex-col items-center gap-2 md:w-auto"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-white text-gold-deep transition-all group-hover:-translate-y-1 group-hover:border-gold">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d={it.d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-body text-xs leading-tight text-navy/80">
                  {it.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Crystals */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl text-navy">Featured Crystals</h2>
          <Link
            href="/shop"
            className="font-body text-sm font-medium uppercase tracking-wide text-gold-deep hover:underline"
          >
            View all products →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <FeaturedProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-10 text-center font-body text-sm text-slate">
            Featured products will appear here once published in the admin.
          </p>
        )}
      </section>

      {/* Value strip */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {VALUES.map((v) => (
            <div key={v.t} className="text-center">
              <p className="font-heading text-sm uppercase tracking-wide text-gold">
                {v.t}
              </p>
              <p className="mt-1 font-body text-xs leading-snug text-ivory/70">
                {v.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Crystal Universe (Learn) */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">The Crystal Universe</p>
            <h2 className="mt-2 text-3xl leading-tight text-navy">
              Learn. Explore. Understand.
            </h2>
            <p className="mt-4 font-body text-slate">
              Dive deep into the world of crystals — their meanings, origins,
              care guides and how they can support your journey.
            </p>
            <Link
              href="/learn"
              className="mt-6 inline-block rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-ivory hover:bg-navy-700"
            >
              Explore &amp; Learn
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIVERSE.map((u) => (
              <Link
                key={u.t}
                href="/learn"
                className="group rounded-brand border border-gold/15 bg-white/60 p-5 transition-all hover:-translate-y-1 hover:border-gold"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-3 font-heading text-base text-navy">{u.t}</h3>
                <p className="mt-1 font-body text-xs leading-relaxed text-slate">
                  {u.d}
                </p>
                <span className="mt-3 inline-block font-body text-xs font-medium text-gold-deep group-hover:translate-x-1">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="border-t border-gold/15 bg-ivory-deep/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 font-body text-xs uppercase tracking-wide text-navy/70">
          {TRUST.map((t, i) => (
            <span key={t} className="flex items-center gap-8">
              {i > 0 && <span className="text-gold/50">·</span>}
              {t}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
