"use client";

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

      {/* Tour grid */}
      <div className="space-y-4">
        {filtered.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
