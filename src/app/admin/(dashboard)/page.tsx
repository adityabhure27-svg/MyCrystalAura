import Link from "next/link";
import { getDashboardStats } from "@/lib/owner";
import { formatPrice } from "@/lib/queries";

export default async function OwnerDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Products", value: String(stats.products), href: "/admin/products" },
    { label: "Orders", value: String(stats.orders), href: "/admin/orders" },
    { label: "Customers", value: String(stats.customers), href: "/admin/customers" },
    { label: "Revenue", value: formatPrice(stats.revenue), href: "/admin/analytics" },
  ];

  return (
    <div>
      <h1 className="text-2xl text-navy">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Overview of your The Aura Crystals operation.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-brand border border-gold/20 bg-white/60 p-5 transition-colors hover:border-gold"
          >
            <p className="font-body text-xs uppercase tracking-wide text-slate">
              {card.label}
            </p>
            <p className="mt-2 font-heading text-2xl text-navy">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-brand border border-gold/20 bg-white/50 p-6">
        <h2 className="font-heading text-lg text-navy">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="rounded-brand bg-navy px-4 py-2 font-body text-sm font-medium text-ivory hover:bg-navy-700"
          >
            + Add product
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-brand border border-navy/20 px-4 py-2 font-body text-sm font-medium text-navy hover:border-gold"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  );
}
