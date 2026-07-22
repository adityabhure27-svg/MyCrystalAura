import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import type { Category, Product, Subcategory } from "@/lib/database.types";

const inputClass =
  "mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold";

export function ProductForm({
  product,
  categories,
  subcategories,
}: {
  product?: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
}) {
  return (
    <form action={saveProduct} className="max-w-2xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2 font-body text-sm text-navy sm:col-span-1">
            Name
            <input name="name" required defaultValue={product?.name ?? ""} className={inputClass} />
          </label>
          <label className="col-span-2 font-body text-sm text-navy sm:col-span-1">
            SKU
            <input name="sku" defaultValue={product?.sku ?? ""} className={inputClass} />
          </label>
        </div>

        <label className="font-body text-sm text-navy">
          Short description
          <input
            name="short_description"
            defaultValue={product?.short_description ?? ""}
            className={inputClass}
          />
        </label>

        <label className="font-body text-sm text-navy">
          Full description
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="font-body text-sm text-navy">
            Price (INR)
            <input name="price" type="number" min="0" step="1" defaultValue={product?.price ?? 0} className={inputClass} />
          </label>
          <label className="font-body text-sm text-navy">
            Sale price (optional)
            <input name="sale_price" type="number" min="0" step="1" defaultValue={product?.sale_price ?? ""} className={inputClass} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="font-body text-sm text-navy">
            Stock quantity
            <input name="stock_quantity" type="number" min="0" defaultValue={product?.stock_quantity ?? 0} className={inputClass} />
          </label>
          <label className="font-body text-sm text-navy">
            Low-stock threshold
            <input name="low_stock_threshold" type="number" min="0" defaultValue={product?.low_stock_threshold ?? 3} className={inputClass} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="font-body text-sm text-navy">
            Category
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputClass}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="font-body text-sm text-navy">
            Subcategory
            <select name="subcategory_id" defaultValue={product?.subcategory_id ?? ""} className={inputClass}>
              <option value="">— None —</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 items-end gap-4">
          <label className="font-body text-sm text-navy">
            Status
            <select name="status" defaultValue={product?.status ?? "draft"} className={inputClass}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (live)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 font-body text-sm text-navy">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-[--color-gold]"
            />
            Featured on home
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          className="rounded-brand bg-navy px-6 py-2.5 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
        >
          {product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
