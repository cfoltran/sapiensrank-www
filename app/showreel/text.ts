import * as THREE from "three";
import { clamp01, easeInCubic, easeOutCubic, prog } from "./timeline";

export const LIME = "#D9FF3D";
export const CREAM = "#F5F1E8";
export const MUTED = "rgba(245,241,232,0.55)";

let family = "Archivo, Arial, sans-serif";

export function setFontFamily(value: string) {
  family = value;
}

export type FontStyle = {
  size: number;
  weight?: number;
  italic?: boolean;
  color?: string;
  spacing?: number;
};

const fontOf = (s: FontStyle) =>
  `${s.italic ? "italic " : ""}${s.weight ?? 800} ${s.size}px ${family}`;

const scratch =
  typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");

export function measure(text: string, style: FontStyle): number {
  if (!scratch) return 0;
  scratch.font = fontOf(style);
  scratch.letterSpacing = `${style.spacing ?? 0}px`;
  return scratch.measureText(text).width;
}

/**
 * HUD textures are sampled raw (NoColorSpace) because the HUD is drawn after
 * the OutputPass, into a buffer that is already sRGB-encoded.
 */
export function hudTexture(canvas: HTMLCanvasElement | HTMLImageElement) {
  const tex =
    canvas instanceof HTMLCanvasElement ? new THREE.CanvasTexture(canvas) : new THREE.Texture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** A solid HUD colour, given as the raw sRGB value it must land with. */
export const hudColor = (hex: string) =>
  new THREE.Color().setStyle(hex, THREE.LinearSRGBColorSpace);

const unitPlane = new THREE.PlaneGeometry(1, 1);

export class TextSprite {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  width = 0;
  private canvas = document.createElement("canvas");
  private text = "";

  constructor(
    private style: FontStyle,
    text: string,
    private colorSpace: THREE.ColorSpace = THREE.NoColorSpace,
  ) {
    this.mesh = new THREE.Mesh(
      unitPlane,
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false }),
    );
    this.set(text);
  }

  get material() {
    return this.mesh.material;
  }

  set(text: string) {
    if (text === this.text) return;
    this.text = text;
    const s = this.style;
    const pad = Math.ceil(s.size * 0.3);
    this.width = measure(text, s);
    const w = Math.ceil(this.width + pad * 2);
    const h = Math.ceil(s.size * 1.5);
    const resized = w !== this.canvas.width || h !== this.canvas.height;
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext("2d")!;
    ctx.font = fontOf(s);
    ctx.letterSpacing = `${s.spacing ?? 0}px`;
    ctx.fillStyle = s.color ?? CREAM;
    ctx.textBaseline = "middle";
    ctx.fillText(text, pad, h / 2 + s.size * 0.04);

    // Textures are allocated immutably, so a new size needs a new texture.
    const old = this.mesh.material.map;
    if (!old || resized) {
      old?.dispose();
      const tex = hudTexture(this.canvas);
      tex.colorSpace = this.colorSpace;
      this.mesh.material.map = tex;
      this.mesh.material.needsUpdate = true;
    } else {
      old.needsUpdate = true;
    }
    this.mesh.scale.set(w, h, 1);
  }
}

type Word = { text: string; accent: boolean };

function parse(src: string): Word[][] {
  let accent = false;
  return src.split("\n").map((line) => {
    const words: Word[] = [];
    for (const raw of line.split(" ")) {
      if (!raw) continue;
      const startsAccent = raw.startsWith("*");
      if (startsAccent) accent = true;
      const word = { text: raw.replaceAll("*", ""), accent };
      if (raw.endsWith("*") && (raw.length > 1 || !startsAccent)) accent = false;
      words.push(word);
    }
    return words;
  });
}

/**
 * Kinetic headline: each word rises out of a mask on its line, one after the
 * other, then leaves upward through the line above.
 */
export class Headline {
  readonly group = new THREE.Group();
  private words: { sprite: TextSprite; x: number; y: number; line: number; order: number }[] = [];
  private lineY: number[] = [];
  private planes: THREE.Plane[][] = [];

  constructor(
    src: string,
    private size: number,
    maxWidth: number,
    private align: "left" | "center" = "center",
  ) {
    const style: FontStyle = { size, weight: 800, italic: true, spacing: -size * 0.02 };
    const space = measure(" ", style);

    const lines: Word[][] = [];
    for (const line of parse(src)) {
      let current: Word[] = [];
      let width = 0;
      for (const word of line) {
        const w = measure(word.text, style);
        if (current.length && width + space + w > maxWidth) {
          lines.push(current);
          current = [];
          width = 0;
        }
        width += (current.length ? space : 0) + w;
        current.push(word);
      }
      if (current.length) lines.push(current);
    }

    const lineHeight = size * 1.08;
    let order = 0;
    lines.forEach((line, li) => {
      const y = ((lines.length - 1) / 2 - li) * lineHeight;
      this.lineY.push(y);
      const sprites = line.map(
        (w) => new TextSprite({ ...style, color: w.accent ? LIME : CREAM }, w.text),
      );
      const total = sprites.reduce((a, s) => a + s.width, 0) + space * (sprites.length - 1);
      let x = align === "center" ? -total / 2 : 0;
      for (const sprite of sprites) {
        this.words.push({ sprite, x: x + sprite.width / 2, y, line: li, order: order++ });
        x += sprite.width + space;
        this.group.add(sprite.mesh);
      }
    });
    this.planes = this.lineY.map(() => [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    ]);
    for (const w of this.words) w.sprite.material.clippingPlanes = this.planes[w.line];
  }

  get height() {
    return this.lineY.length * this.size * 1.08;
  }

  place(x: number, y: number) {
    this.group.position.set(x, y, 0);
    this.lineY.forEach((ly, i) => {
      const [bottom, top] = this.planes[i];
      bottom.constant = -(y + ly - this.size * 0.62);
      top.constant = y + ly + this.size * 0.62;
    });
  }

  /** `b` in beats; words enter from `inAt` and leave from `outAt`. */
  update(b: number, inAt: number, outAt: number) {
    const visible = b >= inAt && b < outAt + 2;
    this.group.visible = visible;
    if (!visible) return;
    for (const w of this.words) {
      const enter = easeOutCubic(prog(b, inAt + w.order * 0.28, 1.1));
      const leave = easeInCubic(prog(b, outAt - 0.9 + w.order * 0.06, 0.8));
      w.sprite.mesh.position.set(
        w.x,
        w.y - (1 - enter) * this.size * 1.15 + leave * this.size * 1.15,
        0,
      );
      w.sprite.material.opacity = clamp01(enter * 1.6) * (1 - leave);
    }
  }
}
