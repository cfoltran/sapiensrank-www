"use client";

import { useEffect, useRef, useState } from "react";
import SapieCoin from "./SapieCoin";

const COUNT = 42;
const DURATION = 2600;

type Drop = {
  x: number;
  delay: number;
  /** The share of the whole rain this coin takes to cross the screen. */
  fall: number;
  size: number;
  sway: number;
  phase: number;
  spins: number;
};

function makeDrops(): Drop[] {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random(),
    delay: Math.random() * 0.45,
    fall: 0.4 + Math.random() * 0.15,
    size: 18 + Math.random() * 20,
    sway: 6 + Math.random() * 18,
    phase: Math.random() * 2 * Math.PI,
    spins: 1 + Math.random() * 2,
  }));
}

// Port of the app's sapie_rain.dart: coins falling once over the screen,
// flipping as they go. Never takes a tap.
export default function SapieRain({ onDone }: { onDone?: () => void }) {
  const [drops] = useState(makeDrops);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done.current?.();
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min((now - start) / DURATION, 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      drops.forEach((d, i) => {
        const el = refs.current[i];
        if (!el) return;
        const t = (value - d.delay) / d.fall;
        if (t < 0 || t > 1) {
          el.style.visibility = "hidden";
          return;
        }
        const left = d.x * (w - d.size) + Math.sin(t * 2 * Math.PI + d.phase) * d.sway;
        const top = -d.size + t * t * (h + d.size * 2);
        const flip = Math.cos(t * d.spins * 2 * Math.PI);
        el.style.visibility = "visible";
        el.style.transform = `translate(${left}px, ${top}px) scaleX(${flip})`;
      });
      if (value < 1) frame = requestAnimationFrame(tick);
      else done.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [drops]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden>
      {drops.map((d, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-0 top-0"
          style={{ visibility: "hidden", willChange: "transform" }}
        >
          <SapieCoin size={d.size} />
        </div>
      ))}
    </div>
  );
}
