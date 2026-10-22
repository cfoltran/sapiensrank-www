import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { PODIUM } from "./copy";
import { LIME, TextSprite } from "./text";
import {
  SCENES,
  beatPulse,
  clamp01,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  mulberry32,
  prog,
} from "./timeline";

const AMBER = "#F0A64A";
const GOLD = "#F2B43A";

function canvas(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  return c;
}

function srgbTexture(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement) {
  const tex =
    source instanceof HTMLVideoElement
      ? new THREE.VideoTexture(source)
      : source instanceof HTMLCanvasElement
        ? new THREE.CanvasTexture(source)
        : new THREE.Texture(source);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function radialTexture(inner: string, outer: string) {
  return srgbTexture(
    canvas(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, inner);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }),
  );
}

/** A 3D label: a TextSprite scaled from pixels down to world units. */
function label(text: string, size: number, color: string, worldHeight: number, weight = 800) {
  const sprite = new TextSprite({ size, weight, color, italic: true }, text, THREE.SRGBColorSpace);
  const group = new THREE.Group();
  group.add(sprite.mesh);
  group.scale.setScalar(worldHeight / size);
  return { group, sprite };
}

export class ScoreRing {
  readonly group = new THREE.Group();
  readonly center = new THREE.Vector3(0, 3, 0);
  readonly radius = 2.6;
  readonly target = 87;
  private progress = { value: 0 };
  private head: THREE.Mesh;
  private halo: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private coins: THREE.InstancedMesh;
  private coinData: { x: number; y: number; z: number; tilt: number; roll: number; at: number }[] = [];
  private m = new THREE.Matrix4();
  private e = new THREE.Euler();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private one = new THREE.Vector3(1, 1, 1);
  value = 0;

  constructor(family: string) {
    this.group.position.copy(this.center);

    const track = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius, 0.1, 24, 160),
      new THREE.MeshStandardMaterial({ color: "#2B271F", roughness: 0.6 }),
    );
    this.group.add(track);

    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius, 0.13, 24, 200),
      new THREE.ShaderMaterial({
        uniforms: {
          uProgress: this.progress,
          uA: { value: new THREE.Color(AMBER) },
          uB: { value: new THREE.Color(LIME) },
        },
        vertexShader: `
          varying vec3 vPos;
          varying vec3 vNormal;
          void main() {
            vPos = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform float uProgress;
          uniform vec3 uA;
          uniform vec3 uB;
          varying vec3 vPos;
          varying vec3 vNormal;
          void main() {
            float f = mod((1.5707963 - atan(vPos.y, vPos.x)) / 6.2831853, 1.0);
            if (f > uProgress) discard;
            vec3 c = mix(uA, uB, smoothstep(0.45, 0.95, f));
            float light = 0.75 + 0.45 * max(normalize(vNormal).z, 0.0);
            gl_FragColor = vec4(c * light * 1.05, 1.0);
          }`,
      }),
    );
    arc.position.z = 0.02;
    this.group.add(arc);

    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(LIME).multiplyScalar(2.5) }),
    );
    this.group.add(this.head);

    this.halo = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 7.5),
      new THREE.MeshBasicMaterial({
        map: radialTexture("rgba(240,166,74,0.32)", "rgba(240,166,74,0)"),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.halo.position.z = -0.4;
    this.group.add(this.halo);

    const face = srgbTexture(
      canvas(256, 256, (ctx) => {
        const g = ctx.createRadialGradient(110, 100, 10, 128, 128, 128);
        g.addColorStop(0, "#FFE08A");
        g.addColorStop(1, "#D08A1C");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = "rgba(120,70,0,0.55)";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(128, 128, 100, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#8A5306";
        ctx.font = `italic 800 150px ${family}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("α", 128, 120);
      }),
    );
    const side = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.3 });
    const cap = new THREE.MeshStandardMaterial({ map: face, metalness: 0.55, roughness: 0.35 });

    const rnd = mulberry32(11);
    const inner = this.radius - 0.42;
    for (let y = -inner + 0.3; y < 0.15; y += 0.34) {
      const half = Math.sqrt(Math.max(0, inner * inner - y * y)) - 0.18;
      const shift = Math.round((y + inner) / 0.34) % 2 ? 0.2 : 0;
      for (let x = -half + shift; x <= half; x += 0.44) {
        this.coinData.push({
          x: x + (rnd() - 0.5) * 0.08,
          y: y + (rnd() - 0.5) * 0.06,
          z: (rnd() - 0.5) * 0.5,
          tilt: (rnd() - 0.5) * 0.45,
          roll: rnd() * Math.PI * 2,
          at: 0,
        });
      }
    }
    const span = 6.5;
    this.coinData.forEach((c, i) => (c.at = 2 + (i / this.coinData.length) * span + rnd() * 0.3));

    this.coins = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.08, 32),
      [side, cap, cap],
      this.coinData.length,
    );
    this.coins.frustumCulled = false;
    this.group.add(this.coins);
  }

  update(b: number) {
    const lb = b - SCENES.score[0];
    this.group.visible = b >= SCENES.score[0] && b < SCENES.score[1];
    if (!this.group.visible) return;

    const intro = easeOutBack(prog(lb, 0, 1.2), 1.6);
    this.group.scale.setScalar(Math.max(0.001, intro));
    this.group.rotation.y = lerp(0.22, -0.12, easeInOutCubic(prog(lb, 0, 12)));

    const p = easeInOutCubic(prog(lb, 1, 7.5)) * (this.target / 100);
    this.progress.value = p;
    this.value = Math.round(p * 100);
    const a = Math.PI / 2 - p * Math.PI * 2;
    this.head.position.set(Math.cos(a) * this.radius, Math.sin(a) * this.radius, 0.05);
    this.head.visible = p > 0.005;
    this.head.scale.setScalar(1 + 0.25 * beatPulse(lb));
    this.halo.material.opacity = 0.6 + 0.5 * p;

    this.coinData.forEach((c, i) => {
      const fall = prog(lb, c.at, 1.1);
      if (lb < c.at) {
        this.m.makeScale(0, 0, 0);
        this.coins.setMatrixAt(i, this.m);
        return;
      }
      const settle = prog(lb, c.at + 1.1, 0.6);
      const y = c.y + (1 - fall * fall) * 6 + Math.sin(settle * Math.PI) * 0.12 * (1 - settle);
      const spin = 1 - fall;
      this.e.set(Math.PI / 2 + c.tilt + spin * 5, spin * 3, c.roll + spin * 7);
      this.q.setFromEuler(this.e);
      this.v.set(c.x, y, c.z);
      this.m.compose(this.v, this.q, this.one);
      this.coins.setMatrixAt(i, this.m);
    });
    this.coins.instanceMatrix.needsUpdate = true;
  }
}

export class Podium {
  readonly group = new THREE.Group();
  private pillars: { mesh: THREE.Group; height: number; at: number }[] = [];
  private avatars: { group: THREE.Group; at: number; baseY: number }[] = [];
  private confetti: THREE.Points;
  private confettiData: { v: THREE.Vector3; spin: number }[] = [];
  private confettiOrigin = new THREE.Vector3();
  private facing = new THREE.Quaternion();

  constructor(family: string) {
    // Second, first, third, left to right, like the World tab.
    const slots = [
      { rank: 2, x: -2, height: 2.1, at: 0.5, top: "#CFCBC2" },
      { rank: 1, x: 0, height: 3, at: 2, top: LIME },
      { rank: 3, x: 2, height: 1.5, at: 1, top: AMBER },
    ];
    const body = new THREE.MeshStandardMaterial({ color: "#2A261E", roughness: 0.45, metalness: 0.2 });

    for (const slot of slots) {
      const pillar = new THREE.Group();
      const box = new THREE.Mesh(new RoundedBoxGeometry(1.7, slot.height, 1.7, 3, 0.08), body);
      box.position.y = slot.height / 2;
      pillar.add(box);

      const topColor = new THREE.Color(slot.top);
      const cap = new THREE.Mesh(
        new RoundedBoxGeometry(1.74, 0.08, 1.74, 2, 0.03),
        new THREE.MeshStandardMaterial({
          color: topColor,
          emissive: topColor,
          emissiveIntensity: slot.rank === 1 ? 0.9 : 0.15,
        }),
      );
      cap.position.y = slot.height;
      pillar.add(cap);

      const rank = label(`#${slot.rank}`, 120, slot.top, 0.62);
      rank.group.position.set(0, slot.height - 0.55, 0.86);
      pillar.add(rank.group);

      pillar.position.x = slot.x;
      this.group.add(pillar);
      this.pillars.push({ mesh: pillar, height: slot.height, at: slot.at });

      const player = PODIUM[slot.rank - 1];
      const avatar = new THREE.Group();
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.55, 48),
        new THREE.MeshBasicMaterial({
          map: srgbTexture(
            canvas(256, 256, (ctx) => {
              const g = ctx.createLinearGradient(0, 0, 256, 256);
              g.addColorStop(0, player.color);
              g.addColorStop(1, `${player.color}AA`);
              ctx.fillStyle = g;
              ctx.fillRect(0, 0, 256, 256);
              ctx.fillStyle = "#15130F";
              ctx.font = `800 96px ${family}`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(player.initials, 128, 136);
            }),
          ),
        }),
      );
      avatar.add(disc);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.58, 0.64, 48),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(slot.top).multiplyScalar(slot.rank === 1 ? 2 : 1) }),
      );
      avatar.add(ring);
      const name = label(player.name, 90, "#F5F1E8", 0.34);
      name.group.position.y = -0.92;
      avatar.add(name.group);
      const score = label(player.score.toString(), 80, "rgba(245,241,232,0.6)", 0.26, 700);
      score.group.position.y = -1.26;
      avatar.add(score.group);

      const baseY = slot.height + 1.75;
      avatar.position.set(slot.x, baseY, 0.3);
      this.group.add(avatar);
      this.avatars.push({ group: avatar, at: slot.at + 0.8, baseY });
    }

    const rnd = mulberry32(5);
    const count = 260;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [LIME, AMBER, "#F5F1E8", "#7CB6FF"].map((c) => new THREE.Color(c).multiplyScalar(1.6));
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2;
      const up = 4 + rnd() * 5;
      const out = 1 + rnd() * 3;
      this.confettiData.push({
        v: new THREE.Vector3(Math.cos(a) * out, up, Math.sin(a) * out * 0.6),
        spin: rnd(),
      });
      palette[i % palette.length].toArray(colors, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.confetti = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.11,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
      }),
    );
    this.confetti.frustumCulled = false;
    this.confettiOrigin.set(0, 3.2, 0.3);
    this.group.add(this.confetti);
  }

  update(b: number, camera: THREE.Camera) {
    const lb = b - SCENES.podium[0];
    this.group.visible = b >= SCENES.podium[0] && b < SCENES.podium[1];
    if (!this.group.visible) return;
    this.group.rotation.y = lerp(0.18, -0.12, prog(lb, 0, 8));
    this.group.updateMatrixWorld();
    this.group.getWorldQuaternion(this.facing).invert().multiply(camera.quaternion);

    for (const p of this.pillars) {
      const e = easeOutBack(prog(lb, p.at, 1.2), 1.3);
      p.mesh.position.y = (e - 1) * (p.height + 0.6);
    }
    for (const a of this.avatars) {
      const e = easeOutBack(prog(lb, a.at, 0.9), 2.2);
      a.group.visible = lb >= a.at;
      a.group.scale.setScalar(Math.max(0.001, e));
      a.group.position.y = a.baseY + (1 - clamp01(e)) * 1.5 + Math.sin(lb * 1.2 + a.at) * 0.05;
      a.group.quaternion.copy(this.facing);
    }

    const burst = lb - 3;
    this.confetti.visible = burst > 0;
    if (burst > 0) {
      const s = burst * 0.5;
      const pos = this.confetti.geometry.getAttribute("position") as THREE.BufferAttribute;
      this.confettiData.forEach((c, i) => {
        const drag = 1 - Math.exp(-s * 2.2);
        pos.setXYZ(
          i,
          this.confettiOrigin.x + (c.v.x * drag) / 2.2,
          this.confettiOrigin.y + (c.v.y * drag) / 2.2 - 2.4 * s * s * 0.5 + Math.sin(s * 9 + c.spin * 6) * 0.05,
          this.confettiOrigin.z + (c.v.z * drag) / 2.2,
        );
      });
      pos.needsUpdate = true;
      (this.confetti.material as THREE.PointsMaterial).opacity = 1 - prog(burst, 3, 2);
    }
  }
}

const SCREEN_CROP = { x: 84, y: 242, w: 492, h: 1090 };

/** The store screenshots, cropped down to the phone's screen. */
export function screenTexture(img: HTMLImageElement) {
  const sx = img.width / 660;
  return srgbTexture(
    canvas(SCREEN_CROP.w, SCREEN_CROP.h, (ctx) =>
      ctx.drawImage(
        img,
        SCREEN_CROP.x * sx,
        SCREEN_CROP.y * sx,
        SCREEN_CROP.w * sx,
        SCREEN_CROP.h * sx,
        0,
        0,
        SCREEN_CROP.w,
        SCREEN_CROP.h,
      ),
    ),
  );
}

export function videoTexture(source: HTMLVideoElement | HTMLImageElement) {
  return srgbTexture(source);
}

export class Phones {
  readonly group = new THREE.Group();
  private phones: { group: THREE.Group; x: number; z: number; ry: number; at: number }[] = [];

  constructor(screens: THREE.Texture[], portrait: boolean) {
    const w = 2;
    const h = 4.3;
    const body = new THREE.MeshStandardMaterial({ color: "#3A3F5C", metalness: 0.75, roughness: 0.28 });
    const mask = srgbTexture(
      canvas(200, 430, (ctx) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 200, 430);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(1, 1, 198, 428, 24);
        ctx.fill();
      }),
    );
    mask.colorSpace = THREE.NoColorSpace;
    const screenGeo = new THREE.PlaneGeometry(w * 0.93, h * 0.955);
    const bodyGeo = new RoundedBoxGeometry(w, h, 0.18, 6, 0.26);
    const n = screens.length;

    screens.forEach((map, i) => {
      const k = i - (n - 1) / 2;
      const phone = new THREE.Group();
      phone.add(new THREE.Mesh(bodyGeo, body));
      const screen = new THREE.Mesh(
        screenGeo,
        new THREE.MeshBasicMaterial({ map, alphaMap: mask, transparent: true }),
      );
      screen.position.z = 0.092;
      phone.add(screen);
      this.group.add(phone);
      this.phones.push({
        group: phone,
        x: k * 2.55,
        z: -(Math.abs(k) ** 1.4) * 0.9,
        ry: -k * 0.22,
        at: 0.2 + Math.abs(k) * 0.4,
      });
    });
    this.group.position.y = 3;
    if (portrait) this.group.scale.setScalar(0.78);
  }

  update(b: number) {
    const lb = b - SCENES.phones[0];
    this.group.visible = b >= SCENES.phones[0] && b < SCENES.phones[1];
    if (!this.group.visible) return;
    this.group.rotation.y = Math.sin(lb * 0.35) * 0.08;
    for (const p of this.phones) {
      const e = easeOutCubic(prog(lb, p.at, 1.6));
      const pop = easeOutBack(prog(lb, p.at, 1.6), 1.2);
      p.group.position.set(p.x, (1 - pop) * -7 + Math.sin(lb * 0.9 + p.at * 4) * 0.08, p.z);
      p.group.rotation.set((1 - e) * 0.9, p.ry + (1 - e) * 1.6, (1 - e) * -0.3);
    }
  }
}
