"use client";

import { Check, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  included: string[];
  excluded: string[];
}

export default function IncludedExcluded({ included, excluded }: Props) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-3">
          {t("tourDetail.included")}
        </h3>
        <ul className="space-y-2">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-cream/80">
              <Check size={14} className="mt-0.5 text-green-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-semibold tracking-widest text-brand-muted uppercase mb-3">
          {t("tourDetail.notIncluded")}
        </h3>
        <ul className="space-y-2">
          {excluded.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-muted">
              <X size={14} className="mt-0.5 text-red-400/70 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
