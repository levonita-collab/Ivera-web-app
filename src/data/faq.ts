// FAQ answers, shared by the /faq page and its structured data (FAQPage JSON-LD).

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_EN: FaqItem[] = [
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
    a: "Day tours include: professional guide and comfortable transport (from Tbilisi). Meals are not included — we stop at a good local restaurant, you choose what you'd like from the menu and pay there directly. Entrance tickets to specific sites are not included unless stated. The Tbilisi City Quest includes guide only — no transport needed.",
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
    a: "Yes — cancellation is free up to 24 hours before the tour starts. Message Levani on WhatsApp and any payment is refunded in full, or move the tour to another date. Cancellations later than that and no-shows are non-refundable.",
  },
  {
    q: "What should I bring?",
    a: "Comfortable walking shoes, weather-appropriate clothing, water, sunscreen, and your phone (for quest QR codes). Lunch isn't included in the price — budget for a meal at the lunch stop (you order from the menu and pay on the spot), and bring snacks if you like.",
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

export const FAQ_RU: FaqItem[] = [
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
    a: "Однодневные туры включают: профессионального гида и комфортабельный транспорт (из Тбилиси). Питание не включено — мы останавливаемся в хорошем местном ресторане, вы сами выбираете блюда по меню и оплачиваете на месте. Входные билеты в конкретные объекты не включены, если не оговорено отдельно. Тбилисский квест включает только гида — транспорт не нужен.",
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
    a: "Да — отмена бесплатна не позднее чем за 24 часа до начала тура. Напишите Левани в WhatsApp: оплата вернётся полностью, или перенесём тур на другую дату. Более поздняя отмена и неявка не возвращаются.",
  },
  {
    q: "Что взять с собой?",
    a: "Удобную обувь для ходьбы, одежду по погоде, воду, солнцезащитный крем и телефон (для QR-кодов квеста). Обед не входит в стоимость — заложите деньги на обед на остановке (заказываете по меню и оплачиваете на месте), можно взять с собой перекус.",
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
