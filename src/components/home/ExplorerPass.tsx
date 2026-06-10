"use client";

import { useState } from "react";
import { X, Compass, Zap, Award, Ticket, Gift, MessageCircle } from "lucide-react";
import { saveProfile, getProfile } from "@/lib/questProgress";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";

const INTERESTS = ["Wine", "Mountains", "History", "Food", "Adventure"];
const LANGUAGES = ["English", "Russian"];

const BENEFITS = [
  { icon: Zap, label: "Save your XP" },
  { icon: Award, label: "Collect badges" },
  { icon: Ticket, label: "Track bookings" },
  { icon: Gift, label: "Unlock rewards" },
  { icon: MessageCircle, label: "Stay connected with your guide" },
];

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ExplorerPass({ onClose, onSaved }: Props) {
  const existing = typeof window !== "undefined" ? getProfile() : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(existing?.whatsappNumber ?? "");
  const [language, setLanguage] = useState(existing?.language ?? "");
  const [interests, setInterests] = useState<string[]>(existing?.interests ?? []);
  const [saving, setSaving] = useState(false);

  function toggleInterest(i: string) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    const profile = {
      name: trimmed,
      country: country.trim() || undefined,
      whatsappNumber: whatsappNumber.trim() || undefined,
      language: language || undefined,
      interests: interests.length > 0 ? interests : undefined,
      joinedAt: existing?.joinedAt ?? new Date().toISOString(),
      supabaseId: existing?.supabaseId,
    };
    saveProfile(profile); // localStorage — instant, source of truth
    onSaved();
    // Background sync — does not block or delay UI
    saveExplorerToSupabase(profile, existing?.supabaseId)
      .then((id) => {
        if (id && id !== existing?.supabaseId) {
          saveProfile({ ...profile, supabaseId: id });
        }
      })
      .catch(() => {});
  }

  const canSave = name.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: "rgba(15,12,7,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-t-3xl px-6 pt-6 pb-10 space-y-5 max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: "#F7F0E4" }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: "#E8DDD0" }} />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
            >
              <Compass size={18} style={{ color: "#C89B3C" }} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold" style={{ color: "#1F1A17" }}>
                Create your Explorer Pass
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "#7B6F63" }}>
                Your free key to the Ivera world
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: "rgba(31,26,23,0.08)" }}
          >
            <X size={15} style={{ color: "#1F1A17" }} />
          </button>
        </div>

        {/* Benefits */}
        <div
          className="rounded-2xl p-3.5 grid grid-cols-1 gap-2"
          style={{ backgroundColor: "#FFFDF8", border: "1px solid #E8DDD0" }}
        >
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon size={14} style={{ color: "#C89B3C" }} className="flex-shrink-0" />
              <span className="text-[13px]" style={{ color: "#3D2B1A" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#7B6F63" }}>
            Your name <span style={{ color: "#C89B3C" }}>*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Explorer name"
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: "#FFFDF8",
              border: "1.5px solid #E8DDD0",
              color: "#1F1A17",
            }}
            maxLength={40}
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#7B6F63" }}>
            Country
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Where are you from?"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: "#FFFDF8",
              border: "1.5px solid #E8DDD0",
              color: "#1F1A17",
            }}
            maxLength={40}
          />
        </div>

        {/* WhatsApp number */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#7B6F63" }}>
            WhatsApp number
          </label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+995 555 12 34 56"
            type="tel"
            inputMode="tel"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: "#FFFDF8",
              border: "1.5px solid #E8DDD0",
              color: "#1F1A17",
            }}
            maxLength={24}
          />
          <p className="text-[10px] mt-1" style={{ color: "#9A8A78" }}>
            So your guide can confirm bookings and reach you safely.
          </p>
        </div>

        {/* Language preference */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#7B6F63" }}>
            Support language
          </label>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(active ? "" : lang)}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active ? "#C89B3C" : "rgba(200,155,60,0.1)",
                    color: active ? "#FFFFFF" : "#C89B3C",
                    border: `1.5px solid ${active ? "#C89B3C" : "rgba(200,155,60,0.3)"}`,
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#7B6F63" }}>
            I&apos;m into...
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active ? "#C89B3C" : "rgba(200,155,60,0.1)",
                    color: active ? "#FFFFFF" : "#C89B3C",
                    border: `1.5px solid ${active ? "#C89B3C" : "rgba(200,155,60,0.3)"}`,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="w-full py-4 rounded-full font-semibold text-base text-white transition-opacity"
            style={{ backgroundColor: "#C89B3C", opacity: canSave && !saving ? 1 : 0.45 }}
          >
            {saving ? "Saving…" : existing?.name ? "Update Pass" : "Create Explorer Pass"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-sm font-medium"
            style={{ color: "#7B6F63" }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
