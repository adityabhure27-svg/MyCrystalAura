import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getPublishedCrystalProfiles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Crystal Encyclopedia",
  description:
    "Explore crystals — their origins, characteristics, traditional associations, and care.",
};

export default async function EncyclopediaPage() {
  const crystals = await getPublishedCrystalProfiles();

  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Crystal Encyclopedia"
        description="Explore crystals, their origins, characteristics, traditional associations, and care — the science and the story."
      />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <Link href="/learn" className="font-body text-sm text-gold-deep hover:underline">
          ← The Crystal Universe
        </Link>

        {crystals.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {crystals.map((c) => (
              <Link
                key={c.id}
                href={`/learn/crystal/${c.slug}`}
                className="group overflow-hidden rounded-brand border border-gold/20 bg-white/60 transition-all hover:-translate-y-1 hover:border-gold"
              >
                <div className="aspect-square overflow-hidden bg-ivory-deep/40">
                  {c.main_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.main_image_url}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gold/40">
                      <svg width="44" height="50" viewBox="0 0 26 30" fill="none" aria-hidden>
                        <path d="M13 1.5 24 9v12l-11 7.5L2 21V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        <path d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M8 15h10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-heading text-base text-navy">{c.name}</h2>
                  <span className="mt-1 inline-block font-body text-xs font-medium text-gold-deep group-hover:translate-x-1">
                    Explore Crystal →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-10 text-center font-body text-sm text-slate">
            Crystal profiles will appear here as they are published.
          </p>
        )}
      </section>
    </>
  );
}
