import Link from "next/link";
import { listProducts } from "@/lib/owner";
import { formatPrice } from "@/lib/queries";
import { setPublished } from "./actions";

export default async function OwnerProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-navy">Products</h1>
        <Link
          href="/owner/products/new"
          className="rounded-brand bg-navy px-4 py-2 font-body text-sm font-medium text-ivory hover:bg-navy-700"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center">
          <p className="font-heading text-lg text-navy">No products yet</p>
          <p className="mt-2 font-body text-sm text-slate">
            Add your first product — it will appear in the shop once published.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-brand border border-gold/20">
          <table className="w-full border-collapse text-left">
            <thead className="bg-ivory-deep/60 font-body text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-navy">
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gold/15">
                  <td className="px-4 py-3">
                    <Link
                      href={`/owner/products/${p.id}`}
                      className="font-medium hover:text-gold-deep"
                    >
                      {p.name}
                    </Link>
                    {p.is_featured && (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] text-gold-deep">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(p.price, p.currency)}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.is_published ? "text-emerald" : "text-slate"
                      }
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={setPublished} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={(!p.is_published).toString()}
                      />
                      <button
                        type="submit"
                        className="font-body text-xs text-gold-deep hover:underline"
                      >
                        {p.is_published ? "Unpublish" : "Publish"}
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
