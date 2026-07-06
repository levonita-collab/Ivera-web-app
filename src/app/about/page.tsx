"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Users, Star, MessageCircle, Shield, Globe } from "lucide-react";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

export default function AboutPage() {
  const { t, language } = useTranslation();
  const isRu = language === "ru";

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "#5A4A38" }}
        >
          <ArrowLeft size={14} />
          {isRu ? "На главную" : "Home"}
        </Link>

        {/* Hero */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#C89B3C" }}>
            {isRu ? "О нас" : "About Ivera"}
          </p>
          <h1 className="font-serif text-3xl font-bold text-white leading-tight">
            {isRu
              ? "Грузия глазами\nместного гида"
              : "Georgia through\na local's eyes"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Ivera — это не туристическое агентство, которое ставит вас в автобус на 50 человек. Это небольшая команда страстных грузин, которые хотят показать свою страну такой, какой видят её сами."
              : "Ivera isn't a tour agency that puts you on a 50-person bus. It's a small team of passionate Georgians who want to show you their country the way they actually see it."}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard number="9+" label={isRu ? "лет опыта" : "years experience"} />
          <StatCard number="8" label={isRu ? "маршрутов" : "quest routes"} />
          <StatCard number="≤ 8" label={isRu ? "человек в группе" : "people per group"} />
        </div>

        {/* Levani section */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.15)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-2xl"
              style={{ backgroundColor: "rgba(200,155,60,0.12)", border: "1px solid rgba(200,155,60,0.25)" }}
            >
              🇬🇪
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                {isRu ? "Ваш гид — Левани" : "Your guide — Levani"}
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: "#C89B3C" }}>
                {isRu ? "Основатель · Тбилиси, Грузия" : "Founder · Tbilisi, Georgia"}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Левани — профессиональный гид по Грузии с 9-летним опытом. Он специализируется на культурных, исторических и гастрономических маршрутах по всей стране: от горных монастырей Казбеги до пещерных городов Вардзии и виноградников Кахетии."
              : "Levani is a professional Georgian tour guide with 9 years of experience. He specialises in cultural, historical, and gastronomic routes across the country — from the mountain monasteries of Kazbegi to the cave cities of Vardzia and the vineyards of Kakheti."}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Свободно говорит по-английски и по-русски. Проводит туры лично, в малых группах до 8 человек."
              : "Fluent in English and Russian. Leads all tours personally, in small groups of up to 8 people."}
          </p>
        </div>

        {/* Why choose us */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">
            {isRu ? "Почему выбирают Ivera" : "Why travellers choose Ivera"}
          </h2>
          <div className="space-y-2">
            <WhyCard
              icon={<Users size={15} />}
              title={isRu ? "Малые группы — до 8 человек" : "Small groups — max 8 people"}
              desc={isRu
                ? "Не массовый туризм. Левани знает имя каждого гостя."
                : "Not mass tourism. Levani knows every guest by name."}
            />
            <WhyCard
              icon={<Globe size={15} />}
              title={isRu ? "Английский и русский" : "English & Russian"}
              desc={isRu
                ? "Полноценные туры на обоих языках, без необходимости переключаться."
                : "Full tours in both languages — no switching halfway through."}
            />
            <WhyCard
              icon={<Shield size={15} />}
              title={isRu ? "Без предоплаты" : "No upfront payment"}
              desc={isRu
                ? "Вы бронируете через WhatsApp. Платите в день тура. Никаких рисков."
                : "You book via WhatsApp. Pay on the day. Zero financial risk."}
            />
            <WhyCard
              icon={<Star size={15} />}
              title={isRu ? "Квест-формат" : "Quest format"}
              desc={isRu
                ? "Туры построены как квест — миссии, QR-коды, загадки. Гораздо интереснее пассивной прогулки."
                : "Tours are built as quests — missions, QR codes, riddles. Far more engaging than a passive walk."}
            />
          </div>
        </div>

        {/* Meeting point info */}
        <div
          className="rounded-2xl border p-4 space-y-3"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.12)" }}
        >
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <MapPin size={16} style={{ color: "#C89B3C" }} />
            {isRu ? "Место встречи" : "Meeting point"}
          </h2>
          <p className="text-sm" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Площадь царя Вахтанга Горгасали, район Метехи, Тбилиси"
              : "King Vakhtang Gorgasali Square, Metekhi district, Tbilisi"}
          </p>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: "#7A6A52" }}>
            <Clock size={12} style={{ color: "#C89B3C" }} />
            <span>
              {isRu
                ? "Группа собирается в 08:45 · Выезд в 09:00"
                : "Group gathers at 08:45 · Departs at 09:00"}
            </span>
          </div>
          <div
            className="rounded-xl px-3 py-2 text-[10px] leading-relaxed"
            style={{ backgroundColor: "rgba(180,30,46,0.06)", border: "1px solid rgba(180,30,46,0.12)", color: "#7A6A52" }}
          >
            {isRu
              ? "⚠️ Группа отправляется в 09:00 ровно. Опоздавший пропускает тур без возврата средств — независимо от формы оплаты."
              : "⚠️ The group departs at 09:00 sharp. Late arrivals forfeit the tour with no refund — regardless of payment form."}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl border p-5 text-center space-y-3"
          style={{ backgroundColor: "rgba(37,211,102,0.04)", borderColor: "rgba(37,211,102,0.18)" }}
        >
          <p className="text-sm font-semibold text-white">
            {isRu ? "Готовы поехать в Грузию?" : "Ready to explore Georgia?"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Напишите Левани в WhatsApp — он ответит в течение часа и поможет выбрать лучший маршрут для вас."
              : "Message Levani on WhatsApp — he replies within an hour and will help you pick the perfect route."}
          </p>
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={16} />
            {isRu ? "Написать Левани" : "Message Levani"}
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#5A4A38" }}>
          <Link href="/tours" className="hover:underline">
            {isRu ? "Все туры →" : "All tours →"}
          </Link>
          <Link href="/faq" className="hover:underline">
            FAQ →
          </Link>
          <Link href="/payment-policy" className="hover:underline">
            {isRu ? "Политика оплаты →" : "Payment policy →"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ backgroundColor: "#1A1408", border: "1px solid rgba(200,155,60,0.12)" }}
    >
      <p className="font-serif text-2xl font-bold" style={{ color: "#C89B3C" }}>
        {number}
      </p>
      <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#7A6A52" }}>
        {label}
      </p>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="rounded-xl border p-3.5 space-y-1"
      style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-2" style={{ color: "#C89B3C" }}>
        {icon}
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="text-xs leading-relaxed ml-6" style={{ color: "#7A6A52" }}>
        {desc}
      </p>
    </div>
  );
}
