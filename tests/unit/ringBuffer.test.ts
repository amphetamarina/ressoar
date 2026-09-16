import { describe, expect, it } from "vitest";
import { RingBuffer } from "../../src/lib/audio/ringBuffer";

describe("RingBuffer", () => {
  it("returns written samples oldest first before wrapping", () => {
    const ring = new RingBuffer(8, 8);
    ring.write(Float32Array.from([1, 2, 3]));
    expect(Array.from(ring.read())).toEqual([1, 2, 3]);
    expect(ring.filledSeconds).toBeCloseTo(3 / 8);
  });

  it("keeps only the most recent samples after wrapping", () => {
    const ring = new RingBuffer(5, 5);
    ring.write(Float32Array.from([1, 2, 3, 4]));
    ring.write(Float32Array.from([5, 6, 7]));
    expect(ring.length).toBe(5);
    expect(Array.from(ring.read())).toEqual([3, 4, 5, 6, 7]);
    expect(Array.from(ring.read(2))).toEqual([6, 7]);
  });

  it("handles chunks larger than the capacity", () => {
    const ring = new RingBuffer(3, 3);
    ring.write(Float32Array.from([1, 2, 3, 4, 5]));
    expect(Array.from(ring.read())).toEqual([3, 4, 5]);
  });

  it("clears", () => {
    const ring = new RingBuffer(4, 4);
    ring.write(Float32Array.from([1, 2]));
    ring.clear();
    expect(ring.length).toBe(0);
    expect(ring.read().length).toBe(0);
  });
});
