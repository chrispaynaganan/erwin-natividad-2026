'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const CORE_VERSION = '0.12.6'
const CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`

let ffmpegPromise: Promise<FFmpeg> | null = null

// Loads the ffmpeg.wasm core once (lazily, on first use) and reuses it for
// every conversion in the session. Uses the single-threaded core, which
// doesn't require cross-origin-isolation (COOP/COEP) headers — the -mt
// (multi-threaded) core is faster but needs those headers set at the
// server/CDN level, which we haven't configured.
async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg()
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      return ffmpeg
    })()
  }
  return ffmpegPromise
}

export type ConvertedAudio = { file: File; durationSecs: number }

// Converts any browser-playable audio file to AAC-in-M4A (128kbps, stereo)
// entirely client-side, and returns the resulting duration. Runs in-browser
// so raw source files (WAV exports, DAW bounces, phone recordings, etc.)
// are normalized before they ever reach the server.
export async function convertToAAC(input: File, onProgress?: (ratio: number) => void): Promise<ConvertedAudio> {
  const ffmpeg = await getFFmpeg()

  const onProgressEvt = ({ progress }: { progress: number }) => onProgress?.(Math.min(1, Math.max(0, progress)))
  if (onProgress) ffmpeg.on('progress', onProgressEvt)

  const inName = 'input' + (input.name.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? '.audio')
  const outName = 'output.m4a'

  try {
    await ffmpeg.writeFile(inName, await fetchFile(input))
    await ffmpeg.exec(['-i', inName, '-vn', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', outName])
    const data = await ffmpeg.readFile(outName)
    // .slice() always allocates a plain ArrayBuffer (never SharedArrayBuffer),
    // which is what File's constructor requires — readFile()'s return type is
    // wider (ArrayBufferLike) and TS rejects it directly.
    const bytes = (data as Uint8Array).slice()

    const durationSecs = await probeDuration(ffmpeg, inName)

    await ffmpeg.deleteFile(inName)
    await ffmpeg.deleteFile(outName)

    const file = new File([bytes], input.name.replace(/\.[a-zA-Z0-9]+$/, '.m4a'), { type: 'audio/mp4' })
    return { file, durationSecs }
  } finally {
    if (onProgress) ffmpeg.off('progress', onProgressEvt)
  }
}

// ffprobe.wasm isn't bundled separately — ffmpeg prints a "Duration:
// HH:MM:SS.xx" line to its own log for any input, so we capture that
// instead of pulling in a second wasm module just for metadata.
async function probeDuration(ffmpeg: FFmpeg, inName: string): Promise<number> {
  let logText = ''
  const onLog = ({ message }: { message: string }) => { logText += message + '\n' }
  ffmpeg.on('log', onLog)
  try {
    await ffmpeg.exec(['-i', inName, '-f', 'null', '-'])
  } catch {
    // ffmpeg exits non-zero for "-f null" duration probes — expected.
  } finally {
    ffmpeg.off('log', onLog)
  }
  const match = logText.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/)
  if (!match) return 0
  const [, h, m, sec] = match
  return Math.round(Number(h) * 3600 + Number(m) * 60 + Number(sec))
}