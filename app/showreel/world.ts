import * as THREE from "three";
import { LIME } from "./text";
import {
  SCENES,
  beatPulse,
  clamp01,
  easeInCubic,
  easeOutBack,
  lerp,
  mulberry32,
  prog,
} from "./timeline";

// The battle map from the app (lib/screens/map/game/hex_geometry.dart):
// flat-top hexagons in odd-q offset coordinates, odd columns shifted down.
const COLS = 37;
const ROWS = 29;
const CENTER_COL = 18;
const CENTER_ROW = 14;
const SQRT3 = Math.sqrt(3);

const NEUTRAL = new THREE.Color("#221F19");
const LIME_COLOR = new THREE.Color(LIME);
// Lime at full albedo blows out to white under the key light; tiles settle on this.
const LIME_TILE = LIME_COLOR.clone().multiplyScalar(0.45);

// Guild colours lifted from the map screenshot; the lime one is "your" guild.
const GUILDS = [
  { color: "#D9FF3D", x: 3, z: 1.7, height: 0.5 },
  { color: "#3B8FE0", x: 14, z: -7, height: 0.46 },
  { color: "#2EAA5C", x: -11, z: -8, height: 0.42 },
  { color: "#232A9E", x: -4, z: 11, height: 0.48 },
  { color: "#9A5BD0", x: 13, z: 10, height: 0.44 },
  { color: "#7A5340", x: -15, z: 5, height: 0.4 },
  { color: "#E0607A", x: 1, z: -14, height: 0.45 },
  { color: "#F0A64A", x: 24, z: 2, height: 0.43 },
  { color: "#74D0C0", x: -24, z: -3, height: 0.47 },
].map((g) => ({ ...g, color: new THREE.Color(g.color) }));

export const LIME_SEED = new THREE.Vector3(GUILDS[0].x, 0, GUILDS[0].z);

const LIME_START_RADIUS = 3;
const CAPTURE_STEP = 0.4;
const CAPTURE_FROM = SCENES.map[0] + 4;
const CAPTURE_UNTIL = SCENES.map[1] - 2;
const TRAIL_FROM = SCENES.move[0] + 1;
export const TRAIL_STEP = 0.5;

type Tile = {
  x: number;
  z: number;
  col: number;
  row: number;
  d: number;
  rnd: number;
  region: number;
  seedDist: number;
  captureAt: number;
  trailAt: number;
};

function roundedHex(r: number, corner: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return new THREE.Vector2(r * Math.cos(a), r * Math.sin(a));
  });
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const v = pts[i];
    const prev = pts[(i + 5) % 6];
    const next = pts[(i + 1) % 6];
    const a = v.clone().add(prev.clone().sub(v).setLength(corner));
    const b = v.clone().add(next.clone().sub(v).setLength(corner));
    if (i === 0) shape.moveTo(a.x, a.y);
    else shape.lineTo(a.x, a.y);
    shape.quadraticCurveTo(v.x, v.y, b.x, b.y);
  }
  shape.closePath();
  return shape;
}

function neighbors(col: number, row: number): [number, number][] {
  const odd = col & 1;
  return [
    [col, row - 1],
    [col, row + 1],
    [col - 1, row - 1 + odd],
    [col - 1, row + odd],
    [col + 1, row - 1 + odd],
    [col + 1, row + odd],
  ];
}

export class HexWorld {
  readonly mesh: THREE.InstancedMesh;
  readonly tiles: Tile[] = [];
  readonly trail: number[] = [];
  readonly trailCurve: THREE.CatmullRomCurve3;
  private glow: THREE.InstancedBufferAttribute;
  private maxD = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private p = new THREE.Vector3();
  private s = new THREE.Vector3();
  private c = new THREE.Color();

  constructor() {
    const rnd = mulberry32(7);
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const x = (col - CENTER_COL) * 1.5;
        const z = (row + (col & 1 ? 0.5 : 0) - CENTER_ROW) * SQRT3;
        const r = rnd();
        let region = 0;
        let best = Infinity;
        GUILDS.forEach((g, gi) => {
          const dist = Math.hypot(x - g.x, z - g.z) + rnd() * 1.6;
          if (dist < best) {
            best = dist;
            region = gi;
          }
        });
        if (best + r * 3 > 12.5) region = -1;
        const limeDist = Math.hypot(x - LIME_SEED.x, z - LIME_SEED.z) + r * 1.1;
        let captureAt = Infinity;
        if (limeDist < LIME_START_RADIUS) captureAt = -Infinity;
        else {
          const at = CAPTURE_FROM + Math.ceil((limeDist - LIME_START_RADIUS) / CAPTURE_STEP);
          if (at <= CAPTURE_UNTIL) captureAt = at;
        }
        const d = Math.hypot(x, z);
        this.maxD = Math.max(this.maxD, d);
        this.tiles.push({ x, z, col, row, d, rnd: r, region, seedDist: best, captureAt, trailAt: Infinity });
      }
    }

    this.buildTrail();
    this.trailCurve = new THREE.CatmullRomCurve3(
      this.trail.map((i) => new THREE.Vector3(this.tiles[i].x, 0.5, this.tiles[i].z)),
    );

    const geometry = new THREE.ExtrudeGeometry(roundedHex(0.9, 0.16), {
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
      curveSegments: 3,
    });
    geometry.rotateX(-Math.PI / 2);
    this.glow = new THREE.InstancedBufferAttribute(new Float32Array(this.tiles.length), 1);
    geometry.setAttribute("aGlow", this.glow);

    const material = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.1 });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aGlow;\nvarying float vGlow;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGlow = aGlow;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vGlow;")
        .replace(
          "#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vGlow;",
        );
    };

    this.mesh = new THREE.InstancedMesh(geometry, material, this.tiles.length);
    this.mesh.frustumCulled = false;
    for (let i = 0; i < this.tiles.length; i++) this.mesh.setColorAt(i, NEUTRAL);
  }

  private index(col: number, row: number) {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return -1;
    return col * ROWS + row;
  }

  /** A walk from the centre tile through a few waypoints, one hex at a time. */
  private buildTrail() {
    const waypoints = [
      [6, -3],
      [11, 2],
      [8, 8],
    ];
    let current = this.index(CENTER_COL, CENTER_ROW);
    const seen = new Set([current]);
    this.trail.push(current);
    for (const [wx, wz] of waypoints) {
      while (this.trail.length < 26) {
        const t = this.tiles[current];
        if (Math.hypot(t.x - wx, t.z - wz) < 1.2) break;
        let next = -1;
        let best = Infinity;
        for (const [c, r] of neighbors(t.col, t.row)) {
          const n = this.index(c, r);
          if (n < 0 || seen.has(n)) continue;
          const dist = Math.hypot(this.tiles[n].x - wx, this.tiles[n].z - wz);
          if (dist < best) {
            best = dist;
            next = n;
          }
        }
        if (next < 0) break;
        seen.add(next);
        this.trail.push(next);
        current = next;
      }
    }
    this.trail.forEach((i, k) => (this.tiles[i].trailAt = TRAIL_FROM + k * TRAIL_STEP));
  }

  /** Beats at which the walk reaches its last tile. */
  get trailEnd() {
    return TRAIL_FROM + (this.trail.length - 1) * TRAIL_STEP;
  }

  private dim(b: number) {
    if (b >= SCENES.score[0] && b < SCENES.score[1]) return 0.22;
    if (b >= SCENES.podium[0] && b < SCENES.phones[1]) return 0.16;
    if (b >= SCENES.outro[0]) return 0.35;
    return 1;
  }

  update(b: number) {
    const dim = this.dim(b);
    const mapOn = b >= SCENES.map[0];
    const center = this.index(CENTER_COL, CENTER_ROW);

    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i];
      let y = 0;
      let h = 0.22;
      let glow = 0;
      this.c.copy(NEUTRAL).offsetHSL(0, 0, (t.rnd - 0.5) * 0.02);

      const rise = prog(b, 0.4 + t.d * 0.12, 2.4);
      const e = easeOutBack(rise, 1.4);
      y += (e - 1) * 5;
      let scale = 0.94 * clamp01(e);

      if (!mapOn) {
        if (i === center) {
          this.c.copy(LIME_TILE);
          glow = 0.45 + 0.35 * beatPulse(b);
          h = 0.42;
        }
        if (b >= t.trailAt) {
          const p = prog(b, t.trailAt, 0.6);
          this.c.lerp(LIME_TILE, p);
          glow = Math.max(glow, 0.12 + 1.1 * Math.exp(-(b - t.trailAt) * 1.8) + 0.12 * beatPulse(b));
          h = lerp(0.22, 0.42, easeOutBack(p, 3));
        }
      } else {
        const reveal = prog(b, SCENES.map[0] + 0.3 + t.seedDist * 0.22, 1.2);
        if (t.region >= 0) {
          const g = GUILDS[t.region];
          this.c.lerp(t.region === 0 ? LIME_TILE : g.color, reveal).offsetHSL(0, 0, (t.rnd - 0.5) * 0.06 * reveal);
          h = lerp(0.22, g.height, easeOutBack(reveal, 2.5));
          if (t.region === 0) glow = 0.06 * reveal;
        }
        if (t.region !== 0 && b >= t.captureAt) {
          const p = prog(b, t.captureAt, 0.5);
          this.c.lerp(LIME_TILE, p);
          glow = 0.06 + 0.7 * Math.exp(-(b - t.captureAt) * 2.6);
          h = lerp(h, GUILDS[0].height, p) + 0.5 * Math.sin(prog(b, t.captureAt, 0.7) * Math.PI);
        }
        if (t.region === 0 || b >= t.captureAt) glow += 0.08 * beatPulse(b, 5);
      }

      if (b >= SCENES.outro[0]) {
        // Collapses from the centre; the outer guilds stay as a frame round the logo.
        const sink = t.d < 15 ? easeInCubic(prog(b, SCENES.outro[0] + 0.3 + t.d * 0.16, 2)) : 0;
        y -= sink * 7;
        scale *= 1 - sink;
      }

      this.c.multiplyScalar(dim);
      this.p.set(t.x, y, t.z);
      this.s.set(scale, scale > 0 ? h : 0, scale);
      this.m.compose(this.p, this.q, this.s);
      this.mesh.setMatrixAt(i, this.m);
      this.mesh.setColorAt(i, this.c);
      this.glow.array[i] = glow * dim;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
    this.glow.needsUpdate = true;
  }

  /** Steps counted so far, so the HUD counter follows the walk. */
  stepsAt(b: number) {
    return clamp01((b - TRAIL_FROM) / (this.trailEnd - TRAIL_FROM + 0.5));
  }
}
