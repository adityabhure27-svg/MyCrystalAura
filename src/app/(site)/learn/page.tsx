import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCrystalProfiles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "The Crystal Universe",
  description:
    "Understand the stone. Discover the story. Find what resonates with you — a complete crystal knowledge universe from beginner to collector.",
};

const START_HERE = [
  { t: "What is a crystal?", d: "A solid whose atoms sit in an ordered, repeating structure — and how that differs from a mineral, rock or gemstone." },
  { t: "How crystals form", d: "From cooling magma, hot mineral-rich fluids, evaporation, metamorphism, and inside geodes." },
  { t: "Understand properties", d: "Colour, hardness (Mohs), lustre, transparency, cleavage, habit — how crystals are really identified." },
];

const CARE = [
  { t: "Cleaning", d: "Removing dirt & residue — safely, and crystal-by-crystal." },
  { t: "Cleansing", d: "Traditional practices to symbolically reset a crystal." },
  { t: "Charging", d: "Moonlight, sound, selenite and other traditions." },
  { t: "Storage", d: "Protect fragile pieces, avoid scratches & moisture." },
];

const PATH = [
  "What is a crystal?",
  "How crystals form",
  "Identify them",
  "Crystal properties",
  "Crystal families",
  "Meet individual crystals",
  "History & culture",
  "Spiritual traditions",
  "Crystal care",
  "Choose your crystal",
];

export default async function LearnPage() {
  const crystals = await getPublishedCrystalProfiles();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-gold/15 bg-navy text-ivory">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="eyebrow text-gold-soft">The Crystal Universe</p>
          <h1 className="mt-3 text-4xl text-ivory sm:text-5xl">
            Understand the stone. Discover the story.
          </h1>
          <p className="mt-5 font-body text-lg leading-relaxed text-ivory/70">
            A complete crystal knowledge universe — start at &ldquo;what is a
            crystal?&rdquo; and journey through geology, identification, care,
            history and tradition, all the way to finding what resonates with
            you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/learn/crystals"
              className="rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy hover:-translate-y-0.5"
            >
              Explore Crystals
            </Link>
            <Link
              href="#start-here"
              className="rounded-brand border border-ivory/25 px-6 py-3 font-body text-sm font-semibold text-ivory hover:border-gold"
            >
              Start Here
            </Link>
          </div>
        </div>
      </section>

      {/* Start here */}
      <section id="start-here" className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow">Begin your journey</p>
        <h2 className="mt-2 text-3xl text-navy">Start here</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {START_HERE.map((s) => (
            <div
              key={s.t}
              className="rounded-brand border border-gold/20 bg-white/60 p-6"
            >
              <h3 className="font-heading text-lg text-navy">{s.t}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Encyclopedia preview */}
      <section className="bg-ivory-deep/30 py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Crystal Encyclopedia</p>
              <h2 className="mt-2 text-3xl text-navy">Meet the crystals</h2>
            </div>
            <Link
              href="/learn/crystals"
              className="font-body text-sm font-medium text-gold-deep hover:underline"
            >
              View all →
            </Link>
          </div>
          {crystals.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {crystals.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={`/learn/crystal/${c.slug}`}
                  className="group overflow-hidden rounded-brand border border-gold/20 bg-white/70 transition-all hover:-translate-y-1 hover:border-gold"
                >
                  <div className="flex aspect-square items-center justify-center bg-ivory-deep/40 text-gold/40">
                    {c.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.main_image_url} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <svg width="40" height="46" viewBox="0 0 26 30" fill="none" aria-hidden>
                        <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading text-sm text-navy">{c.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 font-body text-sm text-slate">
              Crystal profiles are being added.
            </p>
          )}
        </div>
      </section>

      {/* Learning path */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow">The learning path</p>
        <h2 className="mt-2 text-3xl text-navy">From beginner to collector</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PATH.map((step, i) => (
            <li
              key={step}
              className="rounded-brand border border-gold/15 bg-white/60 p-4"
            >
              <span className="font-heading text-sm text-gold-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 font-body text-sm text-navy">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Care */}
      <section className="bg-ivory-deep/30 py-14">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">Crystal care</p>
          <h2 className="mt-2 text-3xl text-navy">Care for your crystals</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARE.map((c) => (
              <div key={c.t} className="rounded-brand border border-gold/20 bg-white/60 p-5">
                <h3 className="font-heading text-base text-navy">{c.t}</h3>
                <p className="mt-1 font-body text-sm leading-relaxed text-slate">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science vs tradition */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="rounded-brand border border-gold/20 bg-white/60 p-8">
          <h2 className="font-heading text-xl text-navy">
            Science and tradition, kept clear
          </h2>
          <p className="mt-3 font-body leading-relaxed text-slate">
            We separate what science knows — mineral composition, hardness,
            formation, locality — from what traditions believe. Associations with
            healing, energy, chakras or zodiac signs are presented as cultural and
            spiritual traditions, never as established medical facts. Crystals are
            not a substitute for professional healthcare.
          </p>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center text-ivory">
          <h2 className="text-3xl text-ivory">Your journey starts here</h2>
          <p className="mt-3 font-body text-ivory/70">
            There&apos;s always more to discover.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/learn/crystals" className="rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy hover:-translate-y-0.5">
              Explore the Encyclopedia
            </Link>
            <Link href="/shop" className="rounded-brand border border-ivory/25 px-6 py-3 font-body text-sm font-semibold text-ivory hover:border-gold">
              Visit the Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
