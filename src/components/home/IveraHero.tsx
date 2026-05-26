"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  onStartQuest: () => void;
}

const TRUST_CHIPS = ["8 Curated Routes", "WhatsApp Booking", "XP Rewards"];

export default function IveraHero({ onStartQuest }: Props) {
  const reduced = useReducedMotion();

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
        {/* Warm cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247,240,228,0.94) 0%, rgba(247,240,228,0.76) 38%, rgba(31,26,23,0.65) 70%, rgba(15,12,7,0.9) 100%)",
          }}
        />
      </div>

      {/* Content */}
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
            ✦ Georgia Travel Quests ✦
          </span>
        </motion.div>

        {/* Headline — centred vertically */}
        <motion.div
          className="flex-1 flex flex-col justify-center py-6"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
        >
          <h1
            className="font-serif font-bold leading-[1.08] mb-4"
            style={{ fontSize: "clamp(2.5rem, 10.5vw, 3.4rem)", color: "#1F1A17" }}
          >
            Your journey<br />begins in<br />Georgia.
          </h1>

          <p className="text-[15px] leading-relaxed max-w-[270px]" style={{ color: "#3D2B1A" }}>
            Discover timeless culture, epic landscapes, and rich heritage
            through tours, quests, and rewards.
          </p>

          {/* Trust chips */}
          <motion.div
            className="flex flex-wrap gap-2 mt-5"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: "rgba(200,155,60,0.13)",
                  color: "#C89B3C",
                  border: "1px solid rgba(200,155,60,0.32)",
                }}
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="pb-9 space-y-3"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.46 }}
        >
          <p
            className="text-[11px] text-center font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Your Explorer Pass is waiting.
          </p>

          <button
            onClick={onStartQuest}
            className="w-full py-4 rounded-full font-semibold text-base text-white transition-transform active:scale-[0.98]"
            style={{ backgroundColor: "#C89B3C" }}
          >
            Start Your Journey
          </button>

          <Link
            href="/tours"
            className="block w-full py-3.5 rounded-full font-semibold text-sm text-center"
            style={{
              color: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(255,255,255,0.22)",
              backgroundColor: "rgba(255,255,255,0.07)",
            }}
          >
            Explore Tours
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
