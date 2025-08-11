// DAGRO - Enkel Andnings-logik för Svelte Portering
// Ren JavaScript utan React-beroenden

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause'

export interface BreathingStep {
  phase: BreathingPhase
  duration: number
  instruction: string
}

export interface BreathingPattern {
  name: string
  description: string
  rune: string
  phases: BreathingStep[]
}

export interface BreathingState {
  isActive: boolean
  currentPhaseIndex: number
  timeLeft: number
  cyclesCompleted: number
  totalCycles: number
  currentPhase: BreathingStep
  progress: number // 0-100% för nuvarande fas
  overallProgress: number // 0-100% för hela sessionen
}

export const breathingPatterns: Record<string, BreathingPattern> = {
  '4-7-8': {
    name: '4-7-8 Teknik',
    description: 'Klassisk lugnande andningsteknik',
    rune: 'ᚨᚾᛞ', // And - andning
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Andas in' },
      { phase: 'hold', duration: 7, instruction: 'Håll andan' },
      { phase: 'exhale', duration: 8, instruction: 'Andas ut' },
      { phase: 'pause', duration: 2, instruction: 'Vila' },
    ],
  },
  box: {
    name: 'Box Andning',
    description: 'Fyrkantandning för balans',
    rune: 'ᚠᚤᚱ', // Fyr - fyra
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Andas in' },
      { phase: 'hold', duration: 4, instruction: 'Håll' },
      { phase: 'exhale', duration: 4, instruction: 'Andas ut' },
      { phase: 'pause', duration: 4, instruction: 'Vila' },
    ],
  },
}

export interface BreathingConfig {
  patternKey: keyof typeof breathingPatterns
  totalCycles: number
  onStateChange?: (state: BreathingState) => void
  onComplete?: () => void
  autoStart?: boolean
}

export class SimpleBreathing {
  private state: BreathingState
  private config: BreathingConfig
  private pattern: BreathingPattern
  private intervalId: number | null = null

  constructor(config: BreathingConfig) {
    this.config = config
    this.pattern = breathingPatterns[config.patternKey]

    this.state = {
      isActive: false,
      currentPhaseIndex: 0,
      timeLeft: this.pattern.phases[0].duration,
      cyclesCompleted: 0,
      totalCycles: config.totalCycles,
      currentPhase: this.pattern.phases[0],
      progress: 0,
      overallProgress: 0,
    }

    if (config.autoStart) {
      this.start()
    }
  }

  start(): void {
    if (this.intervalId) return

    this.state.isActive = true
    this.state.timeLeft = this.state.currentPhase.duration

    this.intervalId = setInterval(() => {
      this.tick()
    }, 1000)

    this.notifyStateChange()
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state.isActive = false
    this.notifyStateChange()
  }

  reset(): void {
    this.pause()
    this.state.currentPhaseIndex = 0
    this.state.timeLeft = this.pattern.phases[0].duration
    this.state.cyclesCompleted = 0
    this.state.currentPhase = this.pattern.phases[0]
    this.state.progress = 0
    this.state.overallProgress = 0
    this.notifyStateChange()
  }

  private tick(): void {
    this.state.timeLeft = Math.max(0, this.state.timeLeft - 1)
    this.updateProgress()

    if (this.state.timeLeft <= 0) {
      this.moveToNextPhase()
    }

    this.notifyStateChange()
  }

  private moveToNextPhase(): void {
    const nextPhaseIndex = (this.state.currentPhaseIndex + 1) % this.pattern.phases.length

    if (nextPhaseIndex === 0) {
      // Fullständig cykel klar
      this.state.cyclesCompleted++

      if (this.state.cyclesCompleted >= this.state.totalCycles) {
        // Hela sessionen klar
        this.pause()
        this.config.onComplete?.()
        return
      }
    }

    this.state.currentPhaseIndex = nextPhaseIndex
    this.state.currentPhase = this.pattern.phases[nextPhaseIndex]
    this.state.timeLeft = this.state.currentPhase.duration
  }

  private updateProgress(): void {
    // Progress för nuvarande fas
    this.state.progress =
      ((this.state.currentPhase.duration - this.state.timeLeft) /
        this.state.currentPhase.duration) *
      100

    // Overall progress för hela sessionen
    const totalPhases = this.state.totalCycles * this.pattern.phases.length
    const completedPhases =
      this.state.cyclesCompleted * this.pattern.phases.length + this.state.currentPhaseIndex
    const currentPhaseProgress = this.state.progress / 100
    this.state.overallProgress = ((completedPhases + currentPhaseProgress) / totalPhases) * 100
  }

  private notifyStateChange(): void {
    this.config.onStateChange?.(this.getState())
  }

  getState(): BreathingState {
    return { ...this.state }
  }

  getPattern(): BreathingPattern {
    return { ...this.pattern }
  }

  changePattern(patternKey: keyof typeof breathingPatterns): void {
    this.pause()
    this.pattern = breathingPatterns[patternKey]
    this.reset()
    this.config.patternKey = patternKey
  }

  destroy(): void {
    this.pause()
  }
}

// Hjälpfunktioner för andningsanimation
export function getBreathingScale(phase: BreathingPhase, progress: number): number {
  switch (phase) {
    case 'inhale':
      return 1 + 0.5 * progress // Skala från 1 till 1.5
    case 'hold':
      return 1.5 // Stanna på max storlek
    case 'exhale':
      return 1.5 - 0.5 * progress // Skala från 1.5 tillbaka till 1
    case 'pause':
      return 1 // Stanna på bassstorlek
    default:
      return 1
  }
}

export function getPhaseColor(phase: BreathingPhase): string {
  switch (phase) {
    case 'inhale':
      return 'from-blue-400 to-blue-600'
    case 'hold':
      return 'from-purple-400 to-purple-600'
    case 'exhale':
      return 'from-green-400 to-green-600'
    case 'pause':
      return 'from-gray-400 to-gray-600'
    default:
      return 'from-blue-400 to-blue-600'
  }
}
