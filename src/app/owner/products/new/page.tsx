import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { listCategories } from "@/lib/owner";

export default async function NewProductPage(
  props: PageProps<"/owner/products/new">,
) {
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const categories = await listCategories();

  return (
    <div>
      <Link
        href="/owner/products"
        className="font-body text-sm text-gold-deep hover:underline"
      >
        ← Products
      </Link>
      <h1 className="mt-3 text-2xl text-navy">New product</h1>

      {error && (
        <p className="mt-4 rounded-brand border border-gold/40 bg-white/70 px-4 py-3 font-body text-sm text-navy">
          {error}
        </p>
      )}

      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
