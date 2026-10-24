/**
 * Web Audio API synthesizer for authentic Cofrade sound effects:
 * - Llamador / Tarja metálica (crisp brass knock against heavy timber)
 * - Tambor con sordina de El Silencio (solemn muffled drumbeat)
 * - Campana de paso de palio (resonant church-like silver bell)
 */

class CofradeSoundEffects {
  private ctx: AudioContext | null = null;
  private drumInterval: any = null;
  public isDrumPlaying = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Sound of the Llamador / Tarja (metallic bronze strike)
   * Simulates the sharp strike of the brass knocker against the paso wood
   */
  public playLlamador(doubleKnock = false) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const knock = (timeOffset: number, pitch = 880) => {
      const now = ctx.currentTime + timeOffset;

      // Primary metallic strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1250, now);
      filter.Q.setValueAtTime(4.5, now);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);

      // Low wood resonance of the paso platform
      const woodOsc = ctx.createOscillator();
      const woodGain = ctx.createGain();
      woodOsc.type = 'sine';
      woodOsc.frequency.setValueAtTime(95, now);
      woodOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

      woodGain.gain.setValueAtTime(0.4, now);
      woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      woodOsc.connect(woodGain);
      woodGain.connect(ctx.destination);

      woodOsc.start(now);
      woodOsc.stop(now + 0.18);
    };

    knock(0, 920);
    if (doubleKnock) {
      knock(0.18, 960);
    }
  }

  /**
   * Sound of the Palio bell chime
   */
  public playCampanilla() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1520, now);
    osc.frequency.exponentialRampToValueAtTime(1490, now + 1.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  /**
   * Sound of the muffled penitential drum of El Silencio (single beat)
   */
  public playTamborSilencio() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Toggle continuous muffled drumbeat (rhythm of the Jueves Santo night)
   */
  public toggleTamborLoop(onStateChange?: (isPlaying: boolean) => void) {
    if (this.isDrumPlaying) {
      if (this.drumInterval) {
        clearInterval(this.drumInterval);
        this.drumInterval = null;
      }
      this.isDrumPlaying = false;
      onStateChange?.(false);
    } else {
      this.isDrumPlaying = true;
      this.playTamborSilencio();
      this.drumInterval = setInterval(() => {
        this.playTamborSilencio();
      }, 1500);
      onStateChange?.(true);
    }
  }

  public stopAll() {
    if (this.drumInterval) {
      clearInterval(this.drumInterval);
      this.drumInterval = null;
    }
    this.isDrumPlaying = false;
  }
}

export const cofradeAudio = new CofradeSoundEffects();
