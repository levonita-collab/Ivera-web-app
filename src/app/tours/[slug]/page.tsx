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
  // A route's openGraph replaces the root one, so repeat siteName/type here.
  return {
    title: tour.title,
    description: tour.shortDescription,
    openGraph: {
      title: `${tour.title} | Ivera`,
      description: tour.shortDescription,
      siteName: "Ivera",
      type: "website",
      images: [{ url: tour.image, alt: tour.title }],
    },
    twitter: { card: "summary_large_image", images: [tour.image] },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const missions = getMissionsForTour(tour.slug);

  return <TourDetailClient tour={tour} missions={missions} />;
}
