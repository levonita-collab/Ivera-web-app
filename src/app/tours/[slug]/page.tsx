import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tours, getTourBySlug } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import TourDetailClient from "./TourDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};
  return { title: tour.title, description: tour.shortDescription };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const missions = getMissionsForTour(tour.slug);

  return <TourDetailClient tour={tour} missions={missions} />;
}
