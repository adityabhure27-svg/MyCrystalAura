import { listCategories, listSubcategories } from "@/lib/owner";

export default async function OwnerCategoriesPage() {
  const [categories, subcategories] = await Promise.all([
    listCategories(),
    listSubcategories(),
  ]);

  return (
    <div>
      <h1 className="text-2xl text-navy">Categories</h1>
      <p className="mt-1 font-body text-sm text-slate">
        {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·{" "}
        {subcategories.length} subcategories.
      </p>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center font-body text-sm text-slate">
          No categories yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const subs = subcategories.filter((s) => s.category_id === c.id);
            return (
              <div
                key={c.id}
                className="rounded-brand border border-gold/20 bg-white/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-base text-navy">{c.name}</h2>
                  <span
                    className={`font-body text-xs ${c.status === "published" ? "text-emerald" : "text-slate"}`}
                  >
                    {c.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-slate">/{c.slug}</p>
                {subs.length > 0 && (
                  <p className="mt-2 font-body text-xs text-slate">
                    {subs.map((s) => s.name).join(" · ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
