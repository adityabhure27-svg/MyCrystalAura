import Image from "next/image";
import Link from "next/link";

/**
 * The Aura Crystals brand lockup (public/logo.png).
 * The source has a cream background, so on dark surfaces (`tone="light"`) it is
 * framed in a matching cream chip so the edge reads as intentional.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="The Aura Crystals — home"
      className="inline-flex items-center"
    >
      <span
        className={
          tone === "light"
            ? "rounded-lg bg-cream px-3 py-2 shadow-sm"
            : undefined
        }
      >
        <Image
          src="/logo.png"
          alt="The Aura Crystals"
          width={1536}
          height={1024}
          priority
          className={tone === "light" ? "h-12 w-auto" : "h-14 w-auto"}
        />
      </span>
    </Link>
  );
}
