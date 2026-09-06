"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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

// ── Hero ──────────────────────────────────────────────────────────────────

function Hero({ isRu, language }: { isRu: boolean; language: "en" | "ru" }) {
  const reduced = useReducedMotion();
  return (
    <div className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={reduced ? {} : { scale: 1.08 }}
        transition={{ duration: 22, ease: "easeOut" }}
      >
        <Image
          src="/images/tours/gori-uplistsikhe.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.35) 40%, rgba(10,8,5,0.92) 100%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
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
      </div>
    </div>
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
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: INK }}>
      <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start">
        <motion.div {...fadeUp} className="flex md:flex-col items-center md:items-start gap-4">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 flex items-center justify-center text-4xl"
            style={{ backgroundColor: "rgba(200,155,60,0.10)", border: `1px solid rgba(200,155,60,0.3)` }}
          >
            🇬🇪
          </div>
          <div className="md:mt-1">
            <p className="font-serif text-xl font-bold text-white">Levani</p>
            <p className="text-[12px] mt-0.5" style={{ color: GOLD }}>
              {isRu ? "Основатель · Тбилиси, Грузия" : "Founder · Tbilisi, Georgia"}
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.p
            {...fadeUp}
            className="text-[11px] uppercase tracking-[0.24em] font-semibold"
            style={{ color: GOLD }}
          >
            {isRu ? "Ваш гид" : "Your guide"}
          </motion.p>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="text-[15px] md:text-base leading-relaxed"
            style={{ color: "#C8B89A" }}
          >
            {isRu
              ? "Левани — профессиональный гид по Грузии с 9-летним опытом. Специализируется на культурных, исторических и гастрономических маршрутах: от горных монастырей Казбеги до пещерных городов Вардзии и виноградников Кахетии."
              : "Levani is a professional Georgian tour guide with 9 years of experience — specialising in cultural, historical, and gastronomic routes across the country, from the mountain monasteries of Kazbegi to the cave cities of Vardzia and the vineyards of Kakheti."}
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.16 }}
            className="space-y-3.5 pt-2"
          >
            {FOUNDER_CHECKLIST.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.en} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(200,155,60,0.10)" }}
                  >
                    <Icon size={13} style={{ color: GOLD }} />
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#9A8A70" }}>
                    {isRu ? item.ru : item.en}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
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
    image: "/images/tours/gori-uplistsikhe.jpg",
    region: { en: "Shida Kartli", ru: "Шида-Картли" },
    title: { en: "A fortress above the plain", ru: "Крепость над долиной" },
    href: "/tours/gori-uplistsikhe-quest",
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
    <section id="journeys" className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
      <div className="max-w-5xl mx-auto">
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
          {isRu ? "Четыре повода влюбиться в Грузию" : "Four ways to fall for Georgia"}
        </motion.h2>

        <div className="mt-10 grid sm:grid-cols-2 gap-5 md:gap-6">
          {JOURNEYS.map((j, i) => (
            <motion.div
              key={j.href}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            >
              <Link
                href={j.href}
                className="group block relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={j.image}
                  alt={isRu ? j.title.ru : j.title.en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 45%, rgba(10,8,5,0.85) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p
                    className="text-[10px] uppercase tracking-widest font-semibold"
                    style={{ color: GOLD_BRIGHT }}
                  >
                    {isRu ? j.region.ru : j.region.en}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-white mt-1">
                    {isRu ? j.title.ru : j.title.en}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
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
      <TrustStats isRu={isRu} />
      <Founder isRu={isRu} />
      <Journeys isRu={isRu} />
      <HowItWorks isRu={isRu} />
      <ClosingCta isRu={isRu} language={language} />
      <Footer />
    </div>
  );
}
