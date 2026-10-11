"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import GuideArticle, { OS_LABEL, SourceLogo } from "./GuideArticle";
import {
  SOURCE_IDS,
  type GuideLabels,
  type OS,
  type Source,
} from "./guideTypes";

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
  pageHrefs,
}: {
  sources: Source[];
  labels: GuideLabels;
  /** URL of each per-app page, keyed `${sourceId}-${os}`. */
  pageHrefs: Record<string, string>;
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
  const pageHref = selected ? pageHrefs[`${selected.id}-${os}`] : undefined;

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
          const href = pageHrefs[`${s.id}-${os}`];
          const className = `rounded-2xl border px-4 py-4 text-left transition-colors ${
            active
              ? "border-lime-300/50 bg-lime-300/[0.08]"
              : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
          }`;
          const content = (
            <>
              <SourceLogo source={s} className="h-5 mb-3" />
              <span
                className={`block text-sm font-medium ${
                  active ? "text-lime-300" : "text-white"
                }`}
              >
                {s.name}
              </span>
            </>
          );
          // Cards with a per-app page are real links, so crawlers reach those
          // pages from here. A plain click still opens the panel in place;
          // ctrl/cmd/middle click opens the page itself.
          return href ? (
            <a
              key={s.id}
              href={href}
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                pickSource(s.id);
              }}
              aria-current={active ? "true" : undefined}
              className={className}
            >
              {content}
            </a>
          ) : (
            <button
              key={s.id}
              type="button"
              onClick={() => pickSource(s.id)}
              aria-pressed={active}
              className={className}
            >
              {content}
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
          <>
            <GuideArticle
              key={`${selected.id}-${os}`}
              ref={panelRef}
              source={selected}
              os={os}
              labels={labels}
            />
            {pageHref && (
              <Link
                href={pageHref}
                className="mt-4 inline-block text-xs text-gray-500 hover:text-lime-300 transition-colors"
              >
                {labels.permalink} →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
