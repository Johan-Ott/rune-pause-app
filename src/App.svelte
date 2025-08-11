<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { invoke } from '@tauri-apps/api/core'

  // Store for dark mode
  const darkMode = writable(false)

  // Timer state
  let timerMinutes = 20
  let timerRunning = false
  let timerPaused = false
  let timeLeft = 0
  let smartChoice = true
  let soundEnabled = false
  let shortBreakInterval = 20
  let longBreakInterval = 60
  let statusUpdateInterval
  
  // Notification tracking
  let lastNotificationTime = 0
  let shortBreakNotified = false
  let longBreakNotified = false

  // Apply dark mode
  $: {
    if ($darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    // Always apply system tray styling
    document.body.classList.add('system-tray')
  }

  onMount(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('nordic-timer-dark-mode')
    if (savedDarkMode) {
      darkMode.set(JSON.parse(savedDarkMode))
    }

    // Save dark mode changes
    darkMode.subscribe((value) => {
      localStorage.setItem('nordic-timer-dark-mode', JSON.stringify(value))
    })

    // Start status update loop
    startStatusUpdates()
  })

  async function startStatusUpdates() {
    statusUpdateInterval = setInterval(async () => {
      try {
        const status = await invoke('get_status')
        updateUIFromStatus(status)
      } catch (error) {
        console.error('Failed to get timer status:', error)
      }
    }, 1000)
  }

  function updateUIFromStatus(status) {
    timerRunning = status.is_running
    timerPaused = status.is_paused

    if (status.duration && status.elapsed_ms !== undefined) {
      const totalMs = status.duration.secs * 1000 + Math.floor(status.duration.nanos / 1000000)
      const remainingMs = Math.max(0, totalMs - status.elapsed_ms)
      timeLeft = Math.ceil(remainingMs / 1000)

      // Check for break notifications
      checkBreakNotifications(timeLeft)
    }
  }

  async function checkBreakNotifications(timeLeftSeconds) {
    if (!timerRunning || timerPaused) {
      // Reset notification flags when timer is not running
      shortBreakNotified = false
      longBreakNotified = false
      return
    }

    // Mini break notification (10 seconds before)
    if (timeLeftSeconds === 10 && !shortBreakNotified) {
      await sendNotification('🌸 Mini Break kommer snart', 'Ta en kort paus om 10 sekunder')
      shortBreakNotified = true
    }

    // Long break notification (30 seconds before) 
    if (timeLeftSeconds === 30 && !longBreakNotified) {
      await sendNotification('🌿 Lång paus kommer snart', 'Dags för en längre vila om 30 sekunder')
      longBreakNotified = true
    }
  }

  async function sendNotification(title, body) {
    try {
      await invoke('send_notification', { title, body })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  async function toggleTimer() {
    // Reset notification flags when starting a new timer
    shortBreakNotified = false
    longBreakNotified = false
    
    try {
      if (timerRunning) {
        if (timerPaused) {
          // Resume timer
          await invoke('resume_timer')
        } else {
          // Pause timer
          await invoke('pause_timer')
        }
      } else {
        // Start new timer
        const durationMs = timerMinutes * 60 * 1000
        await invoke('start_timer', { ms: durationMs })
      }
    } catch (error) {
      console.error('Failed to toggle timer:', error)
    }
  }

  async function stopTimer() {
    try {
      await invoke('stop_timer')
      timeLeft = 0
      // Reset notification flags
      shortBreakNotified = false
      longBreakNotified = false
    } catch (error) {
      console.error('Failed to stop timer:', error)
    }
  }

  async function triggerBreak() {
    try {
      const durationMs = timerMinutes * 60 * 1000
      await invoke('start_timer', { ms: durationMs })
      // Reset notification flags for new break timer
      shortBreakNotified = false
      longBreakNotified = false
    } catch (error) {
      console.error('Failed to start break timer:', error)
    }
  }
</script>

<!-- System Tray Menu Interface -->
<div class="system-tray-popover">
  <div class="w-full max-w-sm mx-auto">
    <div class="modern-container rounded-xl overflow-hidden">
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

              <!-- Toggle Switch -->
              <button
                class="modern-switch scale-75 {$darkMode ? 'active' : ''}"
                on:click={() => darkMode.update((n) => !n)}
                role="switch"
                aria-checked={$darkMode}
              >
                <div class="switch-track">
                  <div class="switch-thumb"></div>
                </div>
              </button>

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

        <!-- Timer Display removed - will use system notifications instead -->
        <!-- Notifications will appear for: -->
        <!-- - 10 seconds before mini break -->
        <!-- - 30 seconds before long break -->
      </div>

      <!-- Main Content -->
      <div class="p-4 space-y-3">
        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn-nordic-outline h-9 text-xs font-normal"
            on:click={triggerBreak}
            disabled={timerRunning}
          >
            <svg class="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="m9 12 4.5 2.5V9.5z" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            Vila nu
          </button>

          <button
            class="btn-nordic-outline h-9 text-xs font-normal"
            on:click={timerRunning ? stopTimer : toggleTimer}
          >
            {#if timerRunning}
              <svg class="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="9" y="9" width="6" height="6" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
              Stoppa
            {:else}
              <svg
                class="w-3 h-3 mr-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 2v10" />
                <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
              </svg>
              Aktivera
            {/if}
          </button>
        </div>

        <!-- Settings Sections -->
        <div class="space-y-3">
          <!-- Smart Choice -->
          <div class="space-y-2 py-2 border-t border-border/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <!-- Zap Icon -->
                <svg
                  class="w-4 h-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M13 2 L3 14 h9 l-1 8 L21 10 h-9 l1-8z" />
                </svg>
                <label class="text-sm cursor-pointer">Smart val</label>
              </div>
              <button
                class="modern-switch scale-75 {smartChoice ? 'active' : ''}"
                on:click={() => (smartChoice = !smartChoice)}
                role="switch"
                aria-checked={smartChoice}
              >
                <div class="switch-track">
                  <div class="switch-thumb"></div>
                </div>
              </button>
            </div>

            {#if smartChoice}
              <div class="space-y-2 pl-6">
                <select class="modern-select w-full p-2 text-xs rounded-lg">
                  <option value="medium">Medium energi</option>
                  <option value="low">Låg energi</option>
                  <option value="high">Hög energi</option>
                </select>

                <div class="flex gap-1">
                  <button
                    class="flex-1 py-1.5 px-2 text-xs rounded-lg modern-interactive text-muted-foreground hover:text-foreground"
                  >
                    Vila
                  </button>
                  <button
                    class="flex-1 py-1.5 px-2 text-xs rounded-lg modern-interactive text-muted-foreground hover:text-foreground"
                  >
                    Andning
                  </button>
                  <button
                    class="flex-1 py-1.5 px-2 text-xs rounded-lg modern-interactive text-muted-foreground hover:text-foreground"
                  >
                    Stretch
                  </button>
                </div>
              </div>
            {/if}
          </div>

          <!-- Intervals -->
          <div class="space-y-3 py-2 border-t border-border/50">
            <div class="flex items-center space-x-2">
              <!-- Activity Icon -->
              <svg
                class="w-4 h-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M22 12h-2.48a2 2 0 0 0-1.93 2.52l-1.35 4.87a1 1 0 0 1-1.93-.01L11.38 7a2 2 0 0 0-3.84.48l-.46 2.3A2 2 0 0 0 8.99 12H16"
                />
              </svg>
              <label class="text-sm">Intervaller</label>
            </div>

            <div class="space-y-3 pl-6">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs text-muted-foreground">Kort paus</label>
                  <span class="text-xs font-medium text-primary">
                    {shortBreakInterval} min
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  bind:value={shortBreakInterval}
                  class="modern-slider w-full"
                />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs text-muted-foreground">Lång paus</label>
                  <span class="text-xs font-medium text-primary">
                    {longBreakInterval} min
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="15"
                  bind:value={longBreakInterval}
                  class="modern-slider w-full"
                />
              </div>
            </div>
          </div>

          <!-- Sound -->
          <div class="space-y-2 py-2 border-t border-border/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                {#if soundEnabled}
                  <!-- Volume On Icon -->
                  <svg
                    class="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                {:else}
                  <!-- Volume Off Icon -->
                  <svg
                    class="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5z" />
                    <line x1="22" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="22" y2="15" />
                  </svg>
                {/if}
                <label class="text-sm cursor-pointer">Ljud</label>
              </div>
              <button
                class="modern-switch scale-75 {soundEnabled ? 'active' : ''}"
                on:click={() => (soundEnabled = !soundEnabled)}
                role="switch"
                aria-checked={soundEnabled}
              >
                <div class="switch-track">
                  <div class="switch-thumb"></div>
                </div>
              </button>
            </div>

            {#if soundEnabled}
              <div class="pl-6">
                <select class="modern-select w-full p-2 text-xs rounded-lg">
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
