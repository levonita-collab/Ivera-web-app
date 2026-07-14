"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";
import { buildGeneralLink } from "@/lib/whatsapp";

export default function Footer() {
  const { t, language } = useTranslation();
  const isRu = language === "ru";
  const year = 2025;

  return (
    <footer
      className="w-full max-w-2xl mx-auto px-4 pb-24 pt-8 mt-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Brand row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-serif text-base font-bold" style={{ color: "#C89B3C" }}>
            IVERA
          </p>
          <p className="text-[11px] mt-0.5 leading-relaxed max-w-[200px]" style={{ color: "#5A4A38" }}>
            {isRu
              ? "Квест-туры по Грузии с местными гидами"
              : "Quest tours across Georgia with local guides"}
          </p>
        </div>

        <a
          href={buildGeneralLink(language)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold text-white flex-shrink-0"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>
      </div>

      {/* Links grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
        <FooterLink href="/tours" label={isRu ? "Туры" : "Tours"} />
        <FooterLink href="/about" label={isRu ? "О нас" : "About Us"} />
        <FooterLink href="/packages" label={isRu ? "Комбо-туры" : "Combo Trips"} />
        <FooterLink href="/faq" label={isRu ? "FAQ" : "FAQ"} />
        <FooterLink href="/payment-policy" label={isRu ? "Политика оплаты" : "Payment Policy"} />
        <FooterLink href="/free-tbilisi-quest" label={isRu ? "Бесплатный квест" : "Free Quest"} />
      </div>

      {/* Trust line */}
      <p className="text-[10px] mb-3" style={{ color: "#3D2D1A" }}>
        {isRu
          ? "Грузинский туроператор · Работаем с 2016 года · Малые группы · Гид говорит по-английски и по-русски"
          : "Georgian tour operator · Est. 2016 · Small groups · English & Russian-speaking guide"}
      </p>

      <p className="text-[10px]" style={{ color: "#3D2D1A" }}>
        © {year} IVERA Georgia.{" "}
        {isRu ? "Все права защищены." : "All rights reserved."}
      </p>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[11px] hover:underline transition-colors"
      style={{ color: "#5A4A38" }}
    >
      {label}
    </Link>
  );
}
