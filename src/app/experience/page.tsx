"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight, Clock3, Users2, Compass, ShieldCheck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

// The conceptual bridge between chapters — a Caucasus ridge silhouette that
// "rises" into view instead of one photo simply dissolving into the next.
// Ties the transition device directly to the site's actual subject matter.
function MountainRidge({
  progress,
  reduced,
  edge = "top",
}: {
  progress: import("framer-motion").MotionValue<number>;
  reduced: boolean;
  edge?: "top" | "bottom";
}) {
  const scaleY = useTransform(progress, [0, 0.12], [0.4, 1]);
  const opacity = useTransform(progress, [0, 0.12], [0, 1]);
  const isTop = edge === "top";

  return (
    <motion.div
      className={`absolute left-0 right-0 z-20 pointer-events-none ${isTop ? "top-0" : "bottom-0"}`}
      style={{
        transformOrigin: isTop ? "top" : "bottom",
        scaleY: reduced ? 1 : scaleY,
        opacity: reduced ? 1 : opacity,
      }}
    >
      <svg
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        className="w-full h-[13vh] md:h-[15vh]"
        style={{ display: "block", transform: isTop ? undefined : "scaleY(-1)" }}
      >
        <path
          d="M0,90 L0,52 L38,18 L72,44 L110,8 L150,38 L185,20 Q205,10 222,24 L262,2 L300,36 L340,12 L400,30 L400,90 Z"
          fill="#0A0805"
        />
        <path
          d="M0,52 L38,18 L72,44 L110,8 L150,38 L185,20 Q205,10 222,24 L262,2 L300,36 L340,12 L400,30"
          fill="none"
          stroke="rgba(224,184,90,0.45)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
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

function ParallaxHero({ isRu }: { isRu: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ["0%", "10%"]);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/tours/kazbegi-mountain-quest.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.35) 45%, #0A0805 100%)" }} />
      </motion.div>

      {/* Same ridge motif as every chapter boundary below — establishes the
          "mountains as the bridge between scenes" device from the first frame. */}
      <MountainRidge edge="bottom" progress={scrollYProgress} reduced />

      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: "#E0B85A" }}>
          {isRu ? "Ivera · Грузия" : "Ivera · Georgia"}
        </p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl"
        >
          {isRu ? "Грузия. Не как в путеводителях." : "Georgia. Not like the guidebooks."}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 }}
          className="mt-5 text-base md:text-lg max-w-md"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {isRu
            ? "Восемь маршрутов. Один WhatsApp. Ноль предоплаты."
            : "Eight routes. One WhatsApp message. Zero upfront payment."}
        </motion.p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-1.5"
        style={{ opacity: contentOpacity }}
      >
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
          {isRu ? "Прокрутите вниз" : "Scroll to begin"}
        </span>
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} style={{ color: "#E0B85A" }} />
        </motion.div>
      </motion.div>
    </div>
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
    <section ref={ref} className="relative" style={{ height: "130vh" }}>
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ opacity: reduced ? 1 : sectionOpacity }}
      >
        <MountainRidge progress={scrollYProgress} reduced={!!reduced} />
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
      <ParallaxHero isRu={isRu} />
      {CHAPTERS.map((chapter, i) => (
        <ChapterSection key={chapter.href} chapter={chapter} isRu={isRu} index={i} />
      ))}
      <TrustStrip isRu={isRu} />
      <FinalCta isRu={isRu} language={language} />
      <Footer />
    </div>
  );
}
