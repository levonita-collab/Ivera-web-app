"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import IveraHero from "@/components/home/IveraHero";
import KeyOfTbilisiSpotlight from "@/components/home/KeyOfTbilisiSpotlight";
import DashboardHome from "@/components/home/DashboardHome";
import ExplorerPass from "@/components/home/ExplorerPass";
import DailyQuestChallenge from "@/components/marketing/DailyQuestChallenge";
import { tours } from "@/data/tours";
import { getTotalXP, getProfile, saveProfile, Profile } from "@/lib/questProgress";
import { buildGeneralLink } from "@/lib/whatsapp";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { ScrollReveal } from "@/components/motion";

const HOW_IT_WORKS = [
  { step: "01", icon: "🧭", title: "Start", desc: "Choose a free or paid quest." },
  { step: "02", icon: "🗺️", title: "Explore", desc: "Visit real Georgian locations." },
  { step: "03", icon: "⚡", title: "Complete", desc: "Scan, solve, photograph or unlock missions." },
  { step: "04", icon: "🏆", title: "Earn", desc: "Collect XP, badges and rewards." },
  { step: "05", icon: "✦", title: "Continue", desc: "Book your next Georgian adventure." },
];

const TRUST_CHIPS = [
  { icon: "🇬🇪", label: "Built by local Georgian tour professionals" },
  { icon: "⭐", label: "9+ years organising tours across Georgia" },
  { icon: "🎓", label: "Professional guides, 6–7+ years experience" },
  { icon: "🗣️", label: "English & Russian speaking support" },
  { icon: "🚐", label: "Experienced drivers & comfortable transport" },
  { icon: "💬", label: "Booking & support through WhatsApp" },
  { icon: "🍽️", label: "Paid tours include guide & transport; select tours include food" },
];

const GROUP_DISCOUNTS = [
  { people: "2 people", pct: "5% off", icon: "👫" },
  { people: "3 people", pct: "10% off", icon: "👨‍👩‍👦" },
  { people: "4–5 people", pct: "20% off", icon: "🎉" },
  { people: "6+ people", pct: "Custom rate", icon: "💬" },
];

function readXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return getProfile();
}

export default function HomePage() {
  const [xp] = useState(readXP);
  const [profile, setProfile] = useState(readProfile);
  const [showPass, setShowPass] = useState(false);

  // One-time background sync for profiles created before Supabase was connected
  useEffect(() => {
    const p = getProfile();
    if (!p || p.supabaseId) return;
    saveExplorerToSupabase(p)
      .then((id) => {
        if (id) saveProfile({ ...p, supabaseId: id });
      })
      .catch(() => {});
  }, []);

  function handlePassSaved() {
    setProfile(getProfile());
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
                Featured Quests
              </h2>
              <Link
                href="/tours"
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: "#C89B3C" }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </ScrollReveal>
            <div className="space-y-4">
              {tours.slice(0, 3).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
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
                  Today&apos;s Best Deal
                </p>
                <h2
                  className="font-serif text-xl font-semibold mb-4"
                  style={{ color: "#1F1A17" }}
                >
                  Limited availability
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.07}>
                <Link href={`/tours/${bestDeal.slug}`} className="block">
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
                        🔴 {bestDeal.urgencyLabel ?? `${bestDeal.seatsLeft} spots left`}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(76,175,80,0.12)", color: "#2E7D32" }}
                      >
                        −{bestDeal.lastSeatsDiscountPct}% last seats
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-base" style={{ color: "#1F1A17" }}>
                      {bestDeal.title}
                    </h3>
                    <p
                      className="text-xs mt-1 leading-relaxed line-clamp-2"
                      style={{ color: "#7B6F63" }}
                    >
                      {bestDeal.shortDescription}
                    </p>
                    <div
                      className="flex items-center justify-between mt-3 pt-3"
                      style={{ borderTop: "1px solid #F0E8DA" }}
                    >
                      <div>
                        <span className="text-lg font-bold" style={{ color: "#C89B3C" }}>
                          {bestDeal.pricePerPersonGel} GEL
                        </span>
                        <span className="text-xs ml-1" style={{ color: "#7B6F63" }}>
                          / person
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                      >
                        View Quest →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </section>
          )}

          {/* How it works */}
          <section className="px-4 pb-6">
            <ScrollReveal>
              <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: "#1F1A17" }}>
                How it works
              </h2>
            </ScrollReveal>
            <div className="space-y-3">
              {HOW_IT_WORKS.map((step, i) => (
                <ScrollReveal key={step.title} delay={i * 0.07}>
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
                        STEP {step.step}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "#1F1A17" }}>
                        {step.title}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#7B6F63" }}>
                        {step.desc}
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
                A real Georgian tour service
              </p>
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "#1F1A17" }}>
                Why travellers trust Ivera
              </h2>
            </ScrollReveal>
            <div className="flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip, i) => (
                <ScrollReveal key={chip.label} delay={i * 0.04}>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium border"
                    style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0", color: "#3D2B1A" }}
                  >
                    <span>{chip.icon}</span>
                    {chip.label}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* How discounts work */}
          <section className="px-4 pb-6">
            <ScrollReveal>
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "#1F1A17" }}>
                Group discounts
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-3">
              {GROUP_DISCOUNTS.map((item, i) => (
                <ScrollReveal key={item.people} delay={i * 0.06}>
                  <div
                    className="rounded-xl p-3 border text-center"
                    style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-xs mt-1" style={{ color: "#7B6F63" }}>{item.people}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "#C89B3C" }}>{item.pct}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.1}>
              <p className="text-[11px] mt-3 text-center" style={{ color: "#9A8A78" }}>
                55 GEL minimum per person · best available discount applies
              </p>
            </ScrollReveal>
          </section>

          {/* Daily Quest Challenge */}
          <ScrollReveal delay={0.05} className="mx-4 mb-6">
            <DailyQuestChallenge variant="light" />
          </ScrollReveal>

          {/* WhatsApp CTA */}
          <ScrollReveal delay={0.1} className="mx-4 mb-8">
            <section
              className="rounded-2xl p-5 text-center"
              style={{ background: "linear-gradient(135deg, #1C1710 0%, #2A1F14 100%)" }}
            >
              <MessageCircle size={22} className="mx-auto mb-2" style={{ color: "#C89B3C" }} />
              <h2 className="font-serif text-lg font-semibold text-white">
                Need a custom itinerary?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
                Message Levani directly on WhatsApp — personalised Georgian
                experiences for every traveller.
              </p>
              <a
                href={buildGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={15} /> Chat on WhatsApp
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
