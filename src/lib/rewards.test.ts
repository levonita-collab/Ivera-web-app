import { describe, it, expect } from "vitest";
import type { MissionProgress } from "@/lib/questProgress";
import {
  rewardDateKey,
  getDailyXp,
  hasAllBonusTasksToday,
  getDailyTierStatuses,
  getMilestoneStatuses,
  getCompletedPaidQuestSlugs,
  getQuestCompletedAt,
  buildRewardCode,
  getMaxPaidQuestXp,
  getTopTierQuestSlugs,
  type AllProgress,
} from "./rewards";
import { BONUS_TASKS } from "@/data/rewardRules";

// 10:00 in Tbilisi (UTC+4)
const NOW = new Date("2026-10-12T06:00:00Z");
const TODAY = "2026-10-12T05:00:00Z";
const YESTERDAY = "2026-10-11T08:00:00Z";

function progress(missionIds: string[], at: string, points = 100): MissionProgress {
  return {
    completedMissions: missionIds,
    xp: missionIds.length * points,
    events: missionIds.map((id) => ({ id, points, at })),
  };
}

function withAllBonus(p: MissionProgress, at: string): MissionProgress {
  const bonusEvents = BONUS_TASKS.map((t) => ({ id: `bonus:${t.id}`, points: t.points, at }));
  return {
    ...p,
    xp: p.xp + bonusEvents.reduce((s, e) => s + e.points, 0),
    bonusCompleted: BONUS_TASKS.map((t) => t.id),
    events: [...(p.events ?? []), ...bonusEvents],
  };
}

const TBILISI_ALL = ["tbs-1", "tbs-2", "tbs-3", "tbs-4"];
const MTSKHETA_ALL = ["mtk-1", "mtk-2", "mtk-3"];
const FREE_ALL = ["ktb-1", "ktb-2", "ktb-3"];

describe("rewardDateKey", () => {
  it("uses Georgia's calendar day, not UTC", () => {
    // 21:30 UTC on the 12th is already 01:30 on the 13th in Tbilisi
    expect(rewardDateKey(new Date("2026-10-12T21:30:00Z"))).toBe("2026-10-13");
    expect(rewardDateKey(new Date("2026-10-12T19:00:00Z"))).toBe("2026-10-12");
  });
});

describe("daily points", () => {
  it("counts only points earned today", () => {
    const all: AllProgress = {
      "tbilisi-city-quest": progress(["tbs-1", "tbs-2"], TODAY),
      "mtskheta-sacred-route": progress(["mtk-1"], YESTERDAY),
    };
    expect(getDailyXp(all, NOW)).toBe(200);
  });

  it("ignores progress saved before timestamps existed", () => {
    const all: AllProgress = { "tbilisi-city-quest": { completedMissions: ["tbs-1"], xp: 50 } };
    expect(getDailyXp(all, NOW)).toBe(0);
  });

  it("requires every bonus task on the same paid tour, today", () => {
    const done: AllProgress = { "tbilisi-city-quest": withAllBonus(progress(["tbs-1"], TODAY), TODAY) };
    const yesterdayBonus: AllProgress = {
      "tbilisi-city-quest": withAllBonus(progress(["tbs-1"], TODAY), YESTERDAY),
    };
    expect(hasAllBonusTasksToday(done, NOW)).toBe(true);
    expect(hasAllBonusTasksToday(yesterdayBonus, NOW)).toBe(false);
  });
});

describe("daily tiers", () => {
  const statusOf = (all: AllProgress, id: string) =>
    getDailyTierStatuses(all, NOW).find((s) => s.tier.id === id)!;

  it("earns nothing below the first threshold", () => {
    const all: AllProgress = { "tbilisi-city-quest": progress(["tbs-1"], TODAY) };
    expect(getDailyTierStatuses(all, NOW).every((s) => !s.earned)).toBe(true);
    expect(statusOf(all, "bronze").xpMissing).toBe(50);
  });

  it("earns bronze and silver by points alone", () => {
    const all: AllProgress = { "tbilisi-city-quest": progress(TBILISI_ALL, TODAY) }; // 400 XP
    expect(statusOf(all, "bronze").earned).toBe(true);
    expect(statusOf(all, "silver").earned).toBe(true);
  });

  it("withholds gold without all bonus tasks, even with enough points", () => {
    const all: AllProgress = { "tbilisi-city-quest": progress(TBILISI_ALL, TODAY, 200) }; // 800 XP
    const gold = statusOf(all, "gold");
    expect(gold.xpMissing).toBe(0);
    expect(gold.bonusMissing).toBe(true);
    expect(gold.earned).toBe(false);
  });

  it("earns gold with enough points and every bonus task", () => {
    const all: AllProgress = {
      "tbilisi-city-quest": withAllBonus(progress(TBILISI_ALL, TODAY, 150), TODAY), // 600 + 75
    };
    expect(statusOf(all, "gold").earned).toBe(true);
  });
});

describe("milestones", () => {
  const statusOf = (all: AllProgress, id: string) =>
    getMilestoneStatuses(all).find((s) => s.milestone.id === id)!;

  it("only counts fully completed quests", () => {
    const all: AllProgress = {
      "tbilisi-city-quest": progress(TBILISI_ALL, TODAY),
      "mtskheta-sacred-route": progress(["mtk-1"], TODAY),
    };
    expect(getCompletedPaidQuestSlugs(all)).toEqual(["tbilisi-city-quest"]);
  });

  it("Key + Quest needs the free quest and one paid quest", () => {
    const paidOnly: AllProgress = { "tbilisi-city-quest": progress(TBILISI_ALL, TODAY) };
    const both: AllProgress = { ...paidOnly, "key-of-tbilisi": progress(FREE_ALL, YESTERDAY) };
    expect(statusOf(paidOnly, "key-plus-quest").earned).toBe(false);
    expect(statusOf(both, "key-plus-quest").earned).toBe(true);
  });

  it("the free quest does not count toward the two-paid-quests reward", () => {
    const all: AllProgress = {
      "tbilisi-city-quest": progress(TBILISI_ALL, TODAY),
      "key-of-tbilisi": progress(FREE_ALL, TODAY),
    };
    expect(statusOf(all, "two-quests").earned).toBe(false);
    expect(statusOf(all, "two-quests").paidQuestsDone).toBe(1);
  });

  it("two completed paid quests earn the free seat", () => {
    const all: AllProgress = {
      "tbilisi-city-quest": progress(TBILISI_ALL, YESTERDAY),
      "mtskheta-sacred-route": progress(MTSKHETA_ALL, TODAY),
    };
    expect(statusOf(all, "two-quests").earned).toBe(true);
  });
});

describe("getQuestCompletedAt", () => {
  it("returns the last mission time, ignoring bonus tasks", () => {
    const p = withAllBonus(
      { completedMissions: ["a", "b"], xp: 0, events: [
        { id: "a", points: 1, at: "2026-10-10T10:00:00Z" },
        { id: "b", points: 1, at: "2026-10-11T10:00:00Z" },
      ] },
      "2026-10-12T10:00:00Z"
    );
    expect(getQuestCompletedAt(p)?.toISOString()).toBe("2026-10-11T10:00:00.000Z");
  });

  it("returns null when there is no timestamped history", () => {
    expect(getQuestCompletedAt({ completedMissions: ["a"], xp: 50 })).toBeNull();
  });
});

describe("buildRewardCode", () => {
  it("is deterministic and distinguishes different claims", () => {
    expect(buildRewardCode("gold|Anna|2026-10-12")).toBe(buildRewardCode("gold|Anna|2026-10-12"));
    expect(buildRewardCode("gold|Anna|2026-10-12")).not.toBe(buildRewardCode("gold|Anna|2026-10-13"));
    expect(buildRewardCode("x")).toMatch(/^IV-[0-9A-Z]{7}$/);
  });
});

describe("expedition bonus", () => {
  it("makes Gold reachable on Kazbegi, Vardzia and Kutaisi–Martvili — and nowhere else", () => {
    expect(getTopTierQuestSlugs().sort()).toEqual(
      ["kazbegi-mountain-quest", "kutaisi-martvili-canyons", "vardzia-cave-kingdom"].sort()
    );
    expect(getMaxPaidQuestXp("vardzia-cave-kingdom")).toBe(600);
    expect(getMaxPaidQuestXp("kutaisi-martvili-canyons")).toBe(600);
    expect(getMaxPaidQuestXp("kazbegi-mountain-quest")).toBe(600);
  });

  it("a full Vardzia day with expedition bonus and every bonus task earns Gold", () => {
    const missions = [
      { id: "var-1", points: 75, at: TODAY },
      { id: "var-2", points: 100, at: TODAY },
      { id: "var-3", points: 125, at: TODAY },
      { id: "bonus:expedition", points: 225, at: TODAY },
    ];
    const base: MissionProgress = {
      completedMissions: ["var-1", "var-2", "var-3"],
      xp: 525,
      bonusCompleted: ["expedition"],
      events: missions,
    };
    const all: AllProgress = { "vardzia-cave-kingdom": withAllBonus(base, TODAY) };
    expect(getDailyXp(all, NOW)).toBe(600);
    expect(getDailyTierStatuses(all, NOW).find((s) => s.tier.id === "gold")!.earned).toBe(true);
  });
});

describe("reward copy highlights", () => {
  it("every highlight phrase actually appears in its reward text (EN and RU)", async () => {
    const { DAILY_TIERS, MILESTONES } = await import("@/data/rewardRules");
    for (const r of [...DAILY_TIERS, ...MILESTONES]) {
      expect(r.reward).toContain(r.highlight);
      expect(r.rewardRu).toContain(r.highlightRu);
    }
  });
});
