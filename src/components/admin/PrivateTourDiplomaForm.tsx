"use client";

import { useState } from "react";
import { Award, Download, Loader2, ChevronDown } from "lucide-react";
import { PRIVATE_TOUR_REGIONS } from "@/data/privateTours";
import { downloadDiploma, formatDateRange } from "@/lib/diploma";
import { buildRewardCode } from "@/lib/rewards";
import type { Language } from "@/lib/i18n/LanguageContext";

const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
} as const;

// Private tours have no in-app missions to verify, so Levani issues their
// diplomas from here after the tour and sends the PNG on WhatsApp.
export default function PrivateTourDiplomaForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [places, setPlaces] = useState("");
  const [busy, setBusy] = useState(false);

  const isRu = language === "ru";
  const lines = places
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const canDownload = name.trim() !== "" && start !== "" && lines.length > 0;

  function addRegion(label: string) {
    setPlaces((p) => (p.trim() ? `${p.trimEnd()}\n${label}` : label));
  }

  async function handleDownload() {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      await downloadDiploma({
        kind: "private",
        explorerName: name.trim(),
        country: country.trim() || undefined,
        tourTitle: title.trim() || (isRu ? "Приватный тур по Грузии" : "Private tour of Georgia"),
        completedOn: new Date(`${end || start}T12:00:00Z`),
        dateText: formatDateRange(start, end, language),
        missions: lines.map((title) => ({ title })),
        totalXp: null,
        certificateNo: buildRewardCode(`private|${name.trim()}|${start}|${end}`),
        language,
        // Browsers drop download names with non-Latin characters (e.g. Cyrillic
        // guest names) and save as "download", so keep the file name ASCII.
        fileSlug: ["private", asciiSlug(name), start].filter(Boolean).join("-"),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border" style={{ backgroundColor: "#141008", borderColor: "rgba(200,155,60,0.2)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <Award size={16} style={{ color: "#C4923A" }} />
        <span className="flex-1">
          <span className="block text-sm font-semibold text-white">Private tour diploma</span>
          <span className="block text-[11px]" style={{ color: "#5A4A38" }}>
            Fill in the guest&apos;s details after the tour, download the PNG and send it on WhatsApp.
          </span>
        </span>
        <ChevronDown size={16} style={{ color: "#5A4A38", transform: open ? "rotate(180deg)" : undefined }} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2">
            {(["en", "ru"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                aria-pressed={language === l}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: language === l ? "#C4923A" : "rgba(255,255,255,0.06)",
                  color: language === l ? "#0A0805" : "#8A7A60",
                }}
              >
                {l === "en" ? "English" : "Русский"}
              </button>
            ))}
          </div>

          <Field label="Guest name *">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} placeholder={isRu ? "Анна Шмидт" : "Anna Schmidt"} />
          </Field>
          <Field label="Country">
            <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} placeholder="Germany" />
          </Field>
          <Field label="Tour title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} placeholder={isRu ? "Приватный тур по Грузии" : "Private tour of Georgia"} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="First day *">
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm outline-none" style={{ ...inputStyle, colorScheme: "dark" }} />
            </Field>
            <Field label="Last day">
              <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm outline-none" style={{ ...inputStyle, colorScheme: "dark" }} />
            </Field>
          </div>
          <Field label="Route — one line per day or place (up to 7 lines on the diploma) *">
            <textarea
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
              rows={4}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
              style={inputStyle}
              placeholder={isRu ? "День 1 — Тбилиси и Мцхета\nДень 2 — Казбеги" : "Day 1 — Tbilisi & Mtskheta\nDay 2 — Kazbegi"}
            />
          </Field>
          <div className="flex flex-wrap gap-1.5">
            {PRIVATE_TOUR_REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => addRegion(isRu ? r.nameRu : r.name)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: "rgba(200,155,60,0.08)", color: "#C4923A", border: "1px solid rgba(200,155,60,0.18)" }}
              >
                + {isRu ? r.nameRu : r.name}
              </button>
            ))}
          </div>
          {lines.length > 7 && (
            <p className="text-[11px]" style={{ color: "#C4923A" }}>
              Only the first 7 lines fit on the diploma.
            </p>
          )}
          <button
            onClick={handleDownload}
            disabled={!canDownload || busy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: "#C4923A", color: "#0A0805" }}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Download diploma
          </button>
        </div>
      )}
    </div>
  );
}

function asciiSlug(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium" style={{ color: "#8A7A60" }}>{label}</span>
      {children}
    </label>
  );
}
