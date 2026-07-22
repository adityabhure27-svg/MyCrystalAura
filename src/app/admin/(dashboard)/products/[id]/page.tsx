import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { getProductById, listCategories, listSubcategories } from "@/lib/owner";
import { deleteProduct } from "../actions";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]">,
) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  const [product, categories, subcategories] = await Promise.all([
    getProductById(id),
    listCategories(),
    listSubcategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="font-body text-sm text-gold-deep hover:underline"
      >
        ← Products
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl text-navy">Edit product</h1>
        {product.slug && product.status === "published" && (
          <Link
            href={`/product/${product.slug}`}
            className="font-body text-sm text-gold-deep hover:underline"
          >
            View in shop →
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-brand border border-gold/40 bg-white/70 px-4 py-3 font-body text-sm text-navy">
          {error}
        </p>
      )}

      <div className="mt-6">
        <ProductForm
          product={product}
          categories={categories}
          subcategories={subcategories}
        />
      </div>

      <div className="mt-10 border-t border-gold/15 pt-6">
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="rounded-brand border border-slate/30 px-4 py-2 font-body text-sm text-slate hover:border-slate hover:text-navy"
          >
            Delete product
          </button>
        </form>
      </div>
    </div>
  );
}
