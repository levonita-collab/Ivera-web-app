// PayPal does not support GEL (Georgian Lari), so tour prices are converted
// to EUR for PayPal checkout. Update DEFAULT_GEL_EUR_RATE periodically (e.g.
// from the National Bank of Georgia), or override via env vars:
//  - PAYPAL_GEL_EUR_RATE            (server-side amount actually charged)
//  - NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE (client-side "≈ X EUR" display)
export const DEFAULT_GEL_EUR_RATE = 0.34;

export function gelToEur(gel: number, rate: number = DEFAULT_GEL_EUR_RATE): number {
  return Math.round(gel * rate * 100) / 100;
}

export function getServerGelEurRate(): number {
  const envRate = Number(process.env.PAYPAL_GEL_EUR_RATE);
  return Number.isFinite(envRate) && envRate > 0 ? envRate : DEFAULT_GEL_EUR_RATE;
}

export function getClientGelEurRate(): number {
  const envRate = Number(process.env.NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE);
  return Number.isFinite(envRate) && envRate > 0 ? envRate : DEFAULT_GEL_EUR_RATE;
}
