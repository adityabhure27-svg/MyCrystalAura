import Link from "next/link";

/**
 * CrystalAura wordmark with a minimal crystal glyph.
 * `tone` switches the wordmark colour for light vs. dark backgrounds.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const wordColor = tone === "light" ? "text-ivory" : "text-navy";
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <svg
        width="26"
        height="30"
        viewBox="0 0 26 30"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path
          d="M13 1.5 24 9v12l-11 7.5L2 21V9z"
          stroke="var(--color-gold)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M13 1.5 8 15l5 13.5M13 1.5 18 15l-5 13.5M2 9l6 6M24 9l-6 6M8 15h10"
          stroke="var(--color-gold)"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeOpacity="0.75"
        />
      </svg>
      <span
        className={`font-heading text-lg font-semibold tracking-wide ${wordColor}`}
      >
        Crystal<span className="text-gold">Aura</span>
      </span>
    </Link>
  );
}
