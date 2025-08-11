<script>
  export let onActivitySelect = () => {}
  export let onSkip = () => {}
  export let pauseType = 'short'

  const activities = [
    {
      id: 'simple',
      title: 'Andas',
      subtitle: 'Tre djupa andetag',
      icon: '🫁',
      rune: 'ᚢᚱᛖᚾᛏ',
      description: 'Tre djupa andetag',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'rest',
      title: 'Vila ögonen',
      subtitle: 'Blicka bort från skärmen',
      icon: '👁️',
      rune: 'ᚺᚢᛁᛚᚨ',
      description: 'Blicka bort från skärmen',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'stretch',
      title: 'Sträck ut',
      subtitle: 'Lyft armarna över huvudet',
      icon: '🤸‍♀️',
      rune: 'ᛋᛏᚱᛖᚲ',
      description: 'Lyft armarna över huvudet',
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'focus',
      title: 'Fokusandning',
      subtitle: 'Koncentrationsförhöjande teknik',
      icon: '🧠',
      rune: '◊ ᚲᛟᚾᛉ ◊',
      description: 'Koncentrationsförhöjande teknik',
      color: 'from-indigo-400 to-purple-500',
    },
    {
      id: 'quickStretch',
      title: 'Snabbstretch',
      subtitle: 'Kort stretchsekvens',
      icon: '🤸‍♀️',
      rune: 'ᛋᚱᛖ',
      description: 'Kort stretchsekvens',
      color: 'from-amber-400 to-orange-500',
    },
  ]

  function handleActivitySelect(activity) {
    onActivitySelect(activity)
  }
</script>

<div
  class="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col"
>
  <!-- Skip Button - Top Right -->
  <div class="absolute top-6 right-6 z-10">
    <button
      on:click={onSkip}
      class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all duration-200 text-sm font-medium"
    >
      Hoppa över paus
    </button>
  </div>

  <!-- Header -->
  <div class="text-center pt-16 pb-8">
    <div class="text-4xl font-bold text-white mb-2">☄️ Smart val aktivitet ☄️</div>
    <p class="text-white/80 text-lg">Välj din aktivitet baserat på hur du känner dig</p>
  </div>

  <!-- Activity Grid -->
  <div class="flex-1 flex items-center justify-center px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {#each activities as activity}
        <button
          on:click={() => handleActivitySelect(activity)}
          class="group relative bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
        >
          <!-- Nordic Rune -->
          <div class="text-2xl font-bold text-white/70 mb-3 text-center">
            {activity.rune}
          </div>

          <!-- Icon -->
          <div class="text-4xl mb-4 text-center">
            {activity.icon}
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-white mb-2 text-center">
            {activity.title}
          </h3>

          <!-- Subtitle -->
          <p class="text-white/80 text-sm mb-4 text-center">
            {activity.subtitle}
          </p>

          <!-- Description -->
          <p class="text-white/60 text-xs text-center">
            {activity.description}
          </p>

          <!-- Hover gradient overlay -->
          <div
            class="absolute inset-0 rounded-xl bg-gradient-to-br {activity.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          ></div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Footer -->
  <div class="text-center pb-8">
    <p class="text-white/60 text-sm">❄️ ᚾᛟᚱᛞᛁᛋᚲ ❄️</p>
  </div>
</div>
