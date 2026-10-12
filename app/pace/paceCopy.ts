import type { Locale } from "../i18n";
import { capitalize } from "./pace";

// Text of the pace calculator and the per-goal pages. Functions take values
// already formatted for the locale.

const en = {
  meta: {
    title: "Running pace calculator: time, pace and speed",
    description:
      "Free running pace calculator: enter a distance and a time to get your pace per km and per mile and your speed. 5K, 10K, half marathon and marathon.",
  },
  eyebrow: "Calculator",
  title: "Running pace",
  titleAccent: "calculator",
  intro:
    "Pick a distance, then enter your goal time or the pace you want to hold. The rest follows: pace per km and per mile, and speed.",
  calc: {
    distance: "Distance",
    custom: "Other",
    customLabel: "Distance in km",
    time: "Finish time",
    pace: "Pace",
    perKm: "min/km",
    perMile: "per mile",
    speed: "Speed",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    km: "Km",
    elapsed: "Time",
    finish: "Finish",
    halfway: "Half",
  },
  cta: {
    eyebrow: "Sapiens Rank",
    title: "Your miles are worth more than a finish time",
    text: "Sapiens Rank turns every run into Sapies. Team up with your guild, conquer territories and climb the world leaderboard.",
    note: "Free on iPhone and Android. Works with Garmin, Strava, COROS and Fitbit.",
    screenshot: "Battle map with the territories conquered by each guild",
  },
  goal: {
    title: (race: string, time: string, pace: string) =>
      `${capitalize(race)} in ${time}: ${pace} min/km pace`,
    description: (race: string, time: string, pace: string, mile: string, speed: string) =>
      `To run a ${race} in ${time}, hold ${pace} per km (${mile} per mile), or ${speed} km/h. Split times and free pace calculator.`,
    // `km` only when the race name does not already say it ("5K" does).
    intro: (race: string, time: string, km: string | null, pace: string, speed: string) =>
      `To finish a ${race}${km ? ` (${km} km)` : ""} in ${time}, you need to hold ${pace} per kilometre, a speed of ${speed} km/h, from start to finish.`,
    splitsTitle: "Split times",
    breadcrumb: "Pace calculator",
    adjust: "Adjust in the calculator",
    otherGoals: "Other goals",
  },
  popularGoals: "Popular goals:",
};

export type PaceCopy = typeof en;

const fr: PaceCopy = {
  meta: {
    title: "Calculateur d'allure course à pied : temps, allure et vitesse",
    description:
      "Calculateur d'allure gratuit : entrez une distance et un temps pour obtenir votre allure au km et votre vitesse. 5 km, 10 km, semi-marathon et marathon.",
  },
  eyebrow: "Calculateur",
  title: "Calculateur d'allure",
  titleAccent: "course à pied",
  intro:
    "Choisissez une distance, puis entrez votre temps visé ou l'allure que vous voulez tenir. Le reste suit : allure au km et vitesse.",
  calc: {
    distance: "Distance",
    custom: "Autre",
    customLabel: "Distance en km",
    time: "Temps final",
    pace: "Allure",
    perKm: "min/km",
    perMile: "par mile",
    speed: "Vitesse",
    hours: "Heures",
    minutes: "Minutes",
    seconds: "Secondes",
    km: "Km",
    elapsed: "Temps",
    finish: "Arrivée",
    halfway: "Semi",
  },
  cta: {
    eyebrow: "Sapiens Rank",
    title: "Vos kilomètres valent plus qu'un chrono",
    text: "Sapiens Rank transforme chaque sortie en Sapies. Avec votre guilde, conquérez des territoires et grimpez au classement mondial.",
    note: "Gratuit sur iPhone et Android. Compatible Garmin, Strava, COROS et Fitbit.",
    screenshot: "Carte de bataille avec les territoires conquis par chaque guilde",
  },
  goal: {
    title: (race: string, time: string, pace: string) =>
      `Allure ${race} en ${time} : ${pace} min/km`,
    description: (race: string, time: string, pace: string, _mile: string, speed: string) =>
      `Pour courir un ${race} en ${time}, tenez ${pace} min/km, soit ${speed} km/h. Temps de passage et calculateur d'allure gratuit.`,
    intro: (race: string, time: string, km: string | null, pace: string, speed: string) =>
      `Pour boucler un ${race}${km ? ` (${km} km)` : ""} en ${time}, il faut tenir ${pace} min/km, soit ${speed} km/h, du départ à l'arrivée.`,
    splitsTitle: "Temps de passage",
    breadcrumb: "Calculateur d'allure",
    adjust: "Ajuster dans le calculateur",
    otherGoals: "Autres objectifs",
  },
  popularGoals: "Objectifs courants :",
};

const COPY: Record<Locale, PaceCopy> = { en, fr };

export function getPaceCopy(locale: Locale): PaceCopy {
  return COPY[locale];
}
