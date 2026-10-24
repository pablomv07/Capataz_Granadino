/**
 * Authentic Web Audio API Synthesizer for Cofrade Marches & Sounds:
 * Orchestrates brass (corneta, trompeta, bombardino, tuba), woodwinds,
 * percussion (redoblante con bordonera, bombo, platillos) and church bells.
 */

// Note frequencies in Hz
const NOTES: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98,
  'REST': 0
};

export interface NoteEvent {
  note: string;       // e.g. 'D4', 'REST'
  duration: number;   // In beats (1 = quarter note, 0.5 = eighth, 2 = half)
  harmony?: string;   // Optional second voice note
  bass?: string;      // Optional bass note
  percussion?: 'snare' | 'roll' | 'bassdrum' | 'crash' | 'muffled' | 'bell';
}

export interface MarchScore {
  id: string;
  bpm: number;
  timeSignature: [number, number];
  notes: NoteEvent[];
}

export const MARCH_SCORES: Record<string, MarchScore> = {
  // 1. La Madrugá (Abel Moreno) - Iconic solemn minor theme building to brass majesty
  'la-madruga': {
    id: 'la-madruga',
    bpm: 72,
    timeSignature: [4, 4],
    notes: [
      { note: 'D4', duration: 1.5, bass: 'D2', percussion: 'bassdrum' },
      { note: 'E4', duration: 0.5, bass: 'D2' },
      { note: 'F4', duration: 1.0, harmony: 'A4', bass: 'D3', percussion: 'snare' },
      { note: 'D4', duration: 1.0, harmony: 'F4', bass: 'D2' },
      { note: 'A4', duration: 2.0, harmony: 'D5', bass: 'A2', percussion: 'bassdrum' },
      { note: 'G4', duration: 1.0, harmony: 'C#5', bass: 'A2', percussion: 'snare' },
      { note: 'F4', duration: 1.0, harmony: 'D5', bass: 'D3' },
      { note: 'E4', duration: 2.5, harmony: 'C#5', bass: 'A2', percussion: 'bassdrum' },
      { note: 'F4', duration: 0.5, harmony: 'D5', bass: 'A2' },
      { note: 'E4', duration: 1.0, harmony: 'C#5', bass: 'A2', percussion: 'snare' },
      { note: 'D4', duration: 3.0, harmony: 'F4', bass: 'D2', percussion: 'crash' },
      { note: 'REST', duration: 1.0, bass: 'D2' },
      // Second phrase: rising lament
      { note: 'F4', duration: 1.0, harmony: 'A4', bass: 'D3', percussion: 'bassdrum' },
      { note: 'G4', duration: 1.0, harmony: 'Bb4', bass: 'G2', percussion: 'snare' },
      { note: 'A4', duration: 1.5, harmony: 'C5', bass: 'F3', percussion: 'bassdrum' },
      { note: 'Bb4', duration: 0.5, harmony: 'D5', bass: 'G2' },
      { note: 'A4', duration: 1.0, harmony: 'C5', bass: 'A2', percussion: 'snare' },
      { note: 'G4', duration: 1.0, harmony: 'Bb4', bass: 'G2' },
      { note: 'F4', duration: 1.5, harmony: 'A4', bass: 'D3', percussion: 'bassdrum' },
      { note: 'E4', duration: 0.5, harmony: 'G4', bass: 'A2' },
      { note: 'D4', duration: 2.0, harmony: 'F4', bass: 'D2', percussion: 'roll' },
      { note: 'C#4', duration: 1.0, harmony: 'E4', bass: 'A2', percussion: 'snare' },
      { note: 'D4', duration: 4.0, harmony: 'D5', bass: 'D2', percussion: 'crash' },
    ]
  },

  // 2. Consuelo Gitano (Antonio Velasco) - Flamenco-cofrade trumpet passion of Sacromonte
  'consuelo-gitano': {
    id: 'consuelo-gitano',
    bpm: 96,
    timeSignature: [4, 4],
    notes: [
      { note: 'A3', duration: 0.5, bass: 'A2', percussion: 'roll' },
      { note: 'C4', duration: 0.5, bass: 'A2' },
      { note: 'E4', duration: 1.0, harmony: 'A4', bass: 'A2', percussion: 'bassdrum' },
      { note: 'E4', duration: 0.5, harmony: 'A4', bass: 'A2' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'A2', percussion: 'snare' },
      { note: 'E4', duration: 1.0, harmony: 'G4', bass: 'E3', percussion: 'bassdrum' },
      { note: 'D4', duration: 0.5, harmony: 'F4', bass: 'D3' },
      { note: 'C4', duration: 0.5, harmony: 'E4', bass: 'A2', percussion: 'snare' },
      { note: 'B3', duration: 1.0, harmony: 'D4', bass: 'E3', percussion: 'bassdrum' },
      { note: 'C4', duration: 0.5, harmony: 'E4', bass: 'A2' },
      { note: 'D4', duration: 0.5, harmony: 'F4', bass: 'D3', percussion: 'snare' },
      { note: 'E4', duration: 2.0, harmony: 'G#4', bass: 'E3', percussion: 'crash' },
      // Cadencia andaluza forte
      { note: 'G4', duration: 0.5, harmony: 'B4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'F2' },
      { note: 'E4', duration: 1.0, harmony: 'G#4', bass: 'E3', percussion: 'snare' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'F2', percussion: 'bassdrum' },
      { note: 'D4', duration: 0.5, harmony: 'F4', bass: 'D3' },
      { note: 'E4', duration: 3.0, harmony: 'G#4', bass: 'E2', percussion: 'roll' },
      { note: 'E4', duration: 1.0, harmony: 'E5', bass: 'E2', percussion: 'crash' },
    ]
  },

  // 3. Reina del Albaicín (Barros Jódar) - Radiant triumph for La Aurora
  'reina-del-albaicin': {
    id: 'reina-del-albaicin',
    bpm: 98,
    timeSignature: [4, 4],
    notes: [
      { note: 'G4', duration: 1.0, harmony: 'B4', bass: 'G2', percussion: 'bell' },
      { note: 'A4', duration: 0.5, harmony: 'C5', bass: 'G2' },
      { note: 'B4', duration: 0.5, harmony: 'D5', bass: 'G2', percussion: 'snare' },
      { note: 'D5', duration: 1.5, harmony: 'G5', bass: 'G3', percussion: 'bassdrum' },
      { note: 'C5', duration: 0.5, harmony: 'E5', bass: 'C3' },
      { note: 'B4', duration: 1.0, harmony: 'D5', bass: 'G2', percussion: 'snare' },
      { note: 'A4', duration: 1.0, harmony: 'C5', bass: 'D3' },
      { note: 'B4', duration: 2.0, harmony: 'D5', bass: 'G2', percussion: 'crash' },
      { note: 'C5', duration: 1.0, harmony: 'E5', bass: 'C3', percussion: 'bell' },
      { note: 'B4', duration: 0.5, harmony: 'D5', bass: 'G2' },
      { note: 'A4', duration: 0.5, harmony: 'C5', bass: 'D3', percussion: 'snare' },
      { note: 'G4', duration: 1.5, harmony: 'B4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'F#4', duration: 0.5, harmony: 'A4', bass: 'D3' },
      { note: 'G4', duration: 3.0, harmony: 'G5', bass: 'G2', percussion: 'crash' },
    ]
  },

  // 4. Al Señor del Rescate - Powerful rhythm of El Greñúo (Magdalena)
  'al-senor-del-rescate': {
    id: 'al-senor-del-rescate',
    bpm: 104,
    timeSignature: [4, 4],
    notes: [
      { note: 'C4', duration: 0.5, bass: 'C3', percussion: 'snare' },
      { note: 'E4', duration: 0.5, bass: 'C3' },
      { note: 'G4', duration: 1.0, harmony: 'C5', bass: 'C2', percussion: 'bassdrum' },
      { note: 'G4', duration: 0.5, harmony: 'C5', bass: 'C2' },
      { note: 'A4', duration: 0.5, harmony: 'C5', bass: 'F2', percussion: 'snare' },
      { note: 'G4', duration: 1.0, harmony: 'B4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'D3' },
      { note: 'E4', duration: 0.5, harmony: 'G4', bass: 'C3', percussion: 'snare' },
      { note: 'D4', duration: 1.0, harmony: 'F4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'E4', duration: 0.5, harmony: 'G4', bass: 'C3' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'D3', percussion: 'snare' },
      { note: 'G4', duration: 2.0, harmony: 'B4', bass: 'G2', percussion: 'roll' },
      { note: 'C5', duration: 3.0, harmony: 'E5', bass: 'C3', percussion: 'crash' },
    ]
  },

  // 5. Paloma de San Pedro - Mellow Darro cadence for Los Dolores
  'paloma-de-san-pedro': {
    id: 'paloma-de-san-pedro',
    bpm: 80,
    timeSignature: [4, 4],
    notes: [
      { note: 'E4', duration: 1.0, harmony: 'G4', bass: 'C3', percussion: 'bell' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'F2' },
      { note: 'G4', duration: 1.5, harmony: 'B4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'A4', duration: 0.5, harmony: 'C5', bass: 'A2' },
      { note: 'G4', duration: 1.0, harmony: 'B4', bass: 'G2', percussion: 'snare' },
      { note: 'F4', duration: 1.0, harmony: 'A4', bass: 'F2' },
      { note: 'E4', duration: 2.0, harmony: 'G4', bass: 'C3', percussion: 'bell' },
      { note: 'D4', duration: 1.0, harmony: 'F4', bass: 'G2', percussion: 'snare' },
      { note: 'C4', duration: 3.0, harmony: 'E4', bass: 'C2', percussion: 'crash' },
    ]
  },

  // 6. Tres Caídas de Esperanza - Sharp Cornetas y Tambores fanfare
  'tres-caidas-de-esperanza': {
    id: 'tres-caidas-de-esperanza',
    bpm: 108,
    timeSignature: [4, 4],
    notes: [
      { note: 'D4', duration: 0.5, harmony: 'F#4', bass: 'D3', percussion: 'snare' },
      { note: 'F#4', duration: 0.5, harmony: 'A4', bass: 'D3' },
      { note: 'A4', duration: 1.0, harmony: 'D5', bass: 'D2', percussion: 'bassdrum' },
      { note: 'A4', duration: 0.5, harmony: 'D5', bass: 'D2' },
      { note: 'B4', duration: 0.5, harmony: 'D5', bass: 'G2', percussion: 'snare' },
      { note: 'A4', duration: 1.0, harmony: 'C#5', bass: 'A2', percussion: 'bassdrum' },
      { note: 'G4', duration: 0.5, harmony: 'B4', bass: 'E3' },
      { note: 'F#4', duration: 0.5, harmony: 'A4', bass: 'D3', percussion: 'snare' },
      { note: 'E4', duration: 1.0, harmony: 'G4', bass: 'A2', percussion: 'bassdrum' },
      { note: 'F#4', duration: 0.5, harmony: 'A4', bass: 'D3' },
      { note: 'G4', duration: 0.5, harmony: 'B4', bass: 'G2', percussion: 'snare' },
      { note: 'A4', duration: 2.0, harmony: 'C#5', bass: 'A2', percussion: 'roll' },
      { note: 'D5', duration: 3.0, harmony: 'F#5', bass: 'D2', percussion: 'crash' },
    ]
  },

  // 7. Tambores del Silencio - Muffled solitary drum and deep midnight tone
  'misericordia-en-el-darro': {
    id: 'misericordia-en-el-darro',
    bpm: 50,
    timeSignature: [4, 4],
    notes: [
      { note: 'A2', duration: 1.5, bass: 'A1', percussion: 'muffled' },
      { note: 'REST', duration: 1.5 },
      { note: 'A2', duration: 1.0, bass: 'A1', percussion: 'muffled' },
      { note: 'A2', duration: 1.5, bass: 'A1', percussion: 'muffled' },
      { note: 'REST', duration: 1.0 },
      { note: 'C3', duration: 1.5, bass: 'A1', percussion: 'bell' },
      { note: 'A2', duration: 2.0, bass: 'A1', percussion: 'muffled' },
      { note: 'E2', duration: 1.5, bass: 'E1', percussion: 'muffled' },
      { note: 'REST', duration: 1.5 },
      { note: 'A2', duration: 3.0, bass: 'A1', percussion: 'muffled' },
    ]
  },

  // 8. Angustias de la Alhambra - Palatial solemnity on the hill
  'angustias-alhambra': {
    id: 'angustias-alhambra',
    bpm: 78,
    timeSignature: [4, 4],
    notes: [
      { note: 'D4', duration: 1.5, harmony: 'F4', bass: 'D2', percussion: 'bell' },
      { note: 'E4', duration: 0.5, harmony: 'G4', bass: 'D2' },
      { note: 'F4', duration: 1.0, harmony: 'A4', bass: 'D3', percussion: 'snare' },
      { note: 'A4', duration: 1.0, harmony: 'D5', bass: 'D2' },
      { note: 'G4', duration: 1.5, harmony: 'Bb4', bass: 'G2', percussion: 'bassdrum' },
      { note: 'F4', duration: 0.5, harmony: 'A4', bass: 'D3' },
      { note: 'E4', duration: 2.0, harmony: 'C#5', bass: 'A2', percussion: 'snare' },
      { note: 'D4', duration: 4.0, harmony: 'D5', bass: 'D2', percussion: 'crash' },
    ]
  }
};

export interface SynthesizerState {
  isPlaying: boolean;
  currentMarchId: string | null;
  progress: number;
  currentNote: string;
}

type StateListener = (state: SynthesizerState) => void;

class CofradeMarchEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private currentMarchId: string | null = null;
  private currentProgress = 0;
  private currentNoteName = '';
  private timeouts: NodeJS.Timeout[] = [];
  private onProgressCallback?: (progress: number, noteName: string) => void;
  private onEndCallback?: () => void;
  private volume = 0.8;
  private listeners: Set<StateListener> = new Set();

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlaying,
      currentMarchId: this.currentMarchId,
      progress: this.currentProgress,
      currentNote: this.currentNoteName
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state: SynthesizerState = {
      isPlaying: this.isPlaying,
      currentMarchId: this.currentMarchId,
      progress: this.currentProgress,
      currentNote: this.currentNoteName
    };
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('Synthesizer listener error:', err);
      }
    });
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getAnalyserData(): Uint8Array | null {
    if (!this.analyser) return null;
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    return array;
  }

  public playMarch(
    marchId: string, 
    onProgress?: (progress: number, noteName: string) => void,
    onEnd?: () => void
  ) {
    this.stop();
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    const score = MARCH_SCORES[marchId] || MARCH_SCORES['la-madruga'];
    this.currentMarchId = marchId;
    this.isPlaying = true;
    this.currentProgress = 0;
    this.currentNoteName = score.notes[0]?.note || '';
    this.onProgressCallback = onProgress;
    this.onEndCallback = onEnd;
    this.notifyListeners();

    const secondsPerBeat = 60 / score.bpm;
    let scheduledTime = this.ctx.currentTime + 0.1;
    let elapsedBeats = 0;
    const totalBeats = score.notes.reduce((sum, n) => sum + n.duration, 0);

    score.notes.forEach((event, index) => {
      const durationSeconds = event.duration * secondsPerBeat;
      const noteTime = scheduledTime;

      // 1. Play Lead Brass
      if (event.note && event.note !== 'REST' && NOTES[event.note]) {
        this.synthesizeBrassVoice(NOTES[event.note], noteTime, durationSeconds, 0.45);
      }

      // 2. Play Harmony
      if (event.harmony && event.harmony !== 'REST' && NOTES[event.harmony]) {
        this.synthesizeBrassVoice(NOTES[event.harmony], noteTime, durationSeconds, 0.35);
      }

      // 3. Play Bass Horn / Tuba
      if (event.bass && NOTES[event.bass]) {
        this.synthesizeBassVoice(NOTES[event.bass], noteTime, durationSeconds, 0.4);
      }

      // 4. Play Percussion Accent
      if (event.percussion) {
        this.synthesizePercussion(event.percussion, noteTime);
      }

      // Progress notification timeout
      const delayMs = (noteTime - this.ctx!.currentTime) * 1000;
      const timeout = setTimeout(() => {
        if (this.isPlaying && this.currentMarchId === marchId) {
          const progress = Math.min(100, Math.round((elapsedBeats / totalBeats) * 100));
          this.currentProgress = progress;
          this.currentNoteName = event.note;
          this.onProgressCallback?.(progress, event.note);
          this.notifyListeners();
        }
      }, Math.max(0, delayMs));
      this.timeouts.push(timeout);

      scheduledTime += durationSeconds;
      elapsedBeats += event.duration;
    });

    // Final finish timeout
    const totalDurationMs = (scheduledTime - this.ctx.currentTime) * 1000;
    const endTimeout = setTimeout(() => {
      if (this.isPlaying && this.currentMarchId === marchId) {
        this.stop();
        this.onEndCallback?.();
      }
    }, totalDurationMs + 200);
    this.timeouts.push(endTimeout);
  }

  /**
   * Synthesizes warm cofrade brass voice (cornetas/trompetas)
   */
  private synthesizeBrassVoice(freq: number, startTime: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Sawtooth + square blend for rich metallic brass timbre
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // slight chorusing detune

    // Brass filter envelope: opens with burst, settles warm
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 3.8, 4800), startTime + 0.08);
    filter.frequency.exponentialRampToValueAtTime(freq * 2.2, startTime + duration);
    filter.Q.setValueAtTime(3.2, startTime);

    // Amplitude envelope: brass swell attack
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.05);
    gain.gain.setValueAtTime(gainLevel * 0.9, startTime + duration - 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  /**
   * Synthesizes heavy low bass horn (tuba / bombardino)
   */
  private synthesizeBassVoice(freq: number, startTime: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Synthesizes authentic cofrade percussion
   */
  private synthesizePercussion(type: 'snare' | 'roll' | 'bassdrum' | 'crash' | 'muffled' | 'bell', startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    if (type === 'snare' || type === 'roll') {
      // Snare drum with bordonera rattle
      const bufferSize = this.ctx.sampleRate * (type === 'roll' ? 0.35 : 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(type === 'roll' ? 0.3 : 0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (type === 'roll' ? 0.35 : 0.15));

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(startTime);
    } else if (type === 'bassdrum') {
      // Deep cofrade bombo
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(95, startTime);
      osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.18);

      gain.gain.setValueAtTime(0.65, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    } else if (type === 'crash') {
      // Brass cymbals
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, startTime);
      filter.Q.setValueAtTime(1.5, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(startTime);
    } else if (type === 'muffled') {
      // Tambor con sordina de El Silencio
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, startTime);
      osc.frequency.exponentialRampToValueAtTime(28, startTime + 0.35);

      gain.gain.setValueAtTime(0.65, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    } else if (type === 'bell') {
      // Campanilla de paso de palio
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1520, startTime);
      osc.frequency.exponentialRampToValueAtTime(1480, startTime + 1.1);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    }
  }

  public stop() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.isPlaying = false;
    this.currentMarchId = null;
    this.currentProgress = 0;
    this.currentNoteName = '';
    this.onProgressCallback?.(0, '');
    this.notifyListeners();
  }

  public isMarchPlaying(): boolean {
    return this.isPlaying;
  }

  public getPlayingMarchId(): string | null {
    return this.currentMarchId;
  }
}

export const cofradeSynthesizer = new CofradeMarchEngine();
