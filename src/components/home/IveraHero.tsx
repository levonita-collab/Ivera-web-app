"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  onStartQuest: () => void;
}

const TRUST_CHIPS = ["8 Curated Routes", "WhatsApp Booking", "XP Rewards"];

export default function IveraHero({ onStartQuest }: Props) {
  return (
    <section className="relative flex flex-col" style={{ minHeight: "100svh" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/tours/kazbegi-mountain-quest.jpg"
          alt="Georgia mountains"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Warm cinematic overlay — light at top, deeper at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247,240,228,0.93) 0%, rgba(247,240,228,0.72) 40%, rgba(31,26,23,0.68) 75%, rgba(15,12,7,0.88) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6" style={{ minHeight: "100svh" }}>
        {/* Tagline at top */}
        <motion.div
          className="pt-5 pb-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-[10px] tracking-[0.35em] uppercase font-semibold"
            style={{ color: "#C89B3C" }}
          >
            ✦ Georgia Travel Quests ✦
          </span>
        </motion.div>

        {/* Main content — centered vertically */}
        <motion.div
          className="flex-1 flex flex-col justify-center py-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1
            className="font-serif font-bold leading-[1.1] mb-4"
            style={{ fontSize: "clamp(2.4rem, 10vw, 3.2rem)", color: "#1F1A17" }}
          >
            Unlock Georgia<br />Through<br />Quests
          </h1>

          <p className="text-[15px] leading-relaxed max-w-[280px]" style={{ color: "#3D2B1A" }}>
            Tours, stories, QR missions and rewards across Georgia.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: "rgba(200,155,60,0.14)",
                  color: "#C89B3C",
                  border: "1px solid rgba(200,155,60,0.35)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTAs */}
        <motion.div
          className="pb-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[11px] text-center font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
            Your Explorer Pass is waiting.
          </p>

          <button
            onClick={onStartQuest}
            className="w-full py-4 rounded-full font-semibold text-base text-white active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#C89B3C" }}
          >
            Start Your Quest
          </button>

          <Link
            href="/tours"
            className="block w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all"
            style={{
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            Explore Tours
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
