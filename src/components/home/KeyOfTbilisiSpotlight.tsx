"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, MapPin } from "lucide-react";
import IveraIcon from "@/components/layout/IveraIcon";

const PREVIEW_MISSIONS = [
  { n: 1, title: "Freedom Square Signal", location: "Freedom Square", xp: 50, teaser: "A hidden city story begins here.", state: "open" as const },
  { n: 2, title: "Old City Whisper", location: "Narikala District", xp: 75, teaser: "Carved balconies guard old secrets.", state: "locked" as const },
  { n: 3, title: "Bridge of Tomorrow", location: "Peace Bridge", xp: 75, teaser: "Where the river tells the future.", state: "locked" as const },
];

export default function KeyOfTbilisiSpotlight() {
  const reduced = useReducedMotion();

  return (
    <section className="px-4 pt-6 pb-8">
      <motion.div
        className="relative rounded-[28px] overflow-hidden"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ border: "1px solid rgba(200,155,60,0.28)" }}
      >
        {/* Layered Tbilisi background */}
        <div className="absolute inset-0">
          <Image
            src="/images/tours/tbilisi-city-quest.jpg"
            alt="Old Tbilisi at dusk"
            fill
            className="object-cover object-center"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          {/* Cinematic gradient — warm evening light fading into deep night */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, rgba(15,12,7,0.45) 0%, rgba(20,15,8,0.72) 48%, rgba(11,8,4,0.96) 100%)",
            }}
          />
          {/* Soft gold glow from the corner */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 78% 12%, rgba(200,155,60,0.28) 0%, transparent 55%)",
            }}
          />
        </div>

        <div className="relative z-10 px-5 pt-6 pb-6">
          {/* Logo + free label */}
          <div className="flex items-center justify-between mb-5">
            <IveraIcon size={22} darkBg />
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(76,175,80,0.16)",
                color: "#7BD389",
                border: "1px solid rgba(76,175,80,0.32)",
              }}
            >
              Free Starter Quest
            </span>
          </div>

          {/* Title block */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <p
              className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-2"
              style={{ color: "#C89B3C" }}
            >
              ✦ The adventure begins ✦
            </p>
            <h2
              className="font-serif font-bold text-white leading-[1.04]"
              style={{ fontSize: "clamp(2.1rem, 9vw, 2.9rem)" }}
            >
              Key of Tbilisi
            </h2>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)", maxWidth: "300px" }}
            >
              Unlock the spirit of Tbilisi through 3 hidden city missions.
            </p>
            <p
              className="mt-3 text-[12px] font-semibold tracking-wide"
              style={{ color: "#E0B85A" }}
            >
              3 missions · 20 minutes · 200 XP
            </p>
          </motion.div>

          {/* Mission preview cards */}
          <div className="mt-5 space-y-2.5">
            {PREVIEW_MISSIONS.map((m, i) => {
              const open = m.state === "open";
              return (
                <motion.div
                  key={m.n}
                  initial={reduced ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
                  style={{
                    backgroundColor: open ? "rgba(200,155,60,0.12)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${open ? "rgba(200,155,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[13px]"
                    style={{
                      backgroundColor: open ? "#C89B3C" : "rgba(255,255,255,0.08)",
                      color: open ? "#0F0C07" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {open ? m.n : <Lock size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-semibold leading-tight truncate"
                      style={{ color: open ? "#FFFFFF" : "rgba(255,255,255,0.7)" }}
                    >
                      {m.title}
                    </p>
                    <p
                      className="text-[10.5px] mt-0.5 flex items-center gap-1 truncate"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <MapPin size={9} /> {m.location} · {m.teaser}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: open ? "rgba(200,155,60,0.22)" : "rgba(255,255,255,0.06)",
                      color: open ? "#E0B85A" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    +{m.xp}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href="/free-tbilisi-quest"
            className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-base text-center transition-transform active:scale-[0.97]"
            style={{ backgroundColor: "#C89B3C", color: "#0F0C07" }}
          >
            Start Free Quest <ArrowRight size={16} />
          </Link>
          <p
            className="mt-3 text-[11px] text-center"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Free to start. Designed by local Georgian experts.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
