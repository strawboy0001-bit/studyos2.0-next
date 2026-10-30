// Web Audio API procedural sound engine for study frequencies & ambient soundscapes
// Works 100% offline, zero network requests, zero latency, zero external dependencies

export type FocusSoundType = "40hz" | "425hz" | "528hz" | "rain" | "brownNoise";

export interface FocusSoundTrack {
  id: FocusSoundType;
  name: string;
  category: "Binaural & Frequencies" | "Ambient Soundscapes";
  description: string;
  badge: string;
  frequencyLabel?: string;
}

export const FOCUS_SOUND_TRACKS: FocusSoundTrack[] = [
  {
    id: "40hz",
    name: "40 Hz Gamma Focus",
    category: "Binaural & Frequencies",
    description: "Scientifically associated with peak cognitive performance, problem solving, and gamma wave synchronization.",
    badge: "Cognitive Sprint",
    frequencyLabel: "40 Hz Binaural Beat",
  },
  {
    id: "425hz",
    name: "425 Hz Alpha Resonance",
    category: "Binaural & Frequencies",
    description: "Deep calming frequency designed for long sustained reading, memory retention, and low anxiety flow.",
    badge: "Alpha State",
    frequencyLabel: "425 Hz Harmonic Sine",
  },
  {
    id: "528hz",
    name: "528 Hz Clarity Tone",
    category: "Binaural & Frequencies",
    description: "Solfeggio transformation tone that clears mental brain fog and resets mental fatigue.",
    badge: "Mental Clarity",
    frequencyLabel: "528 Hz Solfeggio",
  },
  {
    id: "rain",
    name: "Gentle Rainfall",
    category: "Ambient Soundscapes",
    description: "Procedural acoustic rain shower generated via filtered noise synthesis to mask distracting noises.",
    badge: "Nature Flow",
    frequencyLabel: "Rain Acoustic Shield",
  },
  {
    id: "brownNoise",
    name: "Deep Brown Noise",
    category: "Ambient Soundscapes",
    description: "Rumbling low-frequency acoustic blanket that drowns background speech and external distractions.",
    badge: "Deep Silence",
    frequencyLabel: "Brownian Spectrum",
  },
];

class FocusAudioManager {
  private ctx: AudioContext | null = null;
  private currentType: FocusSoundType | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private volume: number = 0.6;
  private listeners: Set<(state: { isPlaying: boolean; currentType: FocusSoundType | null; volume: number }) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public subscribe(listener: (state: { isPlaying: boolean; currentType: FocusSoundType | null; volume: number }) => void) {
    this.listeners.add(listener);
    listener({ isPlaying: this.isPlaying, currentType: this.currentType, volume: this.volume });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ isPlaying: this.isPlaying, currentType: this.currentType, volume: this.volume });
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getVolume() {
    return this.volume;
  }

  public getCurrentType() {
    return this.currentType;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public stop() {
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore already stopped
      }
    }
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = null;
    this.notify();
  }

  public play(type: FocusSoundType) {
    if (this.isPlaying && this.currentType === type) {
      this.stop();
      return;
    }

    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentType = type;
    this.isPlaying = true;

    switch (type) {
      case "40hz":
        this.generate40HzBinaural();
        break;
      case "425hz":
        this.generateSineTone(425, "sine");
        break;
      case "528hz":
        this.generateSineTone(528, "triangle");
        break;
      case "rain":
        this.generateProceduralRain();
        break;
      case "brownNoise":
        this.generateBrownNoise();
        break;
    }

    this.notify();
  }

  // 40 Hz Gamma Wave (Carrier 200 Hz, with 240 Hz in Right channel for true 40Hz binaural entrainment + sub bass)
  private generate40HzBinaural() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Carrier Left: 200 Hz
    const oscL = ctx.createOscillator();
    oscL.type = "sine";
    oscL.frequency.setValueAtTime(200, ctx.currentTime);

    // Carrier Right: 240 Hz (240 - 200 = 40 Hz difference)
    const oscR = ctx.createOscillator();
    oscR.type = "sine";
    oscR.frequency.setValueAtTime(240, ctx.currentTime);

    // Soft 40Hz audible sub-harmonic so users without stereo headphones still benefit
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(40, ctx.currentTime);

    const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    if (panL) panL.pan.setValueAtTime(-0.85, ctx.currentTime);
    if (panR) panR.pan.setValueAtTime(0.85, ctx.currentTime);

    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    const gainSub = ctx.createGain();

    gainL.gain.setValueAtTime(0.18, ctx.currentTime);
    gainR.gain.setValueAtTime(0.18, ctx.currentTime);
    gainSub.gain.setValueAtTime(0.12, ctx.currentTime);

    if (panL) {
      oscL.connect(gainL).connect(panL).connect(this.masterGain);
    } else {
      oscL.connect(gainL).connect(this.masterGain);
    }

    if (panR) {
      oscR.connect(gainR).connect(panR).connect(this.masterGain);
    } else {
      oscR.connect(gainR).connect(this.masterGain);
    }

    subOsc.connect(gainSub).connect(this.masterGain);

    oscL.start();
    oscR.start();
    subOsc.start();

    this.activeNodes.push(
      { stop: () => oscL.stop(), disconnect: () => oscL.disconnect() },
      { stop: () => oscR.stop(), disconnect: () => oscR.disconnect() },
      { stop: () => subOsc.stop(), disconnect: () => subOsc.disconnect() },
      { disconnect: () => gainL.disconnect() },
      { disconnect: () => gainR.disconnect() },
      { disconnect: () => gainSub.disconnect() }
    );
  }

  // Pure Frequency generator with subtle slow tremolo for relaxing study flow
  private generateSineTone(freq: number, shape: OscillatorType = "sine") {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    osc.type = shape;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Slow LFO for organic breath
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 0.1 Hz breathing rate

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.25, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(toneGain.gain);

    // Warm low-pass filter to remove any harsh digital harmonics
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);

    osc.connect(filter).connect(toneGain).connect(this.masterGain);

    osc.start();
    lfo.start();

    this.activeNodes.push(
      { stop: () => osc.stop(), disconnect: () => osc.disconnect() },
      { stop: () => lfo.stop(), disconnect: () => lfo.disconnect() },
      { disconnect: () => toneGain.disconnect() },
      { disconnect: () => filter.disconnect() }
    );
  }

  // Procedural Rain Synthesis using white noise buffer + dual low/bandpass filtering
  private generateProceduralRain() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter white noise to sound like falling droplets
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(800, ctx.currentTime);

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);

    whiteNoise.connect(highpass).connect(lowpass).connect(gain).connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(
      { stop: () => whiteNoise.stop(), disconnect: () => whiteNoise.disconnect() },
      { disconnect: () => lowpass.disconnect() },
      { disconnect: () => highpass.disconnect() },
      { disconnect: () => gain.disconnect() }
    );
  }

  // Deep Brown Noise Synthesis (Integration of white noise)
  private generateBrownNoise() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain scaling for brown noise
    }

    const brownSource = ctx.createBufferSource();
    brownSource.buffer = buffer;
    brownSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(450, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    brownSource.connect(lowpass).connect(gain).connect(this.masterGain);
    brownSource.start();

    this.activeNodes.push(
      { stop: () => brownSource.stop(), disconnect: () => brownSource.disconnect() },
      { disconnect: () => lowpass.disconnect() },
      { disconnect: () => gain.disconnect() }
    );
  }
}

export const focusAudio = new FocusAudioManager();
