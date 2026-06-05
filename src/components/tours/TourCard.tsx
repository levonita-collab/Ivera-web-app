"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Tour } from "@/data/tours";
import { formatPrice } from "@/lib/pricing";
import { getMissionsForTour } from "@/data/missions";

interface Props {
  tour: Tour;
}

const CATEGORY_LABELS: Record<Tour["category"], string> = {
  culture: "Culture",
  adventure: "Adventure",
  wine: "Wine",
  heritage: "Heritage",
};

const CATEGORY_COLORS: Record<Tour["category"], string> = {
  culture: "#C89B3C",
  adventure: "#2F5D50",
  wine: "#6E1F2F",
  heritage: "#8B5E3C",
};

export default function TourCard({ tour }: Props) {
  const reduced = useReducedMotion();
  const missions = getMissionsForTour(tour.slug);
  const totalXP = missions.reduce((s, m) => s + m.points, 0);
  const categoryColor = CATEGORY_COLORS[tour.category];

  return (
    <Link href={`/tours/${tour.slug}`} className="block group">
      <motion.article
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFDF8",
          border: "1px solid #E8DDD0",
          boxShadow: "0 1px 6px rgba(31,26,23,0.06)",
        }}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        whileHover={reduced ? {} : {
          y: -4,
          boxShadow: "0 10px 28px rgba(31,26,23,0.13)",
          transition: { duration: 0.18, ease: "easeOut" },
        }}
        whileTap={reduced ? {} : { scale: 0.985, transition: { duration: 0.1 } }}
      >
        {/* Hero image */}
        <div className="h-48 relative">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: categoryColor + "CC" }}
            >
              {CATEGORY_LABELS[tour.category]}
            </span>
          </div>

          {/* XP badge */}
          <div className="absolute top-3 right-3">
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: "rgba(15,12,7,0.65)" }}
            >
              <Zap size={10} style={{ color: "#C89B3C" }} />
              {totalXP} XP
            </span>
          </div>

          {/* Duration at bottom */}
          <div className="absolute bottom-3 right-3">
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: "rgba(15,12,7,0.55)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <Clock size={9} />
              {tour.duration}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3
              className="font-serif font-semibold text-base leading-snug group-hover:underline"
              style={{ color: "#1F1A17", textDecorationColor: "#C89B3C" }}
            >
              {tour.title}
            </h3>
            <p
              className="mt-1 text-[13px] leading-relaxed line-clamp-2"
              style={{ color: "#7B6F63" }}
            >
              {tour.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px]" style={{ color: "#7B6F63" }}>
            <MapPin size={10} />
            <span>{tour.region}</span>
          </div>

          {/* Price + CTA */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid #F0E8DA" }}
          >
            <div>
              <span className="text-base font-bold" style={{ color: "#C89B3C" }}>
                {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
              </span>
              {tour.pricePerPersonGel && (
                <span className="text-[11px] ml-1" style={{ color: "#7B6F63" }}>
                  / person
                </span>
              )}
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(200,155,60,0.12)",
                color: "#C89B3C",
              }}
            >
              View Quest →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
