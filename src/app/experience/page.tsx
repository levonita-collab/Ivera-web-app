"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  Clock3,
  Users2,
  Compass,
  ShieldCheck,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import AbstractBackdrop, { type BackdropPalette } from "@/components/motion/AbstractBackdrop";

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

// One bold word per region — the giant display headline is the centre of
// attention; the backdrop is abstract, so it never competes with a photo.
const HEADLINES: { ru: string; en: string }[] = [
  { ru: "ГОРЫ", en: "MOUNTAINS" },
  { ru: "ВИНО", en: "WINE" },
  { ru: "СТОЛИЦА", en: "CAPITAL" },
  { ru: "ПЕЩЕРЫ", en: "CAVES" },
];

// Backdrop colour fields per slide — the "3D scene changes colour" beat of a
// slide switch, in the site's own ink/gold/wine family.
const PALETTES: BackdropPalette[] = [
  { a: "#2B4468", b: "#C89B3C", c: "#16211E" },
  { a: "#7A2331", b: "#C89B3C", c: "#2B1220" },
  { a: "#1E4A47", b: "#E4C878", c: "#3A2A10" },
  { a: "#6B4A22", b: "#C89B3C", c: "#2A1A10" },
];

const SLIDE_MS = 6500;
// GSAP's power3.inOut as a cubic-bezier, so the hand-off feels the same.
const EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];
const DUR = 1.2;

function SliderHero({ isRu, chapters }: { isRu: boolean; chapters: Chapter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const total = chapters.length;
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ["0%", "10%"]);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % total), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, reduced, total]);

  function go(i: number) {
    setIndex(((i % total) + total) % total);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  }

  const active = chapters[index];
  const textTransition = { duration: DUR, ease: EASE };
  // Shorter exit leg so a full hand-off (exit → enter) stays under ~2s.
  const exitTransition = { duration: 0.55, ease: EASE };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden select-none"
      style={{ backgroundColor: "#0A0805" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <AbstractBackdrop palette={PALETTES[index]} seed={index} reduced={!!reduced} />
      {/* Vignette + grounding into the ink page colour, so the headline sits in
          a pool of light and the ridge below has something to rise out of. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(10,8,5,0) 0%, rgba(10,8,5,0.18) 70%, rgba(10,8,5,0.55) 100%), linear-gradient(180deg, rgba(10,8,5,0.25) 0%, rgba(10,8,5,0) 28%, rgba(10,8,5,0) 62%, #0A0805 100%)",
        }}
      />

      <motion.div
        className="relative z-20 h-full flex flex-col"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="flex flex-col items-center pt-6 px-6 gap-5">
          <Image src="/images/logo-dark.png" alt="Ivera" width={104} height={35} className="h-8 w-auto" priority />

          <div className="flex gap-1.5 w-full max-w-[280px]">
            {chapters.map((c, i) => (
              <button
                key={c.href}
                onClick={() => go(i)}
                aria-label={`${isRu ? "Слайд" : "Slide"} ${i + 1}`}
                className="flex-1 h-[3px] rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
              >
                {i < index && <div className="h-full w-full" style={{ backgroundColor: "#E0B85A" }} />}
                {i === index && (reduced ? (
                  <div className="h-full w-full" style={{ backgroundColor: "#E0B85A" }} />
                ) : (
                  <motion.div
                    key={index}
                    className="h-full"
                    style={{ backgroundColor: "#E0B85A" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                ))}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between px-2 md:px-6">
          <button
            onClick={() => go(index - 1)}
            aria-label={isRu ? "Предыдущий слайд" : "Previous slide"}
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)" }}
          >
            <ChevronLeft size={18} className="text-white" />
          </button>

          <div className="flex-1 flex flex-col items-center text-center px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${index}`}
                initial={reduced ? false : { opacity: 0, y: 36, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? {} : { opacity: 0, y: -28, filter: "blur(8px)", transition: exitTransition }}
                transition={textTransition}
                className="w-full max-w-full"
              >
                <p className="text-[11px] uppercase tracking-[0.34em] font-semibold mb-4" style={{ color: "#E0B85A" }}>
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} —{" "}
                  {isRu ? active.region.ru : active.region.en}
                </p>
                <h1
                  className="font-serif font-bold leading-[0.9] tracking-tight whitespace-nowrap"
                  style={{
                    fontSize: "clamp(3rem, 14.5vw, 9.5rem)",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F3E7C9 55%, #E0B85A 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {isRu ? HEADLINES[index].ru : HEADLINES[index].en}
                </h1>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${index}`}
                initial={reduced ? false : { opacity: 0, y: 48, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? {} : { opacity: 0, y: -18, filter: "blur(10px)", transition: exitTransition }}
                transition={{ ...textTransition, delay: reduced ? 0 : 0.12 }}
                className="mt-7 max-w-sm w-full rounded-2xl px-6 py-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow: "0 20px 60px -30px rgba(0,0,0,0.6)",
                }}
              >
                <p className="font-serif text-lg md:text-xl font-semibold text-white leading-snug">
                  {isRu ? active.title.ru : active.title.en}
                </p>
                <p className="mt-2 text-[13px] md:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {isRu ? active.text.ru : active.text.en}
                </p>
                <a
                  href={`#chapter-${index}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold"
                  style={{ color: "#E0B85A" }}
                >
                  {isRu ? "Узнать больше" : "Discover more"} <ArrowRight size={14} />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => go(index + 1)}
            aria-label={isRu ? "Следующий слайд" : "Next slide"}
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)" }}
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center gap-1.5 pb-8"
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isRu ? "Прокрутите вниз" : "Scroll to begin"}
          </span>
          <motion.div
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} style={{ color: "#E0B85A" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
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
      <SliderHero isRu={isRu} chapters={CHAPTERS} />
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
