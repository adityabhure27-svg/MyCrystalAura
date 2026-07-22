import Link from "next/link";
import { CrystalForm } from "@/components/crystal-form";

export default async function NewCrystalPage(
  props: PageProps<"/admin/crystals/new">,
) {
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div>
      <Link href="/admin/crystals" className="font-body text-sm text-gold-deep hover:underline">
        ← Crystals
      </Link>
      <h1 className="mt-3 text-2xl text-navy">New crystal</h1>
      {error && (
        <p className="mt-4 rounded-brand border border-gold/40 bg-white/70 px-4 py-3 font-body text-sm text-navy">
          {error}
        </p>
      )}
      <div className="mt-6">
        <CrystalForm />
      </div>
    </div>
  );
}
