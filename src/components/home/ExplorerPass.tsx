"use client";

import { useState } from "react";
import { X, Compass } from "lucide-react";
import { saveProfile, getProfile } from "@/lib/questProgress";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { useTranslation, INTEREST_LABEL_KEYS } from "@/lib/i18n/dictionary";

const INTERESTS = ["Wine", "Mountains", "History", "Food", "Adventure"];

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ExplorerPass({ onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const existing = typeof window !== "undefined" ? getProfile() : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
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
        className="w-full max-w-2xl mx-auto rounded-t-3xl px-6 pt-6 pb-10 space-y-5"
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
                {t("explorerPass.title")}
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "#7B6F63" }}>
                {t("explorerPass.subtitle")}
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

        {/* Name */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#7B6F63" }}>
            {t("explorerPass.yourName")} <span style={{ color: "#C89B3C" }}>*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder={t("explorerPass.namePlaceholder")}
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
            {t("explorerPass.country")}
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t("explorerPass.countryPlaceholder")}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: "#FFFDF8",
              border: "1.5px solid #E8DDD0",
              color: "#1F1A17",
            }}
            maxLength={40}
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#7B6F63" }}>
            {t("explorerPass.imInto")}
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
                  {t(INTEREST_LABEL_KEYS[item])}
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
            {saving ? t("explorerPass.saving") : existing?.name ? t("explorerPass.updatePass") : t("explorerPass.createPass")}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-sm font-medium"
            style={{ color: "#7B6F63" }}
          >
            {t("explorerPass.continueAsGuest")}
          </button>
        </div>
      </div>
    </div>
  );
}
