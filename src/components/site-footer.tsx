import Link from "next/link";
import { Logo } from "@/components/logo";
import { PILLARS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy text-ivory/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ivory/60">
            India&apos;s premium holistic wellness marketplace — authentic
            crystals, trusted knowledge, and conscious living.
          </p>
          <p className="mt-6 eyebrow text-gold-soft">
            Energy · Balance · Transformation
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm text-ivory">Explore</h4>
          <ul className="mt-4 space-y-2.5 font-body text-sm">
            {PILLARS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="transition-colors hover:text-gold-soft"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm text-ivory">Brand Promise</h4>
          <ul className="mt-4 space-y-2.5 font-body text-sm">
            <li>Authentic Products</li>
            <li>Trusted Knowledge</li>
            <li>Conscious Living</li>
            <li>Holistic Transformation</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 font-body text-xs text-ivory/50 sm:flex-row">
          <p>© {new Date().getFullYear()} CrystalAura. All rights reserved.</p>
          <p>Made with intention in India.</p>
        </div>
      </div>
    </footer>
  );
}
