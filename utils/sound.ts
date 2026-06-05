const pools: Record<string, HTMLAudioElement[]> = {};
const POOL_SIZE = 1;

export function playSound(src: string, volume = 1) {
  if (!pools[src]) {
    pools[src] = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(src);
      a.preload = "auto";
      return a;
    });
  }

  const pool = pools[src];
  const audio = pool.find(a => a.paused) || pool[0];

  audio.volume = volume;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}