import Link from "next/link";
import {
  PILLARS,
  BRAND_PROMISE,
  SHOP_CATEGORIES,
  LEARN_AREAS,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, rgba(200,161,70,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 pt-24 pb-20 text-center">
          <p className="eyebrow">Nature&apos;s Energy · Your Transformation</p>
          <h1 className="mt-5 text-balance text-4xl leading-tight text-navy sm:text-5xl md:text-6xl">
            Discover, heal, and elevate your aura
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty font-body text-lg leading-relaxed text-slate">
            The Aura Crystals is India&apos;s premium holistic wellness marketplace —
            authentic crystals, trusted knowledge, and meaningful experiences for
            conscious living.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
            >
              Explore the Collection
            </Link>
            <Link
              href="/learn"
              className="rounded-brand border border-navy/20 px-6 py-3 font-body text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold-deep"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      {/* Brand promise strip */}
      <section className="border-y border-gold/15 bg-ivory-deep/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 font-body text-sm text-navy/70">
          {BRAND_PROMISE.map((promise, i) => (
            <span key={promise} className="flex items-center gap-8">
              {i > 0 && <span className="text-gold">✦</span>}
              {promise}
            </span>
          ))}
        </div>
      </section>

      {/* Four pillars */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="rule-gold" />
          <h2 className="mt-4 text-3xl text-navy">One ecosystem, four pillars</h2>
          <p className="mt-3 max-w-xl font-body text-slate">
            More than a store — a place to discover, learn, experience, and
            transform.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.slug}
              href={`/${pillar.slug}`}
              className="group rounded-brand border border-gold/20 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <p className="eyebrow">{pillar.tagline}</p>
              <h3 className="mt-3 text-xl text-navy">{pillar.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate">
                {pillar.description}
              </p>
              <span className="mt-4 inline-block font-body text-sm font-medium text-gold-deep transition-transform group-hover:translate-x-1">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop preview */}
      <section className="bg-white/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop</p>
              <h2 className="mt-2 text-3xl text-navy">Curated for every intention</h2>
            </div>
            <Link
              href="/shop"
              className="font-body text-sm font-medium text-gold-deep hover:underline"
            >
              View all categories →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SHOP_CATEGORIES.slice(0, 8).map((category) => (
              <div
                key={category.name}
                className="rounded-brand border border-gold/15 bg-ivory p-5 transition-colors hover:border-gold"
              >
                <h3 className="font-heading text-base text-navy">
                  {category.name}
                </h3>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-slate">
                  {category.items.slice(0, 3).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn teaser */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-10 rounded-brand bg-navy p-10 text-ivory md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow text-gold-soft">Learn</p>
            <h2 className="mt-3 text-3xl text-ivory">
              Educated before you purchase
            </h2>
            <p className="mt-4 font-body leading-relaxed text-ivory/70">
              The Aura Crystals Learn is the educational foundation of the platform — a
              crystal encyclopedia and guided learning across chakra healing,
              sound healing, meditation, and mindful living.
            </p>
            <Link
              href="/learn"
              className="mt-7 inline-block rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
            >
              Enter the Learn hub
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-2.5">
            {LEARN_AREAS.slice(0, 8).map((area) => (
              <li
                key={area}
                className="rounded-lg border border-ivory/15 px-4 py-3 font-body text-sm text-ivory/80"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
