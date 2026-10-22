import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import type { ShowreelEngine } from "./engine";

export const FPS = 60;
const SAMPLE_RATE = 48000;

export const canExportMp4 = () => typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";

export async function decodeMusic(file: File) {
  const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
  try {
    return await ctx.decodeAudioData(await file.arrayBuffer());
  } finally {
    void ctx.close();
  }
}

async function audioSupported() {
  if (typeof AudioEncoder === "undefined") return false;
  const { supported } = await AudioEncoder.isConfigSupported({
    codec: "mp4a.40.2",
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 2,
    bitrate: 192_000,
  });
  return !!supported;
}

/**
 * Renders the film frame by frame, so the file is a perfect 60 fps whatever the
 * machine manages in real time, then muxes it to MP4 with the music if any.
 */
export async function exportMp4(
  engine: ShowreelEngine,
  canvas: HTMLCanvasElement,
  music: AudioBuffer | null,
  onProgress: (p: number) => void,
  signal: AbortSignal,
): Promise<{ blob: Blob; withAudio: boolean }> {
  const { W: width, H: height } = engine;
  const withAudio = !!music && (await audioSupported());

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width, height, frameRate: FPS },
    audio: withAudio ? { codec: "aac", numberOfChannels: 2, sampleRate: SAMPLE_RATE } : undefined,
    fastStart: "in-memory",
  });

  let failure: unknown = null;
  const video = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => (failure = e),
  });
  const config: VideoEncoderConfig = {
    codec: "avc1.640034",
    width,
    height,
    bitrate: 24_000_000,
    framerate: FPS,
  };
  const { supported } = await VideoEncoder.isConfigSupported(config);
  if (!supported) throw new Error("H.264 encoding is not supported by this browser.");
  video.configure(config);

  const frames = Math.ceil(engine.duration * FPS);
  for (let i = 0; i < frames; i++) {
    if (signal.aborted) throw new DOMException("Export cancelled", "AbortError");
    if (failure) throw failure;
    const t = i / FPS;
    await engine.seekVideo(t);
    engine.render(t);
    const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
    video.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
    frame.close();
    while (video.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 1));
    if (i % 10 === 0) {
      onProgress(i / frames);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  await video.flush();
  video.close();

  if (withAudio && music) {
    const audio = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: (e) => (failure = e),
    });
    audio.configure({ codec: "mp4a.40.2", sampleRate: SAMPLE_RATE, numberOfChannels: 2, bitrate: 192_000 });
    const total = Math.min(music.length, Math.round(engine.duration * SAMPLE_RATE));
    const fadeFrom = total - Math.round(1.5 * SAMPLE_RATE);
    const left = music.getChannelData(0);
    const right = music.numberOfChannels > 1 ? music.getChannelData(1) : left;
    const block = 4800;
    for (let start = 0; start < total; start += block) {
      const n = Math.min(block, total - start);
      const data = new Float32Array(n * 2);
      for (let j = 0; j < n; j++) {
        const s = start + j;
        const gain = s > fadeFrom ? Math.max(0, (total - s) / (total - fadeFrom)) : 1;
        data[j] = left[s] * gain;
        data[n + j] = right[s] * gain;
      }
      const chunk = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: n,
        numberOfChannels: 2,
        timestamp: Math.round((start * 1e6) / SAMPLE_RATE),
        data,
      });
      audio.encode(chunk);
      chunk.close();
    }
    await audio.flush();
    audio.close();
  }
  if (failure) throw failure;

  muxer.finalize();
  onProgress(1);
  return { blob: new Blob([muxer.target.buffer], { type: "video/mp4" }), withAudio };
}
