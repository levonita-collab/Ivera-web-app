import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, Users, Zap } from "lucide-react";
import { tours, getTourBySlug } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import { formatPrice } from "@/lib/pricing";
import BookingWidget from "@/components/tours/BookingWidget";
import IncludedExcluded from "@/components/tours/IncludedExcluded";
import Badge from "@/components/ui/Badge";

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
  return {
    title: tour.title,
    description: tour.shortDescription,
  };
}

const categoryLabels: Record<string, string> = {
  culture: "Culture",
  adventure: "Adventure",
  wine: "Wine",
  heritage: "Heritage",
};

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const missions = getMissionsForTour(tour.slug);
  const totalQuestXP = missions.reduce((s, m) => s + m.points, 0);

  return (
    <div>
      {/* Hero band */}
      <div
        className="h-52 relative flex flex-col justify-end px-4 pb-4"
        style={{
          background: `linear-gradient(160deg, ${tour.gradientFrom}, ${tour.gradientTo})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Back button */}
        <Link
          href="/tours"
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white"
        >
          <ChevronLeft size={18} />
        </Link>

        <div className="relative z-10 space-y-1.5">
          <Badge label={categoryLabels[tour.category] ?? tour.category} variant="gold" />
          <h1 className="font-serif text-2xl text-white font-bold leading-tight">
            {tour.title}
          </h1>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Meta strip */}
        <div className="flex flex-wrap gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {tour.region}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} /> Small group
          </span>
          <span className="flex items-center gap-1 text-brand-gold font-semibold">
            <Zap size={12} /> {totalQuestXP} XP available
          </span>
        </div>

        {/* Price */}
        <div>
          <span className="text-2xl font-bold text-brand-gold">
            {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
          </span>
          {tour.pricePerPersonGel && (
            <span className="text-sm text-brand-muted ml-1">/ person</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-brand-cream/80 leading-relaxed">
          {tour.longDescription}
        </p>

        {/* Booking Widget */}
        <BookingWidget tour={tour} />

        {/* Route */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-3">
            Route Stops
          </h2>
          <ol className="space-y-2">
            {tour.routeStops.map((stop, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-cream/80">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-[10px] text-brand-gold font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {stop}
              </li>
            ))}
          </ol>
        </div>

        {/* Included / Excluded */}
        <div className="bg-brand-dark rounded-2xl p-4 border border-white/5">
          <IncludedExcluded
            included={tour.included}
            excluded={tour.excluded}
          />
        </div>

        {/* Quest missions preview */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-3">
            Quest Missions ({missions.length})
          </h2>
          <div className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl bg-brand-dark border border-white/5 px-3 py-2.5"
              >
                <p className="text-sm text-white">{m.title}</p>
                <span className="text-xs text-brand-gold font-semibold">
                  +{m.points} XP
                </span>
              </div>
            ))}
          </div>
          <Link
            href={`/quest/${tour.slug}`}
            className="mt-3 block w-full text-center py-3 rounded-full text-sm font-semibold border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 transition-colors"
          >
            Start Quest ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
