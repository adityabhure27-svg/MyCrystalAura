import Link from "next/link";
import { notFound } from "next/navigation";
import { CrystalForm } from "@/components/crystal-form";
import { getCrystalProfileById } from "@/lib/owner";
import { deleteCrystal } from "../actions";
import { uploadCrystalImage, removeCrystalImage } from "./image-actions";

export default async function EditCrystalPage(
  props: PageProps<"/admin/crystals/[id]">,
) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  const crystal = await getCrystalProfileById(id);
  if (!crystal) notFound();

  return (
    <div>
      <Link href="/admin/crystals" className="font-body text-sm text-gold-deep hover:underline">
        ← Crystals
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl text-navy">Edit crystal</h1>
        {crystal.status === "published" && (
          <Link
            href={`/learn/crystal/${crystal.slug}`}
            className="font-body text-sm text-gold-deep hover:underline"
          >
            View on /learn →
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-brand border border-gold/40 bg-white/70 px-4 py-3 font-body text-sm text-navy">
          {error}
        </p>
      )}

      {/* Main image */}
      <div className="mt-6 max-w-2xl rounded-brand border border-gold/20 bg-white/50 p-5">
        <h2 className="font-heading text-sm text-navy">Main image</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gold/20 bg-ivory-deep/40">
            {crystal.main_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={crystal.main_image_url} alt={crystal.name} className="h-full w-full object-cover" />
            )}
          </div>
          <form action={uploadCrystalImage} className="flex items-center gap-3">
            <input type="hidden" name="crystal_id" value={crystal.id} />
            <input
              type="file"
              name="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              required
              className="font-body text-sm text-navy file:mr-3 file:rounded-brand file:border-0 file:bg-navy file:px-4 file:py-2 file:font-body file:text-sm file:font-medium file:text-ivory hover:file:bg-navy-700"
            />
            <button type="submit" className="rounded-brand border border-navy/20 px-4 py-2 font-body text-sm font-medium text-navy hover:border-gold">
              Upload
            </button>
          </form>
          {crystal.main_image_url && (
            <form action={removeCrystalImage}>
              <input type="hidden" name="crystal_id" value={crystal.id} />
              <button type="submit" className="font-body text-xs text-slate hover:text-navy">
                Remove
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6">
        <CrystalForm crystal={crystal} />
      </div>

      <div className="mt-10 border-t border-gold/15 pt-6">
        <form action={deleteCrystal}>
          <input type="hidden" name="id" value={crystal.id} />
          <button
            type="submit"
            className="rounded-brand border border-slate/30 px-4 py-2 font-body text-sm text-slate hover:border-slate hover:text-navy"
          >
            Delete crystal
          </button>
        </form>
      </div>
    </div>
  );
}
