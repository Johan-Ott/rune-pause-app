<script>
  import { onMount, onDestroy } from 'svelte'
  import { invoke } from '@tauri-apps/api/core'
  import { soundSystem } from './lib/soundSystem.js'

  export let config = {}

  let timeLeft = config.duration || 15
  let currentActivity = 'simple'
  let isRunning = true
  let timer

  // Different pause activities with fuller content
  const activities = {
    simple: {
      title: 'Kort paus',
      subtitle: 'Solens kraft och värme • Kraftfull energi och klarhet',
      icon: '☀️',
      rune: 'ᚢᚱᛖᚾᛏ',
      description: 'Vila ögonen och andas lugnt',
      instructions: [
        'Blicka bort från skärmen',
        'Fokusera på något långt borta',
        'Blinka flera gånger',
        'Andas djupt och lugnt',
      ],
      color: 'from-amber-400 to-orange-500',
    },
    breathing: {
      title: 'Andas',
      subtitle: 'Tre djupa andetag',
      icon: '🫁',
      rune: 'ᚨᚾᛞᚨᛋ',
      description: 'Fyra sekunder in, håll, fyra sekunder ut',
      instructions: [
        'Sätt dig bekvämt',
        'Andas in genom näsan (4 sek)',
        'Håll andan (4 sek)',
        'Andas ut genom munnen (4 sek)',
        'Upprepa tills timern går ut',
      ],
      color: 'from-blue-400 to-cyan-500',
    },
    stretch: {
      title: 'Skrivbordsstretching',
      subtitle: 'Perfekt för långa arbetsdagar',
      icon: '🧘‍♀️',
      rune: 'ᛋᛏᚱᛖᚲ',
      description: 'Mobilisera nacke, axlar och rygg',
      instructions: [
        'Res dig upp från stolen',
        'Rotera huvudet långsamt åt höger och vänster',
        'Lyft axlarna upp mot öronen, håll, släpp',
        'Sträck armarna över huvudet',
        'Vrid försiktigt överkroppen åt båda hållen',
      ],
      color: 'from-purple-400 to-pink-500',
    },
    focus: {
      title: 'Fokusandning',
      subtitle: 'Koncentrationsförhöjande teknik',
      icon: '🧠',
      rune: 'ᚠᛟᚲᚢᛋ',
      description: 'Andas djupt och fokusera på nuet',
      instructions: [
        'Sätt dig rakt upp',
        'Slut ögonen försiktigt',
        'Fokusera endast på din andning',
        'Räkna varje andetag från 1 till 10',
        'Börja om från 1 när du når 10',
      ],
      color: 'from-emerald-400 to-teal-500',
    },
    quickStretch: {
      title: 'Snabbstretch',
      subtitle: 'Kort men effektiv rörelse',
      icon: '🤸‍♀️',
      rune: 'ᚱᚨᛊᚲ',
      description: 'Snabb mobilisering för hela kroppen',
      instructions: [
        'Stå upp och sträck dig mot taket',
        'Böj dig framåt och rör tårna',
        'Vrid huvudet åt höger och vänster',
        'Rulla axlarna bakåt 5 gånger',
        'Gör en djup squat om du kan',
      ],
      color: 'from-indigo-400 to-purple-500',
    },
  }

  // Smart activity selection based on time and type
  function selectActivity() {
    const hour = new Date().getHours()

    if (config.type === 'long') {
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
    if (config.soundEnabled && config.soundType !== 'silence') {
      soundSystem.playSound(config.soundType, 0.4)
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

  async function handleComplete() {
    isRunning = false
    soundSystem.stopSound()
    await invoke('close_fullscreen_pause')
  }

  async function handleSkip() {
    isRunning = false
    soundSystem.stopSound()
    await invoke('close_fullscreen_pause')
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function getProgressPercentage() {
    return ((config.duration - timeLeft) / config.duration) * 100
  }

  // Handle keyboard shortcuts
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleSkip()
    }
    if (event.key === ' ') {
      event.preventDefault()
      isRunning = !isRunning
    }
  }

  $: currentActivityData = activities[currentActivity]
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Fullscreen Pause View -->
<div class="fixed inset-0 bg-gradient-to-br {currentActivityData.color} flex flex-col text-white">
  <!-- Skip Button - Top Right -->
  <div class="absolute top-8 right-8 z-10">
    <button
      on:click={handleSkip}
      class="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all duration-200 text-lg font-medium shadow-lg"
    >
      Hoppa över paus
    </button>
  </div>

  <!-- Progress Bar - Top -->
  <div class="absolute top-0 left-0 right-0 h-2 bg-white/20">
    <div
      class="h-full bg-white transition-all duration-1000 ease-linear"
      style="width: {getProgressPercentage()}%"
    ></div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col items-center justify-center px-12">
    <!-- Nordic Rune Header -->
    <div class="text-8xl font-bold mb-6 opacity-90 text-shadow">
      {currentActivityData.rune}
    </div>

    <!-- Activity Title -->
    <h1 class="text-6xl font-bold mb-4 text-center">
      {currentActivityData.title}
    </h1>

    <!-- Subtitle -->
    <p class="text-2xl opacity-80 mb-12 text-center max-w-2xl">
      {currentActivityData.subtitle}
    </p>

    <!-- Timer Display -->
    <div class="text-9xl font-light mb-12 font-mono tracking-wider">
      {formatTime(timeLeft)}
    </div>

    <!-- Progress Ring -->
    <div class="relative w-48 h-48 mb-12">
      <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
        <!-- Background circle -->
        <circle
          cx="100"
          cy="100"
          r="85"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="12"
          fill="none"
        />
        <!-- Progress circle -->
        <circle
          cx="100"
          cy="100"
          r="85"
          stroke="white"
          stroke-width="12"
          fill="none"
          stroke-dasharray="534.07"
          stroke-dashoffset={534.07 - (getProgressPercentage() / 100) * 534.07}
          class="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-6xl">
        {currentActivityData.icon}
      </div>
    </div>

    <!-- Activity Instructions -->
    <div class="max-w-4xl text-center">
      <p class="text-3xl opacity-90 mb-8">
        {currentActivityData.description}
      </p>

      <!-- Step-by-step instructions -->
      <div class="space-y-4">
        {#each currentActivityData.instructions as instruction, index}
          <div class="flex items-center justify-center space-x-4 text-xl opacity-80">
            <span
              class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold"
            >
              {index + 1}
            </span>
            <span>{instruction}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Sound indicator -->
    {#if config.soundEnabled && config.soundType !== 'silence'}
      <div class="absolute bottom-8 left-8 text-white/70 text-xl">
        🎵 {config.soundType === 'wind'
          ? '🌬️ Nordanvind'
          : config.soundType === 'forest'
            ? '🌲 Skogsrus'
            : '🌧️ Regndroppar'}
      </div>
    {/if}

    <!-- Pause/Resume hint -->
    <div class="absolute bottom-8 right-8 text-white/50 text-lg">
      Tryck Space för att pausa • Escape för att hoppa över
    </div>
  </div>
</div>

<style>
  .text-shadow {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
</style>
