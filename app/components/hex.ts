// Hex helpers mirroring the app's map tiles (lib/screens/map/game/hex_geometry.dart):
// flat-top hexagons with rounded corners, laid out in odd-q offset coords.

export const SQRT3 = Math.sqrt(3);

const round = (n: number) => Math.round(n * 100) / 100;

/** Flat-top hexagon SVG path with rounded corners, centered on (cx, cy). */
export function hexPath(cx: number, cy: number, size: number, corner: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * 60 * i;
    return [cx + size * Math.cos(a), cy + size * Math.sin(a)];
  });
  let d = "";
  for (let i = 0; i < 6; i++) {
    const [vx, vy] = pts[i];
    const [px, py] = pts[(i + 5) % 6];
    const [nx, ny] = pts[(i + 1) % 6];
    const inLen = Math.hypot(vx - px, vy - py);
    const outLen = Math.hypot(nx - vx, ny - vy);
    const r = Math.min(corner, Math.min(inLen, outLen) / 2);
    const sx = vx - ((vx - px) / inLen) * r;
    const sy = vy - ((vy - py) / inLen) * r;
    const ex = vx + ((nx - vx) / outLen) * r;
    const ey = vy + ((ny - vy) / outLen) * r;
    d += `${i === 0 ? "M" : "L"}${round(sx)} ${round(sy)}Q${round(vx)} ${round(vy)} ${round(ex)} ${round(ey)}`;
  }
  return d + "Z";
}

/** Top-left corner of the (col, row) cell's bounding box, in units of the hex radius. */
export function hexOrigin(col: number, row: number): [number, number] {
  return [col * 1.5, (row + (col % 2 === 1 ? 0.5 : 0)) * SQRT3];
}

/** Mixes a #RRGGBB color toward white (amount > 0) or black (amount < 0). */
export function shade(hex: string, amount: number): string {
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(c + (target - c) * t)
      .toString(16)
      .padStart(2, "0");
  });
  return `#${channels.join("")}`;
}
