import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BRAND_PROMISE } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "CrystalAura is India's premium holistic wellness marketplace — authentic crystals, trusted knowledge, and conscious living.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Energy. Balance. Transformation."
        description="CrystalAura is India's premium holistic wellness marketplace — more than a store, an ecosystem to discover, learn, experience, and transform."
      />

      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-body text-lg leading-relaxed text-slate">
          We bring together authentic crystals, trusted knowledge, and meaningful
          experiences for conscious living. Every product is chosen for
          authenticity and quality, and every page is built to help you feel
          confident before you purchase.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {BRAND_PROMISE.map((promise) => (
            <div
              key={promise}
              className="rounded-brand border border-gold/20 bg-white/60 px-5 py-4 font-body text-sm text-navy"
            >
              {promise}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
