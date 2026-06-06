let audioCtx: AudioContext | null = null;

export async function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}

const buffers: Record<string, AudioBuffer> = {};

export async function loadSound(src: string) {
  if (!audioCtx) return;

  const res = await fetch(src);
  const arrayBuffer = await res.arrayBuffer();
  buffers[src] = await audioCtx.decodeAudioData(arrayBuffer);
}

export function playSound(src: string, volume = 1) {
  if (!audioCtx || !buffers[src]) return;

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  source.buffer = buffers[src];
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(audioCtx.destination);

  source.start(0);
}