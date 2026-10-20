"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
      className="relative overflow-hidden rounded-[22px] p-4 pr-4 flex items-center gap-3.5"
      style={{
        background: "linear-gradient(115deg, #3A2814 0%, #241A10 45%, #1B2333 100%)",
        border: "1.5px solid rgba(201,160,90,0.7)",
        boxShadow: "inset 0 1px 0 rgba(255,230,170,0.12), 0 10px 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Round glow from a circular wrapper: Safari can draw CSS filter
          shadows on images as a rectangle, a box-shadow on a circle it can't. */}
      <span
        className="block w-[88px] h-[88px] flex-shrink-0 -ml-1 rounded-full"
        style={{ boxShadow: "0 0 18px 2px rgba(240,190,100,0.35)" }}
      >
        <Image
          src="/images/ui/snowflake-medallion.webp"
          alt=""
          width={104}
          height={104}
          className="w-full h-full rounded-full"
        />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase" style={{ color: "#C9A064" }}>
          {fill("season.bannerEyebrow")}
        </p>
        <p
          className="font-serif text-[19px] font-bold leading-[1.2] mt-1"
          style={{ color: "#F6EEDC", textShadow: "0 0 14px rgba(255,220,150,0.35)" }}
        >
          {fill("season.bannerTitle")}
        </p>
        <p className="text-[13px] leading-snug mt-1.5" style={{ color: "#D6CFC2" }}>
          {fill("season.bannerBody")}
        </p>
        {withCta && (
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 mt-3 text-[14px] font-semibold px-5 py-2.5 rounded-full"
            style={{
              background: "linear-gradient(180deg, #E9C163 0%, #C89B3C 100%)",
              color: "#1A1208",
              boxShadow: "0 4px 12px rgba(200,155,60,0.3), inset 0 1px 0 rgba(255,245,210,0.5)",
            }}
          >
            {fill("season.bannerCta")} <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
