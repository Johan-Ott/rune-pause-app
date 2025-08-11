# DAGRO - Svelte Portering Guide

Detta projekt innehåller nu separerade filer som enkelt kan porteras till Svelte utan React-beroenden.

## Filer för Portering

### 1. CSS Styling

- **`/styles/nordic-theme.css`** - Komplett nordisk natthimmel-tema med alla klasser

### 2. JavaScript Logik (React-fri)

- **`/components/SimpleTimer.ts`** - Timer-funktionalitet
- **`/components/SimpleBreathing.ts`** - Andnings-övningar
- **`/components/SimpleStretch.ts`** - Stretch-rutiner
- **`/components/SimpleSounds.ts`** - Ljudsystem

## Användning i Svelte

### 1. CSS Integration

```html
<!-- I din main Svelte layout -->
<style>
  @import './nordic-theme.css';
</style>
```

### 2. Timer Komponent

```typescript
// Timer.svelte
<script lang="ts">
  import { SimpleTimer, formatTime } from './SimpleTimer';
  import { onDestroy } from 'svelte';

  export let duration = 300; // 5 minuter

  let timeLeft = duration;
  let progress = 0;

  const timer = new SimpleTimer({
    duration,
    onTick: (state) => {
      timeLeft = state.timeLeft;
      progress = state.progress;
    },
    onComplete: () => {
      console.log('Timer färdig!');
    },
    autoStart: true
  });

  onDestroy(() => {
    timer.destroy();
  });
</script>

<div class="nordic-container">
  <div class="nordic-timer">{formatTime(timeLeft)}</div>
  <div class="nordic-progress-bar">
    <div class="nordic-progress-fill" style="width: {progress}%"></div>
  </div>
</div>
```

### 3. Andnings Komponent

```typescript
// Breathing.svelte
<script lang="ts">
  import { SimpleBreathing, getBreathingScale } from './SimpleBreathing';
  import { onDestroy } from 'svelte';

  let breathingState = {
    isActive: false,
    currentPhase: { phase: 'inhale', instruction: 'Andas in' },
    timeLeft: 4,
    progress: 0
  };

  const breathing = new SimpleBreathing({
    patternKey: '4-7-8',
    totalCycles: 3,
    onStateChange: (state) => {
      breathingState = state;
    },
    onComplete: () => {
      console.log('Andning färdig!');
    }
  });

  $: scale = getBreathingScale(breathingState.currentPhase.phase, breathingState.progress / 100);

  onDestroy(() => {
    breathing.destroy();
  });
</script>

<div class="night-sky-background">
  <div class="stars-layer"></div>
  <div class="aurora-borealis"></div>

  <div class="nordic-container">
    <div class="nordic-header">
      <span class="nordic-rune rune-glow">ᚨᚾᛞ</span>
      <h1 class="nordic-title">4-7-8 Teknik</h1>
    </div>

    <div
      class="night-glass-cosmic rounded-full w-64 h-64 flex items-center justify-center"
      style="transform: scale({scale})"
    >
      <div class="text-center">
        <div class="nordic-timer text-white">{breathingState.timeLeft}</div>
        <div class="nordic-subtitle">{breathingState.currentPhase.instruction}</div>
      </div>
    </div>

    <button class="nordic-button-primary" on:click={() => breathing.start()}>
      Starta
    </button>
  </div>
</div>
```

### 4. Stretch Komponent

```typescript
// Stretch.svelte
<script lang="ts">
  import { SimpleStretch } from './SimpleStretch';
  import { onDestroy } from 'svelte';

  export let routineType: 'desk' | 'full' = 'desk';

  let stretchState = {
    currentStep: { name: '', instruction: '', tips: '' },
    timeLeft: 0,
    progress: 0,
    stepProgress: 0
  };

  const stretch = new SimpleStretch({
    routineType,
    onStateChange: (state) => {
      stretchState = state;
    },
    onComplete: () => {
      console.log('Stretch färdig!');
    },
    autoStart: true
  });

  onDestroy(() => {
    stretch.destroy();
  });
</script>

<div class="night-sky-background">
  <div class="nordic-container">
    <div class="nordic-card">
      <div class="nordic-timer">{stretchState.timeLeft}s</div>
      <h2 class="nordic-title">{stretchState.currentStep.name}</h2>
      <p class="nordic-subtitle">{stretchState.currentStep.instruction}</p>

      {#if stretchState.currentStep.tips}
        <div class="glass-subtle rounded-xl p-4 mt-4">
          <p class="text-sm opacity-70">💡 Tips: {stretchState.currentStep.tips}</p>
        </div>
      {/if}
    </div>

    <button class="nordic-button-ghost" on:click={() => stretch.reset()}>
      Börja om
    </button>
  </div>
</div>
```

### 5. Ljud Komponent

```typescript
// Sounds.svelte
<script lang="ts">
  import { SimpleSounds, getAllSoundTypes, getSoundDescription } from './SimpleSounds';
  import { onDestroy } from 'svelte';

  export let enabled = false;
  export let soundType = 'wind';

  const sounds = new SimpleSounds({
    type: soundType,
    enabled,
    volume: 0.3,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000
  });

  $: if (enabled) {
    sounds.play();
  } else {
    sounds.stop();
  }

  onDestroy(() => {
    sounds.destroy();
  });
</script>

<div class="modern-card">
  <h3>Bakgrundsljud</h3>

  <label class="flex items-center space-x-2">
    <input type="checkbox" bind:checked={enabled} />
    <span>Aktivera ljud</span>
  </label>

  {#if enabled}
    <select bind:value={soundType} on:change={() => sounds.changeSound(soundType)}>
      {#each getAllSoundTypes() as type}
        <option value={type}>{getSoundDescription(type)}</option>
      {/each}
    </select>
  {/if}
</div>
```

## CSS Klasser att Använda

### Layout

- `.nordic-container` - Huvudcontainer
- `.nordic-card` - Kortlayout
- `.nordic-header` - Header-sektion

### Typography

- `.nordic-title` - Huvudrubriker
- `.nordic-subtitle` - Underrubriker
- `.nordic-rune` - Rune-text med glow
- `.nordic-timer` - Timer-display

### Bakgrunder

- `.night-sky-background` - Natthimmel
- `.stars-layer` - Stjärnor
- `.aurora-borealis` - Nordljus
- `.magic-particles` - Partiklar

### Glass Effekter

- `.night-glass-ethereal` - Ljus glass
- `.night-glass-mystical` - Medium glass
- `.night-glass-cosmic` - Stark glass
- `.glass-subtle` - Subtil glass

### Knappar

- `.nordic-button-primary` - Primär knapp
- `.nordic-button-ghost` - Ghost knapp
- `.btn-top-right` - Positionering top-right
- `.btn-top-left` - Positionering top-left

### Animationer

- `.night-shimmer` - Shimmer-effekt
- `.night-hover` - Hover-effekt
- `.rune-glow` - Rune glöd-animation
- `.fade-in` - Fade in animation

## Exempel-app struktur

```
src/
├── lib/
│   ├── SimpleTimer.ts
│   ├── SimpleBreathing.ts
│   ├── SimpleStretch.ts
│   └── SimpleSounds.ts
├── styles/
│   └── nordic-theme.css
└── routes/
    ├── Timer.svelte
    ├── Breathing.svelte
    ├── Stretch.svelte
    └── +layout.svelte
```

Alla klasser och funktioner är testade och redo för produktion! 🌟💙
