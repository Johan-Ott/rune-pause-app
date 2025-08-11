// DAGRO - Enkel Ljud-logik för Svelte Portering
// Ren JavaScript utan React-beroenden

export type SoundType = 'wind' | 'rain' | 'forest' | 'ocean' | 'fire' | 'none'

export interface SoundConfig {
  type: SoundType
  enabled: boolean
  volume: number // 0-1
  loop: boolean
  fadeInDuration?: number // millisekunder
  fadeOutDuration?: number // millisekunder
}

export interface SoundState {
  isPlaying: boolean
  currentType: SoundType
  volume: number
  error?: string
}

// Ljudfiler - i riktig implementation skulle dessa vara riktiga filer
export const soundSources: Record<SoundType, string> = {
  wind: '/sounds/nordic-wind.mp3',
  rain: '/sounds/nordic-rain.mp3',
  forest: '/sounds/nordic-forest.mp3',
  ocean: '/sounds/nordic-ocean.mp3',
  fire: '/sounds/nordic-fire.mp3',
  none: '',
}

export const soundDescriptions: Record<SoundType, string> = {
  wind: 'Nordisk vind genom skogen',
  rain: 'Lugnt regn på takpannor',
  forest: 'Levande nordisk skog',
  ocean: 'Vågor mot klippkust',
  fire: 'Sprakande brasa',
  none: 'Tystnad',
}

export class SimpleSounds {
  private audio: HTMLAudioElement | null = null
  private config: SoundConfig
  private state: SoundState
  private fadeInterval: number | null = null

  constructor(config: SoundConfig) {
    this.config = { ...config }
    this.state = {
      isPlaying: false,
      currentType: config.type,
      volume: config.volume,
      error: undefined,
    }
  }

  async play(): Promise<void> {
    if (!this.config.enabled || this.config.type === 'none') {
      return
    }

    try {
      await this.loadSound()

      if (!this.audio) return

      this.audio.volume = this.config.fadeInDuration ? 0 : this.config.volume
      this.audio.loop = this.config.loop

      await this.audio.play()
      this.state.isPlaying = true
      this.state.error = undefined

      // Fade in om specifiserat
      if (this.config.fadeInDuration) {
        this.fadeIn()
      }
    } catch (error) {
      this.state.error = `Could not play sound: ${error}`
      console.warn('Sound playback failed:', error)
    }
  }

  stop(): void {
    if (!this.audio) return

    if (this.config.fadeOutDuration) {
      this.fadeOut(() => {
        this.audio?.pause()
        if (this.audio) this.audio.currentTime = 0
        this.state.isPlaying = false
      })
    } else {
      this.audio.pause()
      this.audio.currentTime = 0
      this.state.isPlaying = false
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause()
      this.state.isPlaying = false
    }
  }

  resume(): void {
    if (this.audio && !this.state.isPlaying) {
      this.audio.play().catch((error) => {
        this.state.error = `Could not resume sound: ${error}`
      })
      this.state.isPlaying = true
    }
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume))
    this.state.volume = this.config.volume

    if (this.audio) {
      this.audio.volume = this.config.volume
    }
  }

  async changeSound(type: SoundType): Promise<void> {
    const wasPlaying = this.state.isPlaying

    this.stop()
    this.config.type = type
    this.state.currentType = type

    if (wasPlaying && type !== 'none') {
      await this.play()
    }
  }

  private async loadSound(): Promise<void> {
    if (this.config.type === 'none') return

    // Dispose av tidigare ljud
    if (this.audio) {
      this.audio.pause()
      this.audio = null
    }

    const source = soundSources[this.config.type]
    if (!source) return

    this.audio = new Audio(source)
    this.audio.preload = 'auto'

    // Vänta på att ljudet laddas
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        reject(new Error('No audio element'))
        return
      }

      this.audio.addEventListener('canplaythrough', () => resolve(), { once: true })
      this.audio.addEventListener('error', reject, { once: true })

      // Timeout efter 5 sekunder
      setTimeout(() => reject(new Error('Audio load timeout')), 5000)
    })
  }

  private fadeIn(): void {
    if (!this.audio || !this.config.fadeInDuration) return

    const steps = 20
    const stepDuration = this.config.fadeInDuration / steps
    const volumeStep = this.config.volume / steps
    let currentStep = 0

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        return
      }

      currentStep++
      this.audio.volume = Math.min(volumeStep * currentStep, this.config.volume)

      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        this.fadeInterval = null
      }
    }, stepDuration)
  }

  private fadeOut(onComplete?: () => void): void {
    if (!this.audio || !this.config.fadeOutDuration) {
      onComplete?.()
      return
    }

    const steps = 20
    const stepDuration = this.config.fadeOutDuration / steps
    const volumeStep = this.audio.volume / steps
    let currentStep = 0

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        onComplete?.()
        return
      }

      currentStep++
      this.audio.volume = Math.max(this.audio.volume - volumeStep, 0)

      if (currentStep >= steps || this.audio.volume <= 0) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        this.fadeInterval = null
        onComplete?.()
      }
    }, stepDuration)
  }

  getState(): SoundState {
    return { ...this.state }
  }

  updateConfig(newConfig: Partial<SoundConfig>): void {
    this.config = { ...this.config, ...newConfig }

    if (newConfig.volume !== undefined) {
      this.setVolume(newConfig.volume)
    }

    if (newConfig.type !== undefined && newConfig.type !== this.state.currentType) {
      this.changeSound(newConfig.type)
    }
  }

  destroy(): void {
    this.stop()

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    if (this.audio) {
      this.audio = null
    }
  }
}

// Hjälpfunktioner
export function getAllSoundTypes(): SoundType[] {
  return Object.keys(soundSources) as SoundType[]
}

export function getSoundDescription(type: SoundType): string {
  return soundDescriptions[type] || 'Okänt ljud'
}

export function isSoundSupported(): boolean {
  return typeof Audio !== 'undefined'
}
