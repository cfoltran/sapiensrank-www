"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "../i18n";
import type { PaceCopy } from "./paceCopy";
import {
  DISTANCE_IDS,
  DISTANCE_KM,
  DISTANCE_NAME,
  MILE_KM,
  PREFILL_STYLE_ID,
  capitalize,
  formatPace,
  formatSpeed,
  type DistanceId,
} from "./pace";
import Stat from "./Stat";

type DistanceChoice = DistanceId | "custom";
type Clock = { h: string; m: string; s: string };

const DEFAULT = { distance: "10k" as DistanceChoice, seconds: 50 * 60 };

function toClock(seconds: number): Clock {
  const total = Math.round(seconds);
  return {
    h: String(Math.floor(total / 3600)),
    m: String(Math.floor((total % 3600) / 60)),
    s: String(total % 60),
  };
}

/** A pace has no hours field: minutes go past 59 instead of hiding them. */
function toPaceClock(seconds: number): Clock {
  const total = Math.round(seconds);
  return { h: "0", m: String(Math.floor(total / 60)), s: String(total % 60) };
}

function fromClock(clock: Clock): number {
  const n = (v: string) => Math.max(0, Number(v) || 0);
  return n(clock.h) * 3600 + n(clock.m) * 60 + n(clock.s);
}

// Goal pages link here with ?d=marathon&t=12600 to prefill the form. Read once
// on the client; the server renders the default.
const subscribe = () => () => {};
const getServerSnapshot = () => "";
const getClientSnapshot = () => window.location.search;

function initialFromQuery(search: string) {
  const params = new URLSearchParams(search);
  const d = params.get("d");
  const t = Number(params.get("t"));
  const distance = DISTANCE_IDS.find((id) => id === d);
  if (!distance || !(t > 0)) return null;
  return { distance: distance as DistanceChoice, seconds: t };
}

export default function PaceCalculator({
  locale,
  copy,
}: {
  locale: Locale;
  copy: PaceCopy["calc"];
}) {
  const search = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const fromQuery = initialFromQuery(search);

  // Once the real query is applied, show the form the inline script hid.
  useEffect(() => {
    if (search === window.location.search) {
      document.getElementById(PREFILL_STYLE_ID)?.remove();
    }
  }, [search]);

  // Keyed on the query so the prefilled values reset the form state once.
  return (
    <Form
      key={search}
      locale={locale}
      copy={copy}
      initial={fromQuery ?? DEFAULT}
    />
  );
}

function Form({
  locale,
  copy,
  initial,
}: {
  locale: Locale;
  copy: PaceCopy["calc"];
  initial: { distance: DistanceChoice; seconds: number };
}) {
  const [distance, setDistance] = useState<DistanceChoice>(initial.distance);
  const [customKm, setCustomKm] = useState("15");
  const [time, setTime] = useState<Clock>(toClock(initial.seconds));
  const [pace, setPace] = useState<Clock>({ h: "0", m: "0", s: "0" });
  // The field the user typed in last; the other one is computed from it.
  const [anchor, setAnchor] = useState<"time" | "pace">("time");

  const km =
    distance === "custom"
      ? Math.max(0, Number(customKm.replace(",", ".")) || 0)
      : DISTANCE_KM[distance];

  const totalSeconds =
    anchor === "time" ? fromClock(time) : fromClock(pace) * km;
  const paceSeconds =
    anchor === "pace" ? fromClock(pace) : km > 0 ? totalSeconds / km : 0;
  const valid = km > 0 && paceSeconds > 0;

  const shownTime = anchor === "time" ? time : toClock(totalSeconds);
  const shownPace = anchor === "pace" ? pace : toPaceClock(paceSeconds);

  function editTime(field: keyof Clock, value: string) {
    setTime({ ...shownTime, [field]: value });
    setAnchor("time");
  }

  function editPace(field: keyof Clock, value: string) {
    setPace({ ...shownPace, [field]: value });
    setAnchor("pace");
  }

  return (
    <div className="pace-form rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      {/* Distance */}
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
        {copy.distance}
      </p>
      <div className="flex flex-wrap gap-2">
        {[...DISTANCE_IDS, "custom" as const].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setDistance(id)}
            aria-pressed={distance === id}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              distance === id
                ? "border-lime-300 bg-lime-300 text-black font-medium"
                : "border-white/10 text-gray-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {id === "custom" ? copy.custom : capitalize(DISTANCE_NAME[locale][id])}
          </button>
        ))}
      </div>
      {distance === "custom" && (
        <label className="mt-4 flex items-center gap-3 text-sm text-gray-400">
          {copy.customLabel}
          <input
            type="text"
            inputMode="decimal"
            value={customKm}
            onChange={(e) => setCustomKm(e.target.value)}
            className="w-24 rounded-xl border border-white/10 bg-black px-3 py-2 text-white focus:border-lime-300 focus:outline-none"
          />
        </label>
      )}

      {/* Time and pace */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            {copy.time}
          </legend>
          <ClockInputs
            value={shownTime}
            fields={["h", "m", "s"]}
            labels={copy}
            highlight={anchor === "time"}
            onChange={editTime}
          />
        </fieldset>
        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            {copy.pace} <span className="normal-case tracking-normal">({copy.perKm})</span>
          </legend>
          <ClockInputs
            value={shownPace}
            fields={["m", "s"]}
            labels={copy}
            highlight={anchor === "pace"}
            onChange={editPace}
          />
        </fieldset>
      </div>

      {/* Results */}
      <dl className="mt-8 grid grid-cols-3 gap-3">
        <Stat label={copy.pace} value={valid ? formatPace(paceSeconds) : "–"} unit={copy.perKm} />
        <Stat label={copy.pace} value={valid ? formatPace(paceSeconds * MILE_KM) : "–"} unit={copy.perMile} />
        <Stat label={copy.speed} value={valid ? formatSpeed(paceSeconds, locale) : "–"} unit="km/h" />
      </dl>
    </div>
  );
}

function ClockInputs({
  value,
  fields,
  labels,
  highlight,
  onChange,
}: {
  value: Clock;
  fields: (keyof Clock)[];
  labels: PaceCopy["calc"];
  highlight: boolean;
  onChange: (field: keyof Clock, value: string) => void;
}) {
  const names = { h: labels.hours, m: labels.minutes, s: labels.seconds };
  const suffix = { h: "h", m: "min", s: "s" };
  return (
    <div className="flex gap-2">
      {fields.map((field) => (
        <label key={field} className="relative flex-1">
          <span className="sr-only">{names[field]}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            // Pace minutes can pass 59 (walking, tiny distances).
            max={field === "h" ? 99 : field === "s" || fields.includes("h") ? 59 : undefined}
            value={value[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className={`w-full rounded-xl border bg-black py-3 pl-3 pr-10 text-lg tabular-nums text-white focus:border-lime-300 focus:outline-none ${
              highlight ? "border-white/25" : "border-white/10"
            }`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {suffix[field]}
          </span>
        </label>
      ))}
    </div>
  );
}
