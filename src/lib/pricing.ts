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
