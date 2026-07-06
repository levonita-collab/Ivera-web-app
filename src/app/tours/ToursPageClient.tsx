"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import { Tour } from "@/data/tours";
import { useTranslation, ruPlural } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

const categoryFilters: { labelKey: DictionaryKey; value: Tour["category"] | "all" }[] = [
  { labelKey: "tours.filterAll", value: "all" },
  { labelKey: "tours.filterCulture", value: "culture" },
  { labelKey: "tours.filterAdventure", value: "adventure" },
  { labelKey: "tours.filterWine", value: "wine" },
  { labelKey: "tours.filterHeritage", value: "heritage" },
];

interface Props {
  tours: Tour[];
  category?: string;
}

export default function ToursPageClient({ tours: filtered, category }: Props) {
  const { t, language } = useTranslation();

  const countLabel =
    language === "ru"
      ? `${t("tours.available")}: ${filtered.length} ${ruPlural(filtered.length, "тур", "тура", "туров")}`
      : `${filtered.length} ${filtered.length === 1 ? t("tours.experience") : t("tours.experiences")} ${t("tours.available")}`;

  return (
    <div className="px-4 py-6 space-y-5" style={{ backgroundColor: "#F7F0E4", minHeight: "100%" }}>
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#1F1A17" }}>
          {t("tours.title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7B6F63" }}>
          {countLabel}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryFilters.map((f) => {
          const active = (f.value === "all" && !category) || category === f.value;
          return (
            <a
              key={f.value}
              href={f.value === "all" ? "/tours" : `/tours?category=${f.value}`}
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0"
              style={{
                backgroundColor: active ? "#C89B3C" : "rgba(200,155,60,0.1)",
                color: active ? "#FFFFFF" : "#C89B3C",
                border: `1.5px solid ${active ? "#C89B3C" : "rgba(200,155,60,0.3)"}`,
              }}
            >
              {t(f.labelKey)}
            </a>
          );
        })}
      </div>

      {/* Combo builder CTA */}
      <Link
        href="/packages"
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 w-full text-left"
        style={{
          background: "linear-gradient(135deg, #2A1E08 0%, #1E1508 100%)",
          border: "1px solid rgba(200,155,60,0.35)",
          boxShadow: "0 2px 12px rgba(200,155,60,0.12)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(200,155,60,0.18)" }}
        >
          <Zap size={18} style={{ color: "#C89B3C" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#E8D5A0" }}>
            {language === "ru" ? "Собери свой маршрут" : "Build Your Trip"}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "#8A7254" }}>
            {language === "ru"
              ? "Выбери 2+ тура и получи скидку до 15%"
              : "Pick 2+ tours and save up to 15%"}
          </p>
        </div>
        <span className="text-xs font-bold flex-shrink-0" style={{ color: "#C89B3C" }}>
          −15%
        </span>
      </Link>

      {/* Tour grid */}
      <div className="space-y-4">
        {filtered.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
