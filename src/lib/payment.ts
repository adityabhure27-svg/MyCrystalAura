/**
 * UPI collect configuration. No payment gateway yet — the customer pays the
 * merchant VPA directly (UPI deep-link on mobile / QR on desktop) and confirms
 * with their UPI reference. Verify against the bank statement for real fulfilment.
 */

export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "9604489898@pthdfc";
export const UPI_PAYEE = "The Aura Crystals";

export function upiLink({
  amount,
  note,
}: {
  amount: number;
  note: string;
}): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}
