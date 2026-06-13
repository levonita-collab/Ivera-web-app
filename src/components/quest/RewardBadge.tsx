"use client";

import { Badge as BadgeData } from "@/data/rewards";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  badge: BadgeData;
  earned?: boolean;
}

export default function RewardBadge({ badge, earned = true }: Props) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-2xl p-4 text-center border transition-all ${
        earned
          ? "bg-brand-gold/10 border-brand-gold/40"
          : "bg-white/3 border-white/5 opacity-40 grayscale"
      }`}
    >
      <div className="text-4xl mb-2">{badge.icon}</div>
      <p className={`text-sm font-semibold ${earned ? "text-brand-gold" : "text-brand-muted"}`}>
        {badge.name}
      </p>
      {earned && (
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">{badge.description}</p>
      )}
      {!earned && (
        <p className="text-xs text-brand-muted mt-1">{t("quest.completeToUnlock")}</p>
      )}
    </div>
  );
}
