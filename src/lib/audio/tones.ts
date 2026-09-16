const ATTACK_S = 0.005;
const RELEASE_S = 0.03;

export class ToneGenerator {
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  constructor(private readonly ctx: AudioContext) {}

  get playing(): boolean {
    return this.oscillator !== null;
  }

  async play(hz: number, type: OscillatorType, volume: number): Promise<void> {
    this.stop();
    if (this.ctx.state !== "running") await this.ctx.resume();
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + ATTACK_S);
    const oscillator = this.ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(hz, now);
    oscillator.connect(gain).connect(this.ctx.destination);
    oscillator.start(now);
    this.oscillator = oscillator;
    this.gain = gain;
  }

  setHz(hz: number): void {
    this.oscillator?.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.01);
  }

  setVolume(volume: number): void {
    this.gain?.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.01);
  }

  stop(): void {
    const { oscillator, gain } = this;
    if (!oscillator || !gain) return;
    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + RELEASE_S);
    oscillator.stop(now + RELEASE_S + 0.01);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    this.oscillator = null;
    this.gain = null;
  }
}
