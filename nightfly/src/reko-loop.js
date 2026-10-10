/**
 * Freeze the most recent spoken phrase out of the microphone's rolling PCM buffer.
 * The returned samples are independent of the still-recording ring buffer.
 * Leading/trailing quiet and old phrases separated by a long pause are excluded,
 * so a short shout repeats immediately instead of once every three seconds.
 */
export function extractSpeechLoop(samples, sampleRate) {
  if (!samples?.length || !Number.isFinite(sampleRate) || sampleRate <= 0) return null;
  const frameSize = Math.max(1, Math.round(sampleRate * 0.01)); // 10 ms
  const count = Math.ceil(samples.length / frameSize);
  const rms = new Float32Array(count);
  let peak = 0;
  for (let frame = 0; frame < count; frame++) {
    const from = frame * frameSize;
    const to = Math.min(from + frameSize, samples.length);
    let power = 0;
    for (let i = from; i < to; i++) power += samples[i] * samples[i];
    const value = Math.sqrt(power / (to - from));
    rms[frame] = value;
    peak = Math.max(peak, value);
  }
  // Relative threshold retains quiet syllables; absolute floor avoids looping room noise.
  const gate = Math.max(0.003, peak * 0.16);
  let last = -1;
  for (let frame = count - 1; frame >= 0; frame--) {
    if (rms[frame] >= gate) { last = frame; break; }
  }
  if (last < 0) return null;
  // Stop at a sizeable silence: this picks the most recent phrase, not all 3 s.
  const maxQuietFrames = Math.max(1, Math.round(0.35 * sampleRate / frameSize));
  let first = last;
  let quiet = 0;
  for (let frame = last - 1; frame >= 0; frame--) {
    if (rms[frame] >= gate) { first = frame; quiet = 0; }
    else if (++quiet >= maxQuietFrames) break;
  }
  const padding = Math.round(sampleRate * 0.012);
  const begin = Math.max(0, first * frameSize - padding);
  const end = Math.min(samples.length, (last + 1) * frameSize + padding);
  if (end - begin < Math.round(sampleRate * 0.07)) return null;
  const loop = samples.slice(begin, end);
  // A tiny amplitude fade at the wrap removes clicks without inserting silence.
  const fade = Math.min(Math.round(sampleRate * 0.004), Math.floor(loop.length * 0.1));
  for (let i = 0; i < fade; i++) {
    const gain = i / fade;
    loop[i] *= gain;
    loop[loop.length - 1 - i] *= gain;
  }
  return loop;
}
