"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Region } from "@/data/regions";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedRegion } from "@/lib/i18n/localize";

interface Props {
  region: Region;
}

export default function RegionCard({ region: rawRegion }: Props) {
  const reduced = useReducedMotion();
  const { t, language } = useTranslation();
  const region = getLocalizedRegion(rawRegion, language);

  return (
    <Link href={region.href} className="block group flex-shrink-0 w-[78%] sm:w-full">
      <motion.article
        className="relative rounded-2xl overflow-hidden aspect-[4/3]"
        style={{ boxShadow: "0 6px 20px rgba(15,12,30,0.18)" }}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={
          reduced
            ? {}
            : {
                scale: 1.015,
                boxShadow:
                  "0 0 0 1px rgba(200,155,60,0.55), 0 14px 36px rgba(15,12,30,0.32), 0 0 24px rgba(200,155,60,0.18)",
                transition: { duration: 0.22, ease: "easeOut" },
              }
        }
        whileTap={reduced ? {} : { scale: 0.99, transition: { duration: 0.1 } }}
      >
        <Image
          src={`/assets/regions/${region.slug}-card.webp`}
          alt={region.alt}
          fill
          placeholder="blur"
          blurDataURL={region.blurDataURL}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 78vw, (max-width: 672px) 33vw, 224px"
        />

        {/* Legibility gradient (in addition to the baked-in cinematic grade) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(14,12,28,0.92) 0%, rgba(14,12,28,0.35) 48%, rgba(14,12,28,0) 75%)",
          }}
        />

        {/* Route / map-pin accent — top right */}
        <div
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: "rgba(15,12,30,0.45)",
            border: "1px solid rgba(200,155,60,0.4)",
            backdropFilter: "blur(2px)",
          }}
        >
          <MapPin size={14} style={{ color: "#E8C468" }} />
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="text-[10px] tracking-widest uppercase font-semibold mb-1"
            style={{ color: "#E8C468" }}
          >
            {region.routeHint}
          </p>
          <h3 className="font-serif text-xl font-bold text-white leading-tight">
            {region.name}
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "rgba(242,232,208,0.75)" }}>
            {region.subtitle}
          </p>

          <div
            className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors duration-300 group-hover:bg-[rgba(200,155,60,0.92)] group-hover:text-[#1F1A17]"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "#FFFFFF",
            }}
          >
            {t("region.exploreRoute")}
            <ArrowUpRight size={12} />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
