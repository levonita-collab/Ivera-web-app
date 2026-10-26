"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { isBannerOpen, setConsent, subscribeConsent } from "@/lib/consent";
import { useTranslation } from "@/lib/i18n/dictionary";

/** Small cookie banner above the bottom navigation, in the site's gold-on-brown style. */
export default function ConsentBanner() {
  const { language } = useTranslation();
  const isRu = language === "ru";
  const open = useSyncExternalStore(subscribeConsent, isBannerOpen, () => false);
  const pathname = usePathname();
  if (!open || pathname.startsWith("/admin")) return null;

  return (
    <div
      role="dialog"
      aria-label={isRu ? "Настройки cookies" : "Cookie settings"}
      className="fixed left-3 right-3 z-[60] mx-auto max-w-md rounded-[20px] p-4"
      style={{
        bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
        background: "linear-gradient(165deg, #2A1D10 0%, #1A130B 100%)",
        border: "1.5px solid rgba(200,155,60,0.5)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      }}
    >
      <p className="text-[13px] leading-relaxed" style={{ color: "#E2D6C2" }}>
        {isRu
          ? "Мы используем статистику Google, чтобы понимать, какие страницы и реклама полезны. Разрешите её, если не против."
          : "We use Google statistics to see which pages and ads are useful. Allow it if you don't mind."}{" "}
        <Link href="/privacy" className="underline" style={{ color: "#E2B465" }}>
          {isRu ? "Подробнее" : "Details"}
        </Link>
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setConsent("denied")}
          className="flex-1 py-2.5 rounded-full text-[13px] font-semibold"
          style={{ border: "1.5px solid rgba(200,155,60,0.45)", color: "#E8D5A0" }}
        >
          {isRu ? "Только необходимое" : "Only necessary"}
        </button>
        <button
          onClick={() => setConsent("granted")}
          className="flex-1 py-2.5 rounded-full text-[13px] font-bold"
          style={{ background: "linear-gradient(180deg, #E9C163 0%, #C89B3C 100%)", color: "#1A1208" }}
        >
          {isRu ? "Разрешить" : "Allow"}
        </button>
      </div>
    </div>
  );
}
