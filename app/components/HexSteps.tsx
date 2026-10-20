"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SQRT3, hexOrigin, hexPath, shade } from "./hex";

// Guild colors from the app: each step "captures" its tile in turn.
const COLORS = ["#D9FF3D", "#7CB6FF", "#F0A64A", "#C5A3FF", "#9BE7C4"];

// One tile in a 200 × 173.2 viewBox: radius 100, minus the gap between tiles.
const R = 100;
const FACE = 91;
const CORNER = 18;
const DEPTH = 9;
const CENTER: [number, number] = [R, (SQRT3 / 2) * R];
const FACE_PATH = hexPath(CENTER[0], CENTER[1], FACE, CORNER);
const DEPTH_PATH = hexPath(CENTER[0], CENTER[1] + DEPTH, FACE, CORNER);
const GLOW_PATH = hexPath(CENTER[0], CENTER[1], FACE + 4, CORNER);

type Layout = { cells: [number, number][]; width: number; height: number };

function layout(cells: [number, number][]): Layout {
  let width = 0;
  let height = 0;
  for (const [col, row] of cells) {
    const [x, y] = hexOrigin(col, row);
    width = Math.max(width, x + 2);
    height = Math.max(height, y + SQRT3);
  }
  return { cells, width, height };
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

export default function HexSteps({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile: a two-column zigzag. Desktop: one honeycomb row.
  const mobile = layout(steps.map((_, i) => [i % 2, Math.floor(i / 2)]));
  const desktop = layout(steps.map((_, i) => [i, 0]));

  const boardStyle = {
    "--ratio": `${mobile.width} / ${mobile.height + 0.1}`,
    "--ratio-md": `${desktop.width} / ${desktop.height + 0.1}`,
  } as CSSProperties;

  return (
    <ol ref={ref} className="hex-board" style={boardStyle} data-visible={visible || undefined}>
      {steps.map((text, i) => {
        const color = COLORS[i % COLORS.length];
        const [mx, my] = hexOrigin(...mobile.cells[i]);
        const [dx, dy] = hexOrigin(...desktop.cells[i]);
        const cellStyle = {
          "--x": pct(mx / mobile.width),
          "--y": pct(my / mobile.height),
          "--w": pct(2 / mobile.width),
          "--x-md": pct(dx / desktop.width),
          "--y-md": pct(dy / desktop.height),
          "--w-md": pct(2 / desktop.width),
          "--enter-delay": `${i * 0.1}s`,
          "--capture-delay": `${0.55 + i * 0.28}s`,
        } as CSSProperties;
        const gradientId = `hex-face-${i}`;

        return (
          <li key={text} className="hex-cell" style={cellStyle}>
            <div className="hex-tile">
              <div className="hex-pop">
                <svg viewBox={`0 0 ${2 * R} ${SQRT3 * R}`} className="hex-svg" aria-hidden>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={shade(color, 0.18)} />
                      <stop offset="0.55" stopColor={color} />
                      <stop offset="1" stopColor={shade(color, -0.12)} />
                    </linearGradient>
                  </defs>
                  {/* Neutral tile, as on an unclaimed territory. */}
                  <path d={DEPTH_PATH} fill="#0E0C09" />
                  <path d={FACE_PATH} fill="#1D1A14" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  {/* Captured tile, faded in over the neutral one. */}
                  <g className="hex-color">
                    <path d={GLOW_PATH} fill={color} className="hex-glow" />
                    <path d={DEPTH_PATH} fill={shade(color, -0.45)} />
                    <path d={FACE_PATH} fill={`url(#${gradientId})`} />
                    <path d={FACE_PATH} fill="none" stroke={shade(color, 0.35)} strokeWidth="4" />
                  </g>
                </svg>
                <div className="hex-content">
                  <span className="hex-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hex-text">{text}</span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
