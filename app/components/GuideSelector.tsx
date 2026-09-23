"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  METRIC_KEYS,
  SOURCE_IDS,
  type GuideLabels,
  type Level,
  type OS,
  type Source,
} from "./guideTypes";

const OS_LABEL: Record<OS, string> = {
  ios: "iPhone",
  android: "Android",
};

const LEVEL_STYLE: Record<
  Exclude<Level, "no">,
  { mark: string; className: string }
> = {
  yes: {
    mark: "✓",
    className: "border-lime-300/30 bg-lime-300/10 text-lime-300",
  },
  partial: {
    mark: "~",
    className: "border-amber-300/25 bg-amber-300/[0.07] text-amber-300/90",
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
      app && SOURCE_IDS.includes(app) ? app : ""
    }`;
  }
  return cachedSnapshot;
}

export default function GuideSelector({
  sources,
  labels,
}: {
  sources: Source[];
  labels: GuideLabels;
}) {
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

  const visibleSources = sources.filter((s) => s.platforms.includes(os));
  const selected = visibleSources.find((s) => s.id === sourceId) ?? null;
  const steps = selected?.steps[os] ?? [];
  const shots = selected?.shots?.[os] ?? [];

  // Only show what the source actually transmits.
  const coverage = selected?.coverage;
  const provided = coverage
    ? METRIC_KEYS.flatMap((metric) => {
        const level = coverage[metric];
        return level === "no" ? [] : [{ metric, level }];
      })
    : [];

  function pickOs(next: OS) {
    setOsChoice(next);
    // The selected app may not exist on the other platform.
    const current = sources.find((s) => s.id === sourceId);
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
          {labels.phone}
        </span>
        <div
          role="group"
          aria-label={labels.choosePhone}
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
          <span className="text-xs text-gray-600">{labels.autoDetected}</span>
        )}
      </div>

      {/* Step 2 — app */}
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        {labels.app}
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
              {labels.empty}
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
              {selected.name} → {labels.hub[os]} → Sapiens Rank
            </p>
            <h3 className="text-2xl font-semibold mb-2">
              {labels.connect[0]}{selected.name}{labels.connect[1]}{OS_LABEL[os]}{labels.connect[2]}
            </h3>
            {provided.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">
                  {labels.provides}
                </p>
                <div className="flex flex-wrap gap-2">
                  {provided.map(({ metric, level }) => {
                    const style = LEVEL_STYLE[level];
                    const label = labels.metrics[metric];
                    const title = labels.levels[level];
                    return (
                      <span
                        key={metric}
                        title={`${label} — ${title}`}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${style.className}`}
                      >
                        <span aria-hidden="true">{style.mark}</span>
                        {label}
                        <span className="sr-only"> : {title}</span>
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
