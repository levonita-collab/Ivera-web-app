"use client";

import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  earned: number;
  total: number;
  label?: string;
}

export default function XPProgress({ earned, total, label }: Props) {
  const { t } = useTranslation();
  const pct = total === 0 ? 0 : Math.min(100, Math.round((earned / total) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-brand-muted">
        <span>{label ?? "XP"}</span>
        <span>
          <span className="text-brand-gold font-semibold">{earned}</span> / {total} XP
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #C4923A, #E0B85A)",
          }}
        />
      </div>
      <p className="text-[10px] text-brand-muted text-right">{pct}% {t("quest.percentComplete")}</p>
    </div>
  );
}
