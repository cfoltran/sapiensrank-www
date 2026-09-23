export type OS = "ios" | "android";
export type Level = "yes" | "partial" | "no";

export const METRIC_KEYS = [
  "pas",
  "calories",
  "sommeil",
  "cardio",
  "vfc",
  "exercices",
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

export type Shot = {
  /** Path under /public, e.g. "/guide/strava-ios-sante.png" */
  src: string;
  alt: string;
  /** 1-based index of the step this screenshot illustrates. */
  step: number;
};

export type Logo = {
  src: string;
  width: number;
  height: number;
  // Black-on-transparent wordmark: inverted for the dark background.
  invert?: boolean;
};

export type Source = {
  id: string;
  name: string;
  logo?: Logo;
  platforms: OS[];
  coverage: Record<MetricKey, Level> | null;
  steps: Partial<Record<OS, string[]>>;
  /**
   * Screenshots of the source app, rendered below the steps.
   * One or two per platform is enough: the screen that is hard to find.
   * Drop the files in /public/guide/ and reference them here; while the
   * array is absent, no image block is rendered.
   */
  shots?: Partial<Record<OS, Shot[]>>;
};

/** Ids the app can deep-link to with /guide-sante?app=<id>. Keep them stable. */
export const SOURCE_IDS = ["garmin", "fitbit", "strava", "coros", "autre"];

export type GuideLabels = {
  metrics: Record<MetricKey, string>;
  hub: Record<OS, string>;
  levels: { yes: string; partial: string };
  phone: string;
  choosePhone: string;
  autoDetected: string;
  app: string;
  empty: string;
  /** Title around the app and OS names: [before app, between, after OS]. */
  connect: [string, string, string];
  provides: string;
};
