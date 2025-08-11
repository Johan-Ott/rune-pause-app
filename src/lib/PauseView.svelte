<script>
  import { onMount, onDestroy } from 'svelte'
  import { soundSystem } from '../lib/soundSystem.js'

  export let pauseType = 'short' // 'short' | 'long'
  export let duration = 15 // seconds
  export let soundEnabled = false
  export let soundType = 'wind' // 'wind' | 'forest' | 'rain' | 'silence'
  export let onComplete = () => {}
  export let onSkip = () => {}

  let timeLeft = duration
  let currentActivity = 'simple'
  let isRunning = true
  let timer

  // Different pause activities
  const activities = {
    simple: {
      title: 'Kort paus',
      subtitle: 'Solens kraft och värme • Kraftfull energi och klarhet',
      icon: '☀️',
      rune: 'ᚢᚱᛖᚾᛏ',
      description: 'Vila ögonen och andas lugnt',
      color: 'from-amber-400 to-orange-500',
    },
    breathing: {
      title: 'Andas',
      subtitle: 'Tre djupa andetag',
      icon: '🫁',
      rune: 'ᚢᚱᛖᚾᛏ',
      description: 'Fyra sekunder in, håll, fyra sekunder ut',
      color: 'from-blue-400 to-cyan-500',
    },
    stretch: {
      title: 'Skrivbordsstretching',
      subtitle: 'Perfekt för långa arbetsdagar',
      icon: '🧘‍♀️',
      rune: 'ᛋᛏᚱᛖᚲ',
      description: 'Rotera huvudet långsamt i cirkel',
      color: 'from-purple-400 to-pink-500',
    },
    focus: {
      title: 'Fokusandning',
      subtitle: 'Koncentrationsförhöjande teknik',
      icon: '🧠',
      rune: '◊ ᚲᛟᚾᛉ ◊',
      description: 'Andas djupt och fokusera på nu',
      color: 'from-emerald-400 to-teal-500',
    },
    quickStretch: {
      title: 'Snabbstretch',
      subtitle: 'Kort stretchsekvens',
      icon: '🤸‍♀️',
      rune: 'ᛋᚱᛖ',
      description: 'Sträck armarna över huvudet',
      color: 'from-indigo-400 to-purple-500',
    },
  }

  // Smart activity selection based on time and type
  function selectActivity() {
    const hour = new Date().getHours()

    if (pauseType === 'long') {
      if (hour < 10) return 'stretch'
      if (hour > 16) return 'breathing'
      return 'focus'
    } else {
      if (hour < 12) return 'simple'
      if (hour > 14 && hour < 17) return 'quickStretch'
      return 'breathing'
    }
  }

  onMount(() => {
    // Select activity based on smart logic
    currentActivity = selectActivity()

    // Start background sound if enabled
    if (soundEnabled && soundType !== 'silence') {
      soundSystem.playSound(soundType, 0.4)
    }

    // Start countdown timer
    timer = setInterval(() => {
      if (timeLeft > 0 && isRunning) {
        timeLeft--
      } else if (timeLeft === 0) {
        handleComplete()
      }
    }, 1000)
  })

  onDestroy(() => {
    if (timer) clearInterval(timer)
    soundSystem.stopSound()
  })

  function handleComplete() {
    isRunning = false
    soundSystem.stopSound()
    onComplete()
  }

  function handleSkip() {
    isRunning = false
    soundSystem.stopSound()
    onSkip()
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function getProgressPercentage() {
    return ((duration - timeLeft) / duration) * 100
  }

  $: currentActivityData = activities[currentActivity]
</script>

<!-- Fullscreen Pause View -->
<div class="fixed inset-0 z-50 bg-gradient-to-br {currentActivityData.color} flex flex-col">
  <!-- Skip Button - Top Right -->
  <div class="absolute top-6 right-6 z-10">
    <button
      on:click={handleSkip}
      class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all duration-200 text-sm font-medium"
    >
      Hoppa över paus
    </button>
  </div>

  <!-- Progress Bar - Top -->
  <div class="absolute top-0 left-0 right-0 h-1 bg-white/20">
    <div
      class="h-full bg-white transition-all duration-1000 ease-linear"
      style="width: {getProgressPercentage()}%"
    ></div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col items-center justify-center text-white px-8">
    <!-- Nordic Rune Header -->
    <div class="text-6xl font-bold mb-2 opacity-90 text-shadow">
      {currentActivityData.rune}
    </div>

    <!-- Activity Title -->
    <h1 class="text-4xl font-bold mb-2 text-center">
      {currentActivityData.title}
    </h1>

    <!-- Subtitle -->
    <p class="text-lg opacity-80 mb-8 text-center max-w-md">
      {currentActivityData.subtitle}
    </p>

    <!-- Timer Display -->
    <div class="text-8xl font-light mb-8 font-mono tracking-wider">
      {formatTime(timeLeft)}
    </div>

    <!-- Progress Ring -->
    <div class="relative w-32 h-32 mb-8">
      <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <!-- Background circle -->
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="8"
          fill="none"
        />
        <!-- Progress circle -->
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="white"
          stroke-width="8"
          fill="none"
          stroke-dasharray="339.292"
          stroke-dashoffset={339.292 - (getProgressPercentage() / 100) * 339.292}
          class="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-4xl">
        {currentActivityData.icon}
      </div>
    </div>

    <!-- Activity Description -->
    <p class="text-xl opacity-90 text-center max-w-lg mb-8">
      {currentActivityData.description}
    </p>

    <!-- Activity-specific content -->
    {#if currentActivity === 'breathing'}
      <div class="text-center">
        <div class="text-sm opacity-70 mb-4">❄️ Interaktiv guide ❄️</div>
        <div class="space-y-2 text-lg">
          <div>Andas in (4s) → Håll (4s) → Andas ut (4s)</div>
          <div class="text-sm opacity-80">Upprepa tills timern går ut</div>
        </div>
      </div>
    {/if}

    {#if currentActivity === 'stretch'}
      <div class="text-center">
        <div class="text-sm opacity-70 mb-4">❄️ Tips: Håll axlarna avslappnade ❄️</div>
        <div class="space-y-2 text-lg">
          <div>1. Rotera huvudet långsamt åt höger</div>
          <div>2. Sedan åt vänster</div>
          <div>3. Sträck armarna över huvudet</div>
        </div>
      </div>
    {/if}

    {#if currentActivity === 'focus'}
      <div class="text-center">
        <div class="text-sm opacity-70 mb-4">❄️ Koncentrationsförhöjande ❄️</div>
        <div class="space-y-2 text-lg">
          <div>Fokusera på din andning</div>
          <div class="text-sm opacity-80">Låt tankarna komma och gå</div>
        </div>
      </div>
    {/if}

    <!-- Sound indicator -->
    {#if soundEnabled && soundType !== 'silence'}
      <div class="absolute bottom-6 left-6 text-white/70 text-sm">
        🎵 {soundType === 'wind'
          ? '🌬️ Nordanvind'
          : soundType === 'forest'
            ? '🌲 Skogsrus'
            : '🌧️ Regndroppar'}
      </div>
    {/if}

    <!-- Step indicator for longer pauses -->
    {#if pauseType === 'long'}
      <div class="absolute bottom-6 right-6 text-white/70 text-sm">Steg 1 av 4</div>
    {/if}
  </div>
</div>

<style>
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
</style>
