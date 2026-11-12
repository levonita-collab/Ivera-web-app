"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Tour } from "@/data/tours";
import { MEETING_POINT, getTourRoute, markerLabel } from "@/data/tourRoutes";
import type { LngLat, RoutePoint } from "@/data/tourRoutes";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { Language } from "@/lib/i18n/LanguageContext";

/** Free OpenStreetMap vector tiles — no API key, no cookies. */
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const GOLD = "#C89B3C";
const INK = "#1F1A17";

interface Props {
  /** Already localized tour — its `routeStops` label the markers. */
  tour: Tour;
}

function pointLines(point: RoutePoint, tour: Tour, language: Language): string[] {
  if (point.name) return [point.name[language]];
  return (point.stops ?? []).map((i) => `${i + 1}. ${tour.routeStops[i]}`);
}

function markerElement(label: string, title: string, start = false): HTMLButtonElement {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", title);
  el.textContent = label;
  const wide = label.length > 1;
  Object.assign(el.style, {
    minWidth: start ? "16px" : "24px",
    height: start ? "16px" : "24px",
    padding: wide ? "0 6px" : "0",
    borderRadius: "999px",
    border: "2px solid #FFFDF8",
    backgroundColor: start ? INK : GOLD,
    color: "#FFFFFF",
    font: "700 11px/1 system-ui, sans-serif",
    boxShadow: "0 1px 4px rgba(31,26,23,0.45)",
    cursor: "pointer",
  });
  return el;
}

function popupContent(lines: string[]): HTMLDivElement {
  const box = document.createElement("div");
  box.style.cssText = `font: 500 12px/1.4 system-ui, sans-serif; color: ${INK};`;
  for (const line of lines) {
    const row = document.createElement("div");
    row.textContent = line;
    box.appendChild(row);
  }
  return box;
}

/** Prefer place names in the visitor's language where the map data has them. */
function localizeLabels(map: MapLibreMap, language: Language) {
  for (const layer of map.getStyle().layers ?? []) {
    if (layer.type !== "symbol") continue;
    const field = layer.layout?.["text-field"];
    if (!field || !JSON.stringify(field).includes("name")) continue;
    map.setLayoutProperty(layer.id, "text-field", [
      "coalesce",
      ["get", `name:${language}`],
      ["get", language === "en" ? "name_en" : "name:latin"],
      ["get", "name:latin"],
      ["get", "name"],
    ]);
  }
}

export default function TourRouteMap({ tour }: Props) {
  const { t, language } = useTranslation();
  const route = getTourRoute(tour.id);
  const holderRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [failed, setFailed] = useState(false);

  // The map library is heavy — only fetch it once the map is about to scroll in.
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(holder);
    return () => observer.disconnect();
  }, []);

  const stopsKey = tour.routeStops.join("|");

  useEffect(() => {
    const holder = holderRef.current;
    if (!nearViewport || !holder || !route) return;
    let cancelled = false;
    let map: MapLibreMap | undefined;

    import("maplibre-gl")
      .then(({ default: maplibregl }) => {
        if (cancelled) return;

        const line: LngLat[] = [
          ...(route.fromMeetingPoint ? [MEETING_POINT] : []),
          ...route.points.map((p) => p.lngLat),
        ];
        const bounds = new maplibregl.LngLatBounds(line[0], line[0]);
        line.forEach((c) => bounds.extend(c));

        const instance = new maplibregl.Map({
          container: holder,
          style: STYLE_URL,
          bounds,
          fitBoundsOptions: { padding: 44, maxZoom: 15 },
          // One finger scrolls the page, two fingers move the map.
          cooperativeGestures: true,
          attributionControl: { compact: true },
          locale: {
            "CooperativeGesturesHandler.WindowsHelpText": t("tourDetail.mapCtrlZoom"),
            "CooperativeGesturesHandler.MacHelpText": t("tourDetail.mapCmdZoom"),
            "CooperativeGesturesHandler.MobileHelpText": t("tourDetail.mapTwoFingers"),
          },
        });
        map = instance;
        instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        let loaded = false;
        instance.on("error", () => {
          // A map that never got its style is an empty grey box — hide it.
          if (!loaded && !cancelled) setFailed(true);
        });
        instance.on("load", () => {
          loaded = true;
          try {
            localizeLabels(instance, language);
          } catch {
            // Labels simply stay in the style's default language.
          }
          instance.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: line },
            },
          });
          instance.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": "#8A5A1C",
              "line-width": 2.5,
              "line-opacity": 0.75,
              "line-dasharray": [1.2, 2],
            },
          });
        });

        if (route.fromMeetingPoint) {
          const title = `${t("tourDetail.mapMeetingPoint")}: ${tour.meetingPoint ?? ""}`;
          new maplibregl.Marker({ element: markerElement("", title, true) })
            .setLngLat(MEETING_POINT)
            .setPopup(
              new maplibregl.Popup({ offset: 12, closeButton: false }).setDOMContent(
                popupContent([title]),
              ),
            )
            .addTo(instance);
        }

        for (const point of route.points) {
          const lines = pointLines(point, tour, language);
          new maplibregl.Marker({ element: markerElement(markerLabel(point), lines.join(", ")) })
            .setLngLat(point.lngLat)
            .setPopup(
              new maplibregl.Popup({ offset: 16, closeButton: false }).setDOMContent(
                popupContent(lines),
              ),
            )
            .addTo(instance);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      map?.remove();
    };
    // `t` and `tour` change identity every render; language + stops cover them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearViewport, route, language, tour.id, stopsKey]);

  if (!route || failed) return null;

  return (
    <figure className="mb-5">
      <div
        ref={holderRef}
        data-testid="tour-route-map"
        role="region"
        aria-label={`${t("tourDetail.mapAria")}: ${tour.title}`}
        className="w-full overflow-hidden rounded-2xl border"
        style={{ height: "min(72vw, 320px)", borderColor: "#E8DDD0", backgroundColor: "#EFE8DB" }}
      />
      <figcaption className="mt-2 text-[11px] leading-snug" style={{ color: "#7B6F63" }}>
        {route.fromMeetingPoint && (
          <>
            <span
              aria-hidden
              className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-[-1px]"
              style={{ backgroundColor: INK }}
            />
            {t("tourDetail.mapMeetingPoint")} ·{" "}
          </>
        )}
        {t("tourDetail.mapSchematic")}
      </figcaption>
    </figure>
  );
}
