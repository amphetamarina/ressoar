/** Fixed-capacity mono PCM ring buffer holding the most recent samples. */
export class RingBuffer {
  private readonly data: Float32Array;
  private writeIndex = 0;
  private filled = 0;

  constructor(
    readonly capacity: number,
    readonly sampleRate: number,
  ) {
    this.data = new Float32Array(capacity);
  }

  get length(): number {
    return this.filled;
  }

  get filledSeconds(): number {
    return this.filled / this.sampleRate;
  }

  write(chunk: Float32Array): void {
    if (chunk.length >= this.capacity) {
      this.data.set(chunk.subarray(chunk.length - this.capacity));
      this.writeIndex = 0;
      this.filled = this.capacity;
      return;
    }
    const tail = this.capacity - this.writeIndex;
    if (chunk.length <= tail) {
      this.data.set(chunk, this.writeIndex);
    } else {
      this.data.set(chunk.subarray(0, tail), this.writeIndex);
      this.data.set(chunk.subarray(tail), 0);
    }
    this.writeIndex = (this.writeIndex + chunk.length) % this.capacity;
    this.filled = Math.min(this.capacity, this.filled + chunk.length);
  }

  /** Returns the most recent `count` samples (or fewer if not yet filled), oldest first. */
  read(count: number = this.filled): Float32Array<ArrayBuffer> {
    const n = Math.min(count, this.filled);
    const out = new Float32Array(n);
    const start = (this.writeIndex - n + this.capacity) % this.capacity;
    const tail = this.capacity - start;
    if (n <= tail) {
      out.set(this.data.subarray(start, start + n));
    } else {
      out.set(this.data.subarray(start));
      out.set(this.data.subarray(0, n - tail), tail);
    }
    return out;
  }

  clear(): void {
    this.writeIndex = 0;
    this.filled = 0;
  }
}
