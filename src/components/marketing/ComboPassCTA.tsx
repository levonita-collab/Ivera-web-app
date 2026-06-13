"use client";

import { MessageCircle } from "lucide-react";
import { buildMultiTourLink } from "@/lib/whatsapp";
import { useTranslation, ruPlural } from "@/lib/i18n/dictionary";

interface Props {
  currentTourTitle?: string;
}

const TIERS = [
  { count: 2, pct: 5, extra: false },
  { count: 3, pct: 10, extra: false },
  { count: 4, pct: 15, extra: true },
];

export default function ComboPassCTA({ currentTourTitle }: Props) {
  const { t, language } = useTranslation();

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)",
        border: "1px solid rgba(200,155,60,0.3)",
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-[10px] tracking-widest uppercase font-semibold mb-1"
          style={{ color: "#C89B3C" }}
        >
          {t("combo.title")}
        </p>
        <h3 className="font-serif text-base font-bold" style={{ color: "#1F1A17" }}>
          {t("combo.heading")}
        </h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "#7B6F63" }}>
          {t("combo.description")}
        </p>
      </div>

      {/* Discount tiers */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(200,155,60,0.2)" }}
      >
        {TIERS.map((tier, i) => (
          <div
            key={tier.count}
            className="flex items-center justify-between px-4 py-3 text-sm"
            style={{
              backgroundColor: i % 2 === 0 ? "rgba(200,155,60,0.04)" : "transparent",
              borderBottom: i < TIERS.length - 1 ? "1px solid rgba(200,155,60,0.1)" : "none",
            }}
          >
            <span style={{ color: "#3D2B1A" }}>
              {tier.count === 4
                ? t("combo.toursPlus")
                : `${tier.count} ${
                    language === "ru" ? ruPlural(tier.count, "тур", "тура", "туров") : t("combo.tours")
                  }`}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="font-bold px-2 py-0.5 rounded-full text-[13px]"
                style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
              >
                {tier.pct}{t("discount.offSuffix")}
              </span>
              {tier.extra && (
                <span className="text-[11px]" style={{ color: "#C89B3C" }}>
                  {t("combo.bonusXp")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <a
        href={buildMultiTourLink(2, currentTourTitle, language)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={14} />
        {t("combo.planCombo")}
      </a>
    </div>
  );
}
