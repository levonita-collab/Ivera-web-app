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
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-white font-bold">
          Georgia Travel Quests
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          {filtered.length} experience{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryFilters.map((f) => (
          <a
            key={f.value}
            href={f.value === "all" ? "/tours" : `/tours?category=${f.value}`}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0 ${
              (f.value === "all" && !category) || category === f.value
                ? "bg-brand-gold text-brand-black border-brand-gold"
                : "bg-transparent text-brand-muted border-white/10 hover:border-brand-gold/40"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Tour grid */}
      <div className="space-y-3">
        {filtered.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
