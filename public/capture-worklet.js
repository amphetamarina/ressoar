// Copies mono input into 4096-sample chunks and posts them to the main thread.
// Output is left silent so the node can be connected to the destination safely.
class CaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunk = new Float32Array(4096);
    this.offset = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    let read = 0;
    while (read < channel.length) {
      const count = Math.min(channel.length - read, this.chunk.length - this.offset);
      this.chunk.set(channel.subarray(read, read + count), this.offset);
      this.offset += count;
      read += count;
      if (this.offset === this.chunk.length) {
        this.port.postMessage(this.chunk);
        this.chunk = new Float32Array(4096);
        this.offset = 0;
      }
    }
    return true;
  }
}

registerProcessor("ressoar-capture", CaptureProcessor);
