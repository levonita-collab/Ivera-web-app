import type { Language } from "./i18n/LanguageContext";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787";

interface BookingParams {
  tourTitle: string;
  date: string;
  people: number;
  pricePerPerson: number | null;
  total: number | null;
  discountLabel?: string;
  savingsTotal?: number;
}

export function buildBookingLink(params: BookingParams): string {
  const { tourTitle, date, people, pricePerPerson, total, discountLabel, savingsTotal } = params;

  let message: string;

  if (pricePerPerson === null) {
    message = [
      `Hello Levani, I'd like to request a price for the ${tourTitle}.`,
      ``,
      `Date: ${date}`,
      `People: ${people}`,
      ``,
      `Please send me the package price and availability.`,
    ].join("\n");
  } else {
    const lines = [
      `Hello Levani, I'd like to book a tour.`,
      ``,
      `Tour: ${tourTitle}`,
      `Date: ${date}`,
      `People: ${people}`,
      `Base price: ${pricePerPerson} GEL/person`,
    ];

    if (discountLabel && savingsTotal && savingsTotal > 0) {
      lines.push(`Discount: ${discountLabel} (saving ${savingsTotal} GEL)`);
    }

    lines.push(`Total: ${total} GEL`);
    lines.push(``);
    lines.push(`Please confirm availability.`);

    message = lines.join("\n");
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGroupQuoteLink(
  params: {
    tourTitle: string;
    date: string;
    people: number;
  },
  language: Language = "en"
): string {
  const { tourTitle, date, people } = params;
  const message =
    language === "ru"
      ? [
          `Здравствуйте, Левани! Хочу узнать цену для группы на тур «${tourTitle}».`,
          ``,
          `Дата: ${date}`,
          `Размер группы: ${people} человек`,
          ``,
          `Пожалуйста, отправьте мне групповую цену и информацию о наличии мест.`,
        ].join("\n")
      : [
          `Hello Levani! I'd like a group quote for the ${tourTitle}.`,
          ``,
          `Date: ${date}`,
          `Group size: ${people} people`,
          ``,
          `Please send me the group rate and availability.`,
        ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralLink(language: Language = "en"): string {
  const message =
    language === "ru"
      ? `Здравствуйте, Левани! Я хотел бы узнать больше о турах Ivera по Грузии.`
      : `Hello Levani! I'd like to learn more about Ivera tours in Georgia.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Cross-sell after the free "Key of Tbilisi" quest is completed.
export function buildFreeQuestUpsellLink(tourTitle: string, language: Language = "en"): string {
  const message =
    language === "ru"
      ? `Здравствуйте, Левани! Я выполнил(а) бесплатный квест «Ключ Тбилиси» и хочу продолжить с туром «${tourTitle}». Пришлите, пожалуйста, информацию о наличии мест.`
      : `Hello Levani, I completed the Key of Tbilisi free quest and want to continue with the ${tourTitle}. Please send availability.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildMultiTourLink(
  toursCount: number,
  currentTourTitle?: string,
  language: Language = "en"
): string {
  const discountPct = toursCount >= 4 ? 15 : toursCount === 3 ? 10 : 5;

  if (language === "ru") {
    const tourRef = currentTourTitle ? ` начиная с тура «${currentTourTitle}»` : "";
    const message = [
      `Здравствуйте, Левани! Хочу забронировать комбо из ${toursCount} туров${tourRef}.`,
      ``,
      `Я знаю, что для ${toursCount} туров действует комбо-скидка ${discountPct}%.`,
      ``,
      `Пожалуйста, помогите мне составить лучшую комбинацию и подтвердите наличие мест.`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const tourRef = currentTourTitle ? ` starting with the ${currentTourTitle}` : "";
  const message = [
    `Hello Levani! I'd like to book a ${toursCount}-tour combo${tourRef}.`,
    ``,
    `I know there's a ${discountPct}% combo discount for ${toursCount} tours.`,
    ``,
    `Please help me plan the best combination and confirm availability.`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Custom combo builder message ────────────────────────────────────────────

interface TourComboDetail {
  title: string;
  date: string;         // "YYYY-MM-DD" or ""
  guests: number;
  pricePerPerson: number | null;
  meetingPoint?: string;
  gatherTime?: string;  // e.g. "08:45"
  startTime?: string;   // e.g. "09:00"
}

interface ComboMessageParams {
  tours: TourComboDetail[];
  subtotal: number | null;
  discountPct: number;
  discountAmount: number | null;
  finalTotal: number | null;
  depositAmount: number | null;
  language: Language;
}

function fmtDate(dateStr: string, lang: Language): string {
  if (!dateStr) return lang === "ru" ? "дата уточняется" : "date TBD";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString(
      lang === "ru" ? "ru-RU" : "en-GB",
      { day: "numeric", month: "short", year: "numeric" }
    );
  } catch {
    return dateStr;
  }
}

export function buildCustomComboLink(params: ComboMessageParams): string {
  const { tours, subtotal, discountPct, discountAmount, finalTotal, depositAmount, language } = params;
  const hasPrice = subtotal !== null;

  if (language === "ru") {
    const tourLines = tours.map((t, i) => {
      const lineTotal = t.pricePerPerson ? t.pricePerPerson * t.guests : null;
      const parts = [
        `${i + 1}. ${t.title}`,
        `   📅 ${fmtDate(t.date, "ru")}  👥 ${t.guests} чел.${lineTotal ? `  💰 ${lineTotal} GEL` : "  💰 по запросу"}`,
      ];
      if (t.meetingPoint) {
        parts.push(`   📍 ${t.meetingPoint}`);
      }
      if (t.gatherTime && t.startTime) {
        parts.push(`   🕗 Сбор: ${t.gatherTime} · Выезд: ${t.startTime}`);
      }
      return parts.join("\n");
    }).join("\n\n");

    const lines = [
      `Здравствуйте, Левани! Хочу забронировать комбо-тур (${tours.length} тура):`,
      ``,
      tourLines,
      ``,
      hasPrice ? [
        `Стоимость: ${subtotal} GEL`,
        `Комбо-скидка ${discountPct}%: −${discountAmount} GEL`,
        `Итого: ${finalTotal} GEL`,
        `Депозит (20%): ${depositAmount} GEL`,
      ].join("\n") : `Один или несколько туров требуют уточнения цены.`,
      ``,
      `Пожалуйста, подтвердите доступность.`,
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  const tourLines = tours.map((t, i) => {
    const lineTotal = t.pricePerPerson ? t.pricePerPerson * t.guests : null;
    const parts = [
      `${i + 1}. ${t.title}`,
      `   📅 ${fmtDate(t.date, "en")}  👥 ${t.guests} ${t.guests === 1 ? "person" : "people"}${lineTotal ? `  💰 ${lineTotal} GEL` : "  💰 price on request"}`,
    ];
    if (t.meetingPoint) {
      parts.push(`   📍 ${t.meetingPoint}`);
    }
    if (t.gatherTime && t.startTime) {
      parts.push(`   🕗 Gather: ${t.gatherTime} · Departs: ${t.startTime}`);
    }
    return parts.join("\n");
  }).join("\n\n");

  const lines = [
    `Hello Levani! I'd like to book a combo trip (${tours.length} tours):`,
    ``,
    tourLines,
    ``,
    hasPrice ? [
      `Subtotal: ${subtotal} GEL`,
      `Combo discount ${discountPct}%: −${discountAmount} GEL`,
      `Total: ${finalTotal} GEL`,
      `Deposit (20%): ${depositAmount} GEL`,
    ].join("\n") : `One or more tours require price confirmation.`,
    ``,
    `Please confirm availability.`,
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// ─── Full booking message (with booking code) ──────────────────────────────

interface BookingMessageParams {
  bookingCode: string;
  tourTitle: string;
  selectedDate: string;
  peopleCount: number;
  basePricePerPerson: number | null;
  baseTotal: number | null;
  discountPct: number;
  savings: number;
  finalTotal: number | null;
  seatsLeft: number;
}

export function buildWhatsAppBookingMessage(
  params: BookingMessageParams,
  language: Language = "en"
): string {
  const {
    bookingCode,
    tourTitle,
    selectedDate,
    peopleCount,
    basePricePerPerson,
    baseTotal,
    discountPct,
    savings,
    finalTotal,
    seatsLeft,
  } = params;

  const formattedDate = (() => {
    try {
      return new Date(selectedDate + "T00:00:00").toLocaleDateString(
        language === "ru" ? "ru-RU" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" }
      );
    } catch {
      return selectedDate;
    }
  })();

  if (language === "ru") {
    const lines: string[] = [
      `Здравствуйте, Левани, хочу забронировать «${tourTitle}».`,
      ``,
      `Номер заявки: ${bookingCode}`,
      `Дата: ${formattedDate}`,
      `Количество человек: ${peopleCount}`,
    ];

    if (basePricePerPerson !== null && baseTotal !== null) {
      lines.push(`Базовая сумма: ${baseTotal} GEL`);
      if (discountPct > 0) {
        lines.push(`Скидка: ${discountPct}%`);
        lines.push(`Экономия: ${savings} GEL`);
      }
      lines.push(`Итоговая сумма (ориентировочно): ${finalTotal ?? "уточняется"} GEL`);
    }

    lines.push(`Свободных мест: ${seatsLeft}`);
    lines.push(`Статус: Ожидает подтверждения`);
    lines.push(``);
    lines.push(`Пожалуйста, подтвердите наличие мест.`);

    return lines.join("\n");
  }

  const lines: string[] = [
    `Hello Levani, I want to book ${tourTitle}.`,
    ``,
    `Booking ID: ${bookingCode}`,
    `Date: ${formattedDate}`,
    `People: ${peopleCount}`,
  ];

  if (basePricePerPerson !== null && baseTotal !== null) {
    lines.push(`Base total: ${baseTotal} GEL`);
    if (discountPct > 0) {
      lines.push(`Discount: ${discountPct}%`);
      lines.push(`Savings: ${savings} GEL`);
    }
    lines.push(`Final estimated total: ${finalTotal ?? "TBC"} GEL`);
  }

  lines.push(`Seats left: ${seatsLeft}`);
  lines.push(`Status: Pending confirmation`);
  lines.push(``);
  lines.push(`Please confirm availability.`);

  return lines.join("\n");
}

export function buildBookingWhatsAppUrl(messageText: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
}

export function buildBookingCheckLink(
  bookingCode: string,
  tourTitle: string,
  language: Language = "en"
): string {
  const message =
    language === "ru"
      ? [
          `Здравствуйте, Левани! Хочу узнать статус моей заявки.`,
          ``,
          `Номер заявки: ${bookingCode}`,
          `Тур: ${tourTitle}`,
          ``,
          `Пожалуйста, подтвердите статус.`,
        ].join("\n")
      : [
          `Hello Levani! I'd like to check on my booking.`,
          ``,
          `Booking ID: ${bookingCode}`,
          `Tour: ${tourTitle}`,
          ``,
          `Please confirm the status.`,
        ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ──────────────────────────────────────────────────────────────────────────

export function buildCrossSellLink(tourTitle: string, language: Language = "en"): string {
  const message =
    language === "ru"
      ? `Здравствуйте, Левани! Я только что выполнил(а) бесплатный квест по Тбилиси и хочу забронировать «${tourTitle}». Расскажете подробнее?`
      : `Hi Levani! I just completed the free Tbilisi quest and want to book the ${tourTitle}. Can you tell me more?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildFeedbackLink(
  tourTitle: string,
  explorerName: string,
  xp: number,
  language: Language = "en"
): string {
  const message =
    language === "ru"
      ? [
          `Здравствуйте, Левани! Я только что завершил(а) тур «${tourTitle}» 🎉`,
          ``,
          `Вот мой отзыв:`,
          ``,
          `1. Было ли задание понятным?`,
          `2. Какое задание понравилось больше всего?`,
          `3. Сканирование QR-кодов работало без проблем?`,
          `4. Порекомендуете ли вы этот опыт другим?`,
          `5. Что нам улучшить?`,
          ``,
          `Исследователь: ${explorerName}`,
          `Получено опыта: ${xp} XP`,
        ].join("\n")
      : [
          `Hello Levani! I just completed the ${tourTitle} 🎉`,
          ``,
          `Here is my feedback:`,
          ``,
          `1. Was the quest easy to understand?`,
          `2. Which mission did you enjoy most?`,
          `3. Did QR scanning work smoothly?`,
          `4. Would you recommend this experience?`,
          `5. What should we improve?`,
          ``,
          `Explorer: ${explorerName}`,
          `XP earned: ${xp} XP`,
        ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
