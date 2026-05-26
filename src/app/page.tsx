"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import IveraHero from "@/components/home/IveraHero";
import DashboardHome from "@/components/home/DashboardHome";
import ExplorerPass from "@/components/home/ExplorerPass";
import { tours } from "@/data/tours";
import { getTotalXP, getProfile, Profile } from "@/lib/questProgress";
import { buildGeneralLink } from "@/lib/whatsapp";

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
            <div className="flex items-center justify-between mb-4">
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
            </div>
            <div className="space-y-4">
              {tours.slice(0, 3).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>

          {/* WhatsApp CTA */}
          <section className="mx-4 mb-8 rounded-2xl p-5 text-center"
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
