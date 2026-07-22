import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LEARN_AREAS, ENCYCLOPEDIA_FIELDS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "The educational foundation of The Aura Crystals — a crystal encyclopedia and guided learning across chakra healing, sound healing, meditation, and mindful living.",
};

export default function LearnPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Trusted knowledge, education-first"
        description="The Aura Crystals Learn helps you understand crystals, wellness, meditation, and spiritual practices — so you feel confident before you purchase."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl text-navy">Learning areas</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {LEARN_AREAS.map((area) => (
            <span
              key={area}
              className="rounded-full border border-gold/25 bg-white/60 px-4 py-2 font-body text-sm text-navy/80"
            >
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white/50 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">Crystal Encyclopedia</p>
          <h2 className="mt-2 text-2xl text-navy">
            Every crystal, fully documented
          </h2>
          <p className="mt-3 max-w-2xl font-body text-slate">
            Each crystal has its own knowledge page structured around a
            consistent set of fields — from geology to healing traditions to care.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENCYCLOPEDIA_FIELDS.map((field) => (
              <div
                key={field}
                className="rounded-brand border border-gold/15 bg-ivory px-5 py-4 font-body text-sm text-navy/80"
              >
                {field}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
