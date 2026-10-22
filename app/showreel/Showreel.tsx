"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "./copy";
import { FORMATS, ShowreelEngine, loadAssets, type Format } from "./engine";
import { FPS, canExportMp4, decodeMusic, exportMp4 } from "./exporter";
import { DEFAULT_BPM, SCENES, TOTAL_BEATS } from "./timeline";

const button =
  "rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-lime-300/60 disabled:opacity-40";

function readParams() {
  const q = new URLSearchParams(window.location.search);
  const format = q.get("format");
  const bpm = Number(q.get("bpm"));
  const t = Number(q.get("t"));
  return {
    format: (format && format in FORMATS ? format : "landscape") as Format,
    lang: (q.get("lang") === "en" ? "en" : "fr") as Lang,
    bpm: bpm >= 60 && bpm <= 200 ? bpm : DEFAULT_BPM,
    clean: q.has("clean"),
    still: q.has("t") && t >= 0 ? t : null,
  };
}

export default function Showreel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ShowreelEngine | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const exportingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const [initial] = useState(readParams);
  const timeRef = useRef(initial.still ?? 0);
  const playingRef = useRef(initial.still === null);
  const [ready, setReady] = useState(false);
  const [format, setFormat] = useState<Format>(initial.format);
  const [lang, setLang] = useState<Lang>(initial.lang);
  const [bpm, setBpm] = useState(initial.bpm);
  const [ui, setUi] = useState(!initial.clean);
  const [playing, setPlaying] = useState(initial.still === null);
  const [time, setTime] = useState(initial.still ?? 0);
  const [music, setMusic] = useState<{ name: string; buffer: AudioBuffer } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const duration = (TOTAL_BEATS * 60) / bpm;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    setReady(false);
    loadAssets(lang)
      .then((assets) => {
        if (disposed) return;
        engineRef.current = new ShowreelEngine(canvas, format, lang, assets, bpm);
        setReady(true);
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      disposed = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // The BPM is pushed to the live engine below; it must not rebuild the scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, lang]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.bpm = bpm;
  }, [bpm, ready]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastUi = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const engine = engineRef.current;
      const dt = (now - last) / 1000;
      last = now;
      if (!engine || exportingRef.current) return;
      const audio = audioRef.current;
      if (playingRef.current) {
        timeRef.current = audio && !audio.paused ? audio.currentTime : timeRef.current + dt;
        if (timeRef.current >= engine.duration) {
          timeRef.current = 0;
          if (audio) audio.currentTime = 0;
        }
      }
      engine.syncVideo(timeRef.current, playingRef.current);
      engine.render(timeRef.current);
      if (now - lastUi > 100) {
        lastUi = now;
        setTime(timeRef.current);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const play = useCallback((on: boolean) => {
    playingRef.current = on;
    setPlaying(on);
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.currentTime = timeRef.current;
      void audio.play().catch(() => {});
    } else audio.pause();
  }, []);

  const seek = useCallback((t: number) => {
    timeRef.current = t;
    setTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === " ") {
        e.preventDefault();
        play(!playingRef.current);
      } else if (e.key === "h" || e.key === "H") setUi((v) => !v);
      else if (e.key === "Home") seek(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play, seek]);

  const onMusic = async (file: File | undefined) => {
    if (!file) return;
    audioRef.current?.pause();
    const audio = new Audio(URL.createObjectURL(file));
    audioRef.current = audio;
    setMusic({ name: file.name, buffer: await decodeMusic(file) });
    seek(0);
    play(true);
  };

  const onExport = async () => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    play(false);
    exportingRef.current = true;
    abortRef.current = new AbortController();
    setProgress(0);
    setMessage(null);
    try {
      const { blob, withAudio } = await exportMp4(engine, canvas, music?.buffer ?? null, setProgress, abortRef.current.signal);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sapiensrank-${format}-${lang}-${bpm}bpm.mp4`;
      a.click();
      setMessage(
        music && !withAudio
          ? "Exported without music: this browser cannot encode AAC audio."
          : `Exported ${Math.round(blob.size / 1e6)} MB.`,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMessage(`Export failed: ${(e as Error).message}`);
    } finally {
      exportingRef.current = false;
      setProgress(null);
      engine.render(timeRef.current);
    }
  };

  const { w, h } = FORMATS[format];
  const beat = (time * bpm) / 60;
  const scene = Object.entries(SCENES).find(([, [a, b]]) => beat >= a && beat < b)?.[0] ?? "outro";

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        onClick={() => !exportingRef.current && play(!playingRef.current)}
        style={{
          aspectRatio: `${w} / ${h}`,
          width: `min(100vw, calc(100vh * ${w / h}))`,
          height: "auto",
        }}
      />

      {(!ready || error) && (
        <p className="absolute text-sm text-gray-400">{error ?? "Loading…"}</p>
      )}

      {ui && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button className={button} onClick={() => play(!playing)} disabled={progress !== null}>
                {playing ? "Pause" : "Play"}
              </button>
              <input
                type="range"
                min={0}
                max={duration}
                step={1 / FPS}
                value={Math.min(time, duration)}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1 accent-lime-300"
                disabled={progress !== null}
              />
              <span className="text-xs tabular-nums text-gray-400 w-36 text-right">
                {time.toFixed(1)}s / {duration.toFixed(1)}s · {scene}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="bg-black border border-white/15 rounded-full px-3 py-1.5"
                disabled={progress !== null}
              >
                {Object.entries(FORMATS).map(([key, f]) => (
                  <option key={key} value={key}>
                    {f.label} · {f.w}×{f.h}
                  </option>
                ))}
              </select>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="bg-black border border-white/15 rounded-full px-3 py-1.5"
                disabled={progress !== null}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <label className="flex items-center gap-2 border border-white/15 rounded-full px-3 py-1.5">
                BPM
                <input
                  type="number"
                  min={60}
                  max={200}
                  value={bpm}
                  onChange={(e) => setBpm(Math.min(200, Math.max(60, Number(e.target.value) || DEFAULT_BPM)))}
                  className="w-12 bg-transparent"
                  disabled={progress !== null}
                />
              </label>
              <label className={`${button} cursor-pointer`}>
                {music ? `♪ ${music.name}` : "Add music"}
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => onMusic(e.target.files?.[0])} />
              </label>
              <span className="flex-1" />
              {progress === null ? (
                <button className={`${button} bg-lime-300 text-black border-lime-300`} onClick={onExport} disabled={!ready || !canExportMp4()}>
                  Export MP4 · {FPS} fps
                </button>
              ) : (
                <button className={button} onClick={() => abortRef.current?.abort()}>
                  Exporting {Math.round(progress * 100)}% · Cancel
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Space: play/pause · H: hide this bar · Scene cuts land on bar lines at the chosen BPM
              {message ? ` · ${message}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
