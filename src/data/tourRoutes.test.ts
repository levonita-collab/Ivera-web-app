import { describe, it, expect } from "vitest";
import { tours } from "./tours";
import { toursRu } from "./tours.ru";
import { MEETING_POINT, getTourRoute, markerLabel, tourRoutes } from "./tourRoutes";

// Rough bounding box of Georgia: [west, south, east, north].
const GEORGIA = [39.9, 41.0, 46.8, 43.6];

function inGeorgia([lng, lat]: [number, number]) {
  return lng > GEORGIA[0] && lng < GEORGIA[2] && lat > GEORGIA[1] && lat < GEORGIA[3];
}

describe("tourRoutes", () => {
  it("has a route for every tour, and no routes for unknown tours", () => {
    expect(Object.keys(tourRoutes).sort()).toEqual(tours.map((t) => t.id).sort());
  });

  it("keeps the meeting point in Georgia", () => {
    expect(inGeorgia(MEETING_POINT)).toBe(true);
  });

  it.each(tours.map((t) => [t.id, t] as const))("%s: points are valid", (_id, tour) => {
    const route = getTourRoute(tour.id)!;
    expect(route.points.length).toBeGreaterThan(0);
    const ruStops = toursRu[tour.id]?.routeStops ?? tour.routeStops;
    let previous = -1;
    for (const point of route.points) {
      // [lng, lat] — a swapped pair would land outside Georgia.
      expect(inGeorgia(point.lngLat)).toBe(true);
      expect(Boolean(point.name) || (point.stops?.length ?? 0) > 0).toBe(true);
      for (const stop of point.stops ?? []) {
        expect(tour.routeStops[stop]).toBeDefined();
        expect(ruStops[stop]).toBeDefined();
        // Markers follow the order of the route list.
        expect(stop).toBeGreaterThan(previous);
        previous = stop;
      }
    }
  });

  it("labels markers with the route list numbers", () => {
    expect(markerLabel({ lngLat: MEETING_POINT, stops: [0] })).toBe("1");
    expect(markerLabel({ lngLat: MEETING_POINT, stops: [1, 2, 3] })).toBe("2–4");
    expect(markerLabel({ lngLat: MEETING_POINT, name: { en: "a", ru: "b" } })).toBe("");
  });
});
