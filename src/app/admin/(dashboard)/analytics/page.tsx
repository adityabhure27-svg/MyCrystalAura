import {
  getDashboardStats,
  listCustomerMetrics,
  listProductPerformance,
} from "@/lib/owner";
import { formatPrice } from "@/lib/queries";

const SEGMENT_LABEL: Record<string, string> = {
  new: "New",
  first_time_buyer: "First-time buyer",
  returning: "Returning",
  active: "Active",
  inactive: "Inactive",
  high_value: "High value",
  frequent_buyer: "Frequent buyer",
};

export default async function OwnerAnalyticsPage() {
  const [stats, metrics, performance] = await Promise.all([
    getDashboardStats(),
    listCustomerMetrics(),
    listProductPerformance(),
  ]);

  // Segment counts derived from customer metrics.
  const segments = metrics.reduce<Record<string, number>>((acc, m) => {
    acc[m.segment] = (acc[m.segment] ?? 0) + 1;
    return acc;
  }, {});

  const topProducts = performance.filter((p) => p.units_sold > 0);

  return (
    <div>
      <h1 className="text-2xl text-navy">Analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Revenue (paid)", value: formatPrice(stats.revenue) },
          { label: "Orders", value: String(stats.orders) },
          { label: "Customers", value: String(stats.customers) },
          { label: "Products", value: String(stats.products) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-brand border border-gold/20 bg-white/60 p-5"
          >
            <p className="font-body text-xs uppercase tracking-wide text-slate">
              {s.label}
            </p>
            <p className="mt-2 font-heading text-2xl text-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Segments */}
        <div>
          <h2 className="font-heading text-lg text-navy">Customer segments</h2>
          {Object.keys(segments).length === 0 ? (
            <p className="mt-3 font-body text-sm text-slate">
              No customer data yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {Object.entries(segments).map(([seg, n]) => (
                <li
                  key={seg}
                  className="flex items-center justify-between rounded-lg border border-gold/15 bg-white/50 px-4 py-2.5 font-body text-sm"
                >
                  <span className="text-navy">
                    {SEGMENT_LABEL[seg] ?? seg}
                  </span>
                  <span className="font-semibold text-navy">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top products */}
        <div>
          <h2 className="font-heading text-lg text-navy">Top products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-3 font-body text-sm text-slate">
              No sales yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {topProducts.map((p) => (
                <li
                  key={p.product_id}
                  className="flex items-center justify-between rounded-lg border border-gold/15 bg-white/50 px-4 py-2.5 font-body text-sm"
                >
                  <span className="text-navy">{p.name}</span>
                  <span className="text-slate">
                    {p.units_sold} sold · {formatPrice(p.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
