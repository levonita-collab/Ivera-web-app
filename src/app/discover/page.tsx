"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  MessageCircle,
  Globe2,
  Users2,
  ShieldCheck,
  Compass,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

const INK = "#0A0805";
const CARD = "#1A1408";
const GOLD = "#C89B3C";
const GOLD_BRIGHT = "#E4C878";
const MUTED = "#9A8A70";
const MUTED_DIM = "#5A4A38";
const CREAM = "#F7F0E4";
const WINE = "#7A2331";
const WHATSAPP = "#25D366";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

// ── Ridge — the mountain-silhouette bridge between sections ────────────────
// Same device used on /experience: grows into view instead of a hard color
// cut, tying every section hand-off back to Georgia's own skyline.

function Ridge({ bgBefore, fill }: { bgBefore: string; fill: string }) {
  const reduced = useReducedMotion();
  return (
    <div style={{ backgroundColor: bgBefore, overflow: "hidden" }}>
      <motion.svg
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: "7vh", minHeight: 40, maxHeight: 60, transformOrigin: "top" }}
        initial={reduced ? undefined : { scaleY: 0.35, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <path
          d="M0,90 L0,52 L38,18 L72,44 L110,8 L150,38 L185,20 Q205,10 222,24 L262,2 L300,36 L340,12 L400,30 L400,90 Z"
          fill={fill}
        />
        <path
          d="M0,52 L38,18 L72,44 L110,8 L150,38 L185,20 Q205,10 222,24 L262,2 L300,36 L340,12 L400,30"
          fill="none"
          stroke="rgba(224,184,90,0.5)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────

function Hero({ isRu, language }: { isRu: boolean; language: "en" | "ru" }) {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "16%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={heroRef} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={reduced ? {} : { scale: 1.08 }}
          transition={{ duration: 22, ease: "easeOut" }}
        >
          <Image
            src="/images/tours/batumi-black-sea.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.35) 40%, rgba(10,8,5,0.92) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
      >
        <Image src="/images/logo-dark.png" alt="Ivera" width={104} height={35} className="h-8 w-auto" priority />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-[11px] uppercase tracking-[0.28em] font-semibold mb-5"
          style={{ color: GOLD_BRIGHT }}
        >
          {isRu
            ? "Частный грузинский туроператор · с 2016 года"
            : "Boutique Georgian tour operator · Est. 2016"}
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl font-bold text-white max-w-3xl text-balance"
        >
          {isRu ? "Грузия,\nлично для вас." : "Georgia,\nguided personally."}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.32 }}
          className="mt-6 text-base md:text-lg max-w-lg leading-relaxed"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          {isRu
            ? "Не автобус на сто незнакомцев. Небольшая грузинская команда во главе с гидом с 9-летним опытом — показываем страну такой, какой видим её сами."
            : "Not a bus of a hundred strangers. A small Georgian team — led by a guide with 9+ years on these roads — showing you the country the way we actually see it."}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white w-full sm:w-auto"
            style={{ backgroundColor: WHATSAPP }}
          >
            <MessageCircle size={16} />
            {isRu ? "Написать Левани в WhatsApp" : "Message Levani on WhatsApp"}
          </a>
          <a
            href="#journeys"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full text-sm font-semibold border w-full sm:w-auto"
            style={{ borderColor: "rgba(255,255,255,0.28)", color: "#F0E6D2" }}
          >
            {isRu ? "Смотреть маршруты" : "See signature journeys"}
            <ArrowRight size={14} />
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {isRu ? "Листайте вниз" : "Scroll"}
          </span>
          <motion.div
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 12,
              height: 12,
              borderRight: "1.5px solid rgba(255,255,255,0.55)",
              borderBottom: "1.5px solid rgba(255,255,255,0.55)",
              transform: "rotate(45deg)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Choose your path ────────────────────────────────────────────────────────

const PATHS = [
  {
    image: "/images/tours/vardzia-cave-kingdom.jpg",
    kicker: { en: "8 curated routes", ru: "8 маршрутов" },
    title: { en: "Explore Signature\nQuests", ru: "Смотреть\nмаршруты" },
    cta: { en: "Browse the routes", ru: "Все маршруты" },
    href: "#journeys",
  },
  {
    image: "/images/tours/kazbegi-mountain-quest.jpg",
    kicker: { en: "9+ years guiding", ru: "9+ лет в деле" },
    title: { en: "Meet Your\nGuide", ru: "Познакомиться\nс гидом" },
    cta: { en: "Levani's story", ru: "История Левани" },
    href: "#founder",
  },
];

function ChoosePath({ isRu }: { isRu: boolean }) {
  return (
    <section style={{ backgroundColor: INK }}>
      <div className="px-6 pt-9 pb-4">
        <motion.p
          {...fadeUp}
          className="text-[10px] uppercase tracking-[0.22em] font-semibold"
          style={{ color: GOLD }}
        >
          {isRu ? "Два пути начать ↓" : "Two ways to start ↓"}
        </motion.p>
      </div>
      <div className="grid grid-cols-2">
        {PATHS.map((p, i) => (
          <motion.a
            key={p.href}
            href={p.href}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.1 }}
            className="group relative flex items-end h-64 md:h-80 overflow-hidden"
          >
            <Image
              src={p.image}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, transparent 28%, rgba(10,8,5,0.9) 100%)" }}
            />
            <div className="relative z-10 p-4 md:p-6">
              <p
                className="text-[9.5px] uppercase tracking-wider font-semibold"
                style={{ color: GOLD_BRIGHT }}
              >
                {isRu ? p.kicker.ru : p.kicker.en}
              </p>
              <h3
                className="font-serif text-lg md:text-2xl font-bold text-white mt-1 leading-tight whitespace-pre-line"
              >
                {isRu ? p.title.ru : p.title.en}
              </h3>
              <span className="inline-block mt-2 text-[11px] md:text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
                {isRu ? p.cta.ru : p.cta.en} →
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// ── Trust stats ───────────────────────────────────────────────────────────

const STATS = [
  { value: "9+", en: "Years guiding Georgia", ru: "лет проводим туры" },
  { value: "8", en: "Signature quest routes", ru: "авторских маршрутов" },
  { value: "2–50", en: "Guests per group, any size", ru: "человек в группе — любой размер" },
  { value: "0", en: "GEL paid upfront — zero risk", ru: "GEL предоплата — ноль риска" },
];

function TrustStats({ isRu }: { isRu: boolean }) {
  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: CREAM }}>
      <div className="max-w-4xl mx-auto">
        <motion.p
          {...fadeUp}
          className="text-[11px] uppercase tracking-[0.24em] font-semibold text-center"
          style={{ color: WINE }}
        >
          {isRu ? "Почему нам доверяют" : "Why serious travellers choose Ivera"}
        </motion.p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="text-center px-2"
            >
              <p
                className="font-serif text-4xl md:text-5xl font-bold"
                style={{ color: "#231A10", fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </p>
              <p
                className="text-[12px] md:text-[13px] mt-2 leading-snug"
                style={{ color: "#6B5B45" }}
              >
                {isRu ? s.ru : s.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Founder ───────────────────────────────────────────────────────────────

const FOUNDER_CHECKLIST = [
  {
    icon: Globe2,
    en: "Fluent in English and Russian — full tours in both, no switching halfway",
    ru: "Свободно говорит по-английски и по-русски — без переключения на середине тура",
  },
  {
    icon: Users2,
    en: "Groups of any size, from 2 to 50 — most commonly up to 20",
    ru: "Группы любого размера, от 2 до 50 — чаще всего до 20 человек",
  },
  {
    icon: ShieldCheck,
    en: "You pay on the day, not before — book on WhatsApp with zero risk",
    ru: "Оплата в день тура, без предоплаты — бронирование в WhatsApp без риска",
  },
  {
    icon: Compass,
    en: "Every tour is a quest — missions and stories, not a passive walk",
    ru: "Каждый тур — это квест: миссии и истории, а не пассивная прогулка",
  },
];

function Founder({ isRu }: { isRu: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [reduced ? "0%" : "-8%", reduced ? "0%" : "8%"]);

  return (
    <section id="founder" ref={ref} className="relative px-6 py-16 md:py-24 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image src="/images/team/levani.jpg" alt="" fill className="object-cover" sizes="100vw" />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, rgba(43,18,32,0.88) 0%, rgba(21,12,8,0.92) 55%, rgba(10,8,5,0.96) 100%)",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.p
          {...fadeUp}
          className="text-[11px] uppercase tracking-[0.24em] font-semibold mb-6"
          style={{ color: GOLD_BRIGHT }}
        >
          {isRu ? "Ваш гид" : "Your guide"}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="rounded-3xl p-6 md:p-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: "2px solid rgba(200,155,60,0.4)" }}
            >
              <Image src="/images/team/levani.jpg" alt="Levani" fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white">Levani</p>
              <p className="text-[12px] mt-0.5" style={{ color: GOLD }}>
                {isRu ? "Основатель · Тбилиси, Грузия" : "Founder · Tbilisi, Georgia"}
              </p>
            </div>
          </div>
          <p className="text-[15px] md:text-base leading-relaxed mb-5" style={{ color: "#E4D9C4" }}>
            {isRu
              ? "Левани — профессиональный гид по Грузии с 9-летним опытом. Специализируется на культурных, исторических и гастрономических маршрутах: от горных монастырей Казбеги до пещерных городов Вардзии и виноградников Кахетии."
              : "Levani is a professional Georgian tour guide with 9 years of experience — specialising in cultural, historical, and gastronomic routes across the country, from the mountain monasteries of Kazbegi to the cave cities of Vardzia and the vineyards of Kakheti."}
          </p>
          <div className="space-y-3.5">
            {FOUNDER_CHECKLIST.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.en} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(200,155,60,0.14)" }}
                  >
                    <Icon size={13} style={{ color: GOLD_BRIGHT }} />
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#C8B89A" }}>
                    {isRu ? item.ru : item.en}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Signature journeys ────────────────────────────────────────────────────

const JOURNEYS = [
  {
    image: "/images/tours/tbilisi-city-quest.jpg",
    region: { en: "Tbilisi", ru: "Тбилиси" },
    title: { en: "The old capital, on foot", ru: "Старая столица пешком" },
    href: "/tours/tbilisi-city-quest",
  },
  {
    image: "/images/tours/kutaisi-martvili-canyons.jpg",
    region: { en: "Imereti / Samegrelo", ru: "Имерети / Самегрело" },
    title: { en: "A canyon carved by water", ru: "Каньон, созданный водой" },
    href: "/tours/kutaisi-martvili-canyons",
  },
  {
    image: "/images/tours/vardzia-cave-kingdom.jpg",
    region: { en: "Samtskhe-Javakheti", ru: "Самцхе-Джавахети" },
    title: { en: "A kingdom carved in rock", ru: "Царство, высеченное в скале" },
    href: "/tours/vardzia-cave-kingdom",
  },
  {
    image: "/images/tours/batumi-black-sea.jpg",
    region: { en: "Adjara", ru: "Аджария" },
    title: { en: "Sunset on the Black Sea", ru: "Закат на Чёрном море" },
    href: "/tours/batumi-black-sea-quest",
  },
];

function Journeys({ isRu }: { isRu: boolean }) {
  return (
    <section id="journeys" className="py-16 md:py-24" style={{ backgroundColor: CREAM }}>
      <div className="px-6 max-w-5xl mx-auto">
        <motion.p
          {...fadeUp}
          className="text-[11px] uppercase tracking-[0.24em] font-semibold"
          style={{ color: WINE }}
        >
          {isRu ? "Главные маршруты" : "Signature journeys"}
        </motion.p>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="font-serif text-3xl md:text-4xl font-bold mt-2 max-w-md"
          style={{ color: "#231A10" }}
        >
          {isRu ? "Свайпайте по Грузии" : "Swipe through Georgia"}
        </motion.h2>
      </div>

      <div
        className="mt-10 flex gap-4 overflow-x-auto px-6 pb-3"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {JOURNEYS.map((j, i) => (
          <motion.div
            key={j.href}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="flex-none w-[76%] sm:w-[46%] md:w-[30%]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link
              href={j.href}
              className="group block relative rounded-2xl overflow-hidden"
              style={{ height: 280, boxShadow: "0 10px 24px -8px rgba(35,26,16,0.28)" }}
            >
              <Image
                src={j.image}
                alt={isRu ? j.title.ru : j.title.en}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 76vw, (max-width: 768px) 46vw, 30vw"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-4"
                style={{
                  backgroundColor: "rgba(10,8,5,0.42)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderTop: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <p
                  className="text-[9px] uppercase tracking-widest font-semibold"
                  style={{ color: GOLD_BRIGHT }}
                >
                  {isRu ? j.region.ru : j.region.en}
                </p>
                <h3 className="font-serif text-base font-bold text-white mt-0.5">
                  {isRu ? j.title.ru : j.title.en}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5 justify-center mt-2">
        {JOURNEYS.map((j, i) => (
          <span
            key={j.href}
            className="rounded-full"
            style={{
              width: i === 0 ? 14 : 5,
              height: 5,
              backgroundColor: i === 0 ? WINE : "rgba(122,35,49,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    en: "Message Levani on WhatsApp — tell him your dates and what excites you.",
    ru: "Напишите Левани в WhatsApp — расскажите даты и что вам интересно.",
  },
  {
    n: "02",
    en: "Get a personal plan back — real pricing, real availability, no bots.",
    ru: "Получите личный план — реальные цены и наличие мест, без ботов.",
  },
  {
    n: "03",
    en: "Meet in Tbilisi and pay on the day — the quest starts the moment you arrive.",
    ru: "Встречаемся в Тбилиси, оплата в день тура — квест начинается сразу по приезде.",
  },
];

function HowItWorks({ isRu }: { isRu: boolean }) {
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: INK }}>
      <div className="max-w-4xl mx-auto">
        <motion.p
          {...fadeUp}
          className="text-[11px] uppercase tracking-[0.24em] font-semibold"
          style={{ color: GOLD }}
        >
          {isRu ? "Как это работает" : "How it works"}
        </motion.p>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="font-serif text-3xl md:text-4xl font-bold text-white mt-2 max-w-md"
        >
          {isRu ? "Бронирование не должно быть рискованным." : "Booking shouldn't feel risky."}
        </motion.h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="space-y-3"
            >
              <p
                className="font-serif text-3xl font-bold"
                style={{ color: "rgba(200,155,60,0.4)" }}
              >
                {step.n}
              </p>
              <p className="text-[14px] leading-relaxed" style={{ color: "#9A8A70" }}>
                {isRu ? step.ru : step.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Closing CTA ───────────────────────────────────────────────────────────

function ClosingCta({ isRu, language }: { isRu: boolean; language: "en" | "ru" }) {
  return (
    <section className="px-6 py-20 md:py-28 text-center" style={{ backgroundColor: CARD }}>
      <motion.div {...fadeUp} className="max-w-md mx-auto space-y-5">
        <p
          className="text-[11px] uppercase tracking-[0.24em] font-semibold"
          style={{ color: GOLD }}
        >
          {isRu ? "✦ Начните путешествие ✦" : "✦ Start your journey ✦"}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
          {isRu ? "Давайте спланируем вашу Грузию." : "Let's build your Georgia."}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
          {isRu
            ? "Оплата не нужна сейчас. Левани отвечает в течение часа."
            : "No payment now. Levani replies within the hour."}
        </p>
        <a
          href={buildGeneralLink(language)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white w-full sm:w-auto"
          style={{ backgroundColor: WHATSAPP }}
        >
          <MessageCircle size={16} />
          {isRu ? "Написать в WhatsApp" : "Message on WhatsApp"}
        </a>
        <div>
          <Link href="/tours" className="text-xs font-medium underline" style={{ color: MUTED_DIM }}>
            {isRu ? "Или смотреть все 8 маршрутов →" : "Or browse all 8 routes →"}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const { language } = useTranslation();
  const isRu = language === "ru";

  return (
    <div style={{ backgroundColor: INK }}>
      <Hero isRu={isRu} language={language} />
      <Ridge bgBefore={INK} fill={INK} />
      <ChoosePath isRu={isRu} />
      <Ridge bgBefore={INK} fill={CREAM} />
      <TrustStats isRu={isRu} />
      <Ridge bgBefore={CREAM} fill="#150c08" />
      <Founder isRu={isRu} />
      <Ridge bgBefore="#0A0805" fill={CREAM} />
      <Journeys isRu={isRu} />
      <Ridge bgBefore={CREAM} fill={INK} />
      <HowItWorks isRu={isRu} />
      <ClosingCta isRu={isRu} language={language} />
      <Footer />
    </div>
  );
}
