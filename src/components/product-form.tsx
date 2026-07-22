import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import type { Category, Product } from "@/lib/database.types";

const inputClass =
  "mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  return (
    <form action={saveProduct} className="max-w-2xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-5">
        <label className="font-body text-sm text-navy">
          Name
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            className={inputClass}
          />
        </label>

        <label className="font-body text-sm text-navy">
          Description
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
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.price ?? 0}
              className={inputClass}
            />
          </label>
          <label className="font-body text-sm text-navy">
            Compare-at price (optional)
            <input
              name="compare_at_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.compare_at_price ?? ""}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="font-body text-sm text-navy">
            Stock
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 0}
              className={inputClass}
            />
          </label>
          <label className="font-body text-sm text-navy">
            SKU (optional)
            <input
              name="sku"
              defaultValue={product?.sku ?? ""}
              className={inputClass}
            />
          </label>
        </div>

        <label className="font-body text-sm text-navy">
          Category
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className={inputClass}
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 font-body text-sm text-navy">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={product?.is_published ?? false}
              className="h-4 w-4 accent-[--color-gold]"
            />
            Published (visible in shop)
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-navy">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.is_featured ?? false}
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
