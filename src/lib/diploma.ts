// Renders a completion diploma to a canvas and downloads it as a PNG.
// Browser-only (uses document/canvas).

import { REWARD_TIMEZONE, BONUS_TASKS } from "@/data/rewardRules";
import { tours } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import { getBadgeForTour } from "@/data/rewards";
import { FREE_QUEST_SLUG, FREE_MISSIONS } from "@/data/freeTbilisiQuest";
import type { Language } from "@/lib/i18n/LanguageContext";
import type { MissionProgress, Profile } from "@/lib/questProgress";
import { getLocalizedTour, getLocalizedMission, getLocalizedFreeMission, getLocalizedBadge } from "@/lib/i18n/localize";
import { getQuestCompletedAt, buildRewardCode } from "@/lib/rewards";

/** Localized title + missions for any quest, paid or the free Key of Tbilisi. */
export function getQuestDisplay(
  slug: string,
  language: Language
): { title: string; missions: { id: string; title: string; points: number }[] } | null {
  if (slug === FREE_QUEST_SLUG) {
    const badge = getBadgeForTour(slug);
    return {
      title: badge ? getLocalizedBadge(badge, language).name : "Key of Tbilisi",
      missions: FREE_MISSIONS.map((m) => getLocalizedFreeMission(m, language)),
    };
  }
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return null;
  return {
    title: getLocalizedTour(tour, language).title,
    missions: getMissionsForTour(slug).map((m) => getLocalizedMission(m, language)),
  };
}

export function buildDiplomaData(
  slug: string,
  progress: MissionProgress,
  profile: Profile | null,
  language: Language,
  fallbackName: string
): DiplomaData | null {
  const quest = getQuestDisplay(slug, language);
  if (!quest) return null;
  const name = profile?.name ?? fallbackName;
  const bonusXp = BONUS_TASKS.filter((t) => progress.bonusCompleted?.includes(t.id)).reduce(
    (s, t) => s + t.points,
    0
  );
  const missions = quest.missions
    .filter((m) => progress.completedMissions.includes(m.id))
    .map(({ title, points }) => ({ title, points }));
  if (bonusXp > 0) {
    missions.push({ title: language === "ru" ? "Бонусные задания" : "Bonus tasks", points: bonusXp });
  }
  return {
    explorerName: name,
    country: profile?.country,
    tourTitle: quest.title,
    completedOn: getQuestCompletedAt(progress) ?? new Date(),
    missions,
    totalXp: missions.reduce((s, m) => s + m.points, 0),
    certificateNo: buildRewardCode(`diploma|${slug}|${profile?.supabaseId ?? name}`),
    language,
    fileSlug: slug,
  };
}

export interface DiplomaData {
  explorerName: string;
  country?: string;
  tourTitle: string;
  completedOn: Date;
  missions: { title: string; points: number }[];
  totalXp: number;
  certificateNo: string;
  language: Language;
  fileSlug: string;
}

const W = 2000;
const H = 1414;
const INK = "#1F1A17";
const GOLD = "#A77B26";
const MUTED = "#7B6F63";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// next/font registers hashed family names; read the real ones off the page
// so the diploma uses the same typefaces as the site.
function siteFonts(): { serif: string; sans: string } {
  const probe = document.createElement("span");
  probe.className = "font-serif";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const serif = getComputedStyle(probe).fontFamily || "Georgia, serif";
  probe.remove();
  const sans = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  return { serif, sans };
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: (size: number) => string, size: number) {
  let s = size;
  ctx.font = font(s);
  while (ctx.measureText(text).width > maxWidth && s > 24) {
    s -= 4;
    ctx.font = font(s);
  }
}

export async function downloadDiploma(data: DiplomaData): Promise<void> {
  const isRu = data.language === "ru";
  const [logo, signature] = await Promise.all([
    loadImage("/images/logo-light.png"),
    loadImage("/images/team/signature.png"),
  ]);
  await document.fonts.ready;
  const { serif, sans } = siteFonts();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#FBF6EC";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#C89B3C";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(62, 62, W - 124, H - 124);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const cx = W / 2;

  if (logo) {
    const lw = 420;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, cx - lw / 2, 110, lw, lh);
  } else {
    ctx.font = `700 90px ${serif}`;
    ctx.fillStyle = INK;
    ctx.fillText("IVERA", cx, 220);
  }

  ctx.fillStyle = GOLD;
  ctx.font = `600 30px ${sans}`;
  ctx.letterSpacing = "8px";
  ctx.fillText(isRu ? "ДИПЛОМ О ПРОХОЖДЕНИИ КВЕСТА" : "CERTIFICATE OF QUEST COMPLETION", cx, 330);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = MUTED;
  ctx.font = `italic 400 38px ${serif}`;
  ctx.fillText(isRu ? "Настоящим подтверждается, что" : "This certifies that", cx, 410);

  ctx.fillStyle = INK;
  fitText(ctx, data.explorerName, W - 400, (s) => `700 ${s}px ${serif}`, 100);
  ctx.fillText(data.explorerName, cx, 520);

  if (data.country) {
    ctx.fillStyle = MUTED;
    ctx.font = `400 30px ${sans}`;
    ctx.fillText(data.country, cx, 572);
  }

  ctx.fillStyle = MUTED;
  ctx.font = `italic 400 38px ${serif}`;
  ctx.fillText(isRu ? "успешно прошёл(а) квест-тур" : "has successfully completed the quest", cx, 650);

  ctx.fillStyle = GOLD;
  fitText(ctx, data.tourTitle, W - 400, (s) => `700 ${s}px ${serif}`, 68);
  ctx.fillText(data.tourTitle, cx, 735);

  ctx.fillStyle = "#3D2B1A";
  ctx.font = `400 28px ${sans}`;
  let y = 815;
  for (const m of data.missions) {
    ctx.fillText(`✓  ${m.title} — ${m.points} XP`, cx, y);
    y += 44;
  }
  ctx.fillStyle = GOLD;
  ctx.font = `700 32px ${sans}`;
  ctx.fillText(`${isRu ? "Итого" : "Total"}: ${data.totalXp} XP`, cx, y + 16);

  // Seal
  ctx.beginPath();
  ctx.arc(cx, 1215, 72, 0, Math.PI * 2);
  ctx.fillStyle = "#C89B3C";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 1215, 60, 0, Math.PI * 2);
  ctx.strokeStyle = "#FBF6EC";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#FBF6EC";
  ctx.font = `700 28px ${serif}`;
  ctx.letterSpacing = "4px";
  ctx.fillText("IVERA", cx + 2, 1225);
  ctx.letterSpacing = "0px";

  // Signature (left)
  const sigX = 520;
  if (signature) {
    const sw = 300;
    const sh = (signature.height / signature.width) * sw;
    ctx.drawImage(signature, sigX - sw / 2, 1225 - sh, sw, sh);
  } else {
    ctx.fillStyle = INK;
    ctx.font = `italic 600 64px ${serif}`;
    ctx.fillText("Levani", sigX, 1215);
  }
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX - 180, 1240);
  ctx.lineTo(sigX + 180, 1240);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.font = `400 24px ${sans}`;
  ctx.fillText(isRu ? "Левани — основатель и гид IVERA" : "Levani — Founder & Lead Guide, IVERA", sigX, 1280);

  // Date (right)
  const dateX = W - 520;
  ctx.fillStyle = INK;
  ctx.font = `400 36px ${serif}`;
  ctx.fillText(
    data.completedOn.toLocaleDateString(isRu ? "ru-RU" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: REWARD_TIMEZONE,
    }),
    dateX,
    1215
  );
  ctx.beginPath();
  ctx.moveTo(dateX - 180, 1240);
  ctx.lineTo(dateX + 180, 1240);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.font = `400 24px ${sans}`;
  ctx.fillText(isRu ? "Дата прохождения" : "Date of completion", dateX, 1280);

  ctx.font = `400 20px ${sans}`;
  ctx.fillText(`${isRu ? "Диплом №" : "Certificate No."} ${data.certificateNo} · ivera.info`, cx, 1335);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ivera-diploma-${data.fileSlug}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
