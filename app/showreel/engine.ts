import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { COPY, type Copy, type Lang } from "./copy";
import { Phones, Podium, ScoreRing, radialTexture, screenTexture, videoTexture } from "./props";
import {
  CREAM,
  Headline,
  LIME,
  MUTED,
  TextSprite,
  hudColor,
  hudTexture,
  setFontFamily,
} from "./text";
import {
  CUTS,
  SCENES,
  TOTAL_BEATS,
  beatPulse,
  clamp01,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  mulberry32,
  prog,
  sceneAt,
} from "./timeline";
import { HexWorld, LIME_SEED, TRAIL_STEP } from "./world";

export const FORMATS = {
  landscape: { w: 1920, h: 1080, label: "16:9" },
  portrait: { w: 1080, h: 1920, label: "9:16" },
  square: { w: 1080, h: 1080, label: "1:1" },
} as const;

export type Format = keyof typeof FORMATS;

const BG = "#0A0907";
const STEPS_GOAL = 12480;

export type Assets = {
  family: string;
  screens: HTMLImageElement[];
  /** Null when the browser can't decode the tour; its poster stands in. */
  video: HTMLVideoElement | null;
  poster: HTMLImageElement;
  icon: HTMLImageElement;
  appStore: HTMLImageElement;
  googlePlay: HTMLImageElement;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

export async function loadAssets(lang: Lang): Promise<Assets> {
  const family = getComputedStyle(document.body).fontFamily;
  setFontFamily(family);
  // Only the first family: next/font's local fallback face fails to load where
  // Arial isn't installed, which would reject the whole list.
  const primary = family.split(",")[0];
  await Promise.all(
    ["italic 800", "800", "700", "600"].map((w) =>
      document.fonts.load(`${w} 64px ${primary}`).catch(() => []),
    ),
  );

  const video = document.createElement("video");
  video.src = `/videos/tour-${lang}.mp4`;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  const videoReady = new Promise<boolean>((resolve) => {
    video.addEventListener("loadeddata", () => resolve(true), { once: true });
    video.addEventListener("error", () => resolve(false), { once: true });
  });
  video.load();

  // Far left to far right; the tour video plays on the middle phone.
  const [screens, icon, appStore, googlePlay, poster, playable] = await Promise.all([
    Promise.all([2, 1, 4, 3].map((n) => loadImage(`/${n}${lang}.webp`))),
    loadImage("/AppIcon.png"),
    loadImage("/app-store.svg"),
    loadImage("/googleplay.png"),
    loadImage(`/videos/tour-${lang}.jpg`),
    videoReady,
  ]);
  return { family, screens, video: playable ? video : null, poster, icon, appStore, googlePlay };
}

function imageSprite(img: HTMLImageElement, height: number, radius = 0) {
  const width = Math.round((img.naturalWidth / img.naturalHeight) * height);
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  if (radius) {
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, radius);
    ctx.clip();
  }
  ctx.drawImage(img, 0, 0, width, height);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: hudTexture(c), transparent: true, depthWrite: false }),
  );
  return mesh;
}

function gradientSprite(w: number, h: number, horizontal: boolean) {
  const c = document.createElement("canvas");
  c.width = horizontal ? 256 : 4;
  c.height = horizontal ? 4 : 256;
  const ctx = c.getContext("2d")!;
  const g = horizontal ? ctx.createLinearGradient(0, 0, 256, 0) : ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "rgba(6,5,4,0.78)");
  g.addColorStop(0.55, "rgba(6,5,4,0.4)");
  g.addColorStop(1, "rgba(6,5,4,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: hudTexture(c), transparent: true, depthWrite: false }),
  );
}

const FinalShader = {
  uniforms: {
    tDiffuse: { value: null },
    tHud: { value: null },
    uRes: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uFlash: { value: 0 },
    uFade: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tHud;
    uniform vec2 uRes;
    uniform float uTime;
    uniform float uFlash;
    uniform float uFade;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 d = vUv - 0.5;
      float ca = 0.0012 + uFlash * 0.008;
      vec3 col = vec3(
        texture2D(tDiffuse, vUv + d * ca).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv - d * ca).b
      );
      vec2 a = d * vec2(uRes.x / uRes.y, 1.0);
      float r = length(a) / length(vec2(uRes.x / uRes.y, 1.0) * 0.5);
      col *= 1.0 - smoothstep(0.45, 1.15, r) * 0.6;
      vec4 hud = texture2D(tHud, vUv);
      col = col * (1.0 - hud.a) + hud.rgb;
      col += vec3(0.85, 1.0, 0.55) * uFlash;
      col += (hash(vUv * uRes + fract(uTime * 7.31) * 100.0) - 0.5) * 0.04;
      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

type Layout = "side" | "stack";

export class ShowreelEngine {
  readonly W: number;
  readonly H: number;
  bpm: number;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private final: ShaderPass;
  private hudTarget: THREE.WebGLRenderTarget;
  private scene = new THREE.Scene();
  private hud = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private hudCamera: THREE.OrthographicCamera;
  private layout: Layout;
  private distance: number;
  private copy: Copy;
  private world = new HexWorld();
  private ring: ScoreRing;
  private podium: Podium;
  private phones: Phones;
  private dust: THREE.Points;
  private dustSeeds: Float32Array;
  private spot = new THREE.PointLight(LIME, 0, 16, 1.4);
  private video: HTMLVideoElement | null;
  private target = new THREE.Vector3();
  private v = new THREE.Vector3();
  private headlines: { h: Headline; inAt: number; outAt: number }[] = [];
  private scrim!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private eyebrow!: TextSprite;
  private eyebrowY = 0;
  private counter!: TextSprite;
  private counterLabel!: TextSprite;
  private barTrack!: THREE.Mesh;
  private barFill!: THREE.Mesh;
  private scoreNumber!: TextSprite;
  private scoreEyebrow!: TextSprite;
  private harvest!: TextSprite;
  private guildTag!: TextSprite;
  private outro: { mesh: THREE.Object3D; at: number; y: number; pop: boolean; material: THREE.Material }[] = [];
  private tagline!: Headline;
  private lang: Lang;

  constructor(canvas: HTMLCanvasElement, format: Format, lang: Lang, assets: Assets, bpm: number) {
    const { w: W, h: H } = FORMATS[format];
    this.W = W;
    this.H = H;
    this.bpm = bpm;
    this.lang = lang;
    this.copy = COPY[lang];
    this.layout = W > H * 1.2 ? "side" : "stack";
    this.distance = format === "square" ? 1.18 : 1;
    this.video = assets.video;

    this.renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(W, H, false);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.localClippingEnabled = true;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;
    this.scene.background = new THREE.Color(BG);
    this.scene.fog = new THREE.FogExp2(BG, 0.026);

    const fov = format === "portrait" ? 58 : format === "square" ? 46 : 38;
    this.camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 200);
    this.hudCamera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -10, 10);

    this.scene.add(new THREE.HemisphereLight("#FFF1D6", "#0A0907", 0.9));
    const key = new THREE.DirectionalLight("#FFFFFF", 2.2);
    key.position.set(10, 18, 8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight("#7CB6FF", 0.7);
    rim.position.set(-12, 6, -10);
    this.scene.add(rim);
    this.scene.add(this.spot);

    this.scene.add(this.world.mesh);
    this.ring = new ScoreRing(assets.family);
    this.scene.add(this.ring.group);
    this.podium = new Podium(assets.family);
    this.scene.add(this.podium.group);
    const screens = assets.screens.map(screenTexture);
    const tour = videoTexture(assets.video ?? assets.poster);
    tour.repeat.x = 0.983;
    tour.offset.x = 0.0085;
    screens.splice(2, 0, tour);
    this.phones = new Phones(screens, format === "portrait");
    this.scene.add(this.phones.group);

    const rnd = mulberry32(3);
    const count = 700;
    this.dustSeeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) this.dustSeeds[i] = rnd();
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    this.dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        size: 0.09,
        map: radialTexture("rgba(255,250,225,1)", "rgba(255,250,225,0)"),
        color: "#E8E2C8",
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);

    this.hudTarget = new THREE.WebGLRenderTarget(W, H, { samples: 4 });
    const sceneTarget = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(this.renderer, sceneTarget);
    this.composer.setPixelRatio(1);
    this.composer.setSize(W, H);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.65, 0.55, 0.85));
    this.composer.addPass(new OutputPass());
    this.final = new ShaderPass(FinalShader);
    this.final.uniforms.tHud.value = this.hudTarget.texture;
    this.final.uniforms.uRes.value.set(W, H);
    this.composer.addPass(this.final);

    this.buildHud(assets);
  }

  get duration() {
    return (TOTAL_BEATS * 60) / this.bpm;
  }

  private buildHud(assets: Assets) {
    const { W, H } = this;
    const m = Math.min(W, H);
    const side = this.layout === "side";
    const size = side ? 0.085 * H : this.W === this.H ? 0.07 * m : 0.08 * m;
    const maxWidth = side ? 0.42 * W : 0.86 * W;

    this.scrim = side ? gradientSprite(W * 0.62, H, true) : gradientSprite(W, H * 0.5, false);
    if (side) this.scrim.position.x = -W / 2 + (W * 0.62) / 2;
    else this.scrim.position.y = H / 2 - H * 0.25;
    this.hud.add(this.scrim);

    const add = (src: string, inAt: number, outAt: number, mode: "auto" | "center" | "top") => {
      const leftAligned = mode === "auto" && side;
      const h = new Headline(src, mode === "center" ? size * 1.1 : size, maxWidth * (mode === "auto" ? 1 : 2), leftAligned ? "left" : "center");
      if (mode === "center") h.place(0, -size * 0.2);
      else if (leftAligned) h.place(-W / 2 + 0.07 * W, size * 0.4);
      else h.place(0, H / 2 - Math.max(0.07 * H, 0.09 * m) - h.height / 2);
      this.hud.add(h.group);
      this.headlines.push({ h, inAt, outAt });
    };
    add(this.copy.intro, 2.5, SCENES.intro[1] - 0.2, "center");
    add(this.copy.move, SCENES.move[0] + 0.6, SCENES.move[1] - 0.2, "auto");
    add(this.copy.score, SCENES.score[0] + 0.6, SCENES.score[1] - 0.2, "auto");
    add(this.copy.map, SCENES.map[0] + 0.6, SCENES.map[1] - 0.2, "auto");
    add(this.copy.podium, SCENES.podium[0] + 0.6, SCENES.podium[1] - 0.2, "auto");
    add(this.copy.phones, SCENES.phones[0] + 0.6, SCENES.phones[1] - 0.2, "top");

    this.eyebrow = new TextSprite({ size: 0.028 * m, weight: 700, color: LIME, spacing: 0.012 * m }, this.copy.eyebrow);
    this.eyebrowY = size * 1.1 + 0.05 * m;
    this.hud.add(this.eyebrow.mesh);

    this.counter = new TextSprite({ size: 0.12 * m, weight: 800, italic: true, color: LIME }, "0");
    this.counterLabel = new TextSprite({ size: 0.034 * m, weight: 700, color: MUTED, spacing: 0.004 * m }, this.copy.steps.toUpperCase());
    this.barTrack = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: hudColor("#2B271F"), transparent: true }),
    );
    this.barFill = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: hudColor(LIME), transparent: true }),
    );
    this.barFill.geometry.translate(0.5, 0, 0);
    this.hud.add(this.counter.mesh, this.counterLabel.mesh, this.barTrack, this.barFill);

    this.scoreNumber = new TextSprite({ size: 0.17 * m, weight: 800, color: CREAM }, "0");
    this.scoreEyebrow = new TextSprite(
      { size: 0.022 * m, weight: 700, color: MUTED, spacing: 0.008 * m },
      this.copy.scoreEyebrow,
    );
    this.harvest = new TextSprite(
      { size: 0.036 * m, weight: 800, italic: true, color: "#15130F" },
      `${this.copy.harvest} +${this.ring.target} α`,
    );
    this.harvest.mesh.material.map = this.pillTexture(this.harvest, "#F0A64A");
    this.guildTag = new TextSprite({ size: 0.042 * m, weight: 800, italic: true, color: "#15130F" }, this.lang === "fr" ? "TA GUILDE" : "YOUR GUILD");
    this.guildTag.mesh.material.map = this.pillTexture(this.guildTag, LIME);
    this.hud.add(this.scoreNumber.mesh, this.scoreEyebrow.mesh, this.harvest.mesh, this.guildTag.mesh);

    const ob = SCENES.outro[0];
    const icon = imageSprite(assets.icon, Math.round(0.17 * m), Math.round(0.17 * m * 0.23));
    const wordmark = new TextSprite({ size: 0.08 * m, weight: 800, italic: true, color: CREAM, spacing: 0.004 * m }, "SAPIENS RANK");
    const free = new TextSprite({ size: 0.028 * m, weight: 600, color: MUTED }, this.copy.free);
    const badgeH = Math.round(0.062 * m);
    const appStore = imageSprite(assets.appStore, badgeH);
    const googlePlay = imageSprite(assets.googlePlay, Math.round(badgeH * 1.0));
    const gap = 0.02 * m;
    const aw = (appStore.geometry as THREE.PlaneGeometry).parameters.width;
    const gw = (googlePlay.geometry as THREE.PlaneGeometry).parameters.width;
    appStore.position.x = -(aw + gw + gap) / 2 + aw / 2;
    googlePlay.position.x = (aw + gw + gap) / 2 - gw / 2;
    const badges = new THREE.Group();
    badges.add(appStore, googlePlay);

    this.tagline = new Headline(this.copy.tagline, 0.042 * m, 0.86 * W);
    this.tagline.place(0, -0.15 * m);
    this.hud.add(this.tagline.group);

    const items: [THREE.Object3D, THREE.Material[], number, number][] = [
      [icon, [icon.material as THREE.Material], 1, 0.21 * m],
      [wordmark.mesh, [wordmark.material], 1.8, 0.02 * m],
      [free.mesh, [free.material], 5.5, -0.285 * m],
      [badges, [appStore.material as THREE.Material, googlePlay.material as THREE.Material], 6, -0.38 * m],
    ];
    for (const [mesh, materials, at, y] of items) {
      mesh.position.y = y;
      this.hud.add(mesh);
      for (const material of materials) this.outro.push({ mesh, at: ob + at, y, pop: mesh === icon, material });
    }
  }

  /** Repaints a TextSprite's canvas with a rounded pill behind its text. */
  private pillTexture(sprite: TextSprite, color: string) {
    const src = sprite.material.map!.image as HTMLCanvasElement;
    const c = document.createElement("canvas");
    c.width = src.width;
    c.height = src.height;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(src.height * 0.12, src.height * 0.12, src.width - src.height * 0.24, src.height * 0.76, src.height * 0.38);
    ctx.fill();
    ctx.drawImage(src, 0, 0);
    sprite.material.map!.dispose();
    return hudTexture(c);
  }

  private project(p: THREE.Vector3) {
    this.v.copy(p).project(this.camera);
    return { x: (this.v.x * this.W) / 2, y: (this.v.y * this.H) / 2 };
  }

  private orbit(target: THREE.Vector3, azimuth: number, elevation: number, dist: number) {
    const d = dist * this.distance;
    return new THREE.Vector3(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * d,
      target.y + Math.sin(elevation) * d,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * d,
    );
  }

  private updateCamera(b: number) {
    const side = this.layout === "side";
    let pos: THREE.Vector3;
    let shiftX = 0;
    let shiftY = 0;
    const scene = sceneAt(b);
    if (scene === "intro") {
      const p = easeInOutCubic(prog(b, 0, 8.5));
      this.target.set(0, 0, 0);
      pos = this.orbit(this.target, lerp(-0.9, -0.1, p), lerp(1.45, 0.78, p), lerp(5, 21, p));
    } else if (scene === "move") {
      const lb = b - SCENES.move[0];
      const n = this.world.trail.length;
      const k = clamp01((b - SCENES.move[0] - 1) / ((n - 1) * TRAIL_STEP + 1));
      this.target.copy(this.world.trailCurve.getPoint(easeInOutCubic(k)));
      pos = this.orbit(this.target, lerp(-1.0, -0.15, prog(lb, 0, 12)), 0.62, 11);
      if (side) shiftX = -3.2;
      else shiftY = -0.4;
    } else if (scene === "score") {
      const lb = b - SCENES.score[0];
      this.target.copy(this.ring.center);
      pos = this.orbit(this.target, 0, 0.06, lerp(12, 10.2, easeOutCubic(prog(lb, 0, 12))));
      if (side) shiftX = -3.1;
      else shiftY = this.distance > 1 ? 1.2 : 0.7;
    } else if (scene === "map") {
      const lb = b - SCENES.map[0];
      const p = easeInOutCubic(prog(lb, 0, 16));
      this.target.set(0, 0, 0).lerp(LIME_SEED, easeInOutCubic(prog(lb, 1, 6)));
      pos = this.orbit(this.target, lerp(-0.55, 0.45, prog(lb, 0, 16)), lerp(1.0, 0.82, p), lerp(32, 20, p));
      if (side) shiftX = -5;
      else shiftY = 2.4;
    } else if (scene === "podium") {
      const lb = b - SCENES.podium[0];
      this.target.set(0, 2.6, 0);
      pos = this.orbit(this.target, lerp(-0.2, 0.18, prog(lb, 0, 8)), 0.12, 12);
      if (side) shiftX = -3;
      else shiftY = 1.1;
    } else if (scene === "phones") {
      const lb = b - SCENES.phones[0];
      this.target.set(0, 3, 0);
      pos = this.orbit(this.target, lerp(-0.18, 0.18, prog(lb, 0, 8)), 0.08, 10.5);
      shiftY = side ? 1.1 : 1.5;
    } else {
      const lb = b - SCENES.outro[0];
      const p = easeInOutCubic(prog(lb, 0, 12));
      this.target.set(0, 0, 0);
      pos = this.orbit(this.target, lerp(0.5, 0, p), lerp(0.95, 1.4, p), lerp(18, 26, p));
    }

    this.camera.position.copy(pos);
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
    const shift = right.multiplyScalar(shiftX).add(up.multiplyScalar(shiftY));
    this.camera.position.add(shift);
    this.camera.updateMatrixWorld();
  }

  private updateDust(b: number) {
    const pos = this.dust.geometry.getAttribute("position") as THREE.BufferAttribute;
    const s = this.dustSeeds;
    for (let i = 0; i < pos.count; i++) {
      const y = (s[i * 4 + 1] * 14 + b * 0.06 * (0.5 + s[i * 4 + 3])) % 14;
      pos.setXYZ(
        i,
        (s[i * 4] - 0.5) * 60 + Math.sin(b * 0.2 + s[i * 4 + 3] * 6) * 0.4,
        y - 1,
        (s[i * 4 + 2] - 0.5) * 60,
      );
    }
    pos.needsUpdate = true;
  }

  private updateLight(b: number) {
    const scene = sceneAt(b);
    if (scene === "move") {
      this.spot.position.copy(this.target).add(this.v.set(0, 2.2, 0));
      this.spot.intensity = 5 + 4 * beatPulse(b);
    } else if (scene === "map") {
      this.spot.position.copy(LIME_SEED).add(this.v.set(0, 3, 0));
      this.spot.intensity = 3 + 3 * beatPulse(b, 3) * prog(b, SCENES.map[0] + 4, 1);
    } else if (scene === "intro") {
      this.spot.position.set(0, 1.6, 0);
      this.spot.intensity = 3 + 3 * beatPulse(b);
    } else {
      this.spot.intensity = 0;
    }
  }

  private updateHud(b: number) {
    const { W, H } = this;
    const m = Math.min(W, H);
    const side = this.layout === "side";
    const scene = sceneAt(b);

    for (const { h, inAt, outAt } of this.headlines) h.update(b, inAt, outAt);
    this.scrim.visible = scene !== "intro" && scene !== "outro";

    const eb = easeOutCubic(prog(b, 1, 1.5)) * (1 - prog(b, SCENES.intro[1] - 1, 0.8));
    this.eyebrow.mesh.visible = scene === "intro";
    this.eyebrow.material.opacity = eb;
    this.eyebrow.mesh.position.y = this.eyebrowY - (1 - eb) * 20;

    const moveOn = scene === "move";
    const cb = b - SCENES.move[0];
    const enter = easeOutCubic(prog(cb, 1.2, 1.2)) * (1 - prog(cb, 11, 0.8));
    const steps = Math.round(STEPS_GOAL * easeOutCubic(this.world.stepsAt(b)));
    this.counter.set(steps.toLocaleString(this.lang === "fr" ? "fr-FR" : "en-US").replace(/\s/g, " "));
    const barW = side ? 0.3 * W : 0.6 * W;
    const x0 = side ? -W / 2 + 0.07 * W : -barW / 2;
    const yc = -H / 2 + (side ? 0.2 : 0.14) * H;
    const align = (s: TextSprite) => (side ? x0 + s.width / 2 : 0);
    for (const o of [this.counter.mesh, this.counterLabel.mesh, this.barTrack, this.barFill]) o.visible = moveOn;
    this.counter.mesh.position.set(align(this.counter), yc + (1 - enter) * -30, 0);
    this.counter.material.opacity = enter;
    this.counterLabel.mesh.position.set(align(this.counterLabel), yc + 0.095 * m, 0);
    this.counterLabel.material.opacity = enter;
    const barY = yc - 0.085 * m;
    const barH = 0.012 * m;
    this.barTrack.position.set(x0 + barW / 2, barY, 0);
    this.barTrack.scale.set(barW, barH, 1);
    (this.barTrack.material as THREE.MeshBasicMaterial).opacity = enter;
    this.barFill.position.set(x0, barY, 0);
    this.barFill.scale.set(Math.max(1, barW * Math.min(1, steps / 10000)), barH, 1);
    (this.barFill.material as THREE.MeshBasicMaterial).opacity = enter;

    const scoreOn = scene === "score";
    const sb = b - SCENES.score[0];
    for (const o of [this.scoreNumber.mesh, this.scoreEyebrow.mesh, this.harvest.mesh]) o.visible = scoreOn;
    if (scoreOn) {
      const c = this.project(this.ring.center);
      const radiusPx = this.project(this.v.copy(this.ring.center).setY(this.ring.center.y + this.ring.radius)).y - c.y;
      const s = easeOutBack(prog(sb, 0.6, 1.2), 1.6);
      this.scoreNumber.set(this.ring.value.toString());
      this.scoreNumber.mesh.position.set(c.x, c.y + radiusPx * 0.32, 0);
      this.scoreNumber.material.opacity = clamp01(s);
      this.scoreEyebrow.mesh.position.set(c.x, c.y + radiusPx * 0.72, 0);
      this.scoreEyebrow.material.opacity = clamp01(s);
      const hp = easeOutBack(prog(sb, 9, 0.8), 2.5);
      this.harvest.mesh.visible = sb >= 9;
      this.harvest.mesh.position.set(c.x, c.y - radiusPx * 1.25, 0);
      this.harvest.material.opacity = clamp01(hp * 2);
      this.harvest.mesh.position.y += (1 - hp) * -30;
    }

    const mb = b - SCENES.map[0];
    this.guildTag.mesh.visible = scene === "map" && mb >= 2.5;
    if (this.guildTag.mesh.visible) {
      const p = this.project(this.v.copy(LIME_SEED).setY(1.6));
      const e = easeOutBack(prog(mb, 2.5, 0.8), 2);
      this.guildTag.mesh.position.set(p.x, p.y + (1 - e) * -20, 0);
      this.guildTag.material.opacity = clamp01(e * 2) * (1 - prog(mb, 15, 0.8));
    }

    const outroOn = scene === "outro";
    for (const o of this.outro) {
      o.mesh.visible = outroOn && b >= o.at;
      const e = easeOutBack(prog(b, o.at, 1), 1.8);
      o.mesh.position.y = o.y + (1 - clamp01(e)) * -40;
      if (o.pop) o.mesh.scale.setScalar(Math.max(0.001, e));
      (o.material as THREE.MeshBasicMaterial).opacity = clamp01(e * 1.5);
    }
    this.tagline.update(b, SCENES.outro[0] + 3, Infinity);
  }

  /** Puts the tour video at the frame the timeline expects, for offline export. */
  async seekVideo(seconds: number) {
    const video = this.video;
    const b = (seconds * this.bpm) / 60;
    if (!video || sceneAt(b) !== "phones" || !video.duration) return;
    const t = (((b - SCENES.phones[0]) * 60) / this.bpm + 2) % video.duration;
    if (Math.abs(video.currentTime - t) < 0.001) return;
    await new Promise<void>((resolve) => {
      video.addEventListener("seeked", () => resolve(), { once: true });
      video.currentTime = t;
    });
  }

  /** Keeps the tour video roughly in step during live playback. */
  syncVideo(seconds: number, playing: boolean) {
    if (!this.video) return;
    const b = (seconds * this.bpm) / 60;
    const on = sceneAt(b) === "phones";
    if (on && playing) {
      if (this.video.paused) {
        this.video.currentTime = (((b - SCENES.phones[0]) * 60) / this.bpm + 2) % (this.video.duration || 1);
        void this.video.play().catch(() => {});
      }
    } else if (!this.video.paused) this.video.pause();
  }

  render(seconds: number) {
    const b = (seconds * this.bpm) / 60;
    this.updateCamera(b);
    this.world.update(b);
    this.ring.update(b);
    this.podium.update(b, this.camera);
    this.phones.update(b);
    this.updateDust(b);
    this.updateLight(b);
    this.updateHud(b);

    let flash = 0;
    for (const c of CUTS) if (b >= c) flash = 0.4 * Math.exp(-(b - c) * 5);
    this.final.uniforms.uFlash.value = flash;
    this.final.uniforms.uTime.value = b;
    this.final.uniforms.uFade.value = Math.max(1 - prog(b, 0, 1.5), prog(b, TOTAL_BEATS - 2, 2));

    this.renderer.setRenderTarget(this.hudTarget);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    this.renderer.render(this.hud, this.hudCamera);
    this.renderer.setRenderTarget(null);
    this.composer.render();
  }

  dispose() {
    this.video?.pause();
    this.composer.dispose();
    this.hudTarget.dispose();
    this.renderer.dispose();
  }
}
