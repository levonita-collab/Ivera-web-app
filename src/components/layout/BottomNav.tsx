"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Gift, User } from "lucide-react";
import IveraIcon from "./IveraIcon";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

const tabs: { href: string; icon: typeof Home; labelKey: DictionaryKey }[] = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/tours", icon: Map, labelKey: "nav.quests" },
  { href: "/leaderboard", icon: Gift, labelKey: "nav.rewards" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-black/95 backdrop-blur-sm border-t border-white/5 safe-bottom">
      <div className="max-w-2xl mx-auto px-2 h-16 flex items-center justify-around">
        {/* First two tabs */}
        {tabs.slice(0, 2).map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 min-w-[56px] py-1"
          >
            <Icon
              size={20}
              className={isActive(href) ? "text-brand-gold" : "text-brand-muted"}
            />
            <span
              className={`text-[10px] font-medium ${
                isActive(href) ? "text-brand-gold" : "text-brand-muted"
              }`}
            >
              {t(labelKey)}
            </span>
          </Link>
        ))}

        {/* Centre button → My Trip */}
        <Link
          href="/my-trip"
          className="flex flex-col items-center -mt-6"
          aria-label={t("nav.myTrip")}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: "#C4923A",
              boxShadow: "0 4px 16px rgba(196,146,58,0.45)",
            }}
          >
            <IveraIcon size={26} darkBg ariaLabel={t("header.logoAriaLabel")} />
          </div>
          <span className="text-[9px] font-semibold mt-1" style={{ color: "#C4923A" }}>
            {t("nav.myTrip")}
          </span>
        </Link>

        {/* Last two tabs */}
        {tabs.slice(2).map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 min-w-[56px] py-1"
          >
            <Icon
              size={20}
              className={isActive(href) ? "text-brand-gold" : "text-brand-muted"}
            />
            <span
              className={`text-[10px] font-medium ${
                isActive(href) ? "text-brand-gold" : "text-brand-muted"
              }`}
            >
              {t(labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
