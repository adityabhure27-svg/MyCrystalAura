import Link from "next/link";
import { Logo } from "@/components/logo";
import { FooterAccordion } from "@/components/footer-accordion";
import { PILLARS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy text-ivory/70">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="md:flex md:gap-12">
          <div className="md:max-w-xs">
            <Logo tone="light" />
            <p className="mt-4 font-body text-sm leading-relaxed text-ivory/60">
              India&apos;s premium holistic wellness marketplace — authentic
              crystals, trusted knowledge, and conscious living.
            </p>
            <p className="eyebrow mt-5 text-gold-soft">
              Energy · Balance · Transformation
            </p>
          </div>

          <div className="mt-8 flex-1 md:mt-0 md:grid md:grid-cols-3 md:gap-8">
            <FooterAccordion title="Explore">
              <ul className="space-y-2.5 font-body text-sm">
                {PILLARS.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`} className="hover:text-gold-soft">
                      {p.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/about" className="hover:text-gold-soft">
                    About
                  </Link>
                </li>
              </ul>
            </FooterAccordion>

            <FooterAccordion title="Learn">
              <ul className="space-y-2.5 font-body text-sm">
                <li>
                  <Link href="/learn" className="hover:text-gold-soft">
                    The Crystal Universe
                  </Link>
                </li>
                <li>
                  <Link href="/learn/crystals" className="hover:text-gold-soft">
                    Crystal Encyclopedia
                  </Link>
                </li>
              </ul>
            </FooterAccordion>

            <FooterAccordion title="Brand Promise">
              <ul className="space-y-2.5 font-body text-sm">
                <li>Authentic Products</li>
                <li>Trusted Knowledge</li>
                <li>Conscious Living</li>
                <li>Holistic Transformation</li>
              </ul>
            </FooterAccordion>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 font-body text-xs text-ivory/50 sm:flex-row">
          <p>© {new Date().getFullYear()} The Aura Crystals. All rights reserved.</p>
          <p>Made with intention in India.</p>
        </div>
      </div>
    </footer>
  );
}
