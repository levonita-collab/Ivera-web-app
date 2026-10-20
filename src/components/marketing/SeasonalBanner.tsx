"use client";

import Link from "next/link";
import { Snowflake, ArrowRight } from "lucide-react";
import { getActiveSeasonalOffer } from "@/lib/discounts";
import { useTranslation } from "@/lib/i18n/dictionary";

/** Shown only while the seasonal offer for group quest tours is running. */
export default function SeasonalBanner({ withCta = true }: { withCta?: boolean }) {
  const { t, language } = useTranslation();
  const offer = getActiveSeasonalOffer();
  if (!offer) return null;

  const until = new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tbilisi",
  }).format(new Date(`${offer.endsOn}T12:00:00+04:00`));
  const fill = (key: Parameters<typeof t>[0]) =>
    t(key).replace("{pct}", String(offer.pct)).replace("{date}", until);

  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{
        background: "linear-gradient(135deg, #1F2A2E 0%, #16201F 100%)",
        border: "1px solid rgba(160,200,210,0.25)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(160,200,210,0.12)", color: "#BFD9E0" }}
      >
        <Snowflake size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: "#9FC3CC" }}>
          {fill("season.bannerEyebrow")}
        </p>
        <p className="font-serif text-lg font-semibold leading-snug mt-0.5" style={{ color: "#F3EEE4" }}>
          {fill("season.bannerTitle")}
        </p>
        <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: "#B9C4C4" }}>
          {fill("season.bannerBody")}
        </p>
        {withCta && (
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-semibold px-4 py-2 rounded-full"
            style={{ backgroundColor: "#C89B3C", color: "#1A1208" }}
          >
            {fill("season.bannerCta")} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
