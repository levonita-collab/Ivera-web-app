"use client";

import { useTranslation } from "@/lib/i18n/dictionary";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div
      className="flex items-center rounded-full border text-[11px] font-bold overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
      role="group"
      aria-label={t("lang.switchTo")}
    >
      <button
        onClick={() => setLanguage("en")}
        className="px-2 py-1.5 transition-colors"
        style={{
          color: language === "en" ? "#0F0C07" : "#8A7A60",
          backgroundColor: language === "en" ? "#C4923A" : "transparent",
        }}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("ru")}
        className="px-2 py-1.5 transition-colors"
        style={{
          color: language === "ru" ? "#0F0C07" : "#8A7A60",
          backgroundColor: language === "ru" ? "#C4923A" : "transparent",
        }}
        aria-pressed={language === "ru"}
      >
        RU
      </button>
    </div>
  );
}
