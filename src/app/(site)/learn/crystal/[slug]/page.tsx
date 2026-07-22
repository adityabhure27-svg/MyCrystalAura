import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCrystalProfileBySlug,
  getProductsByCrystalProfile,
  getPublishedCrystalProfiles,
} from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export async function generateMetadata(
  props: PageProps<"/learn/crystal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const c = await getCrystalProfileBySlug(slug);
  if (!c) return { title: "Crystal not found" };
  return {
    title: `${c.name} — Crystal Profile`,
    description: c.overview ?? `Learn about ${c.name}.`,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gold/15 pt-6">
      <h2 className="font-heading text-xl text-navy">{title}</h2>
      <div className="mt-3 font-body leading-relaxed text-slate">{children}</div>
    </div>
  );
}

export default async function CrystalProfilePage(
  props: PageProps<"/learn/crystal/[slug]">,
) {
  const { slug } = await props.params;
  const crystal = await getCrystalProfileBySlug(slug);
  if (!crystal) notFound();

  const [products, all] = await Promise.all([
    getProductsByCrystalProfile(crystal.id),
    getPublishedCrystalProfiles(),
  ]);
  const related = all.filter((c) => c.id !== crystal.id).slice(0, 4);

  const hasScience =
    crystal.scientific_information ||
    crystal.geological_formation ||
    crystal.origin ||
    crystal.colour_variations;
  const hasTraditions =
    crystal.traditional_properties ||
    crystal.chakra_association ||
    crystal.zodiac_association;
  const hasCare =
    crystal.care_instructions ||
    crystal.cleansing_methods ||
    crystal.charging_methods;

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <nav className="font-body text-xs text-slate">
        <Link href="/learn" className="hover:text-gold-deep">Learn</Link> ·{" "}
        <Link href="/learn/crystals" className="hover:text-gold-deep">
          Encyclopedia
        </Link>{" "}
        · <span className="text-navy">{crystal.name}</span>
      </nav>

      <div className="mt-4 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="eyebrow">Crystal Profile</p>
          <h1 className="mt-2 text-4xl text-navy">{crystal.name}</h1>
          {crystal.overview && (
            <p className="mt-4 font-body text-lg leading-relaxed text-slate">
              {crystal.overview}
            </p>
          )}

          <div className="mt-8 space-y-6">
            {hasScience && (
              <Section title="Scientific information">
                <span className="mb-2 inline-block rounded-full bg-navy/5 px-2.5 py-0.5 font-body text-[11px] uppercase tracking-wide text-navy/60">
                  Verified facts
                </span>
                <div className="space-y-2">
                  {crystal.scientific_information && <p>{crystal.scientific_information}</p>}
                  {crystal.geological_formation && (
                    <p><strong className="text-navy">Formation:</strong> {crystal.geological_formation}</p>
                  )}
                  {crystal.origin && (
                    <p><strong className="text-navy">Origin:</strong> {crystal.origin}</p>
                  )}
                  {crystal.colour_variations && (
                    <p><strong className="text-navy">Colour variations:</strong> {crystal.colour_variations}</p>
                  )}
                </div>
              </Section>
            )}

            {hasTraditions && (
              <Section title="Traditional & spiritual associations">
                <span className="mb-2 inline-block rounded-full bg-gold/15 px-2.5 py-0.5 font-body text-[11px] uppercase tracking-wide text-gold-deep">
                  Beliefs & traditions — not medical claims
                </span>
                <div className="space-y-2">
                  {crystal.traditional_properties && <p>{crystal.traditional_properties}</p>}
                  {crystal.chakra_association && (
                    <p><strong className="text-navy">Chakra:</strong> {crystal.chakra_association}</p>
                  )}
                  {crystal.zodiac_association && (
                    <p><strong className="text-navy">Zodiac:</strong> {crystal.zodiac_association}</p>
                  )}
                </div>
              </Section>
            )}

            {hasCare && (
              <Section title="Care & cleansing">
                <div className="space-y-2">
                  {crystal.care_instructions && (
                    <p><strong className="text-navy">Care:</strong> {crystal.care_instructions}</p>
                  )}
                  {crystal.cleansing_methods && (
                    <p><strong className="text-navy">Cleansing:</strong> {crystal.cleansing_methods}</p>
                  )}
                  {crystal.charging_methods && (
                    <p><strong className="text-navy">Charging:</strong> {crystal.charging_methods}</p>
                  )}
                </div>
              </Section>
            )}

            {crystal.buying_guide && (
              <Section title="Buying guide">{crystal.buying_guide}</Section>
            )}
          </div>
        </div>

        {/* Sidebar: shop this crystal */}
        <aside className="h-fit md:sticky md:top-24">
          <div className="rounded-brand border border-gold/20 bg-white/60 p-5">
            <h2 className="font-heading text-base text-navy">
              Shop {crystal.name}
            </h2>
            {products.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="mt-3 font-body text-sm text-slate">
                No {crystal.name} products available yet.
              </p>
            )}
            <Link
              href="/shop"
              className="mt-4 block rounded-brand bg-navy px-4 py-2.5 text-center font-body text-sm font-semibold text-ivory hover:bg-navy-700"
            >
              Browse the shop
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-14 border-t border-gold/15 pt-8">
          <h2 className="font-heading text-lg text-navy">Related crystals</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/learn/crystal/${c.slug}`}
                className="rounded-full border border-gold/25 bg-white/60 px-4 py-1.5 font-body text-sm text-navy hover:border-gold"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-12 rounded-brand bg-ivory-deep/40 px-5 py-4 font-body text-xs leading-relaxed text-slate">
        Traditional and spiritual associations are cultural beliefs, not medical
        advice. Crystals are not a substitute for professional medical or mental
        healthcare.
      </p>
    </section>
  );
}
