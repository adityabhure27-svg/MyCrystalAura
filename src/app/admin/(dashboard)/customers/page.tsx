import { listCustomerMetrics } from "@/lib/owner";
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

export default async function OwnerCustomersPage() {
  const customers = await listCustomerMetrics();

  return (
    <div>
      <h1 className="text-2xl text-navy">Customers</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Segments are derived from purchasing behaviour.
      </p>

      {customers.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center font-body text-sm text-slate">
          No customers yet. Customer records are created automatically at
          checkout.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-brand border border-gold/20">
          <table className="w-full border-collapse text-left">
            <thead className="bg-ivory-deep/60 font-body text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total spend</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-navy">
              {customers.map((c) => (
                <tr key={c.customer_id} className="border-t border-gold/15">
                  <td className="px-4 py-3">
                    <span className="font-medium">{c.name ?? "—"}</span>
                    <span className="block text-xs text-slate">{c.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs text-gold-deep">
                      {SEGMENT_LABEL[c.segment] ?? c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.order_count}</td>
                  <td className="px-4 py-3">{formatPrice(c.total_spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
