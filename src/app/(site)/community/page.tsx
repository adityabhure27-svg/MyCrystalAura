import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { COMMUNITY_FEATURES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Community",
  description:
    "A place where members connect, share, learn, and grow together — memberships, learning circles, events, and a practitioner network.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Grow together"
        description="CrystalAura Community is where members connect, share, and support one another on a shared wellness journey."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_FEATURES.map((feature) => (
            <div
              key={feature}
              className="rounded-brand border border-gold/20 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <h2 className="font-heading text-lg text-navy">{feature}</h2>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-brand bg-navy p-10 text-center text-ivory md:p-14">
          <h2 className="text-2xl text-ivory">Join a like-minded community</h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-ivory/70">
            Be the first to know when memberships and learning circles open.
          </p>
          <button
            type="button"
            className="mt-7 rounded-brand bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
          >
            Notify me
          </button>
        </div>
      </section>
    </>
  );
}
