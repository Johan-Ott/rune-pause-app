export class SoundManager {
  private audio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    try {
      this.audio = new Audio('/src/assets/sounds/notification.mp3');
      this.audio.preload = 'auto';
    } catch (error) {
      console.warn('Could not load notification sound:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('mexro-sound-enabled', String(enabled));
  }

  getEnabled(): boolean {
    const saved = localStorage.getItem('mexro-sound-enabled');
    return saved ? saved === 'true' : true;
  }

  async playNotification() {
    if (!this.isEnabled || !this.audio) return;

    try {
      this.audio.currentTime = 0;
      await this.audio.play();
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  // Nordic/cosmic sound effects using Web Audio API
  async playBreakStart() {
    if (!this.isEnabled) return;
    this.createSynthSound(440, 0.1, 'sine'); // Gentle A note
  }

  async playBreakEnd() {
    if (!this.isEnabled) return;
    this.createSynthSound(523.25, 0.1, 'sine'); // Gentle C note
  }

  async playTimerComplete() {
    if (!this.isEnabled) return;
    // Play a calming sequence
    this.createSynthSound(523.25, 0.15, 'sine'); // C
    setTimeout(() => this.createSynthSound(659.25, 0.15, 'sine'), 200); // E
    setTimeout(() => this.createSynthSound(783.99, 0.15, 'sine'), 400); // G
  }

  private createSynthSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      // Gentle fade in/out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Could not create synth sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
