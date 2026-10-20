export function calculateTotal(
  pricePerPersonGel: number | null,
  people: number
): number | null {
  if (pricePerPersonGel === null) return null;
  return pricePerPersonGel * Math.max(1, people);
}

export function formatPrice(gel: number | null, label?: string): string {
  if (gel === null) return label ?? "Price on Request";
  return `${gel} GEL`;
}

const GEL_EUR_APPROX = 0.34;
/** ≈ 2.63 GEL per US dollar (mid-2026). Display only; PayPal charges use lib/paypal/currency. */
const GEL_USD_APPROX = 0.38;

export function formatApproxEur(gel: number): string {
  return `≈ ${Math.round(gel * GEL_EUR_APPROX)} €`;
}

/** "≈ $21 · 19 €" — tourists think in their own currency, not lari. */
export function formatApproxForeign(gel: number): string {
  return `≈ $${Math.round(gel * GEL_USD_APPROX)} · ${Math.round(gel * GEL_EUR_APPROX)} €`;
}
