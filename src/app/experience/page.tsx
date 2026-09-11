"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight, Clock3, Users2, Compass, ShieldCheck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import HeroRouteStage, { type RouteWaypoint } from "@/components/motion/HeroRouteStage";

const INK = "#0A0805";
const CARD = "#1A1408";
const GOLD_BRIGHT = "#E0B85A";

// A plain hairline between chapters — replaced an animated mountain-ridge
// silhouette that read as an unrelated decorative shape at every transition.
function ChapterDivider() {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
      style={{ height: 1, backgroundColor: "rgba(224,184,90,0.4)" }}
    />
  );
}

interface Chapter {
  image: string;
  region: { ru: string; en: string };
  title: { ru: string; en: string };
  text: { ru: string; en: string };
  href: string;
  linkLabel: { ru: string; en: string };
}

const CHAPTERS: Chapter[] = [
  {
    image: "/images/tours/kazbegi-mountain-quest.jpg",
    region: { ru: "Казбеги", en: "Kazbegi" },
    title: { ru: "Горы, касающиеся неба", en: "Mountains that touch the sky" },
    text: {
      ru: "Троицкая церковь Гергети стоит на высоте 2170 метров — над облаками, у ледника Казбека.",
      en: "Gergeti Trinity Church stands at 2,170 metres — above the clouds, at the foot of Mount Kazbek's glacier.",
    },
    href: "/tours/kazbegi-mountain-quest",
    linkLabel: { ru: "Смотреть тур", en: "View the tour" },
  },
  {
    image: "/images/tours/kakheti-wine-legends.jpg",
    region: { ru: "Кахетия", en: "Kakheti" },
    title: { ru: "Вино старше большинства религий", en: "Wine older than most religions" },
    text: {
      ru: "8 000 лет назад здесь впервые начали делать вино. Оно всё ещё бродит в квеври под землёй.",
      en: "Wine was first made here 8,000 years ago. It still ferments underground in clay qvevri, exactly as it always has.",
    },
    href: "/tours/kakheti-wine-legends",
    linkLabel: { ru: "Смотреть тур", en: "View the tour" },
  },
  {
    image: "/images/tours/tbilisi-city-quest.jpg",
    region: { ru: "Тбилиси", en: "Tbilisi" },
    title: { ru: "Город, не спящий с V века", en: "A city that hasn't slept since the 5th century" },
    text: {
      ru: "Серные бани, крепость Нарикала, узкие улочки Старого города — история под ногами на каждом шагу.",
      en: "Sulfur baths, the Narikala fortress, narrow Old Town lanes — 1,500 years of history underfoot at every turn.",
    },
    href: "/tours/tbilisi-city-quest",
    linkLabel: { ru: "Смотреть тур", en: "View the tour" },
  },
  {
    image: "/images/tours/vardzia-cave-kingdom.jpg",
    region: { ru: "Вардзиа", en: "Vardzia" },
    title: { ru: "Пещерное царство царицы Тамары", en: "A cave kingdom carved by a queen" },
    text: {
      ru: "13 ярусов, высеченных в скале в XII веке. Здесь когда-то жили 6 000 человек.",
      en: "Thirteen storeys carved into rock in the 12th century. Six thousand people once lived inside this mountain.",
    },
    href: "/tours/vardzia-cave-kingdom",
    linkLabel: { ru: "Смотреть тур", en: "View the tour" },
  },
];

// Real quest route — all 8 tours, in a mountain-silhouette zigzag that
// peaks at Kazbegi (our actual highest-altitude tour). XP values are the
// real `bookingBonusXp` figures from src/data/tours.ts, not placeholders.
const ROUTE_COLORS = {
  ink: INK,
  ink2: CARD,
  bone: "#F3E7C9",
  route: "#F3D68A",
  xp: GOLD_BRIGHT,
};

interface RouteWaypointSource {
  id: string;
  label: string;
  labelRu: string;
  meta: { en: string; ru: string };
  href: string;
  x: number;
  y: number;
  mobile: { x: number; y: number };
}

const ROUTE_WAYPOINTS: RouteWaypointSource[] = [
  {
    id: "tbilisi",
    label: "Tbilisi",
    labelRu: "Тбилиси",
    meta: { en: "start", ru: "старт" },
    href: "/tours/tbilisi-city-quest",
    x: 0.5,
    y: 0.82,
    mobile: { x: 0.06, y: 0.85 },
  },
  {
    id: "mtskheta",
    label: "Mtskheta",
    labelRu: "Мцхета",
    meta: { en: "+75 XP", ru: "+75 XP" },
    href: "/tours/mtskheta-sacred-route",
    x: 0.58,
    y: 0.64,
    mobile: { x: 0.18, y: 0.72 },
  },
  {
    id: "uplistsikhe",
    label: "Uplistsikhe",
    labelRu: "Уплисцихе",
    meta: { en: "+100 XP", ru: "+100 XP" },
    href: "/tours/gori-uplistsikhe-quest",
    x: 0.65,
    y: 0.75,
    mobile: { x: 0.3, y: 0.8 },
  },
  {
    id: "kakheti",
    label: "Kakheti",
    labelRu: "Кахетия",
    meta: { en: "+100 XP", ru: "+100 XP" },
    href: "/tours/kakheti-wine-legends",
    x: 0.72,
    y: 0.58,
    mobile: { x: 0.42, y: 0.68 },
  },
  {
    id: "kazbegi",
    label: "Kazbegi",
    labelRu: "Казбеги",
    meta: { en: "+150 XP", ru: "+150 XP" },
    href: "/tours/kazbegi-mountain-quest",
    x: 0.8,
    y: 0.3,
    mobile: { x: 0.56, y: 0.52 },
  },
  {
    id: "vardzia",
    label: "Vardzia",
    labelRu: "Вардзиа",
    meta: { en: "+150 XP", ru: "+150 XP" },
    href: "/tours/vardzia-cave-kingdom",
    x: 0.87,
    y: 0.55,
    mobile: { x: 0.68, y: 0.7 },
  },
  {
    id: "martvili",
    label: "Martvili",
    labelRu: "Мартвили",
    meta: { en: "+100 XP", ru: "+100 XP" },
    href: "/tours/kutaisi-martvili-canyons",
    x: 0.93,
    y: 0.7,
    mobile: { x: 0.8, y: 0.64 },
  },
  {
    id: "batumi",
    label: "Batumi",
    labelRu: "Батуми",
    meta: { en: "finish", ru: "финиш" },
    href: "/tours/batumi-black-sea-quest",
    x: 0.985,
    y: 0.5,
    mobile: { x: 0.94, y: 0.58 },
  },
];

// Show labels only for start / the Kazbegi peak / finish on phones — the
// other five still get a dot on the route, just no crowded text.
const MOBILE_LABEL_INDICES = [0, 4, 7];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false
  );
}

function RouteHero({ isRu, language }: { isRu: boolean; language: "en" | "ru" }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const isMobile = useIsMobile();
  const scrub = isMobile ? 1.5 : 1.7;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const contentY = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const reveal = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay } };

  return (
    <section ref={ref} className="relative" style={{ backgroundColor: INK, height: `${scrub * 100}svh` }} aria-label={isRu ? "Добро пожаловать" : "Welcome"}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Image
          src="/images/hero/tbilisi-route.jpg"
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
              `radial-gradient(120% 70% at 20% 95%, rgba(224,184,90,0.12) 0%, rgba(224,184,90,0) 60%),` +
              `linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.32) 42%, rgba(10,8,5,0.55) 78%, ${INK} 100%)`,
          }}
        />

        <HeroRouteStage
          progress={scrollYProgress}
          waypoints={ROUTE_WAYPOINTS.map(
            (w): RouteWaypoint => ({
              id: w.id,
              label: isRu ? w.labelRu : w.label,
              meta: isRu ? w.meta.ru : w.meta.en,
              href: w.href,
              x: w.x,
              y: w.y,
              mobile: w.mobile,
            })
          )}
          colors={ROUTE_COLORS}
          isMobile={isMobile}
          reduced={reduced}
          labelOnMobile={MOBILE_LABEL_INDICES}
          showRidges={false}
        />

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <Image src="/images/logo-dark.png" alt="Ivera" width={104} height={35} className="h-8 w-auto" priority />
        </div>

        <motion.div
          style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}
          className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-start px-6 pt-[104px] md:justify-center md:pt-20"
        >
          <div className="max-w-[46rem]">
            <h1
              className="font-serif font-bold leading-[0.95] tracking-tight text-white text-[clamp(2.25rem,7.5vw,4.5rem)]"
            >
              <motion.span {...reveal(0.08)} className="block">
                {isRu ? "Не смотри Грузию." : "Don't just see Georgia."}
              </motion.span>
              <motion.span {...reveal(0.18)} className="mt-2 inline-block">
                <span
                  className="inline-block -rotate-1 rounded-[0.35em] px-[0.28em] pb-[0.06em] pt-[0.1em]"
                  style={{ backgroundColor: GOLD_BRIGHT, color: INK }}
                >
                  {isRu ? "Играй в неё." : "Play it."}
                </span>
              </motion.span>
            </h1>

            <motion.p
              {...reveal(0.3)}
              className="mt-5 max-w-[34rem] text-[15px] leading-relaxed md:mt-7 md:text-lg"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {isRu
                ? "Однодневные квесты из Тбилиси — горы, пещерные города, винные погреба, каньоны и побережье. Каждый маршрут даёт XP к вашему Explorer Pass."
                : "One-day quests from Tbilisi — mountains, cave cities, wine cellars, canyons and the coast. Every route earns XP toward your Explorer Pass."}
            </motion.p>

            <motion.div {...reveal(0.4)} className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
              <a
                href={buildGeneralLink(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-full px-6 md:px-7 text-[15px] md:text-base font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={16} />
                {isRu ? "Написать в WhatsApp" : "Message on WhatsApp"}
              </a>
              <a
                href="#chapter-0"
                className="inline-flex h-12 md:h-14 items-center justify-center gap-1.5 rounded-full border px-6 md:px-7 text-[15px] md:text-base font-semibold"
                style={{ borderColor: "rgba(255,255,255,0.25)", color: "#F0E6D2" }}
              >
                {isRu ? "Смотреть маршруты" : "Explore the routes"}
                <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.ul {...reveal(0.5)} className="mt-6 flex flex-wrap gap-2 md:mt-8" aria-label={isRu ? "Почему Ivera" : "Why ivera"}>
              {(isRu
                ? ["Команда из Тбилиси", "9+ лет гидом", "8 регионов, один XP-аккаунт"]
                : ["Tbilisi-based team", "9+ years guiding", "8 regions, one XP account"]
              ).map((t) => (
                <li
                  key={t}
                  className="rounded-full border px-3 py-1 text-[11px] md:text-xs"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                >
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: reduced ? 0 : hintOpacity }}
          className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-1.5"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isRu ? "Листайте, чтобы построить маршрут" : "Scroll to draw the route"}
          </span>
          <motion.div
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} style={{ color: GOLD_BRIGHT }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ChapterSection({ chapter, isRu, index }: { chapter: Chapter; isRu: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  // Ken-Burns-style creeping zoom, settling as the section becomes fully
  // active — reads as "floating" rather than a hard cut between chapters.
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.08, 1.18]);
  // Cross-fades the whole sticky layer in/out at the edges of its own
  // scroll range, so the incoming chapter softly dissolves over the one
  // it's covering instead of snapping into place.
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  return (
    <section id={`chapter-${index}`} ref={ref} className="relative" style={{ height: "130vh" }}>
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ opacity: reduced ? 1 : sectionOpacity }}
      >
        <ChapterDivider />
        <motion.div className="absolute inset-0" style={{ y: reduced ? "0%" : imageY, scale: reduced ? 1 : imageScale }}>
          <Image
            src={chapter.image}
            alt={isRu ? chapter.region.ru : chapter.region.en}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0.15) 40%, rgba(10,8,5,0.9) 100%)" }} />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-16 md:pb-20 max-w-2xl mx-auto">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: "#E0B85A" }}>
              {String(index + 1).padStart(2, "0")} — {isRu ? chapter.region.ru : chapter.region.en}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {isRu ? chapter.title.ru : chapter.title.en}
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-5 max-w-md" style={{ color: "rgba(255,255,255,0.8)" }}>
              {isRu ? chapter.text.ru : chapter.text.en}
            </p>
            <Link
              href={chapter.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "#E0B85A" }}
            >
              {isRu ? chapter.linkLabel.ru : chapter.linkLabel.en} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TrustStrip({ isRu }: { isRu: boolean }) {
  const reduced = useReducedMotion();
  const items = [
    { icon: Clock3, value: "9+", label: isRu ? "лет опыта" : "years of experience" },
    { icon: Users2, value: isRu ? "до 50" : "up to 50", label: isRu ? "человек в группе" : "people per group" },
    { icon: Compass, value: "8", label: isRu ? "маршрутов" : "quest routes" },
    { icon: ShieldCheck, value: "0", label: isRu ? "предоплаты" : "upfront payment" },
  ];

  return (
    <section className="relative px-6 py-24 overflow-hidden" style={{ backgroundColor: "#0A0805" }}>
      {/* Soft glow so this doesn't read as a flat dead zone between chapters */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[140%] h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(224,184,90,0.10) 0%, rgba(10,8,5,0) 70%)" }}
      />
      <div className="relative max-w-2xl mx-auto grid grid-cols-2 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={reduced ? false : { opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
              className="rounded-2xl px-4 py-6 text-center"
              style={{ backgroundColor: "rgba(224,184,90,0.05)", border: "1px solid rgba(224,184,90,0.18)" }}
            >
              <Icon size={20} className="mx-auto mb-2" style={{ color: "#E0B85A" }} />
              <p className="font-serif text-3xl font-bold text-white leading-none">
                {item.value}
              </p>
              <p className="text-[11px] mt-2 leading-snug" style={{ color: "#9A8A70" }}>
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FounderSection({ isRu }: { isRu: boolean }) {
  const reduced = useReducedMotion();
  return (
    <section className="px-6 py-20 md:py-28 text-center" style={{ backgroundColor: "#0A0805" }}>
      <div className="max-w-md mx-auto">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[11px] uppercase tracking-[0.24em] font-semibold mb-7"
          style={{ color: "#E0B85A" }}
        >
          {isRu ? "Ваш гид" : "Your guide"}
        </motion.p>

        {/* Photo rises first, on its own trigger */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative mx-auto w-[240px] h-[300px] sm:w-[280px] sm:h-[350px] md:w-[340px] md:h-[420px] rounded-3xl overflow-hidden"
          style={{ border: "1px solid rgba(224,184,90,0.25)" }}
        >
          <Image
            src="/images/team/levani.jpg"
            alt="Levani"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 340px"
          />
        </motion.div>

        {/* Text follows a beat later, rising up from below the photo */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: reduced ? 0 : 0.3 }}
          className="mt-8"
        >
          <p className="font-serif text-2xl font-bold text-white">Levani</p>
          <p className="text-[12px] mt-1 mb-5" style={{ color: "#C89B3C" }}>
            {isRu ? "Основатель · Тбилиси, Грузия" : "Founder · Tbilisi, Georgia"}
          </p>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            {isRu
              ? "Левани — профессиональный гид по Грузии с 9-летним опытом. Специализируется на культурных, исторических и гастрономических маршрутах: от горных монастырей Казбеги до пещерных городов Вардзии и виноградников Кахетии."
              : "Levani is a professional Georgian tour guide with 9 years of experience — specialising in cultural, historical, and gastronomic routes across the country, from the mountain monasteries of Kazbegi to the cave cities of Vardzia and the vineyards of Kakheti."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCta({ isRu, language }: { isRu: boolean; language: "en" | "ru" }) {
  const reduced = useReducedMotion();
  return (
    <section className="px-6 py-24 text-center" style={{ backgroundColor: "#0A0805" }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md mx-auto space-y-5"
      >
        <h2 className="font-serif text-3xl font-bold text-white">
          {isRu ? "Готовы начать?" : "Ready to begin?"}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
          {isRu
            ? "Напишите Левани в WhatsApp — он ответит в течение часа и поможет выбрать маршрут."
            : "Message Levani on WhatsApp — he replies within an hour and helps you pick a route."}
        </p>
        <a
          href={buildGeneralLink(language)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white w-full sm:w-auto"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={16} />
          {isRu ? "Написать в WhatsApp" : "Message on WhatsApp"}
        </a>
        <div>
          <Link href="/tours" className="text-xs font-medium underline" style={{ color: "#7A6A52" }}>
            {isRu ? "Или смотреть все 8 маршрутов →" : "Or browse all 8 routes →"}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function ExperiencePage() {
  const { language } = useTranslation();
  const isRu = language === "ru";

  return (
    <div style={{ backgroundColor: "#0A0805" }}>
      <RouteHero isRu={isRu} language={language} />
      {CHAPTERS.map((chapter, i) => (
        <ChapterSection key={chapter.href} chapter={chapter} isRu={isRu} index={i} />
      ))}
      <FounderSection isRu={isRu} />
      <TrustStrip isRu={isRu} />
      <FinalCta isRu={isRu} language={language} />
      <Footer />
    </div>
  );
}
