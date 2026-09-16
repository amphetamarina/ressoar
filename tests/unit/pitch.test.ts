import { describe, expect, it } from "vitest";
import { autoCorrelate, noteFromHz, PitchSmoother } from "../../src/lib/audio/pitch";

const SAMPLE_RATE = 48000;

function sine(hz: number, samples = 4096, amplitude = 0.5): Float32Array {
  return Float32Array.from({ length: samples }, (_, i) => amplitude * Math.sin((2 * Math.PI * hz * i) / SAMPLE_RATE));
}

describe("autoCorrelate", () => {
  it.each([110, 220, 330])("detects a %d Hz sine within 0.5 Hz", (hz) => {
    const detected = autoCorrelate(sine(hz), SAMPLE_RATE);
    expect(detected).not.toBeNull();
    expect(Math.abs((detected as number) - hz)).toBeLessThan(0.5);
  });

  it("returns null on silence", () => {
    expect(autoCorrelate(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
  });

  it("returns null on white noise", () => {
    const noise = Float32Array.from({ length: 4096 }, () => Math.random() - 0.5);
    expect(autoCorrelate(noise, SAMPLE_RATE)).toBeNull();
  });
});

describe("noteFromHz", () => {
  it("maps 440 Hz to A4 / Lá4", () => {
    const note = noteFromHz(440);
    expect(note).toMatchObject({ name: "A4", namePt: "Lá4", midi: 69, cents: 0 });
  });

  it("reports cents offset", () => {
    expect(noteFromHz(446).cents).toBeGreaterThan(20);
  });
});

describe("PitchSmoother", () => {
  it("rejects a single octave spike", () => {
    const smoother = new PitchSmoother();
    [200, 200, 200].forEach((hz) => smoother.push(hz));
    const spiked = smoother.push(400) as number;
    expect(spiked).toBeLessThan(220);
  });

  it("passes silence through and resets after three silent frames", () => {
    const smoother = new PitchSmoother();
    smoother.push(200);
    expect(smoother.push(null)).toBeNull();
    smoother.push(null);
    smoother.push(null);
    expect(smoother.push(300)).toBe(300);
  });
});
