import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, Clock, Users, Zap, Check, X } from "lucide-react";
import { tours, getTourBySlug } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import { formatPrice } from "@/lib/pricing";
import BookingWidget from "@/components/tours/BookingWidget";

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

const CATEGORY_LABELS: Record<string, string> = {
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
    <div style={{ backgroundColor: "#F7F0E4", minHeight: "100%" }}>
      {/* Photo hero */}
      <div className="h-56 relative">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 672px) 100vw, 672px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Back button */}
        <Link
          href="/tours"
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: "rgba(15,12,7,0.55)" }}
        >
          <ChevronLeft size={18} />
        </Link>

        {/* Category + title overlay */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <span
            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: "rgba(200,155,60,0.75)" }}
          >
            {CATEGORY_LABELS[tour.category] ?? tour.category}
          </span>
          <h1 className="font-serif text-2xl font-bold text-white leading-tight drop-shadow-md">
            {tour.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-6">
        {/* Meta strip */}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#7B6F63" }}>
          <span className="flex items-center gap-1">
            <MapPin size={12} style={{ color: "#C89B3C" }} /> {tour.region}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} style={{ color: "#C89B3C" }} /> {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} style={{ color: "#C89B3C" }} /> Small group
          </span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: "#C89B3C" }}>
            <Zap size={12} /> {totalQuestXP} XP available
          </span>
        </div>

        {/* Price */}
        <div>
          <span className="text-2xl font-bold" style={{ color: "#C89B3C" }}>
            {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
          </span>
          {tour.pricePerPersonGel && (
            <span className="text-sm ml-1" style={{ color: "#7B6F63" }}>
              / person
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "#3D2B1A" }}>
          {tour.longDescription}
        </p>

        {/* Booking Widget */}
        <BookingWidget tour={tour} />

        {/* Route */}
        <div>
          <h2
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#C89B3C" }}
          >
            Route Stops
          </h2>
          <ol className="space-y-2">
            {tour.routeStops.map((stop, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#3D2B1A" }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "rgba(200,155,60,0.15)",
                    border: "1px solid rgba(200,155,60,0.35)",
                    color: "#C89B3C",
                  }}
                >
                  {i + 1}
                </span>
                {stop}
              </li>
            ))}
          </ol>
        </div>

        {/* Included / Excluded */}
        <div
          className="rounded-2xl p-4 border space-y-4"
          style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
        >
          <div>
            <h3
              className="text-[11px] font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#2F5D50" }}
            >
              Included
            </h3>
            <ul className="space-y-1.5">
              {tour.included.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#3D2B1A" }}>
                  <Check size={13} style={{ color: "#2F5D50" }} className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-[11px] font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#6E1F2F" }}
            >
              Not included
            </h3>
            <ul className="space-y-1.5">
              {tour.excluded.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#7B6F63" }}>
                  <X size={13} style={{ color: "#6E1F2F" }} className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quest missions preview */}
        <div>
          <h2
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#C89B3C" }}
          >
            Quest Missions ({missions.length})
          </h2>
          <div className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 border"
                style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
              >
                <p className="text-sm" style={{ color: "#1F1A17" }}>
                  {m.title}
                </p>
                <span className="text-xs font-semibold" style={{ color: "#C89B3C" }}>
                  +{m.points} XP
                </span>
              </div>
            ))}
          </div>
          <Link
            href={`/quest/${tour.slug}`}
            className="mt-3 block w-full text-center py-3 rounded-full text-sm font-semibold border transition-colors"
            style={{
              borderColor: "#C89B3C",
              color: "#C89B3C",
              backgroundColor: "rgba(200,155,60,0.08)",
            }}
          >
            Start Quest ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
