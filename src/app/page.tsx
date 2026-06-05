"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import IveraHero from "@/components/home/IveraHero";
import DashboardHome from "@/components/home/DashboardHome";
import ExplorerPass from "@/components/home/ExplorerPass";
import { tours } from "@/data/tours";
import { getTotalXP, getProfile, saveProfile, Profile } from "@/lib/questProgress";
import { buildGeneralLink } from "@/lib/whatsapp";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { ScrollReveal } from "@/components/motion";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🗺️",
    title: "Choose your route",
    desc: "8 curated quests across Georgia — culture, wine, mountains, heritage.",
  },
  {
    step: "02",
    icon: "💬",
    title: "Book with Levani on WhatsApp",
    desc: "No payment now. Levani confirms availability within 2 hours.",
  },
  {
    step: "03",
    icon: "⚡",
    title: "Complete missions during the tour",
    desc: "Scan QR codes, taste, observe, and discover at each stop.",
  },
  {
    step: "04",
    icon: "🏆",
    title: "Earn XP, badges and rewards",
    desc: "Track your progress and climb the leaderboard.",
  },
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

          {/* WhatsApp CTA */}
          <ScrollReveal delay={0.1} className="mx-4 mb-8">
          <section className="rounded-2xl p-5 text-center"
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
