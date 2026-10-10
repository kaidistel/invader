import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractSpeechLoop } from '../src/reko-loop.js';
const rate = 10000;
const sampleCount = seconds => Math.round(seconds * rate);
const spoken = (samples, from, to, amplitude = 0.15) => {
  for (let i = sampleCount(from); i < sampleCount(to); i++) samples[i] = Math.sin(i * .15) * amplitude;
};
test('a short word is repeated at its own duration, not the full 3 second buffer', () => {
  const input = new Float32Array(sampleCount(3));
  spoken(input, 2, 2.5);
  const result = extractSpeechLoop(input, rate);
  assert.ok(result);
  assert.ok(result.length / rate > .49 && result.length / rate < .56, `Unexpected length: ${result.length/rate}`);
});
test('only the latest phrase is frozen when separated by silence', () => {
  const input = new Float32Array(sampleCount(3));
  spoken(input, .1, .6);
  spoken(input, 2.1, 2.4);
  const result = extractSpeechLoop(input, rate);
  assert.ok(result.length / rate > .29 && result.length / rate < .36);
});
test('small gaps inside a phrase remain intact', () => {
  const input = new Float32Array(sampleCount(3));
  spoken(input, 1.0, 1.35);
  spoken(input, 1.52, 1.9);
  const result = extractSpeechLoop(input, rate);
  assert.ok(result.length / rate > .89 && result.length / rate < .96);
});
test('speech continuing up to keypress still plays immediately', () => {
  const input = new Float32Array(sampleCount(3));
  spoken(input, 2.2, 3);
  const result = extractSpeechLoop(input, rate);
  assert.ok(result.length / rate > .79 && result.length / rate < .83);
});
test('silence is not turned into a loop', () => {
  assert.equal(extractSpeechLoop(new Float32Array(sampleCount(3)), rate), null);
});
test('loop is independent of future capture', () => {
  const input = new Float32Array(sampleCount(3));
  spoken(input, 2, 2.4);
  const result = extractSpeechLoop(input, rate);
  const old = Array.from(result);
  input.fill(0);
  assert.deepEqual(Array.from(result), old);
});
