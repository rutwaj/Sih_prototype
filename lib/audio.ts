/**
 * lib/audio.ts
 * Audio: siren (Web Audio API oscillator), clip playback, speechSynthesis fallback.
 * All functions are safe to call before user interaction — they will no-op silently.
 * Call `playClip` or `startSiren` only after the user has clicked "Enable sound".
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type AudioClipPath = string; // e.g. "/audio/en/forest_fire.mp3"

// ─── Siren ───────────────────────────────────────────────────────────────────

let _sirenCtx: AudioContext | null = null;
let _sirenOsc: OscillatorNode | null = null;
let _sirenGain: GainNode | null = null;
let _sirenLfo: OscillatorNode | null = null;

/**
 * Start the siren loop (Web Audio API — no file needed).
 * Frequency sweeps 440 Hz → 880 Hz and back at ~1 Hz (well under 3 Hz flash limit).
 * Safe to call multiple times; idempotent.
 */
export function startSiren(muted: boolean): void {
  if (muted) return;
  if (_sirenOsc) return; // already running

  try {
    const ctx = new AudioContext();
    _sirenCtx = ctx;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.connect(ctx.destination);
    _sirenGain = gain;

    // Main siren oscillator
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.connect(gain);
    osc.start();
    _sirenOsc = osc;

    // LFO to sweep frequency (0.9 Hz — comfortably under 3 Hz WCAG limit)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.9, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(220, ctx.currentTime); // sweep ±220 Hz
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    _sirenLfo = lfo;
  } catch {
    // AudioContext not available (SSR or sandboxed) — silently ignore
  }
}

/** Stop the siren. Safe to call when not running. */
export function stopSiren(): void {
  try {
    _sirenOsc?.stop();
    _sirenLfo?.stop();
    _sirenCtx?.close();
  } catch {
    // ignore
  }
  _sirenOsc = null;
  _sirenLfo = null;
  _sirenGain = null;
  _sirenCtx = null;
}

/** Mute/unmute the siren in place. */
export function setSirenMuted(muted: boolean): void {
  if (!_sirenGain || !_sirenCtx) return;
  _sirenGain.gain.setValueAtTime(muted ? 0 : 0.18, _sirenCtx.currentTime);
}

// ─── Voice clip playback ──────────────────────────────────────────────────────

let _currentAudio: HTMLAudioElement | null = null;

/**
 * Play a pre-generated audio clip from /public/audio.
 * Falls back to speechSynthesis if the file is missing (404).
 * Falls back to caption-only if speechSynthesis has no matching voice.
 *
 * @param path   - e.g. "/audio/en/forest_fire.mp3"
 * @param fallbackText - text to speak via speechSynthesis if file missing
 * @param lang   - BCP-47 language tag for speechSynthesis (e.g. "en-IN", "hi-IN", "ta-IN")
 * @param muted  - if true, do nothing
 */
export function playClip(
  path: AudioClipPath,
  fallbackText: string,
  lang: string,
  muted: boolean,
): void {
  if (muted) return;

  stopClip(); // stop any previous clip

  const audio = new Audio(path);
  _currentAudio = audio;

  audio.play().catch(() => {
    // File not found or autoplay blocked — try speechSynthesis
    trySpeechSynthesis(fallbackText, lang);
  });

  audio.addEventListener("error", () => {
    trySpeechSynthesis(fallbackText, lang);
  });
}

/** Stop any currently playing clip. */
export function stopClip(): void {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function trySpeechSynthesis(text: string, lang: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.volume = 0.8;

  // Try to find a voice matching the language
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (match) {
    utterance.voice = match;
    window.speechSynthesis.speak(utterance);
  }
  // If no matching voice, show caption only (handled in UI)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map scenario+lang to clip path. Returns null if pre-generated file doesn't exist (UI will fallback). */
export function clipPath(scenarioId: string, lang: string): AudioClipPath {
  return `/audio/${lang}/${scenarioId}.mp3`;
}

/** Map language code to BCP-47 tag for speechSynthesis */
export function langToBcp47(lang: string): string {
  const map: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    ta: "ta-IN",
  };
  return map[lang] ?? lang;
}
