<script>
  import { onMount, onDestroy } from 'svelte'
  import { invoke } from '@tauri-apps/api/core'
  import PauseView from './lib/PauseView.svelte'
  import { soundSystem } from './lib/soundSystem.js'

  // App states
  let isFullscreenPause = false
  let pauseConfig = {}

  // Timer state
  let timerRunning = false
  let timeRemaining = 0
  let selectedTechnique = '4-7-8'
  let totalDuration = 25 * 60 // 25 minutes in seconds
  let timer
  let darkMode = false

  // Settings
  let soundEnabled = false
  let soundType = 'wind'
  let smartSelection = true
  let pauseInterval = 25 // minutes
  let pauseDuration = 15 // seconds for short breaks

  // Format time for display
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage for ring
  function getProgress() {
    if (totalDuration === 0) return 0
    return ((totalDuration - timeRemaining) / totalDuration) * 100
  }

  // Update tray with current status
  async function updateTrayStatus() {
    try {
      if (timerRunning) {
        const mins = Math.floor(timeRemaining / 60)
        const secs = timeRemaining % 60
        await invoke('update_tray_timer', {
          minutes: mins,
          seconds: secs,
          isRunning: true,
        })
      } else {
        await invoke('update_tray_timer', {
          minutes: 0,
          seconds: 0,
          isRunning: false,
        })
      }
    } catch (error) {
      console.error('Failed to update tray:', error)
    }
  }

  // Start timer
  async function startTimer() {
    timerRunning = true
    timeRemaining = totalDuration

    await updateTrayStatus()

    timer = setInterval(async () => {
      if (timeRemaining > 0) {
        timeRemaining--
        await updateTrayStatus()

        // Check if it's time for a break
        if (timeRemaining === 0) {
          triggerPause()
        }
      }
    }, 1000)
  }

  // Stop timer
  async function stopTimer() {
    timerRunning = false
    clearInterval(timer)
    await updateTrayStatus()
  }

  // Reset timer
  async function resetTimer() {
    timerRunning = false
    timeRemaining = totalDuration
    clearInterval(timer)
    await updateTrayStatus()
  }

  // Trigger pause break
  async function triggerPause() {
    stopTimer()

    try {
      await invoke('show_fullscreen_pause', {
        pauseType: 'short',
        duration: pauseDuration,
        soundEnabled: soundEnabled,
        soundType: soundType,
      })
    } catch (error) {
      console.error('Failed to show fullscreen pause:', error)
      // Fallback to restart timer if pause fails
      startTimer()
    }
  }

  // Handle activity selection (not used with fullscreen pauses)
  function handleActivitySelect(activity) {
    // This is no longer used since we show fullscreen pauses directly
  }

  // Handle pause completion (called when fullscreen pause closes)
  function handlePauseComplete() {
    invoke('close_fullscreen_pause')
    // close_fullscreen_pause will call window.exitFullscreenPause
  }

  // Handle pause skip (called when fullscreen pause closes)
  function handlePauseSkip() {
    invoke('close_fullscreen_pause')
    // close_fullscreen_pause will call window.exitFullscreenPause
  }

  // Toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  onMount(() => {
    // Apply system tray styling
    document.body.classList.add('system-tray')

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('nordic-timer-dark-mode')
    if (savedDarkMode) {
      darkMode = JSON.parse(savedDarkMode)
      toggleDarkMode()
    }

    // Make pause functions available globally
    window.startFullscreenPause = (config) => {
      isFullscreenPause = true
      pauseConfig = config
    }

    window.exitFullscreenPause = () => {
      isFullscreenPause = false
      pauseConfig = {}
      // Restart timer after pause
      startTimer()
    }
  })

  onDestroy(() => {
    if (timer) clearInterval(timer)
    soundSystem.stopSound()
    // Clean up global functions
    delete window.startFullscreenPause
    delete window.exitFullscreenPause
  })

  // Save settings when they change
  $: if (typeof window !== 'undefined') {
    localStorage.setItem('nordic-timer-dark-mode', JSON.stringify(darkMode))
  }

  // Keyboard shortcuts
  function handleKeydown(event) {
    if (event.key === ' ') {
      event.preventDefault()
      if (timerRunning) {
        stopTimer()
      } else {
        startTimer()
      }
    }
    if (event.key === 't') {
      // Test pause shortcut
      triggerPause()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isFullscreenPause}
  <!-- Fullscreen Pause Mode -->
  <PauseView
    duration={pauseConfig.duration || 15}
    soundEnabled={pauseConfig.soundEnabled || false}
    soundType={pauseConfig.soundType || 'wind'}
    onComplete={handlePauseComplete}
    onSkip={handlePauseSkip}
    pauseType={pauseConfig.type || 'short'}
  />
{:else}
  <!-- System Tray Interface Mode -->
  <div class="system-tray-popover">
    <div class="w-full max-w-sm mx-auto">
      <div class="modern-container rounded-xl overflow-hidden shadow-2xl">
        <!-- Header with Rune and Dark Mode Toggle -->
        <div class="modern-header p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1" />

            <!-- Centered Nordic Rune R -->
            <div class="text-3xl relative text-primary font-bold rune-glow">
              <span class="relative">
                ᚱ
                <div class="absolute inset-0 text-primary opacity-30 blur-sm">ᚱ</div>
              </span>
            </div>

            <!-- Dark Mode Toggle -->
            <div class="flex-1 flex justify-end">
              <div class="flex items-center gap-1">
                <!-- Sun Icon -->
                <svg
                  class="w-3 h-3 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="m12 2 0 2" />
                  <path d="m12 20 0 2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="m2 12 2 0" />
                  <path d="m20 12 2 0" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>

                <!-- Dark Mode Switch -->
                <label class="modern-switch">
                  <input type="checkbox" bind:checked={darkMode} on:change={toggleDarkMode} />
                  <span class="modern-switch-slider"></span>
                </label>

                <!-- Moon Icon -->
                <svg
                  class="w-3 h-3 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Timer Display Section -->
        <div class="p-6 text-center">
          <!-- Timer Circle -->
          <div class="relative w-32 h-32 mx-auto mb-6">
            <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <!-- Background circle -->
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="rgba(var(--border-rgb), 0.2)"
                stroke-width="8"
                fill="none"
              />
              <!-- Progress circle -->
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="rgb(var(--primary-rgb))"
                stroke-width="8"
                fill="none"
                stroke-dasharray="339.292"
                stroke-dashoffset={339.292 - (getProgress() / 100) * 339.292}
                class="transition-all duration-1000 ease-linear"
              />
            </svg>

            <!-- Timer Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-2xl font-mono font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
              <div class="text-xs text-muted-foreground mt-1">
                {timerRunning ? 'Körs' : 'Pausad'}
              </div>
            </div>
          </div>

          <!-- Technique Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-foreground mb-2">Teknik</label>
            <select bind:value={selectedTechnique} class="modern-select w-full">
              <option value="4-7-8">4-7-8 Teknik</option>
              <option value="pomodoro">Pomodoro</option>
              <option value="custom">Anpassad</option>
            </select>
          </div>

          <!-- Control Buttons -->
          <div class="flex gap-2 mb-6">
            <button
              on:click={timerRunning ? stopTimer : startTimer}
              class="modern-button flex-1 {timerRunning
                ? 'modern-button-secondary'
                : 'modern-button-primary'}"
            >
              {timerRunning ? 'Pausa' : 'Starta'}
            </button>
            <button on:click={resetTimer} class="modern-button modern-button-secondary px-4">
              Återställ
            </button>
          </div>

          <!-- Test Pause Button -->
          <button on:click={triggerPause} class="modern-button modern-button-outline w-full mb-4">
            Testa paus
          </button>
        </div>

        <!-- Settings Section -->
        <div class="border-t border-border">
          <div class="p-4 space-y-4">
            <!-- Smart Choice Toggle -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-foreground">Smart val aktivitet</label>
              <label class="modern-switch">
                <input type="checkbox" bind:checked={smartSelection} />
                <span class="modern-switch-slider"></span>
              </label>
            </div>

            <!-- Sound Settings -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-foreground">Ljud</label>
                <label class="modern-switch">
                  <input type="checkbox" bind:checked={soundEnabled} />
                  <span class="modern-switch-slider"></span>
                </label>
              </div>

              {#if soundEnabled}
                <div>
                  <select bind:value={soundType} class="modern-select w-full">
                    <option value="wind">🌬️ Nordanvind</option>
                    <option value="forest">🌲 Skogsrus</option>
                    <option value="rain">🌧️ Regndroppar</option>
                    <option value="silence">🤫 Tystnad</option>
                  </select>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body.system-tray) {
    margin: 0;
    padding: 0;
    background: transparent;
    overflow: hidden;
  }
</style>
