"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Region } from "@/data/regions";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLocalizedRegion } from "@/lib/i18n/localize";

interface Props {
  region: Region;
}

export default function RegionCardCompact({ region: rawRegion }: Props) {
  const reduced = useReducedMotion();
  const { language } = useLanguage();
  const region = getLocalizedRegion(rawRegion, language);

  return (
    <Link href={region.href} className="block group flex-shrink-0 w-28">
      <motion.div
        className="relative rounded-xl overflow-hidden aspect-[3/4]"
        style={{ boxShadow: "0 4px 14px rgba(15,12,30,0.16)" }}
        whileHover={reduced ? {} : { scale: 1.03, transition: { duration: 0.2 } }}
        whileTap={reduced ? {} : { scale: 0.97, transition: { duration: 0.1 } }}
      >
        <Image
          src={`/assets/regions/${region.slug}-card.webp`}
          alt={region.alt}
          fill
          placeholder="blur"
          blurDataURL={region.blurDataURL}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="112px"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(14,12,28,0.85) 0%, rgba(14,12,28,0.1) 55%, rgba(14,12,28,0) 75%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="flex items-center gap-1 text-[11px] font-semibold text-white leading-tight">
            <MapPin size={10} style={{ color: "#E8C468" }} />
            {region.name}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
