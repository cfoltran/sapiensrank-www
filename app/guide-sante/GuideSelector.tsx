"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type OS = "ios" | "android";
type Level = "yes" | "partial" | "no";

const METRICS = [
  { key: "pas", label: "Pas" },
  { key: "calories", label: "Calories" },
  { key: "sommeil", label: "Sommeil" },
  { key: "cardio", label: "Cardio" },
  { key: "vfc", label: "VFC" },
  { key: "exercices", label: "Exercices" },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

type Shot = {
  /** Path under /public, e.g. "/guide/strava-ios-sante.png" */
  src: string;
  alt: string;
  /** 1-based index of the step this screenshot illustrates. */
  step: number;
};

type Logo = {
  src: string;
  width: number;
  height: number;
  // Black-on-transparent wordmark: inverted for the dark background.
  invert?: boolean;
};

type Source = {
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

const SOURCES: Source[] = [
  {
    id: "garmin",
    name: "Garmin Connect",
    logo: { src: "/logos/garmin.webp", width: 209, height: 72, invert: true },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "yes",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: [
        "Dans Garmin Connect, ouvrez l'onglet Plus (en bas à droite).",
        "Touchez Paramètres.",
        "Touchez Applications connectées.",
        "Choisissez Apple Health.",
        "Touchez Se connecter avec Apple Health, puis choisissez les données à partager dans l'écran Apple Health qui s'affiche.",
      ],
      android: [
        "Cette connexion demande Android 14 ou plus.",
        "Dans Garmin Connect, touchez Plus (en bas à droite).",
        "Touchez Paramètres, puis Applications connectées.",
        "Choisissez Health Connect.",
        "Touchez Mise en route.",
        "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
      ],
    },
    shots: {
      android: [
        {
          src: "/guide/garmin-android-1.webp",
          alt: "Accueil de Garmin Connect sur Android, l'onglet Plus encadré en bas à droite.",
          step: 2,
        },
        {
          src: "/guide/garmin-android-2.webp",
          alt: "Menu Plus de Garmin Connect, la ligne Paramètres encadrée.",
          step: 3,
        },
        {
          src: "/guide/garmin-android-3.webp",
          alt: "Écran Paramètres de Garmin Connect, la ligne Applications connectées encadrée.",
          step: 3,
        },
        {
          src: "/guide/garmin-android-4.webp",
          alt: "Écran Applications connectées de Garmin Connect, la ligne Health Connect encadrée.",
          step: 4,
        },
        {
          src: "/guide/garmin-android-5.webp",
          alt: "Écran Synchroniser avec Health Connect, le bouton Mise en route encadré.",
          step: 5,
        },
        {
          src: "/guide/garmin-android-6.webp",
          alt: "Dialogue Android autorisant Garmin Connect à écrire dans Santé Connect, l'option Tout autoriser encadrée.",
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/garmin-ios-1.webp",
          alt: "Menu Plus de Garmin Connect, la ligne Paramètres encadrée.",
          step: 2,
        },
        {
          src: "/guide/garmin-ios-2.webp",
          alt: "Écran Paramètres de Garmin Connect, la ligne Applications connectées encadrée.",
          step: 3,
        },
        {
          src: "/guide/garmin-ios-3.webp",
          alt: "Écran Applications connectées de Garmin Connect, la ligne Apple Health encadrée.",
          step: 4,
        },
        {
          src: "/guide/garmin-ios-4.webp",
          alt: "Écran Apple Health de Garmin Connect, le bouton Se connecter avec Apple Health encadré.",
          step: 5,
        },
      ],
    },
  },
  {
    id: "fitbit",
    name: "Google Health (Fitbit)",
    logo: { src: "/logos/google-health.webp", width: 82, height: 72 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "yes",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: [
        "Mettez à jour l'app Google Health sur l'App Store (iOS 16.4 minimum).",
        "Ouvrez l'app et touchez l'icône Connexions, en haut à gauche.",
        "Ouvrez l'onglet Applis et services.",
        "Sous « Ajouter des connexions », touchez Apple Santé.",
        "Sur l'écran Accès à Santé, touchez Tout activer, puis Autoriser.",
      ],
      android: [
        "Ouvrez l'app Google Health (Android 9 ou plus) et touchez l'icône Connexions, en haut à gauche.",
        "Sous Applis et services, touchez Applis partenaires.",
        "Sous Paramètres, touchez Gérer Santé Connect.",
        "Sur la carte « Profitez davantage de Santé Connect », touchez Consulter.",
        "Activez Tout autoriser, puis touchez Autoriser : la lecture et l'écriture sont toutes deux nécessaires.",
      ],
    },
    shots: {
      ios: [
        {
          src: "/guide/fitbit-ios-1.webp",
          alt: "Accueil de Google Health sur iPhone, l'icône Connexions encadrée en haut à gauche.",
          step: 2,
        },
        {
          src: "/guide/fitbit-ios-2.webp",
          alt: "Écran Connexions de Google Health, l'onglet Applis et services encadré.",
          step: 3,
        },
        {
          src: "/guide/fitbit-ios-3.webp",
          alt: "Onglet Applis et services de Google Health, l'entrée Apple Santé encadrée.",
          step: 4,
        },
        {
          src: "/guide/fitbit-ios-4.webp",
          alt: "Écran iOS Accès à Santé demandant à Google Health d'écrire vos données, l'option Tout activer encadrée.",
          step: 5,
        },
      ],
      android: [
        {
          src: "/guide/fitbit-android-1.webp",
          alt: "Accueil de Google Health sur Android, l'icône Connexions encadrée en haut à gauche.",
          step: 1,
        },
        {
          src: "/guide/fitbit-android-2.webp",
          alt: "Écran Connexions de Google Health, l'entrée Applis partenaires encadrée.",
          step: 2,
        },
        {
          src: "/guide/fitbit-android-3.webp",
          alt: "Écran Applis partenaires, l'entrée Gérer Santé Connect encadrée sous Paramètres.",
          step: 3,
        },
        {
          src: "/guide/fitbit-android-4.webp",
          alt: "Écran Santé Connect de Google Health, le bouton Consulter encadré.",
          step: 4,
        },
        {
          src: "/guide/fitbit-android-5.webp",
          alt: "Dialogue Android autorisant Health à accéder à Santé Connect, l'option Tout autoriser encadrée.",
          step: 5,
        },
      ],
    },
  },
  {
    id: "strava",
    name: "Strava",
    logo: { src: "/logos/strava.svg", width: 42, height: 59 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "no",
      calories: "no",
      sommeil: "no",
      cardio: "no",
      vfc: "no",
      exercices: "yes",
    },
    steps: {
      ios: [
        "Dans Strava, ouvrez l'onglet Vous puis l'icône Paramètres (roue dentée, en haut à droite).",
        "Touchez Gérer les applications et les appareils.",
        "Sous Services, sélectionnez Santé.",
        "Activez Santé et Autoriser le partage de l'entraînement, puis, sous Paramètres d'automatisation, activez Envoyer à Apple Santé.",
      ],
      android: [
        "Sur Android 13 ou moins, installez d'abord Health Connect depuis le Play Store. Sur Android 14 et plus, il est intégré aux Paramètres.",
        "Dans Strava, ouvrez l'onglet Vous puis l'icône Paramètres (roue dentée, en haut à droite).",
        "Touchez Gérer les applications et les appareils.",
        "Sous Services, cochez Health Connect.",
        "Touchez Connecter.",
        "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
      ],
    },
    shots: {
      android: [
        {
          src: "/guide/strava-android-1.webp",
          alt: "Onglet Vous de Strava sur Android, l'icône Paramètres en haut à droite.",
          step: 2,
        },
        {
          src: "/guide/strava-android-2.webp",
          alt: "Écran Paramètres de Strava, la ligne Gérer les applications et les appareils encadrée.",
          step: 3,
        },
        {
          src: "/guide/strava-android-3.webp",
          alt: "Écran Autres services de Strava, la case Health Connect encadrée sous Services.",
          step: 4,
        },
        {
          src: "/guide/strava-android-4.webp",
          alt: "Écran invitant à connecter Strava à Health Connect, le bouton Connecter encadré.",
          step: 5,
        },
        {
          src: "/guide/strava-android-5.webp",
          alt: "Dialogue Android autorisant Strava à accéder à Santé Connect, l'option Tout autoriser encadrée.",
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/strava-ios-1.webp",
          alt: "Onglet Vous de Strava, l'icône Paramètres encadrée en haut à droite.",
          step: 1,
        },
        {
          src: "/guide/strava-ios-2.webp",
          alt: "Écran Paramètres de Strava, la ligne Gérer les applications et les appareils encadrée.",
          step: 2,
        },
        {
          src: "/guide/strava-ios-3.webp",
          alt: "Écran de gestion des appareils Strava, le service Santé encadré.",
          step: 3,
        },
        {
          src: "/guide/strava-ios-4.webp",
          alt: "Écran Paramètres Apple Santé de Strava, les autorisations et l'option Envoyer à Apple Santé encadrées.",
          step: 4,
        },
      ],
    },
  },
  {
    id: "coros",
    name: "COROS",
    logo: { src: "/logos/coros.png", width: 82, height: 72 },
    platforms: ["ios", "android"],
    coverage: {
      pas: "yes",
      calories: "no",
      sommeil: "yes",
      cardio: "yes",
      vfc: "no",
      exercices: "no",
    },
    steps: {
      ios: [
        "Ouvrez l'app COROS, touchez l'onglet Profil (en bas à droite), puis Paramètres.",
        "Touchez Applications tierces.",
        "Touchez Synchro. des données.",
        "Dans la liste, sélectionnez Apple Santé et autorisez le partage. Une pastille verte confirme la connexion.",
      ],
      android: [
        "Ouvrez l'app COROS, touchez l'onglet Profil (en bas à droite), puis Paramètres.",
        "Touchez Applications tierces.",
        "Touchez Synchro. des données.",
        "Dans la liste, choisissez Health Connect.",
        "Touchez Synchroniser.",
        "Sur l'écran d'autorisation, activez Tout autoriser, puis touchez Autoriser.",
      ],
    },
    shots: {
      android: [
        {
          src: "/guide/coros-android-1.webp",
          alt: "Onglet Profil de l'app COROS sur Android, avec l'entrée Paramètres en bas.",
          step: 1,
        },
        {
          src: "/guide/coros-android-2.webp",
          alt: "Écran Paramètres de COROS, avec l'entrée Applications tierces.",
          step: 2,
        },
        {
          src: "/guide/coros-android-3.webp",
          alt: "Écran Applications tierces de COROS, avec l'entrée Synchro. des données.",
          step: 3,
        },
        {
          src: "/guide/coros-android-4.webp",
          alt: "Liste des applications tierces de COROS, avec l'entrée Health Connect.",
          step: 4,
        },
        {
          src: "/guide/coros-android-5.webp",
          alt: "Écran Health Connect de COROS, avec le bouton Synchroniser.",
          step: 5,
        },
        {
          src: "/guide/coros-android-6.webp",
          alt: "Dialogue Android autorisant COROS à accéder à Santé Connect, avec l'option Tout autoriser.",
          step: 6,
        },
      ],
      ios: [
        {
          src: "/guide/coros-ios-1.webp",
          alt: "Onglet Profil de l'app COROS, avec l'entrée Paramètres en bas de la page.",
          step: 1,
        },
        {
          src: "/guide/coros-ios-2.webp",
          alt: "Écran Paramètres de COROS, avec l'entrée Applications tierces.",
          step: 2,
        },
        {
          src: "/guide/coros-ios-3.webp",
          alt: "Écran Applications tierces de COROS, avec l'entrée Synchro. des données.",
          step: 3,
        },
        {
          src: "/guide/coros-ios-4.webp",
          alt: "Liste des applications tierces de COROS, Apple Santé coché en vert.",
          step: 4,
        },
      ],
    },
  },
  {
    id: "autre",
    name: "Autre appareil",
    platforms: ["ios", "android"],
    coverage: null,
    steps: {
      ios: [
        "Ouvrez les réglages de l'application fournie avec votre appareil.",
        "Cherchez une section Intégrations, Applications connectées ou Applications et services.",
        "Choisissez Apple Santé et autorisez l'écriture de toutes les catégories proposées.",
        "Si Apple Santé n'apparaît nulle part, l'application ne peut pas alimenter Sapiens Rank : écrivez-nous, on regarde ensemble.",
      ],
      android: [
        "Installez Health Connect depuis le Play Store s'il n'est pas déjà là.",
        "Dans les réglages de l'application de votre appareil, cherchez Health Connect.",
        "Autorisez l'écriture des pas, du sommeil, de la fréquence cardiaque et de l'exercice.",
        "Si Health Connect n'apparaît nulle part, l'application ne peut pas alimenter Sapiens Rank : écrivez-nous, on regarde ensemble.",
      ],
    },
  },
];

const OS_LABEL: Record<OS, string> = {
  ios: "iPhone",
  android: "Android",
};

const HUB_LABEL: Record<OS, string> = {
  ios: "Apple Santé",
  android: "Health Connect",
};

const LEVEL_STYLE: Record<
  Exclude<Level, "no">,
  { mark: string; className: string; title: string }
> = {
  yes: {
    mark: "✓",
    className: "border-lime-300/30 bg-lime-300/10 text-lime-300",
    title: "Transmis",
  },
  partial: {
    mark: "~",
    className: "border-amber-300/25 bg-amber-300/[0.07] text-amber-300/90",
    title: "Partiellement transmis",
  },
};

// Logos do not share an aspect ratio, so they are pinned to a common height
// and the width follows. Sources without a logo fall back to a glyph.
function SourceLogo({
  source,
  className = "",
}: {
  source: Source;
  className?: string;
}) {
  if (!source.logo) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
        className={`block w-auto text-gray-600 ${className}`}
      >
        <rect x="7" y="5" width="10" height="14" rx="3" />
        <path d="M9.5 3.5h5M9.5 20.5h5" />
      </svg>
    );
  }

  return (
    <Image
      src={source.logo.src}
      alt=""
      width={source.logo.width}
      height={source.logo.height}
      className={`block w-auto object-contain object-left ${
        source.logo.invert ? "invert" : ""
      } ${className}`}
    />
  );
}

function detectOS(): OS | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ reports itself as a Mac.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return null;
}

// The app can open /guide-sante?os=android&app=garmin; otherwise we read the
// browser. The snapshot is a string so it stays referentially stable.
const EMPTY_SNAPSHOT = "|";
const subscribe = () => () => {};
const getServerSnapshot = () => EMPTY_SNAPSHOT;

// Frozen on the first client render: we rewrite the URL afterwards, so it must
// not stay the source of truth (the initial value would erase itself).
let cachedSnapshot: string | null = null;

function getClientSnapshot(): string {
  if (cachedSnapshot === null) {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("os");
    const os = fromUrl === "ios" || fromUrl === "android" ? fromUrl : detectOS();
    const app = params.get("app");
    cachedSnapshot = `${os ?? ""}|${
      app && SOURCES.some((s) => s.id === app) ? app : ""
    }`;
  }
  return cachedSnapshot;
}

export default function GuideSelector() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [snapshotOs, snapshotApp] = snapshot.split("|");

  // `null` = not yet touched by the user, keep the detected value.
  const [osChoice, setOsChoice] = useState<OS | null>(null);
  const [appChoice, setAppChoice] = useState<string | null>(null);
  const [appTouched, setAppTouched] = useState(false);

  const os: OS =
    osChoice ?? (snapshotOs === "android" ? "android" : "ios");
  const autoDetected = osChoice === null && snapshotOs !== "";
  const sourceId = appTouched ? appChoice : snapshotApp || null;

  // The snapshot is cached at module level: release it on unmount so coming
  // back to the page reads the URL and the browser again.
  useEffect(() => () => {
    cachedSnapshot = null;
  }, []);

  const panelRef = useRef<HTMLElement>(null);
  // Only a user picking an app scrolls; a deep link must not move the page.
  const scrollOnNextRender = useRef(false);

  // On mobile the result sits below the fold, so bring it into view.
  useEffect(() => {
    if (!scrollOnNextRender.current) return;
    scrollOnNextRender.current = false;
    const panel = panelRef.current;
    if (!panel) return;
    // On wide screens the panel often already sits in view; scrolling then
    // reads as an unwanted jump.
    const { top } = panel.getBoundingClientRect();
    if (top >= 0 && top <= window.innerHeight * 0.5) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    panel.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [sourceId, os]);

  // Keep the URL shareable without going through the router.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("os", os);
    if (sourceId) params.set("app", sourceId);
    else params.delete("app");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [os, sourceId]);

  const visibleSources = SOURCES.filter((s) => s.platforms.includes(os));
  const selected = visibleSources.find((s) => s.id === sourceId) ?? null;
  const steps = selected?.steps[os] ?? [];
  const shots = selected?.shots?.[os] ?? [];

  // Only show what the source actually transmits.
  const coverage = selected?.coverage;
  const provided = coverage
    ? METRICS.flatMap((metric) => {
        const level = coverage[metric.key];
        return level === "no" ? [] : [{ metric, level }];
      })
    : [];

  function pickOs(next: OS) {
    setOsChoice(next);
    // The selected app may not exist on the other platform.
    const current = SOURCES.find((s) => s.id === sourceId);
    if (current && !current.platforms.includes(next)) {
      setAppChoice(null);
      setAppTouched(true);
    }
  }

  function pickSource(id: string) {
    const next = sourceId === id ? null : id;
    setAppChoice(next);
    setAppTouched(true);
    // Deselecting leaves an empty state, nothing worth scrolling to.
    scrollOnNextRender.current = next !== null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step 1 — platform */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Votre téléphone
        </span>
        <div
          role="group"
          aria-label="Choisir votre téléphone"
          className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
        >
          {(["ios", "android"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => pickOs(value)}
              aria-pressed={os === value}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                os === value
                  ? "bg-lime-300 text-black font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {OS_LABEL[value]}
            </button>
          ))}
        </div>
        {autoDetected && (
          <span className="text-xs text-gray-600">détecté automatiquement</span>
        )}
      </div>

      {/* Step 2 — app */}
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        Votre application ou votre montre
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleSources.map((s) => {
          const active = s.id === sourceId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pickSource(s.id)}
              aria-pressed={active}
              className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                active
                  ? "border-lime-300/50 bg-lime-300/[0.08]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <SourceLogo source={s} className="h-5 mb-3" />
              <span
                className={`block text-sm font-medium ${
                  active ? "text-lime-300" : "text-white"
                }`}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result */}
      <div className="mt-8">
        {!selected ? (
          <div className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              Choisissez votre application pour afficher les étapes.
            </p>
          </div>
        ) : (
          <article
            key={`${selected.id}-${os}`}
            ref={panelRef}
            className="scroll-mt-20 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <SourceLogo source={selected} className="h-7 mb-5" />
            <p className="text-xs uppercase tracking-widest text-lime-300/70 mb-3">
              {selected.name} → {HUB_LABEL[os]} → Sapiens Rank
            </p>
            <h3 className="text-2xl font-semibold mb-2">
              Connecter {selected.name} sur {OS_LABEL[os]}
            </h3>
            {provided.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">
                  Ce que cette source apporte à votre score :
                </p>
                <div className="flex flex-wrap gap-2">
                  {provided.map(({ metric, level }) => {
                    const style = LEVEL_STYLE[level];
                    return (
                      <span
                        key={metric.key}
                        title={`${metric.label} — ${style.title}`}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${style.className}`}
                      >
                        <span aria-hidden="true">{style.mark}</span>
                        {metric.label}
                        <span className="sr-only"> : {style.title}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <ol className="mt-8 flex flex-col gap-7">
              {steps.map((step, i) => {
                const stepShots = shots.filter((shot) => shot.step === i + 1);
                return (
                  <li key={step} className="flex gap-4">
                    <span className="mt-px flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-lime-300/10 text-xs font-semibold text-lime-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-gray-300">
                        {step}
                      </p>
                      {stepShots.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {stepShots.map((shot) => (
                            <div
                              key={shot.src}
                              className="w-[190px] overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] sm:w-[210px]"
                            >
                              <Image
                                src={shot.src}
                                alt={shot.alt}
                                width={640}
                                height={1388}
                                sizes="(min-width: 640px) 210px, 190px"
                                className="h-auto w-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </article>
        )}
      </div>
    </div>
  );
}
