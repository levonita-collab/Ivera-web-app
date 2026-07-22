"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle } from "lucide-react";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_EN: FaqItem[] = [
  {
    q: "How do I book a tour?",
    a: "Choose a tour, pick a date and number of people, then tap 'Book via WhatsApp'. A pre-filled message opens in WhatsApp — send it to Levani and he'll confirm availability, usually within 1 hour.",
  },
  {
    q: "Do I need to pay in advance?",
    a: "No upfront payment is required if you book via WhatsApp — you confirm with Levani, then pay him directly on the day of the tour, in Georgian Lari (GEL), cash or card. If you'd rather secure your booking instantly, you can also pay online via PayPal at checkout — your booking is confirmed as soon as that payment goes through.",
  },
  {
    q: "What is included in the price?",
    a: "Day tours include: professional guide, comfortable transport (from Tbilisi), and lunch where listed. Entrance tickets to specific sites are not included unless stated. The Tbilisi City Quest includes guide only — no transport needed.",
  },
  {
    q: "What languages are tours in?",
    a: "All tours are conducted in English and Russian. Levani speaks both fluently.",
  },
  {
    q: "How many people are in a group?",
    a: "Groups can range from 2 to 50 people — the most common size is up to 20. For groups of 6 or more, message Levani for a custom group rate and quote.",
  },
  {
    q: "Where do we meet?",
    a: "All day tours depart from King Vakhtang Gorgasali Square, Metekhi district, Tbilisi. The group assembles at 08:45 and departs at 09:00 sharp.",
  },
  {
    q: "What happens if I'm late?",
    a: "The group departs at 09:00 sharp and cannot wait. If you miss the departure, you forfeit the tour with no refund — whether you've paid in full or left a deposit. Please plan to arrive by 08:45.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Contact Levani via WhatsApp as soon as possible. Cancellations made more than 24 hours in advance can usually be rescheduled. No-shows or last-minute cancellations are non-refundable.",
  },
  {
    q: "What should I bring?",
    a: "Comfortable walking shoes, weather-appropriate clothing, water, sunscreen, and your phone (for quest QR codes). Lunch is included on most day tours, but bring snacks if you like.",
  },
  {
    q: "Can I book a private tour?",
    a: "Yes. Message Levani on WhatsApp for private tour pricing. Private tours can be customised for your dates, group size, and interests.",
  },
  {
    q: "What is the 'Quest' format?",
    a: "Quest tours include interactive missions at each stop — scan QR codes, answer trivia, take specific photos, taste local foods. You earn XP for each mission completed. It's designed to make you engage with Georgia's history and culture, not just photograph it.",
  },
  {
    q: "Are tours safe?",
    a: "All tours use experienced drivers and well-maintained vehicles. Georgia is a safe country for tourism. Levani is a licensed, experienced guide who knows every route.",
  },
];

const FAQ_RU: FaqItem[] = [
  {
    q: "Как забронировать тур?",
    a: "Выберите тур, дату и количество человек, затем нажмите «Забронировать через WhatsApp». Откроется WhatsApp с готовым сообщением — отправьте его Левани, и он подтвердит наличие мест, обычно в течение часа.",
  },
  {
    q: "Нужна ли предоплата?",
    a: "Если вы бронируете через WhatsApp, предоплата не нужна — вы подтверждаете бронь с Левани и платите ему напрямую в день тура, в грузинских лари (GEL), наличными или картой. Если вы хотите сразу зафиксировать бронирование, можно также оплатить онлайн через PayPal — бронь подтверждается сразу после оплаты.",
  },
  {
    q: "Что включено в стоимость?",
    a: "Однодневные туры включают: профессионального гида, комфортабельный транспорт (из Тбилиси) и обед, где это указано. Входные билеты в конкретные объекты не включены, если не оговорено отдельно. Тбилисский квест включает только гида — транспорт не нужен.",
  },
  {
    q: "На каких языках проводятся туры?",
    a: "Все туры проводятся на английском и русском языках. Левани свободно говорит на обоих.",
  },
  {
    q: "Сколько человек в группе?",
    a: "От 2 до 50 человек — чаще всего группы до 20 человек. Для групп от 6 человек напишите Левани для индивидуальной групповой цены.",
  },
  {
    q: "Где место встречи?",
    a: "Все однодневные туры отправляются с площади царя Вахтанга Горгасали, район Метехи, Тбилиси. Группа собирается в 08:45, выезд — ровно в 09:00.",
  },
  {
    q: "Что будет, если я опоздаю?",
    a: "Группа отправляется в 09:00 ровно и не ждёт опоздавших. Если вы пропустили отправление, тур считается использованным без возврата средств — независимо от того, оплачен ли он полностью или внесён депозит. Пожалуйста, приходите к 08:45.",
  },
  {
    q: "Можно ли отменить или перенести тур?",
    a: "Напишите Левани в WhatsApp как можно скорее. Отмена более чем за 24 часа, как правило, допускает перенос. Неявка и отмена в последний момент не возвращаются.",
  },
  {
    q: "Что взять с собой?",
    a: "Удобную обувь для ходьбы, одежду по погоде, воду, солнцезащитный крем и телефон (для QR-кодов квеста). На большинстве однодневных туров обед включён, но можно взять перекус.",
  },
  {
    q: "Можно ли заказать индивидуальный тур?",
    a: "Да. Напишите Левани в WhatsApp для получения цены на частный тур. Частные туры можно адаптировать под ваши даты, размер группы и интересы.",
  },
  {
    q: "Что такое формат «Квест»?",
    a: "Квест-туры включают интерактивные задания в каждой точке маршрута — сканирование QR-кодов, вопросы о культуре, фотоза дания, дегустации. За каждое задание вы получаете XP. Формат создан, чтобы вы по-настоящему погружались в историю и культуру Грузии, а не просто фотографировали.",
  },
  {
    q: "Безопасны ли туры?",
    a: "Все туры используют опытных водителей и ухоженные автомобили. Грузия — безопасная страна для туризма. Левани — лицензированный, опытный гид, знающий каждый маршрут.",
  },
];

export default function FaqPage() {
  const { language } = useTranslation();
  const isRu = language === "ru";
  const items = isRu ? FAQ_RU : FAQ_EN;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "#5A4A38" }}
        >
          <ArrowLeft size={14} />
          {isRu ? "На главную" : "Home"}
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#C89B3C" }}>
            FAQ
          </p>
          <h1 className="font-serif text-2xl font-bold text-white">
            {isRu ? "Часто задаваемые вопросы" : "Frequently Asked Questions"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Не нашли ответа? Напишите Левани — он ответит в течение часа."
              : "Can't find an answer? Message Levani — he replies within an hour."}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#1A1408",
                borderColor: open === i ? "rgba(200,155,60,0.25)" : "rgba(255,255,255,0.05)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-white leading-snug">
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: "#C89B3C",
                    flexShrink: 0,
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {open === i && (
                <div
                  className="px-4 pb-4 text-sm leading-relaxed"
                  style={{ color: "#7A6A52" }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div
          className="rounded-2xl border p-5 text-center space-y-3"
          style={{ backgroundColor: "rgba(37,211,102,0.04)", borderColor: "rgba(37,211,102,0.18)" }}
        >
          <p className="text-sm font-semibold text-white">
            {isRu ? "Остались вопросы?" : "Still have questions?"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Левани отвечает в WhatsApp в течение часа."
              : "Levani answers on WhatsApp within an hour."}
          </p>
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={16} />
            {isRu ? "Написать в WhatsApp" : "Chat on WhatsApp"}
          </a>
        </div>

      </div>
    </div>
  );
}
