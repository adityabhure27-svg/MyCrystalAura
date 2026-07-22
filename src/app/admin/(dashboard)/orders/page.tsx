import { listOrders } from "@/lib/owner";
import { formatPrice } from "@/lib/queries";

const STATUS_TONE: Record<string, string> = {
  delivered: "text-emerald",
  shipped: "text-gold-deep",
  cancelled: "text-slate",
  returned: "text-slate",
};

export default async function OwnerOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="text-2xl text-navy">Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-brand border border-dashed border-gold/30 bg-white/40 p-12 text-center font-body text-sm text-slate">
          No orders yet. Orders appear here automatically when customers check
          out.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-brand border border-gold/20">
          <table className="w-full border-collapse text-left">
            <thead className="bg-ivory-deep/60 font-body text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Tracking</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-navy">
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-gold/15">
                  <td className="px-4 py-3 font-medium">{o.order_number}</td>
                  <td className={`px-4 py-3 ${STATUS_TONE[o.order_status] ?? ""}`}>
                    {o.order_status}
                  </td>
                  <td className="px-4 py-3">{o.payment_status}</td>
                  <td className="px-4 py-3">
                    {formatPrice(o.total_amount, o.currency)}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {o.delivery_tracking_id ?? "—"}
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
