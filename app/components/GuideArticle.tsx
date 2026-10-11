import Image from "next/image";
import type { Ref } from "react";
import {
  METRIC_KEYS,
  type GuideLabels,
  type Level,
  type OS,
  type Source,
} from "./guideTypes";

// Shared by the interactive selector (hub page) and the static per-app pages.

export const OS_LABEL: Record<OS, string> = {
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
export function SourceLogo({
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

/** What the source actually transmits, "no" entries left out. */
export function providedMetrics(source: Source) {
  const coverage = source.coverage;
  return coverage
    ? METRIC_KEYS.flatMap((metric) => {
        const level = coverage[metric];
        return level === "no" ? [] : [{ metric, level }];
      })
    : [];
}

export default function GuideArticle({
  source,
  os,
  labels,
  heading: Heading = "h3",
  ref,
}: {
  source: Source;
  os: OS;
  labels: GuideLabels;
  /** h3 inside the hub page, h2 on a per-app page whose h1 is the title. */
  heading?: "h2" | "h3";
  ref?: Ref<HTMLElement>;
}) {
  const steps = source.steps[os] ?? [];
  const shots = source.shots?.[os] ?? [];
  const provided = providedMetrics(source);

  return (
    <article
      ref={ref}
      className="scroll-mt-20 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
    >
      <SourceLogo source={source} className="h-7 mb-5" />
      <p className="text-xs uppercase tracking-widest text-lime-300/70 mb-3">
        {source.name} → {labels.hub[os]} → Sapiens Rank
      </p>
      <Heading className="text-2xl font-semibold mb-2">
        {labels.connect[0]}{source.name}{labels.connect[1]}{OS_LABEL[os]}{labels.connect[2]}
      </Heading>
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
                  title={`${label} (${title.toLowerCase()})`}
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
  );
}
