"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

interface Props {
  onStartQuest: () => void;
}

const VALUE_CHIP_KEYS: DictionaryKey[] = [
  "hero.chipLocalExpert",
  "hero.chipEnglishGuide",
  "hero.chipSmallGroups",
  "hero.chipWhatsappBooking",
  "hero.chipNoPayment",
];

export default function IveraHero({ onStartQuest }: Props) {
  const reduced = useReducedMotion();
  const { t, language } = useTranslation();

  return (
    <section className="relative flex flex-col" style={{ minHeight: "100svh" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-gergeti.jpg"
          alt="Gergeti Trinity Church above the clouds, Mount Kazbek, Georgia"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247,240,228,0.97) 0%, rgba(247,240,228,0.82) 33%, rgba(31,26,23,0.7) 65%, rgba(15,12,7,0.95) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col px-6" style={{ minHeight: "100svh" }}>
        {/* Top label */}
        <motion.div
          className="pt-5"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <span
            className="text-[10px] tracking-[0.38em] uppercase font-semibold"
            style={{ color: "#C89B3C" }}
          >
            {t("hero.tagline")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="flex-1 flex flex-col justify-center py-6"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
        >
          <h1
            className="font-serif font-bold leading-[1.06] mb-4"
            style={{ fontSize: "clamp(2.5rem, 10.5vw, 3.4rem)", color: "#1F1A17" }}
          >
            {t("hero.headline").split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="text-[15px] leading-relaxed" style={{ color: "#3D2B1A", maxWidth: "285px" }}>
            {t("hero.subtitle")}
          </p>

          {/* Value chips — horizontal scroll */}
          <motion.div
            className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none -mx-6 px-6"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            {VALUE_CHIP_KEYS.map((key) => (
              <span
                key={key}
                className="inline-flex items-center whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold flex-shrink-0"
                style={{
                  backgroundColor: "rgba(200,155,60,0.13)",
                  color: "#C89B3C",
                  border: "1px solid rgba(200,155,60,0.32)",
                }}
              >
                {t(key)}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="pb-10 space-y-3"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.46 }}
        >
          <p
            className="text-[11px] text-center font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            {t("hero.freePass")}
          </p>

          <button
            onClick={onStartQuest}
            className="w-full py-4 rounded-full font-semibold text-base text-white transition-transform active:scale-[0.97]"
            style={{ backgroundColor: "#C89B3C" }}
          >
            {t("hero.startJourney")}
          </button>

          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-opacity active:opacity-70"
            style={{
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.22)",
              backgroundColor: "rgba(255,255,255,0.07)",
            }}
          >
            <MessageCircle size={14} />
            {t("hero.buildCustomTrip")}
          </a>

          <p className="text-center">
            <Link
              href="/tours"
              className="text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {t("hero.exploreRoutes")}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
