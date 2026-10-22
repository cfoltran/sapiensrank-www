// Every animation is written in beats, so changing the BPM to match a track
// rescales the whole film and keeps the cuts on the bar lines.

export const DEFAULT_BPM = 120;

export const SCENES = {
  intro: [0, 8],
  move: [8, 20],
  score: [20, 32],
  map: [32, 48],
  podium: [48, 56],
  phones: [56, 64],
  outro: [64, 76],
} as const;

export type SceneName = keyof typeof SCENES;

export const TOTAL_BEATS = SCENES.outro[1];

export const CUTS = Object.values(SCENES)
  .map(([start]) => start)
  .filter((start) => start > 0);

export function sceneAt(beat: number): SceneName {
  for (const [name, [start, end]] of Object.entries(SCENES)) {
    if (beat >= start && beat < end) return name as SceneName;
  }
  return "outro";
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (b: number, start: number, len: number) => clamp01((b - start) / len);

export const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
export const easeInCubic = (x: number) => x ** 3;
export const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
export const easeOutBack = (x: number, s = 1.70158) =>
  1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2;

/** 1 on each beat, decaying to 0 before the next one. */
export const beatPulse = (b: number, sharpness = 4) =>
  b < 0 ? 0 : Math.exp(-(b % 1) * sharpness);

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
