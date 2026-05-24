import { tours } from "@/data/tours";
import { notFound } from "next/navigation";
import { getTourBySlug } from "@/data/tours";
import QuestClient from "./QuestClient";

interface Props {
  params: Promise<{ tourSlug: string }>;
}

export async function generateStaticParams() {
  return tours.map((t) => ({ tourSlug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { tourSlug } = await params;
  const tour = getTourBySlug(tourSlug);
  if (!tour) return {};
  return { title: `${tour.title} — Quest` };
}

export default async function QuestPage({ params }: Props) {
  const { tourSlug } = await params;
  const tour = getTourBySlug(tourSlug);
  if (!tour) notFound();
  return <QuestClient tour={tour} />;
}
