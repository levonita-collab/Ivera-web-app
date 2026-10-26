"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";
import { reopenConsentBanner } from "@/lib/consent";

const CONTACT_EMAIL = "LevanLevanski@ivera.info";
const UPDATED = { en: "26 October 2026", ru: "26 октября 2026" };

type Section = { title: string; body: string[] };

const EN: Section[] = [
  {
    title: "Who is responsible for your data",
    body: [
      "IVERA is run by individual entrepreneur ლევან რევაზიშვილი (Levan Revazishvili), Georgia, personal number / ID 01013015788.",
      `For any question about your data, write to ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "What we collect",
    body: [
      "Explorer Pass: the name, country, interests, preferred language and optional WhatsApp number you enter. They are kept in your browser and, when you create a pass, in our database.",
      "Account: if you sign in, your email address (with a password or through Google sign-in).",
      "Bookings: the tour, date, number of people, price, booking code and the name on your pass.",
      "Quest progress, points and rewards: stored in your browser; nothing is sent unless you book or sign in.",
      "WhatsApp: when you tap a WhatsApp button, a prepared message opens in WhatsApp. What you send there is handled by WhatsApp (Meta) and read by Levani.",
      "Payments: PayPal processes card and PayPal details. We only receive the payment status and amount, never your card number.",
      "Statistics: Google Analytics records pages visited, the website or ad you came from, device and approximate country, and clicks on WhatsApp and booking buttons. It runs only as described under “Cookies and consent”.",
      "AI features: questions you type to the quest guide, and the names of tours you completed, are sent to Google’s Gemini AI to generate answers and suggestions.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To take and confirm bookings and to contact you about your tour (contract).",
      "To run quests, points, rewards, diplomas and personal songs you ask for (contract).",
      "To understand which pages and ads bring visitors, so we spend our small ad budget well (your consent for statistics cookies).",
      "To keep records the law requires, such as payment records (legal obligation).",
      "We never sell your data and do not use it for anything else.",
    ],
  },
  {
    title: "Who else processes it",
    body: [
      "Supabase (database and sign-in), Vercel (website hosting), Google (Analytics, Google Ads measurement, Gemini AI and Google sign-in), PayPal (payments), WhatsApp / Meta (messages).",
      "Some of these companies store data outside Georgia, for example in the EU or the USA. They protect it under their own agreements, such as standard contractual clauses.",
    ],
  },
  {
    title: "Cookies and consent",
    body: [
      "Necessary storage keeps the site working: your language, Explorer Pass and quest progress live in your browser’s local storage.",
      "Statistics cookies (Google Analytics) and Google Ads measurement are used only after you agree in the banner. Visitors from the EU, UK and Switzerland start with them switched off.",
      "You can change your choice at any time with the button below or by clearing your browser data.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Bookings and payment records: as long as Georgian tax and accounting law requires.",
      "Explorer Pass and account: until you ask us to delete them.",
      "Statistics: according to Google Analytics retention settings, up to 14 months.",
      "Data in your browser stays until you clear it.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask to see, correct or delete your data, to receive a copy, or to stop a use you agreed to.",
      `Write to ${CONTACT_EMAIL}; we reply within 30 days.`,
      "You may also complain to the Personal Data Protection Service of Georgia, or to the authority in your own country.",
    ],
  },
  {
    title: "Children",
    body: [
      "The site is for travellers planning trips. It is not aimed at children under 16; children join tours with their parents, who book for them.",
    ],
  },
  {
    title: "Photos on this site",
    body: ["Photos are our own or created with AI tools for IVERA."],
  },
  {
    title: "Changes",
    body: ["If this policy changes, the new version appears on this page with a new date."],
  },
];

const RU: Section[] = [
  {
    title: "Кто отвечает за ваши данные",
    body: [
      "IVERA ведёт индивидуальный предприниматель ლევან რევაზიშვილი (Леван Ревазишвили), Грузия, личный номер / ID 01013015788.",
      `По любым вопросам о данных пишите на ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "Что мы собираем",
    body: [
      "Explorer Pass: имя, страна, интересы, язык и, по желанию, номер WhatsApp, которые вы вводите. Хранятся в вашем браузере, а при создании паспорта — в нашей базе данных.",
      "Аккаунт: если вы входите, ваш email (с паролем или через вход Google).",
      "Бронирования: тур, дата, число людей, цена, код брони и имя из паспорта.",
      "Прогресс квестов, очки и награды хранятся в вашем браузере; ничего не отправляется, пока вы не бронируете и не входите в аккаунт.",
      "WhatsApp: при нажатии кнопки WhatsApp открывается готовое сообщение. То, что вы отправляете, обрабатывает WhatsApp (Meta), а читает Левани.",
      "Оплата: данные карты и PayPal обрабатывает PayPal. Мы получаем только статус и сумму оплаты, номер карты — никогда.",
      "Статистика: Google Analytics фиксирует посещённые страницы, сайт или рекламу, откуда вы пришли, устройство, примерную страну и нажатия на кнопки WhatsApp и бронирования. Работает только так, как описано в разделе «Cookies и согласие».",
      "ИИ-функции: вопросы, которые вы пишете гиду в квесте, и названия пройденных туров отправляются в ИИ Google Gemini, чтобы получить ответы и советы.",
    ],
  },
  {
    title: "Зачем мы их используем",
    body: [
      "Чтобы принимать и подтверждать брони и связываться с вами по туру (договор).",
      "Чтобы работали квесты, очки, награды, дипломы и личные песни, которые вы просите (договор).",
      "Чтобы понимать, какие страницы и реклама приводят гостей, и разумно тратить небольшой рекламный бюджет (ваше согласие на статистические cookies).",
      "Чтобы хранить записи, которые требует закон, например о платежах (обязанность по закону).",
      "Мы никогда не продаём ваши данные и не используем их ни для чего другого.",
    ],
  },
  {
    title: "Кто ещё их обрабатывает",
    body: [
      "Supabase (база данных и вход), Vercel (хостинг сайта), Google (Analytics, измерение Google Ads, ИИ Gemini и вход через Google), PayPal (оплата), WhatsApp / Meta (сообщения).",
      "Часть этих компаний хранит данные за пределами Грузии, например в ЕС или США. Они защищают их по собственным соглашениям, например по стандартным договорным условиям.",
    ],
  },
  {
    title: "Cookies и согласие",
    body: [
      "Необходимое хранилище обеспечивает работу сайта: язык, Explorer Pass и прогресс квестов лежат в локальном хранилище вашего браузера.",
      "Статистические cookies (Google Analytics) и измерение Google Ads используются только после вашего согласия в баннере. Для посетителей из ЕС, Великобритании и Швейцарии они изначально выключены.",
      "Изменить выбор можно в любой момент кнопкой ниже или очистив данные браузера.",
    ],
  },
  {
    title: "Сколько мы их храним",
    body: [
      "Брони и платёжные записи — столько, сколько требует налоговое и бухгалтерское законодательство Грузии.",
      "Explorer Pass и аккаунт — пока вы не попросите их удалить.",
      "Статистику — по настройкам хранения Google Analytics, до 14 месяцев.",
      "Данные в браузере хранятся, пока вы их не очистите.",
    ],
  },
  {
    title: "Ваши права",
    body: [
      "Вы можете попросить показать, исправить или удалить ваши данные, получить их копию или прекратить использование, на которое вы дали согласие.",
      `Напишите на ${CONTACT_EMAIL}; мы ответим в течение 30 дней.`,
      "Также вы можете подать жалобу в Службу защиты персональных данных Грузии или в орган вашей страны.",
    ],
  },
  {
    title: "Дети",
    body: [
      "Сайт предназначен для путешественников. Он не рассчитан на детей младше 16 лет; дети едут в туры с родителями, которые бронируют за них.",
    ],
  },
  {
    title: "Фотографии на сайте",
    body: ["Фотографии наши собственные или созданы для IVERA с помощью ИИ."],
  },
  {
    title: "Изменения",
    body: ["Если политика изменится, новая версия появится на этой странице с новой датой."],
  },
];

export default function PrivacyPage() {
  const { language } = useTranslation();
  const isRu = language === "ru";
  const sections = isRu ? RU : EN;

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#5A4A38" }}>
            <ArrowLeft size={14} /> {isRu ? "На главную" : "Home"}
          </Link>
          <h1 className="font-serif text-2xl text-white font-bold">
            {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
          </h1>
          <p className="text-xs" style={{ color: "#7A6A52" }}>
            {isRu ? `Обновлено: ${UPDATED.ru}` : `Last updated: ${UPDATED.en}`}
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border p-4 space-y-2" style={{ backgroundColor: "#181410", borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="text-sm font-semibold text-white">{s.title}</h2>
              <ul className="space-y-1.5">
                {s.body.map((line) => (
                  <li key={line} className="text-[13px] leading-relaxed" style={{ color: "#B5A68C" }}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="rounded-2xl border p-4 space-y-3 text-center" style={{ backgroundColor: "rgba(200,155,60,0.06)", borderColor: "rgba(200,155,60,0.25)" }}>
          <p className="text-sm text-white font-medium">{isRu ? "Настройки cookies" : "Cookie settings"}</p>
          <button
            onClick={reopenConsentBanner}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "linear-gradient(180deg, #E9C163 0%, #C89B3C 100%)", color: "#1A1208" }}
          >
            {isRu ? "Изменить выбор" : "Change my choice"}
          </button>
          <p className="text-xs" style={{ color: "#7A6A52" }}>
            {isRu ? "Вопросы о данных: " : "Data questions: "}
            <span className="select-all" style={{ color: "#C89B3C" }}>{CONTACT_EMAIL}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
