import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCrystalProfiles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Learn — The Crystal Universe",
  description:
    "Learn. Understand. Connect. Step by step, explore the science, stories and spiritual wisdom behind nature's treasures.",
};

const SIDEBAR = [
  { label: "Learning Path", sub: "Start Your Journey", href: "#top", active: true },
  { label: "Crystal Basics", sub: "The Fundamentals", href: "#start" },
  { label: "Crystal Science", sub: "Formation & Properties", href: "#topics" },
  { label: "Crystal Encyclopedia", sub: "A–Z Crystal Library", href: "/learn/crystals" },
  { label: "Spiritual Wisdom", sub: "Chakras, Zodiac & Traditions", href: "#topics" },
  { label: "Crystal Care", sub: "Cleansing, Charging & Storage", href: "#topics" },
  { label: "Guides & Courses", sub: "In-depth Learning", href: "#topics" },
  { label: "Glossary", sub: "Terms & Definitions", href: "#topics" },
  { label: "FAQ", sub: "Common Questions", href: "#topics" },
];

const PATH = [
  { step: "Beginner", d: "Start with the basics of crystals." },
  { step: "Explore", d: "Understand properties & types." },
  { step: "Connect", d: "Discover spiritual wisdom & meanings." },
  { step: "Care", d: "Learn how to cleanse, charge & protect." },
  { step: "Apply", d: "Use crystals in daily life with intention." },
  { step: "Master", d: "Deepen your knowledge & personal practice." },
];

const TOPICS = [
  { t: "Crystal Science", d: "Learn the science behind crystal formation, structure and properties.", c: "#7c5cbf", href: "/learn/crystals" },
  { t: "Spiritual Wisdom", d: "Explore chakras, zodiac signs and ancient traditions around crystals.", c: "#d98aa0", href: "/learn/crystals" },
  { t: "Crystal Care", d: "Master cleansing, charging, storing and caring for your crystals.", c: "#6baa7e", href: "/learn/crystals" },
  { t: "Crystal Encyclopedia", d: "Your A–Z guide to crystals and their unique energies.", c: "#c8a146", href: "/learn/crystals" },
  { t: "Guides & Courses", d: "In-depth guides and courses to expand your knowledge.", c: "#4a6fa5", href: "/learn/crystals" },
  { t: "Myths & Facts", d: "Separate beliefs from facts and understand the truth.", c: "#8a6fc0", href: "/learn/crystals" },
];

const CONTINUE = [
  { t: "What is a Crystal?", m: "5 min read", active: true },
  { t: "How Crystals Form", m: "7 min read" },
  { t: "Crystal Properties Explained", m: "6 min read" },
  { t: "Types of Crystals", m: "8 min read" },
];

function Glyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 30" fill="none" aria-hidden>
      <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M8 15h10" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
    </svg>
  );
}

export default async function LearnPage() {
  const crystals = await getPublishedCrystalProfiles();

  return (
    <div id="top" className="mx-auto max-w-7xl px-5 py-8 lg:grid lg:grid-cols-[248px_1fr] lg:gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <p className="eyebrow">Learn</p>
        <nav className="mt-5 flex flex-col gap-1">
          {SIDEBAR.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-start gap-3 rounded-brand px-3 py-2.5 transition-colors ${
                item.active
                  ? "bg-navy text-ivory"
                  : "text-navy hover:bg-ivory-deep/60"
              }`}
            >
              <span className={item.active ? "text-gold-soft" : "text-gold-deep"}>
                <Glyph />
              </span>
              <span>
                <span className="block font-body text-sm font-medium">{item.label}</span>
                <span className={`block font-body text-xs ${item.active ? "text-ivory/60" : "text-slate"}`}>
                  {item.sub}
                </span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-brand border border-gold/20 bg-white/60 p-5 text-center">
          <h3 className="font-heading text-base text-navy">Not sure where to begin?</h3>
          <p className="mt-2 font-body text-xs text-slate">
            Find the perfect crystal for you in 2 minutes.
          </p>
          <Link
            href="/learn/crystals"
            className="mt-4 inline-block rounded-brand bg-navy px-5 py-2 font-body text-xs font-semibold uppercase tracking-wide text-ivory hover:bg-navy-700"
          >
            Find my crystal
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        {/* Hero */}
        <section className="overflow-hidden rounded-brand bg-ivory-deep/30">
          <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:p-8">
            <div>
              <h1 className="text-4xl leading-[1.1] text-navy">
                Learn. Understand. Connect.
                <br />
                <span className="italic text-gold">
                  Your Journey into the Crystal Universe.
                </span>
              </h1>
              <p className="mt-4 max-w-md font-body text-slate">
                Step by step, explore the science, stories and spiritual wisdom
                behind nature&apos;s treasures.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="#start"
                  className="rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-ivory hover:bg-navy-700"
                >
                  Start Your Journey
                </Link>
                <Link href="#path" className="flex items-center gap-2 font-body text-sm font-medium text-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/25">▶</span>
                  How it works
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div
                className="flex aspect-square w-full max-w-xs items-center justify-center rounded-full text-gold/50"
                style={{ background: "radial-gradient(circle at 50% 40%, rgba(200,161,70,0.18), rgba(124,92,191,0.14) 60%, transparent)" }}
              >
                <svg width="120" height="138" viewBox="0 0 26 30" fill="none" aria-hidden>
                  <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                  <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M2 9l6 6M24 9l-6 6M8 15h10" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.7" />
                </svg>
              </div>
              {["Knowledge", "Awareness", "Connection"].map((label, i) => (
                <span
                  key={label}
                  className={`absolute font-body text-[11px] uppercase tracking-wide text-navy/60 ${
                    ["top-0 left-1/2 -translate-x-1/2", "left-0 top-1/2 -translate-y-1/2", "right-0 top-1/2 -translate-y-1/2"][i]
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Learning path */}
        <section id="path" className="py-12 text-center">
          <h2 className="text-3xl text-navy">Your Learning Path</h2>
          <p className="mt-2 font-body text-slate">
            A simple path to help you grow from curious to confident.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {PATH.map((p, i) => (
              <div key={p.step} className="flex flex-col items-center">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full border ${i === 0 ? "border-gold bg-white text-gold-deep" : "border-gold/25 text-gold-deep/70"}`}>
                  <Glyph />
                </span>
                <span className="mt-3 font-body text-[11px] uppercase tracking-wide text-slate">
                  Step {i + 1}
                </span>
                <span className="font-heading text-sm text-navy">{p.step}</span>
                <span className="mt-1 font-body text-xs leading-snug text-slate">{p.d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Start your journey */}
        <section id="start" className="rounded-brand border border-gold/15 bg-white/50 p-6 md:p-8">
          <h2 className="font-heading text-2xl text-navy">Start Your Journey</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative flex aspect-video items-center justify-center rounded-brand bg-navy/90 text-ivory/70">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">▶</span>
                <span className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 font-body text-[11px] text-ivory">
                  5:24 min
                </span>
              </div>
              <div>
                <p className="font-body text-[11px] uppercase tracking-wide text-gold-deep">
                  Beginner · 5 min read
                </p>
                <h3 className="mt-1 font-heading text-xl text-navy">What is a Crystal?</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate">
                  Everything begins here. Learn what crystals are, how they form,
                  and why people have been drawn to them for thousands of years.
                </p>
                <ul className="mt-3 space-y-1.5 font-body text-sm text-navy/80">
                  <li>✓ The difference between crystal, mineral & rock</li>
                  <li>✓ Where crystals come from</li>
                  <li>✓ Why crystals have unique shapes & colours</li>
                </ul>
                <Link
                  href="/learn/crystals"
                  className="mt-4 inline-block rounded-brand bg-navy px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wide text-ivory hover:bg-navy-700"
                >
                  Read lesson →
                </Link>
              </div>
            </div>

            <div className="rounded-brand border border-gold/15 bg-ivory-deep/30 p-5">
              <h3 className="font-heading text-sm text-navy">Continue Learning</h3>
              <ul className="mt-4 space-y-2">
                {CONTINUE.map((c) => (
                  <li
                    key={c.t}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 font-body text-sm ${c.active ? "bg-white text-navy" : "text-slate"}`}
                  >
                    <span>
                      <span className="block">{c.t}</span>
                      <span className="text-xs text-slate">{c.m}</span>
                    </span>
                    <span className="text-gold-deep">{c.active ? "▶" : "🔒"}</span>
                  </li>
                ))}
              </ul>
              <Link href="#path" className="mt-4 inline-block font-body text-xs font-semibold uppercase tracking-wide text-gold-deep">
                View full path →
              </Link>
            </div>
          </div>
        </section>

        {/* Explore by topic */}
        <section id="topics" className="py-12 text-center">
          <h2 className="text-3xl text-navy">Explore by Topic</h2>
          <p className="mt-2 font-body text-slate">Dive deeper into what interests you most.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TOPICS.map((t) => (
              <Link
                key={t.t}
                href={t.href}
                className="group flex flex-col items-center rounded-brand border border-gold/15 bg-white/60 p-5 text-center transition-all hover:-translate-y-1 hover:border-gold"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: t.c }}
                >
                  <Glyph />
                </span>
                <h3 className="mt-3 font-heading text-sm text-navy">{t.t}</h3>
                <p className="mt-1 font-body text-xs leading-snug text-slate">{t.d}</p>
                <span className="mt-2 text-gold-deep group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Community band */}
        <section className="overflow-hidden rounded-brand bg-navy">
          <div className="grid items-center gap-6 p-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-heading text-2xl text-ivory">
                Knowledge is the first step.
                <br />
                Connection is the destination.
              </h2>
              <p className="mt-3 font-body text-sm text-ivory/70">
                Keep learning, stay curious, and let crystals guide you.
              </p>
              <Link
                href="/community"
                className="mt-6 inline-block rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-navy hover:-translate-y-0.5"
              >
                Join our community
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-ivory">
              {[
                { n: `${crystals.length || 0}+`, l: "Crystal profiles" },
                { n: "Expert", l: "Researched content" },
                { n: "Always", l: "Growing" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-heading text-xl text-gold">{s.n}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wide text-ivory/60">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
