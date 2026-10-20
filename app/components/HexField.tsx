import { SQRT3, hexOrigin, hexPath } from "./hex";

// Decorative honeycomb behind the hero: a few tiles light up in guild colors,
// like territories changing hands on the battle map.
const R = 40;
const COLS = 18;
const ROWS = 7;
const TILE = hexPath(0, 0, R - 4, 8);

const LIT: { col: number; row: number; color: string; delay: number }[] = [
  { col: 2, row: 1, color: "#D9FF3D", delay: 0 },
  { col: 3, row: 1, color: "#D9FF3D", delay: 0.6 },
  { col: 14, row: 2, color: "#7CB6FF", delay: 1.8 },
  { col: 15, row: 2, color: "#7CB6FF", delay: 2.4 },
  { col: 5, row: 4, color: "#F0A64A", delay: 3.2 },
  { col: 12, row: 5, color: "#C5A3FF", delay: 4.1 },
  { col: 16, row: 4, color: "#9BE7C4", delay: 5 },
  { col: 1, row: 4, color: "#C5A3FF", delay: 5.8 },
];

export default function HexField() {
  const width = (COLS * 1.5 + 0.5) * R;
  const height = (ROWS + 0.5) * SQRT3 * R;
  const center = (col: number, row: number) => {
    const [x, y] = hexOrigin(col, row);
    return `translate(${x * R + R} ${(y + SQRT3 / 2) * R})`;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="hex-field"
      aria-hidden
    >
      <defs>
        <path id="hex-field-tile" d={TILE} />
      </defs>
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <use
          key={i}
          href="#hex-field-tile"
          transform={center(i % COLS, Math.floor(i / COLS))}
          fill="rgba(255,255,255,0.015)"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.5"
        />
      ))}
      {LIT.map(({ col, row, color, delay }) => (
        <use
          key={`${col}-${row}`}
          href="#hex-field-tile"
          transform={center(col, row)}
          fill={color}
          stroke={color}
          strokeWidth="2"
          className="hex-field-lit"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </svg>
  );
}
