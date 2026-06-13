import type { Metadata } from "next";
import { tours } from "@/data/tours";
import ToursPageClient from "./ToursPageClient";

export const metadata: Metadata = {
  title: "All Tours",
  description:
    "Browse all 8 Ivera travel quests across Georgia — culture, adventure, wine, and heritage.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ToursPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const filtered =
    category && category !== "all"
      ? tours.filter((t) => t.category === category)
      : tours;

  return <ToursPageClient tours={filtered} category={category} />;
}
