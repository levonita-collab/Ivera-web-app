// Single source of truth for the reward system. Every threshold, prize and
// bonus task lives here so the business rules can be tuned without touching
// UI or logic. Prizes are never granted automatically: the site builds a
// WhatsApp claim with a unique code and Levani confirms it with the guide.

/** "Today" for daily points is the calendar day in Georgia, not the visitor's device. */
export const REWARD_TIMEZONE = "Asia/Tbilisi";

export type RewardKind = "gift" | "discount" | "freeSeat";

export interface DailyTier {
  id: "bronze" | "silver" | "gold";
  minXp: number;
  /** Also requires every bonus task of one tour to be done the same day. */
  requiresAllBonusTasks: boolean;
  kind: RewardKind;
  icon: string;
  title: string;
  titleRu: string;
  reward: string;
  rewardRu: string;
}

export const DAILY_TIERS: DailyTier[] = [
  {
    id: "bronze",
    minXp: 150,
    requiresAllBonusTasks: false,
    kind: "gift",
    icon: "🥉",
    title: "Bronze",
    titleRu: "Бронза",
    reward: "A small gift from your guide on the spot — local wine, churchkhela or a souvenir",
    rewardRu: "Небольшой подарок от гида на месте — местное вино, чурчхела или сувенир",
  },
  {
    id: "silver",
    minXp: 300,
    requiresAllBonusTasks: false,
    kind: "discount",
    icon: "🥈",
    title: "Silver",
    titleRu: "Серебро",
    reward: "10% off your next tour",
    rewardRu: "Скидка 10% на следующий тур",
  },
  {
    id: "gold",
    minXp: 600,
    requiresAllBonusTasks: true,
    kind: "freeSeat",
    icon: "🥇",
    title: "Gold",
    titleRu: "Золото",
    reward: "1 free seat on any group quest tour",
    rewardRu: "1 бесплатное место на любом групповом квест-туре",
  },
];

export interface Milestone {
  id: "key-plus-quest" | "two-quests";
  requiresFreeQuest: boolean;
  paidQuestsRequired: number;
  kind: RewardKind;
  icon: string;
  title: string;
  titleRu: string;
  condition: string;
  conditionRu: string;
  reward: string;
  rewardRu: string;
}

/** One-time rewards for completing whole quests, counted across all days. */
export const MILESTONES: Milestone[] = [
  {
    id: "key-plus-quest",
    requiresFreeQuest: true,
    paidQuestsRequired: 1,
    kind: "discount",
    icon: "🗝️",
    title: "Key + Quest",
    titleRu: "Ключ + Квест",
    condition: "Complete the free Key of Tbilisi quest and any paid quest tour",
    conditionRu: "Пройдите бесплатный квест «Ключ Тбилиси» и любой платный квест-тур",
    reward: "20% off your next tour",
    rewardRu: "Скидка 20% на следующий тур",
  },
  {
    id: "two-quests",
    requiresFreeQuest: false,
    paidQuestsRequired: 2,
    kind: "freeSeat",
    icon: "🎁",
    title: "Loyal Explorer",
    titleRu: "Верный исследователь",
    condition: "Fully complete 2 paid quest tours",
    conditionRu: "Полностью пройдите 2 платных квест-тура",
    reward: "1 free seat on your next group quest tour",
    rewardRu: "1 бесплатное место на следующем групповом квест-туре",
  },
];

/**
 * Extra XP for finishing every mission of a long expedition tour, so Gold
 * (600 XP + bonus tasks) is reachable there too, not only on Kazbegi —
 * without changing per-mission points already printed on the QR cards.
 * Missions + expedition bonus + all bonus tasks = 600 on each listed tour.
 */
export const EXPEDITION_BONUS_XP: Record<string, number> = {
  "vardzia-cave-kingdom": 225,
  "kutaisi-martvili-canyons": 200,
};

export const EXPEDITION_BONUS_ID = "expedition";

export interface BonusTask {
  id: string;
  points: number;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
}

/** Extra tasks on every paid tour. Self-marked; the guide confirms them when a prize is claimed. */
export const BONUS_TASKS: BonusTask[] = [
  {
    id: "toast",
    points: 25,
    title: "Raise a Georgian toast",
    titleRu: "Произнесите грузинский тост",
    description: "Learn one toast from your guide and say it at the table — «Gaumarjos!»",
    descriptionRu: "Выучите у гида один тост и произнесите его за столом — «Гаумарджос!»",
  },
  {
    id: "group-photo",
    points: 25,
    title: "Group photo at the final stop",
    titleRu: "Фото группы на финальной точке",
    description: "Take a photo of your group at the last location and send it to Levani on WhatsApp.",
    descriptionRu: "Сфотографируйте группу на последней локации и отправьте фото Левани в WhatsApp.",
  },
  {
    id: "local-story",
    points: 25,
    title: "Collect a local legend",
    titleRu: "Узнайте местную легенду",
    description: "Ask your guide for one legend from today's route — you'll retell it when you claim your prize.",
    descriptionRu: "Попросите гида рассказать одну легенду о сегодняшнем маршруте — перескажете её при получении приза.",
  },
];
