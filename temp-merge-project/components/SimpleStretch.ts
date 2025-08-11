// DAGRO - Enkel Stretch-logik för Svelte Portering
// Ren JavaScript utan React-beroenden

export interface StretchStep {
  name: string
  description: string
  duration: number
  instruction: string
  tips?: string
}

export interface StretchRoutine {
  name: string
  description: string
  rune: string
  exercises: StretchStep[]
}

export interface StretchState {
  isActive: boolean
  currentStepIndex: number
  timeLeft: number
  currentStep: StretchStep
  progress: number // 0-100% för hela rutinen
  stepProgress: number // 0-100% för nuvarande steg
}

export const stretchRoutines: Record<'desk' | 'full', StretchRoutine> = {
  desk: {
    name: 'Skrivbordsstretching',
    description: 'Perfekt för långa arbetsdagar',
    rune: 'ᛊᛏᚱᛖᚲ', // Sträck
    exercises: [
      {
        name: 'Nackrotation',
        description: 'Mjuka rotationer för att lösa spänningar',
        duration: 30,
        instruction: 'Rotera huvudet långsamt i cirkel. Först åt höger, sedan åt vänster.',
        tips: 'Håll axlarna avslappnade',
      },
      {
        name: 'Axelrullningar',
        description: 'Lossa upp axlarna och övre ryggen',
        duration: 20,
        instruction: 'Lyft axlarna mot öronen, rulla bakåt och låt dem falla.',
        tips: 'Gör stora, långsamma rörelser',
      },
      {
        name: 'Armsträckning',
        description: 'Sträck armarna över huvudet',
        duration: 25,
        instruction: 'Sträck armarna rakt upp, lås fingrarna och sträck mot taket.',
        tips: 'Andas djupt och känn sträckningen',
      },
      {
        name: 'Sidosträckning',
        description: 'Sträck kroppen åt sidorna',
        duration: 30,
        instruction: 'Lutåt höger med höger arm över huvudet. Upprepa åt vänster.',
        tips: 'Håll höfterna rakt framåt',
      },
    ],
  },
  full: {
    name: 'Hel kroppsstretch',
    description: 'Omfattande stretchrutinning',
    rune: 'ᚺᛖᛚ', // Hel
    exercises: [
      {
        name: 'Kattsträckning',
        description: 'Ryggsträckning i stående',
        duration: 30,
        instruction: 'Böj dig framåt, runda ryggen som en katt och sträck sedan bakåt.',
        tips: 'Rör dig långsamt och kontrollerat',
      },
      {
        name: 'Vadstretch',
        description: 'Sträck bak på benen',
        duration: 40,
        instruction: 'Stå emot vägg, sätt ena foten bakåt och tryck hälen mot golvet.',
        tips: 'Håll benet rakt',
      },
      {
        name: 'Höftflexorer',
        description: 'Öppna upp höfterna',
        duration: 35,
        instruction: 'Ta ett stort steg bakåt och sänk kroppen. Känn sträckningen i höften.',
        tips: 'Håll ryggen rak',
      },
      {
        name: 'Axel och bröst',
        description: 'Öppna bröstkorgen',
        duration: 30,
        instruction: 'För armarna bakåt och känn sträckningen över bröstet.',
        tips: 'Håll huvudet upprätt',
      },
      {
        name: 'Total avslappning',
        description: 'Djup avslappning',
        duration: 45,
        instruction: 'Stå rak, andas djupt och känn hur hela kroppen slappnar av.',
        tips: 'Fokusera på andningen',
      },
    ],
  },
}

export interface StretchConfig {
  routineType: 'desk' | 'full'
  onStateChange?: (state: StretchState) => void
  onComplete?: () => void
  autoStart?: boolean
}

export class SimpleStretch {
  private state: StretchState
  private config: StretchConfig
  private routine: StretchRoutine
  private intervalId: number | null = null

  constructor(config: StretchConfig) {
    this.config = config
    this.routine = stretchRoutines[config.routineType]

    this.state = {
      isActive: false,
      currentStepIndex: 0,
      timeLeft: this.routine.exercises[0].duration,
      currentStep: this.routine.exercises[0],
      progress: 0,
      stepProgress: 0,
    }

    if (config.autoStart) {
      this.start()
    }
  }

  start(): void {
    if (this.intervalId) return

    this.state.isActive = true
    this.state.timeLeft = this.state.currentStep.duration

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
    this.state.currentStepIndex = 0
    this.state.currentStep = this.routine.exercises[0]
    this.state.timeLeft = this.state.currentStep.duration
    this.state.progress = 0
    this.state.stepProgress = 0
    this.notifyStateChange()
  }

  private tick(): void {
    this.state.timeLeft = Math.max(0, this.state.timeLeft - 1)
    this.updateProgress()

    if (this.state.timeLeft <= 0) {
      this.moveToNextStep()
    }

    this.notifyStateChange()
  }

  private moveToNextStep(): void {
    if (this.state.currentStepIndex + 1 >= this.routine.exercises.length) {
      // Rutinen är klar
      this.pause()
      this.config.onComplete?.()
      return
    }

    // Gå till nästa steg
    this.state.currentStepIndex++
    this.state.currentStep = this.routine.exercises[this.state.currentStepIndex]
    this.state.timeLeft = this.state.currentStep.duration
  }

  private updateProgress(): void {
    // Progress för nuvarande steg
    this.state.stepProgress =
      ((this.state.currentStep.duration - this.state.timeLeft) / this.state.currentStep.duration) *
      100

    // Overall progress för hela rutinen
    this.state.progress = ((this.state.currentStepIndex + 1) / this.routine.exercises.length) * 100
  }

  private notifyStateChange(): void {
    this.config.onStateChange?.(this.getState())
  }

  getState(): StretchState {
    return { ...this.state }
  }

  getRoutine(): StretchRoutine {
    return { ...this.routine }
  }

  changeRoutine(routineType: 'desk' | 'full'): void {
    this.pause()
    this.routine = stretchRoutines[routineType]
    this.reset()
    this.config.routineType = routineType
  }

  destroy(): void {
    this.pause()
  }
}

// Hjälpfunktioner
export function getTotalDuration(routineType: 'desk' | 'full'): number {
  return stretchRoutines[routineType].exercises.reduce(
    (total, exercise) => total + exercise.duration,
    0,
  )
}

export function getStepByIndex(routineType: 'desk' | 'full', index: number): StretchStep | null {
  const routine = stretchRoutines[routineType]
  return routine.exercises[index] || null
}
