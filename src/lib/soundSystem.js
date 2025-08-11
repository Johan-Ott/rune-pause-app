// Sound system for Nordic ambient sounds during breaks
// SoundType: 'wind' | 'forest' | 'rain' | 'silence'

class NordicSoundSystem {
  constructor() {
    this.audioContext = null
    this.currentSound = null
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.isInitialized = true
    } catch (error) {
      console.warn('Audio context not available:', error)
    }
  }

  createWindSound() {
    if (!this.audioContext) return null

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Nordic wind characteristics
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(140, this.audioContext.currentTime + 8)

    // Low-pass filter for wind-like sound
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime)

    // Gentle volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 3)
    gainNode.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 6)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    return { oscillator, gainNode }
  }

  createForestSound() {
    if (!this.audioContext) return null

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Forest ambiance - higher frequencies
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 10)

    // Band-pass filter for forest-like sound
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(400, this.audioContext.currentTime)
    filter.Q.setValueAtTime(1.2, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 4)
    gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 8)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    return { oscillator, gainNode }
  }

  createRainSound() {
    if (!this.audioContext) return null

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Rain sound - white noise characteristics
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 6)

    // High-pass filter for rain-like sound
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1200, this.audioContext.currentTime)
    filter.Q.setValueAtTime(0.8, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 2)
    gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 4)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    return { oscillator, gainNode }
  }

  async playSound(soundType, volume = 0.3) {
    if (soundType === 'silence') {
      this.stopSound()
      return
    }

    await this.initialize()
    if (!this.audioContext) return

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current sound
    this.stopSound()

    try {
      switch (soundType) {
        case 'wind':
          this.currentSound = this.createWindSound()
          break
        case 'forest':
          this.currentSound = this.createForestSound()
          break
        case 'rain':
          this.currentSound = this.createRainSound()
          break
      }

      if (this.currentSound) {
        // Apply volume
        this.currentSound.gainNode.gain.value *= volume
        this.currentSound.oscillator.start()
      }
    } catch (error) {
      console.warn('Could not play sound:', error)
    }
  }

  stopSound() {
    if (this.currentSound) {
      try {
        this.currentSound.oscillator.stop()
      } catch (error) {
        // Oscillator might already be stopped
      }
      this.currentSound = null
    }
  }

  setVolume(volume) {
    if (this.currentSound) {
      this.currentSound.gainNode.gain.value = volume * 0.3 // Base volume multiplier
    }
  }
}

export const soundSystem = new NordicSoundSystem()
