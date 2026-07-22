import Link from "next/link";
import { listCrystalProfiles } from "@/lib/owner";
import { setCrystalPublished } from "./actions";

export default async function AdminCrystalsPage() {
  const crystals = await listCrystalProfiles();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-navy">Crystal Knowledge</h1>
          <p className="mt-1 font-body text-sm text-slate">
            Author crystal encyclopedia profiles. Published crystals appear in
            /learn and link to matching products.
          </p>
        </div>
        <Link
          href="/admin/crystals/new"
          className="shrink-0 rounded-brand bg-navy px-4 py-2 font-body text-sm font-medium text-ivory hover:bg-navy-700"
        >
          + Add crystal
        </Link>
      </div>

      {crystals.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center font-body text-sm text-slate">
          No crystals yet. Add your first crystal profile.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-brand border border-gold/20">
          <table className="w-full border-collapse text-left">
            <thead className="bg-ivory-deep/60 font-body text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-navy">
              {crystals.map((c) => (
                <tr key={c.id} className="border-t border-gold/15">
                  <td className="px-4 py-3">
                    <Link href={`/admin/crystals/${c.id}`} className="font-medium hover:text-gold-deep">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate">/{c.slug}</td>
                  <td className="px-4 py-3">
                    <span className={c.status === "published" ? "text-emerald" : "text-slate"}>
                      {c.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={setCrystalPublished} className="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="publish" value={(c.status !== "published").toString()} />
                      <button type="submit" className="font-body text-xs text-gold-deep hover:underline">
                        {c.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
