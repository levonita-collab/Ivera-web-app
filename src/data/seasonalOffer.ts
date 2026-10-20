// Seasonal promotion for group quest tours (private tours are priced
// separately and never get it). Change the dates or percentage here only:
// tour cards, booking, combo packages and the PayPal server all read it.

export interface SeasonalOffer {
  id: string;
  pct: number;
  /** Inclusive calendar dates in Georgia (YYYY-MM-DD). */
  startsOn: string;
  endsOn: string;
  title: string;
  titleRu: string;
}

export const SEASONAL_OFFER: SeasonalOffer | null = {
  id: "winter-2026",
  pct: 40,
  startsOn: "2026-10-20",
  endsOn: "2027-02-28",
  title: "Winter season",
  titleRu: "Зимний сезон",
};
