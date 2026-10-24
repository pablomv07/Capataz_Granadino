import { MarchaCofrade, MARCHAS_GRANADINAS } from '../data/marchas';

export interface RealPlayerState {
  isPlaying: boolean;
  activeMarcha: MarchaCofrade;
  playerMode: 'video' | 'audio';
}

type RealPlayerListener = (state: RealPlayerState) => void;

class RealCofradePlayerManager {
  private activeMarcha: MarchaCofrade = MARCHAS_GRANADINAS[0];
  private isPlaying = false;
  private playerMode: 'video' | 'audio' = 'video';
  private listeners: Set<RealPlayerListener> = new Set();

  public subscribe(listener: RealPlayerListener): () => void {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlaying,
      activeMarcha: this.activeMarcha,
      playerMode: this.playerMode
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public play(marcha?: MarchaCofrade) {
    if (marcha) {
      this.activeMarcha = marcha;
    }
    this.isPlaying = true;
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay(marcha: MarchaCofrade) {
    if (this.isPlaying && this.activeMarcha.id === marcha.id) {
      this.stop();
    } else {
      this.play(marcha);
    }
  }

  public setMode(mode: 'video' | 'audio') {
    this.playerMode = mode;
    this.notify();
  }

  public getActiveMarcha(): MarchaCofrade {
    return this.activeMarcha;
  }

  public isMarchPlaying(): boolean {
    return this.isPlaying;
  }

  private notify() {
    const state: RealPlayerState = {
      isPlaying: this.isPlaying,
      activeMarcha: this.activeMarcha,
      playerMode: this.playerMode
    };
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('Real player listener error:', err);
      }
    });
  }
}

export const realCofradePlayer = new RealCofradePlayerManager();
