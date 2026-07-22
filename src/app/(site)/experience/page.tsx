import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { EXPERIENCES, COMING_SOON } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Immersive wellness experiences — sound healing sessions, guided meditation, crystal healing, workshops, retreats, and consultations.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Immersive wellness, in practice"
        description="Beyond products — healing sessions, workshops, retreats, and consultations to help you begin or deepen your wellness journey."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((experience) => (
            <div
              key={experience}
              className="rounded-brand border border-gold/20 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <div className="rule-gold" />
              <h2 className="mt-4 font-heading text-lg text-navy">
                {experience}
              </h2>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-brand border border-gold/20 bg-ivory-deep/50 p-8">
          <p className="eyebrow">Coming soon</p>
          <h2 className="mt-2 text-xl text-navy">Part of the long-term vision</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {COMING_SOON.map((item) => (
              <span
                key={item}
                className="rounded-full border border-gold/25 bg-white/60 px-4 py-1.5 font-body text-sm text-navy/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
