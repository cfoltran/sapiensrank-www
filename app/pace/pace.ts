import { routePath, type Locale } from "../i18n";

// Pace maths and the race goals that get their own page
// (/calculateur-allure/marathon-3h30, /pace-calculator/marathon-3h30...).

export const MILE_KM = 1.609344;

export const DISTANCE_IDS = ["5k", "10k", "half", "marathon"] as const;
export type DistanceId = (typeof DISTANCE_IDS)[number];

export const DISTANCE_KM: Record<DistanceId, number> = {
  "5k": 5,
  "10k": 10,
  half: 21.0975,
  marathon: 42.195,
};

export const DISTANCE_NAME: Record<Locale, Record<DistanceId, string>> = {
  fr: { "5k": "5 km", "10k": "10 km", half: "semi-marathon", marathon: "marathon" },
  en: { "5k": "5K", "10k": "10K", half: "half marathon", marathon: "marathon" },
};

const DISTANCE_SLUG: Record<Locale, Record<DistanceId, string>> = {
  fr: { "5k": "5-km", "10k": "10-km", half: "semi-marathon", marathon: "marathon" },
  en: { "5k": "5k", "10k": "10k", half: "half-marathon", marathon: "marathon" },
};

/** Finish times (in minutes) people actually search for, per distance. */
const GOAL_MINUTES: Record<DistanceId, number[]> = {
  "5k": [20, 25, 30],
  "10k": [40, 45, 50, 55, 60],
  half: [90, 105, 120],
  marathon: [180, 195, 210, 225, 240, 270],
};

export type Goal = { distance: DistanceId; seconds: number };

export const GOALS: Goal[] = DISTANCE_IDS.flatMap((distance) =>
  GOAL_MINUTES[distance].map((min) => ({ distance, seconds: min * 60 })),
);

/** "50-min", "1h", "1h45": the time part of a goal's slug. */
function timeSlug(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}-min`;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function goalSlug(goal: Goal, locale: Locale): string {
  return `${DISTANCE_SLUG[locale][goal.distance]}-${timeSlug(goal.seconds)}`;
}

export function goalPath(goal: Goal, locale: Locale): string {
  return `${routePath("pace", locale)}/${goalSlug(goal, locale)}`;
}

export function findGoal(slug: string, locale: Locale): Goal | undefined {
  return GOALS.find((goal) => goalSlug(goal, locale) === slug);
}

/** The middle goal of a distance: a typical target rather than an extreme. */
export function typicalGoal(distance: DistanceId): Goal {
  const goals = GOALS.filter((goal) => goal.distance === distance);
  return goals[Math.floor(goals.length / 2)];
}

/**
 * How a goal time reads in a sentence: "3h30", "50 min" / "3:30", "50 minutes",
 * "1 hour" (an English "1:00" reads as one minute).
 */
export function goalTimeLabel(seconds: number, locale: Locale): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return locale === "fr" ? `${m} min` : `${m} minutes`;
  if (locale === "fr") return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
  if (m === 0) return h === 1 ? "1 hour" : `${h} hours`;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** 4:58 (minutes:seconds), for a pace per km or per mile. */
export function formatPace(secondsPerUnit: number): string {
  const total = Math.round(secondsPerUnit);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** 52:30 or 3:29:45. */
export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${String(m).padStart(h > 0 ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}

/** km/h with one decimal, "12,1" in French. */
export function formatSpeed(secondsPerKm: number, locale: Locale): string {
  return (3600 / secondsPerKm).toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Id of a <style> that hides the calculator until it has read ?d=&t= (set by
 * an inline script in the static HTML, removed by the calculator).
 */
export const PREFILL_STYLE_ID = "pace-prefill";

export function formatKm(km: number, locale: Locale): string {
  return km.toLocaleString(locale, { maximumFractionDigits: 4 });
}

/**
 * Split points for a race: every km up to the half marathon, then every 5 km
 * (a 42-row table is noise). Always ends on the exact finish.
 */
export function splitPoints(distanceKm: number): number[] {
  const step = distanceKm > 21.1 ? 5 : 1;
  const points: number[] = [];
  for (let km = step; km < distanceKm - 1e-9; km += step) points.push(km);
  if (step === 5 && distanceKm > DISTANCE_KM.half) {
    points.push(DISTANCE_KM.half);
    points.sort((a, b) => a - b);
  }
  points.push(distanceKm);
  return points;
}
