/**
 * Map coordinates for each tour's route, keyed by `Tour.id`.
 *
 * A point covers one or more entries of `Tour.routeStops` (by index), so the
 * numbers on the map match the numbered route list on the tour page. Stops
 * that sit a few hundred metres apart share one marker — at the zoom needed
 * to show a whole day trip they would otherwise sit on top of each other.
 * Stops without a fixed place ("Lunch stop") have no point.
 *
 * Coordinates are [longitude, latitude].
 */

export type LngLat = [number, number];

export interface RoutePoint {
  lngLat: LngLat;
  /** Indexes into `Tour.routeStops` this marker stands for. */
  stops?: number[];
  /** Own label, for tours whose `routeStops` are not single places. */
  name?: { en: string; ru: string };
}

export interface TourRoute {
  /** Draw the Tbilisi meeting point as the start of the line. */
  fromMeetingPoint: boolean;
  points: RoutePoint[];
}

/** Vakhtang Gorgasali Square (Meidan), by the "I Love Tbilisi" sign. */
export const MEETING_POINT: LngLat = [44.8089, 41.6898];

export const tourRoutes: Record<string, TourRoute> = {
  tbilisi: {
    fromMeetingPoint: false,
    points: [
      { stops: [0], lngLat: MEETING_POINT },
      { stops: [1], lngLat: [44.8112, 41.6902] }, // Metekhi Church
      { stops: [2], lngLat: [44.8102, 41.6931] }, // Rike Park
      { stops: [3], lngLat: [44.8083, 41.693] }, // Bridge of Peace
      { stops: [4], lngLat: [44.8088, 41.688] }, // Narikala Fortress
      { stops: [5], lngLat: [44.8107, 41.6876] }, // Abanotubani
      { stops: [6], lngLat: [44.8084, 41.6905] }, // Shardeni Street
    ],
  },
  mtskheta: {
    fromMeetingPoint: true,
    points: [
      { stops: [0], lngLat: [44.7334, 41.8383] }, // Jvari Monastery
      { stops: [1, 2, 3], lngLat: [44.7205, 41.8432] }, // Svetitskhoveli, old town, Samtavro
      { stops: [4], lngLat: [44.6402, 41.8624] }, // Shiomgvime
    ],
  },
  gori: {
    fromMeetingPoint: true,
    points: [
      { stops: [0, 1, 2], lngLat: [44.111, 41.9868] }, // Gori, fortress, museum
      { stops: [3], lngLat: [44.2073, 41.9668] }, // Uplistsikhe
    ],
  },
  kakheti: {
    fromMeetingPoint: true,
    points: [
      { stops: [0, 1, 2], lngLat: [45.9255, 41.616] }, // Bodbe, Sighnaghi, city walls
      { stops: [3], lngLat: [45.4735, 41.919] }, // Telavi
      { stops: [4], lngLat: [45.3772, 42.0325] }, // Alaverdi
    ],
  },
  kazbegi: {
    fromMeetingPoint: true,
    points: [
      { stops: [0, 1], lngLat: [44.7338, 42.1548] }, // Jinvali Reservoir, Ananuri
      { stops: [2, 3, 4], lngLat: [44.4601, 42.4901] }, // Gudauri, monument, Jvari Pass
      { stops: [5, 6], lngLat: [44.6303, 42.6603] }, // Stepantsminda, Gergeti
    ],
  },
  vardzia: {
    fromMeetingPoint: true,
    points: [
      { stops: [0], lngLat: [43.3916, 41.836] }, // Borjomi
      { stops: [1], lngLat: [42.9781, 41.643] }, // Rabati Fortress
      { stops: [2], lngLat: [43.2842, 41.3811] }, // Vardzia
    ],
  },
  kutaisi: {
    fromMeetingPoint: true,
    points: [
      { stops: [0, 1], lngLat: [42.7049, 42.2745] }, // Kutaisi, Bagrati
      { stops: [2], lngLat: [42.6005, 42.3769] }, // Prometheus Cave
      { stops: [3, 4], lngLat: [42.3769, 42.4572] }, // Martvili Canyon, boat ride
    ],
  },
  batumi: {
    // Three days around Batumi: show the coast, not the 370 km drive.
    fromMeetingPoint: false,
    points: [
      {
        lngLat: [41.637, 41.6535],
        name: {
          en: "Batumi — Boulevard, Alphabet Tower, Europe Square",
          ru: "Батуми — бульвар, Алфавитная башня, площадь Европы",
        },
      },
      {
        lngLat: [41.7075, 41.6944],
        name: { en: "Batumi Botanical Garden (optional)", ru: "Батумский ботанический сад (по желанию)" },
      },
      {
        lngLat: [41.859, 41.573],
        name: {
          en: "Makhuntseti Waterfall and Queen Tamar Bridge",
          ru: "Водопад Махунцети и мост царицы Тамары",
        },
      },
    ],
  },
};

export function getTourRoute(tourId: string): TourRoute | undefined {
  return tourRoutes[tourId];
}

/** Marker text for a point: "3", "2–4", or "" when it has its own name. */
export function markerLabel(point: RoutePoint): string {
  const stops = point.stops;
  if (!stops || stops.length === 0) return "";
  const first = stops[0] + 1;
  const last = stops[stops.length - 1] + 1;
  return first === last ? String(first) : `${first}–${last}`;
}
