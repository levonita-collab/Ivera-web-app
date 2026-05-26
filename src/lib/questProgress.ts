const PREFIX = "ivera_quest_";
const PROFILE_KEY = "ivera_profile";

export interface MissionProgress {
  completedMissions: string[];
  xp: number;
}

export interface Profile {
  name: string;
  country?: string;
  interests?: string[];
  joinedAt: string;
  supabaseId?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getQuestProgress(tourSlug: string): MissionProgress {
  if (!isBrowser()) return { completedMissions: [], xp: 0 };
  try {
    const raw = localStorage.getItem(PREFIX + tourSlug);
    if (!raw) return { completedMissions: [], xp: 0 };
    return JSON.parse(raw) as MissionProgress;
  } catch {
    return { completedMissions: [], xp: 0 };
  }
}

export function completeMission(
  tourSlug: string,
  missionId: string,
  points: number
): MissionProgress {
  const current = getQuestProgress(tourSlug);
  if (current.completedMissions.includes(missionId)) return current;
  const updated: MissionProgress = {
    completedMissions: [...current.completedMissions, missionId],
    xp: current.xp + points,
  };
  localStorage.setItem(PREFIX + tourSlug, JSON.stringify(updated));
  return updated;
}

export function getTotalXP(): number {
  if (!isBrowser()) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      try {
        const p = JSON.parse(localStorage.getItem(key) ?? "{}") as MissionProgress;
        total += p.xp ?? 0;
      } catch {
        // ignore corrupted entries
      }
    }
  }
  return total;
}

export function getAllQuestProgress(): Record<string, MissionProgress> {
  if (!isBrowser()) return {};
  const result: Record<string, MissionProgress> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      const slug = key.slice(PREFIX.length);
      try {
        result[slug] = JSON.parse(localStorage.getItem(key) ?? "{}") as MissionProgress;
      } catch {
        // ignore
      }
    }
  }
  return result;
}

export function getCompletedTourSlugs(): string[] {
  if (!isBrowser()) return [];
  const result: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      result.push(key.slice(PREFIX.length));
    }
  }
  return result;
}

export function getProfile(): Profile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
