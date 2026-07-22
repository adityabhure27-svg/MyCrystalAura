import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import {
  getProductById,
  listCategories,
  listSubcategories,
  listCrystalProfiles,
} from "@/lib/owner";
import { deleteProduct } from "../actions";
import { uploadProductImage, deleteProductImage } from "./image-actions";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]">,
) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  const [product, categories, subcategories, crystalProfiles] =
    await Promise.all([
      getProductById(id),
      listCategories(),
      listSubcategories(),
      listCrystalProfiles(),
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
          crystalProfiles={crystalProfiles}
        />
      </div>

      {/* Images */}
      <div className="mt-10 max-w-2xl border-t border-gold/15 pt-6">
        <h2 className="font-heading text-lg text-navy">Images</h2>
        {product.product_images && product.product_images.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {product.product_images
              .slice()
              .sort(
                (a, b) =>
                  Number(b.is_primary) - Number(a.is_primary) ||
                  a.display_order - b.display_order,
              )
              .map((img) => (
                <div
                  key={img.id}
                  className="relative h-24 w-24 overflow-hidden rounded-lg border border-gold/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt={img.alt_text ?? ""}
                    className="h-full w-full object-cover"
                  />
                  {img.is_primary && (
                    <span className="absolute left-1 top-1 rounded bg-gold px-1 py-0.5 text-[9px] font-semibold text-navy">
                      Main
                    </span>
                  )}
                  <form
                    action={deleteProductImage}
                    className="absolute right-1 top-1"
                  >
                    <input type="hidden" name="image_id" value={img.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <button
                      type="submit"
                      aria-label="Delete image"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-xs text-slate hover:text-navy"
                    >
                      ×
                    </button>
                  </form>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-3 font-body text-sm text-slate">No images yet.</p>
        )}

        <form action={uploadProductImage} className="mt-4 flex items-center gap-3">
          <input type="hidden" name="product_id" value={product.id} />
          <input
            type="file"
            name="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            required
            className="font-body text-sm text-navy file:mr-3 file:rounded-brand file:border-0 file:bg-navy file:px-4 file:py-2 file:font-body file:text-sm file:font-medium file:text-ivory hover:file:bg-navy-700"
          />
          <button
            type="submit"
            className="rounded-brand border border-navy/20 px-4 py-2 font-body text-sm font-medium text-navy hover:border-gold"
          >
            Upload
          </button>
        </form>
        <p className="mt-2 font-body text-xs text-slate">
          First image becomes the main image. Max 5MB · PNG/JPG/WebP.
        </p>
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
