import type { Metadata } from "next";
import TourCard from "@/components/tours/TourCard";
import { tours, Tour } from "@/data/tours";

export const metadata: Metadata = {
  title: "All Tours",
  description:
    "Browse all 8 Ivera travel quests across Georgia — culture, adventure, wine, and heritage.",
};

const categoryFilters: { label: string; value: Tour["category"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Culture", value: "culture" },
  { label: "Adventure", value: "adventure" },
  { label: "Wine", value: "wine" },
  { label: "Heritage", value: "heritage" },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ToursPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const filtered =
    category && category !== "all"
      ? tours.filter((t) => t.category === category)
      : tours;

  return (
    <div className="px-4 py-6 space-y-5" style={{ backgroundColor: "#F7F0E4", minHeight: "100%" }}>
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#1F1A17" }}>
          Georgia Travel Quests
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7B6F63" }}>
          {filtered.length} {filtered.length === 1 ? "experience" : "experiences"} available
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
              {f.label}
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
