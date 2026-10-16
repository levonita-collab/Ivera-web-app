"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, UserRound, Car, Map as MapIcon } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import RegionCard from "@/components/home/RegionCard";
import IveraHero from "@/components/home/IveraHero";
import KeyOfTbilisiSpotlight from "@/components/home/KeyOfTbilisiSpotlight";
import DashboardHome from "@/components/home/DashboardHome";
import ExplorerPass from "@/components/home/ExplorerPass";
import DailyRewards from "@/components/marketing/DailyRewards";
import ReviewsSection from "@/components/marketing/ReviewsSection";
import { tours } from "@/data/tours";
import { regions } from "@/data/regions";
import { getTotalXP, getProfileRaw, saveProfile, Profile } from "@/lib/questProgress";
import { buildGeneralLink } from "@/lib/whatsapp";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { ScrollReveal } from "@/components/motion";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedTour } from "@/lib/i18n/localize";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

const emptySubscribe = () => () => {};
const getServerXP = () => 0;
const getServerProfileRaw = () => null;

const HOW_IT_WORKS: { step: string; icon: string; titleKey: DictionaryKey; descKey: DictionaryKey }[] = [
  { step: "01", icon: "🧭", titleKey: "home.step1Title", descKey: "home.step1Desc" },
  { step: "02", icon: "🗺️", titleKey: "home.step2Title", descKey: "home.step2Desc" },
  { step: "03", icon: "⚡", titleKey: "home.step3Title", descKey: "home.step3Desc" },
  { step: "04", icon: "🏆", titleKey: "home.step4Title", descKey: "home.step4Desc" },
  { step: "05", icon: "✦", titleKey: "home.step5Title", descKey: "home.step5Desc" },
];

const TRUST_CHIPS: { icon: string; labelKey: DictionaryKey }[] = [
  { icon: "🇬🇪", labelKey: "home.trustChip1" },
  { icon: "⭐", labelKey: "home.trustChip2" },
  { icon: "🎓", labelKey: "home.trustChip3" },
  { icon: "🗣️", labelKey: "home.trustChip4" },
  { icon: "🚐", labelKey: "home.trustChip5" },
  { icon: "💬", labelKey: "home.trustChip6" },
  { icon: "🍽️", labelKey: "home.trustChip7" },
];

const GROUP_DISCOUNTS: { peopleKey: DictionaryKey; pctKey: DictionaryKey; icon: string }[] = [
  { peopleKey: "discount.2people", pctKey: "discount.5off", icon: "👫" },
  { peopleKey: "discount.3people", pctKey: "discount.10off", icon: "👨‍👩‍👦" },
  { peopleKey: "discount.45people", pctKey: "discount.20off", icon: "🎉" },
  { peopleKey: "discount.6people", pctKey: "discount.custom", icon: "💬" },
];

export default function HomePage() {
  const { t, language } = useTranslation();
  // Profile/XP live in localStorage, so they're only known on the client.
  // useSyncExternalStore returns the server snapshot during SSR/hydration
  // and the real value afterwards, avoiding a server/client markup mismatch.
  const xp = useSyncExternalStore(emptySubscribe, getTotalXP, getServerXP);
  const profileRaw = useSyncExternalStore(emptySubscribe, getProfileRaw, getServerProfileRaw);
  const profile = useMemo<Profile | null>(
    () => (profileRaw ? (JSON.parse(profileRaw) as Profile) : null),
    [profileRaw]
  );
  const [showPass, setShowPass] = useState(false);

  // One-time background sync for profiles created before Supabase was connected
  useEffect(() => {
    if (!profile || profile.supabaseId) return;
    saveExplorerToSupabase(profile)
      .then((id) => {
        if (id) saveProfile({ ...profile, supabaseId: id });
      })
      .catch(() => {});
  }, [profile]);

  function handlePassSaved() {
    setShowPass(false);
  }

  // Find the best deal: urgency + discount
  const bestDeal = tours.find((t) => t.showUrgency && t.lastSeatsDiscountPct > 0);

  return (
    <div style={{ backgroundColor: "#F7F0E4" }}>
      {profile ? (
        /* ── Returning user: full dashboard ── */
        <DashboardHome
          profile={profile}
          xp={xp}
          onEditPass={() => setShowPass(true)}
        />
      ) : (
        /* ── New user: cinematic welcome + below-fold ── */
        <>
          <IveraHero onStartQuest={() => setShowPass(true)} />

          {/* Free Tbilisi Quest — premium spotlight (main entry point) */}
          <KeyOfTbilisiSpotlight />

          {/* Featured quests below the fold */}
          <section className="px-4 pt-8 pb-5">
            <ScrollReveal className="flex items-center justify-between mb-4">
              <h2
                className="font-serif text-xl font-semibold"
                style={{ color: "#1F1A17" }}
              >
                {t("home.featuredQuests")}
              </h2>
              <Link
                href="/tours"
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: "#C89B3C" }}
              >
                {t("home.viewAll")} <ArrowRight size={12} />
              </Link>
            </ScrollReveal>
            <div className="space-y-4">
              {tours.slice(0, 3).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>

          {/* Private tours — flagship product: private guide/driver, self-composed itinerary */}
          <ScrollReveal delay={0.06} className="px-4 pb-6">
            <Link href="/private-tours" className="block group">
              <section
                className="relative rounded-[28px] overflow-hidden"
                style={{ boxShadow: "0 18px 40px rgba(42,26,14,0.35)" }}
              >
                <Image
                  src="/images/private-tours/swords-panorama.jpg"
                  alt=""
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 672px) 100vw, 640px"
                />
                {/* Warm grade: darkened sky for the headline, deep brown base for the controls */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(28,20,10,0.62) 0%, rgba(60,40,15,0.18) 34%, rgba(60,38,16,0.12) 52%, rgba(46,28,14,0.88) 80%, #2A1A0E 100%)",
                  }}
                />
                <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundColor: "rgba(224,170,80,0.35)" }} />

                <div className="relative flex flex-col items-center text-center px-4 pt-7 pb-6 min-h-[24rem]">
                  <h2
                    className="font-serif font-bold text-white leading-tight"
                    style={{ fontSize: "clamp(1.75rem, 7.5vw, 2.4rem)", textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}
                  >
                    {/* Keep each sentence whole so "По-вашему." never splits at its hyphen. */}
                    {t("home.privateToursTitle")
                      .split(/(?<=\.)\s+/)
                      .map((sentence) => (
                        <span key={sentence} className="inline-block whitespace-nowrap px-1">
                          {sentence}
                        </span>
                      ))}
                  </h2>
                  <p
                    className="text-[15px] mt-2 leading-snug max-w-sm"
                    style={{ color: "rgba(255,255,255,0.92)", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                  >
                    {t("home.privateToursDesc")}
                  </p>

                  <div className="mt-auto w-full pt-10 space-y-3">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {[
                        { icon: UserRound, label: t("home.privateToursFeatureGuide") },
                        { icon: Car, label: t("home.privateToursFeatureDriver") },
                        { icon: MapIcon, label: t("home.privateToursFeatureRoute") },
                      ].map(({ icon: Icon, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-[12.5px] font-medium backdrop-blur-sm whitespace-nowrap"
                          style={{
                            backgroundColor: "rgba(52,36,20,0.55)",
                            color: "#F6EBD2",
                            border: "1.5px solid rgba(224,184,90,0.75)",
                          }}
                        >
                          <Icon size={14} />
                          {label}
                        </span>
                      ))}
                    </div>

                    <span
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-base font-bold"
                      style={{
                        background: "linear-gradient(180deg, #EBC56A 0%, #D4A847 100%)",
                        color: "#2A1A0E",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.45)",
                      }}
                    >
                      {t("home.privateToursCta")} <ArrowRight size={17} />
                    </span>
                  </div>
                </div>
              </section>
            </Link>
          </ScrollReveal>

          {/* Discover the Regions */}
          <section className="pb-6">
            <ScrollReveal className="px-4 mb-4">
              <h2 className="font-serif text-xl font-semibold" style={{ color: "#1F1A17" }}>
                {t("home.discoverRegions")}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#7B6F63" }}>
                {t("home.discoverRegionsDesc")}
              </p>
            </ScrollReveal>
            <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
              {regions.map((region) => (
                <RegionCard key={region.slug} region={region} />
              ))}
            </div>
          </section>

          {/* Today's Best Deal */}
          {bestDeal && (
            <section className="px-4 pb-6">
              <ScrollReveal>
                <p
                  className="text-[11px] tracking-widest uppercase font-semibold mb-1"
                  style={{ color: "#C89B3C" }}
                >
                  {t("home.todaysBestDeal")}
                </p>
                <h2
                  className="font-serif text-xl font-semibold mb-4"
                  style={{ color: "#1F1A17" }}
                >
                  {t("home.limitedAvailability")}
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.07}>
                {(() => {
                  const deal = getLocalizedTour(bestDeal, language);
                  return (
                    <Link href={`/tours/${deal.slug}`} className="block">
                      <div
                        className="rounded-2xl p-4 border"
                        style={{
                          background: "linear-gradient(135deg, #FFFDF8 0%, #FFF8EC 100%)",
                          borderColor: "rgba(200,155,60,0.3)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse-soft"
                            style={{ backgroundColor: "rgba(180,30,30,0.1)", color: "#B41E1E" }}
                          >
                            🔴 {deal.urgencyLabel ?? `${deal.seatsLeft} ${t("tourCard.spotsLeft")}`}
                          </span>
                          <span
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: "rgba(76,175,80,0.12)", color: "#2E7D32" }}
                          >
                            −{deal.lastSeatsDiscountPct}{t("discount.lastSeats")}
                          </span>
                        </div>
                        <h3 className="font-serif font-semibold text-base" style={{ color: "#1F1A17" }}>
                          {deal.title}
                        </h3>
                        <p
                          className="text-xs mt-1 leading-relaxed line-clamp-2"
                          style={{ color: "#7B6F63" }}
                        >
                          {deal.shortDescription}
                        </p>
                        <div
                          className="flex items-center justify-between mt-3 pt-3"
                          style={{ borderTop: "1px solid #F0E8DA" }}
                        >
                          <div>
                            <span className="text-lg font-bold" style={{ color: "#C89B3C" }}>
                              {deal.pricePerPersonGel} GEL
                            </span>
                            <span className="text-xs ml-1" style={{ color: "#7B6F63" }}>
                              {t("tourCard.perPerson")}
                            </span>
                          </div>
                          <span
                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                          >
                            {t("home.viewQuest")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </ScrollReveal>
            </section>
          )}

          {/* How it works */}
          <section className="px-4 pb-6">
            <ScrollReveal>
              <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: "#1F1A17" }}>
                {t("home.howItWorks")}
              </h2>
            </ScrollReveal>
            <div className="space-y-3">
              {HOW_IT_WORKS.map((step, i) => (
                <ScrollReveal key={step.titleKey} delay={i * 0.07}>
                  <div
                    className="flex items-start gap-4 px-4 py-4 rounded-2xl border"
                    style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{step.icon}</span>
                    <div>
                      <p
                        className="text-[10px] tracking-widest font-semibold mb-0.5"
                        style={{ color: "#C89B3C" }}
                      >
                        {t("home.stepLabel")} {step.step}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "#1F1A17" }}>
                        {t(step.titleKey)}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#7B6F63" }}>
                        {t(step.descKey)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Trust / credibility */}
          <section className="px-4 pb-6">
            <ScrollReveal>
              <p
                className="text-[11px] tracking-widest uppercase font-semibold mb-1"
                style={{ color: "#C89B3C" }}
              >
                {t("home.trustBadge")}
              </p>
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "#1F1A17" }}>
                {t("home.trustHeading")}
              </h2>
            </ScrollReveal>
            <div className="flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip, i) => (
                <ScrollReveal key={chip.labelKey} delay={i * 0.04}>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium border"
                    style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0", color: "#3D2B1A" }}
                  >
                    <span>{chip.icon}</span>
                    {t(chip.labelKey)}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* How discounts work */}
          <section className="px-4 pb-6">
            <ScrollReveal>
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "#1F1A17" }}>
                {t("home.groupDiscounts")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-3">
              {GROUP_DISCOUNTS.map((item, i) => (
                <ScrollReveal key={item.peopleKey} delay={i * 0.06}>
                  <div
                    className="rounded-xl p-3 border text-center"
                    style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-xs mt-1" style={{ color: "#7B6F63" }}>{t(item.peopleKey)}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "#C89B3C" }}>{t(item.pctKey)}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.1}>
              <p className="text-[11px] mt-3 text-center" style={{ color: "#9A8A78" }}>
                {t("home.groupDiscountsNote")}
              </p>
            </ScrollReveal>
          </section>

          {/* Points rewards */}
          <ScrollReveal delay={0.05} className="mx-4 mb-6">
            <DailyRewards variant="light" />
          </ScrollReveal>

          {/* Reviews */}
          <ScrollReveal delay={0.05} className="mx-4 mb-6">
            <ReviewsSection />
          </ScrollReveal>

          {/* WhatsApp CTA */}
          <ScrollReveal delay={0.1} className="mx-4 mb-8">
            <section
              className="rounded-2xl p-5 text-center"
              style={{ background: "linear-gradient(135deg, #1C1710 0%, #2A1F14 100%)" }}
            >
              <MessageCircle size={22} className="mx-auto mb-2" style={{ color: "#C89B3C" }} />
              <h2 className="font-serif text-lg font-semibold text-white">
                {t("home.needCustomItinerary")}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
                {t("home.needCustomItineraryDesc")}
              </p>
              <a
                href={buildGeneralLink(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={15} /> {t("home.chatWhatsapp")}
              </a>
            </section>
          </ScrollReveal>
        </>
      )}

      {/* Explorer Pass modal */}
      {showPass && (
        <ExplorerPass
          onClose={() => setShowPass(false)}
          onSaved={handlePassSaved}
        />
      )}
    </div>
  );
}
