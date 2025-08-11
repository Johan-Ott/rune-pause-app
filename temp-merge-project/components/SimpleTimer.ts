// DAGRO - Enkel Timer för Svelte Portering
// Ren JavaScript utan React-beroenden

export interface TimerState {
  timeLeft: number
  isActive: boolean
  duration: number
  progress: number // 0-100%
}

export interface TimerConfig {
  duration: number // i sekunder
  onTick?: (state: TimerState) => void
  onComplete?: () => void
  autoStart?: boolean
}

export class SimpleTimer {
  private state: TimerState
  private config: TimerConfig
  private intervalId: number | null = null

  constructor(config: TimerConfig) {
    this.config = config
    this.state = {
      timeLeft: config.duration,
      isActive: config.autoStart || false,
      duration: config.duration,
      progress: 0,
    }

    if (config.autoStart) {
      this.start()
    }
  }

  start(): void {
    if (this.intervalId) return // Redan igång

    this.state.isActive = true
    this.intervalId = setInterval(() => {
      this.tick()
    }, 1000)
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state.isActive = false
  }

  reset(): void {
    this.pause()
    this.state.timeLeft = this.config.duration
    this.state.progress = 0
    this.notifyStateChange()
  }

  stop(): void {
    this.pause()
    this.state.timeLeft = 0
    this.state.progress = 100
    this.notifyStateChange()
  }

  private tick(): void {
    this.state.timeLeft = Math.max(0, this.state.timeLeft - 1)
    this.state.progress =
      ((this.config.duration - this.state.timeLeft) / this.config.duration) * 100

    if (this.state.timeLeft <= 0) {
      this.pause()
      this.config.onComplete?.()
    }

    this.notifyStateChange()
  }

  private notifyStateChange(): void {
    this.config.onTick?.(this.getState())
  }

  getState(): TimerState {
    return { ...this.state }
  }

  setDuration(duration: number): void {
    this.config.duration = duration
    if (!this.state.isActive) {
      this.state.timeLeft = duration
      this.state.duration = duration
      this.state.progress = 0
      this.notifyStateChange()
    }
  }

  destroy(): void {
    this.pause()
  }
}

// Hjälpfunktioner för formatering
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatTimeForDisplay(seconds: number): { minutes: string; seconds: string } {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return {
    minutes: mins.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  }
}
