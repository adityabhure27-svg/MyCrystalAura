import { listCategories } from "@/lib/owner";

export default async function OwnerCategoriesPage() {
  const categories = await listCategories();
  const mains = categories.filter((c) => !c.parent_id);

  return (
    <div>
      <h1 className="text-2xl text-navy">Categories</h1>
      <p className="mt-1 font-body text-sm text-slate">
        {categories.length} categor{categories.length === 1 ? "y" : "ies"} —
        seeded from the Brand Anchor taxonomy.
      </p>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center font-body text-sm text-slate">
          No categories yet. Run the category seed migration
          (0003_seed_categories.sql).
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mains.map((c) => (
            <div
              key={c.id}
              className="rounded-brand border border-gold/20 bg-white/60 p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base text-navy">{c.name}</h2>
                <span
                  className={`font-body text-xs ${c.is_active ? "text-emerald" : "text-slate"}`}
                >
                  {c.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <p className="mt-1 font-body text-xs text-slate">/{c.slug}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
