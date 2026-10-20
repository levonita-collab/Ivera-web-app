"use client";

import { getSeasonalPrice } from "@/lib/discounts";
import { formatApproxForeign, formatPrice } from "@/lib/pricing";
import { useTranslation } from "@/lib/i18n/dictionary";

/**
 * Per-person tour price with the seasonal offer applied: the old price
 * struck through, the new one, a small badge and the ≈ $ / € equivalent.
 */
export default function TourPrice({
  gel,
  label,
  size = "md",
}: {
  gel: number | null;
  label?: string;
  size?: "md" | "lg";
}) {
  const { t } = useTranslation();
  if (gel === null) {
    return <span className={size === "lg" ? "text-2xl font-bold" : "text-base font-bold"} style={{ color: "#C89B3C" }}>{formatPrice(null, label)}</span>;
  }
  const price = getSeasonalPrice(gel);
  const big = size === "lg";
  return (
    <div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {price.pct > 0 && (
          <s className={big ? "text-base" : "text-[12px]"} style={{ color: "#9A8A7A" }}>
            {price.base} GEL
          </s>
        )}
        <span className={big ? "text-2xl font-bold" : "text-base font-bold"} style={{ color: "#C89B3C" }}>
          {price.final} GEL
        </span>
        <span className={big ? "text-sm" : "text-[11px]"} style={{ color: "#7B6F63" }}>
          {t("tourCard.perPerson")}
        </span>
        {price.pct > 0 && (
          <span
            className={`${big ? "text-[11px]" : "text-[10px]"} font-bold px-2 py-0.5 rounded-full`}
            style={{ backgroundColor: "rgba(47,93,80,0.12)", color: "#2F5D50" }}
          >
            {t("season.badge").replace("{pct}", String(price.pct))}
          </span>
        )}
      </div>
      <p className={big ? "text-sm mt-0.5" : "text-[10px] mt-0.5"} style={{ color: "#9A8A7A" }}>
        {formatApproxForeign(price.final)}
      </p>
    </div>
  );
}
