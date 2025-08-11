<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentActivityStore, settingsStore, timerStore, availableActivities } from '../stores/appStore';
  import type { Activity, AppSettings } from '../types';
  import { invoke } from '@tauri-apps/api/core';

  let settings: AppSettings;
  let activities: Activity[] = [];
  let currentActivity: Activity | null = null;
  let timeRemaining = 300; // 5 minutes default
  let isPlaying = false;
  let showInstructions = false;
  let instructionIndex = 0;
  let timer: ReturnType<typeof setInterval>;

  // Subscribe to stores
  settingsStore.subscribe(s => settings = s);
  availableActivities.subscribe(a => activities = a);
  currentActivityStore.subscribe(a => currentActivity = a);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function selectRandomActivity() {
    if (activities.length > 0) {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      if (randomActivity) {
        currentActivityStore.set(randomActivity);
        timeRemaining = randomActivity.duration;
        showInstructions = true;
        instructionIndex = 0;
      }
    }
  }

  function startActivity() {
    if (!currentActivity) return;
    
    isPlaying = true;
    timeRemaining = currentActivity.duration;
    
    timer = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        completeActivity();
      }
    }, 1000);
  }

  function pauseActivity() {
    isPlaying = false;
    clearInterval(timer);
  }

  function completeActivity() {
    isPlaying = false;
    clearInterval(timer);
    showInstructions = false;
    // Could show completion message or auto-close
  }

  function skipActivity() {
    selectRandomActivity();
  }

  async function dismissBreak() {
    try {
      await invoke('hide_pause_window');
    } catch (error) {
      console.error('Failed to dismiss break:', error);
    }
  }

  function nextInstruction() {
    if (currentActivity && instructionIndex < currentActivity.instructions!.length - 1) {
      instructionIndex++;
    }
  }

  function prevInstruction() {
    if (instructionIndex > 0) {
      instructionIndex--;
    }
  }

  onMount(() => {
    // Start with a random activity
    selectRandomActivity();
    
    // Prevent context menu and selection
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    
    // Escape key handling (make it hard to dismiss)
    let escapeCount = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escapeCount++;
        if (escapeCount >= 3) {
          dismissBreak();
        }
      } else {
        escapeCount = 0;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', e => e.preventDefault());
      document.removeEventListener('selectstart', e => e.preventDefault());
    };
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<div class="pause-container">
  <!-- Background overlay -->
  <div class="background-overlay"></div>
  
  <!-- Main content -->
  <div class="pause-content">
    
    <!-- Header -->
    <header class="pause-header">
      <h1 class="pause-title runic-title">ᛏᛁᛞ ᚠᛟᚱ ᚨᛏᛏ ᚱᛁᛚᚨ</h1>
      <p class="pause-subtitle">Tid för att vila</p>
    </header>

    <!-- Timer Display -->
    <div class="timer-display night-glass-cosmic">
      <div class="timer-circle">
        <div class="timer-progress" style="--progress: {currentActivity ? (currentActivity.duration - timeRemaining) / currentActivity.duration : 0}">
          <div class="timer-text">
            <span class="time-value">{formatTime(timeRemaining)}</span>
            <span class="time-label">kvar</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Section -->
    {#if currentActivity}
      <section class="activity-section night-glass-cosmic">
        <div class="activity-header">
          <span class="activity-icon">{currentActivity.icon}</span>
          <div class="activity-info">
            <h2 class="activity-name">{currentActivity.name}</h2>
            <p class="activity-description">{currentActivity.description}</p>
          </div>
        </div>

        <!-- Instructions -->
        {#if showInstructions && currentActivity.instructions}
          <div class="instructions-container">
            <div class="instruction-counter">
              {instructionIndex + 1} av {currentActivity.instructions.length}
            </div>
            <div class="instruction-text">
              {currentActivity.instructions[instructionIndex]}
            </div>
            <div class="instruction-nav">
              <button 
                class="nav-button" 
                on:click={prevInstruction}
                disabled={instructionIndex === 0}
              >
                ‹ Föregående
              </button>
              <button 
                class="nav-button" 
                on:click={nextInstruction}
                disabled={instructionIndex >= currentActivity.instructions.length - 1}
              >
                Nästa ›
              </button>
            </div>
          </div>
        {/if}

        <!-- Activity Controls -->
        <div class="activity-controls">
          {#if !isPlaying}
            <button class="control-button primary" on:click={startActivity}>
              <span class="button-icon">▶</span>
              <span>Starta</span>
            </button>
          {:else}
            <button class="control-button secondary" on:click={pauseActivity}>
              <span class="button-icon">⏸</span>
              <span>Pausa</span>
            </button>
          {/if}
          
          <button class="control-button secondary" on:click={skipActivity}>
            <span class="button-icon">⏭</span>
            <span>Byt aktivitet</span>
          </button>
        </div>
      </section>
    {/if}

    <!-- Bottom Actions -->
    <footer class="pause-footer">
      <div class="footer-info">
        <p class="dismiss-hint">Tryck Escape 3 gånger för att avsluta</p>
      </div>
      
      <button class="dismiss-button" on:click={dismissBreak}>
        <span class="button-icon">✕</span>
        <span>Avsluta vila</span>
      </button>
    </footer>
  </div>
</div>

<style>
  .pause-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
    user-select: none;
  }

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--nordic-cosmic-surface-base);
    background-image: 
      radial-gradient(circle at 25% 25%, var(--nordic-aurora-cyan-dim) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, var(--nordic-aurora-purple-dim) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, var(--nordic-aurora-green-dim) 0%, transparent 70%);
    z-index: -1;
  }

  .pause-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--nordic-space-xl);
    max-width: 600px;
    padding: var(--nordic-space-xl);
    text-align: center;
  }

  .pause-header {
    margin-bottom: var(--nordic-space-lg);
  }

  .pause-title {
    font-family: 'Cinzel', serif;
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0 0 var(--nordic-space-sm) 0;
    background: var(--nordic-aurora-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
  }

  .pause-subtitle {
    font-size: 1.25rem;
    color: var(--nordic-cosmic-text-secondary);
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .timer-display {
    padding: var(--nordic-space-xl);
    border-radius: var(--nordic-radius-xl);
    border: 1px solid var(--nordic-cosmic-border);
    backdrop-filter: blur(20px);
  }

  .timer-circle {
    width: 200px;
    height: 200px;
    position: relative;
  }

  .timer-progress {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      var(--nordic-aurora-cyan) 0deg,
      var(--nordic-aurora-cyan) calc(var(--progress) * 360deg),
      var(--nordic-cosmic-surface-elevated) calc(var(--progress) * 360deg),
      var(--nordic-cosmic-surface-elevated) 360deg
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .timer-progress::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: var(--nordic-cosmic-surface-base);
    border-radius: 50%;
  }

  .timer-text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .time-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--nordic-cosmic-text-primary);
    font-variant-numeric: tabular-nums;
  }

  .time-label {
    font-size: 0.875rem;
    color: var(--nordic-cosmic-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: -0.5rem;
  }

  .activity-section {
    width: 100%;
    max-width: 500px;
    padding: var(--nordic-space-xl);
    border-radius: var(--nordic-radius-xl);
    border: 1px solid var(--nordic-cosmic-border);
    backdrop-filter: blur(20px);
  }

  .activity-header {
    display: flex;
    align-items: center;
    gap: var(--nordic-space-lg);
    margin-bottom: var(--nordic-space-lg);
    text-align: left;
  }

  .activity-icon {
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
  }

  .activity-info {
    flex: 1;
  }

  .activity-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--nordic-cosmic-text-primary);
    margin: 0 0 var(--nordic-space-xs) 0;
  }

  .activity-description {
    font-size: 1rem;
    color: var(--nordic-cosmic-text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .instructions-container {
    background: var(--nordic-cosmic-surface-elevated);
    border-radius: var(--nordic-radius-lg);
    padding: var(--nordic-space-lg);
    margin-bottom: var(--nordic-space-lg);
    border: 1px solid var(--nordic-cosmic-border);
  }

  .instruction-counter {
    font-size: 0.75rem;
    color: var(--nordic-cosmic-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--nordic-space-sm);
  }

  .instruction-text {
    font-size: 1.125rem;
    color: var(--nordic-cosmic-text-primary);
    line-height: 1.6;
    margin-bottom: var(--nordic-space-lg);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .instruction-nav {
    display: flex;
    gap: var(--nordic-space-md);
    justify-content: center;
  }

  .nav-button {
    padding: var(--nordic-space-sm) var(--nordic-space-md);
    border-radius: var(--nordic-radius-md);
    border: 1px solid var(--nordic-cosmic-border);
    background: var(--nordic-cosmic-surface-base);
    color: var(--nordic-cosmic-text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--nordic-transition-smooth);
  }

  .nav-button:hover:not(:disabled) {
    background: var(--nordic-cosmic-surface-hover);
    color: var(--nordic-cosmic-text-primary);
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .activity-controls {
    display: flex;
    gap: var(--nordic-space-md);
    justify-content: center;
  }

  .control-button {
    padding: var(--nordic-space-md) var(--nordic-space-xl);
    border-radius: var(--nordic-radius-lg);
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: var(--nordic-space-sm);
    cursor: pointer;
    transition: all var(--nordic-transition-smooth);
    min-width: 140px;
    justify-content: center;
  }

  .control-button.primary {
    background: var(--nordic-aurora-cyan-gradient);
    border: 1px solid var(--nordic-aurora-cyan);
    color: var(--nordic-cosmic-text-primary);
  }

  .control-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--nordic-shadow-lg);
    border-color: var(--nordic-aurora-cyan-bright);
  }

  .control-button.secondary {
    background: var(--nordic-cosmic-surface-elevated);
    border: 1px solid var(--nordic-cosmic-border);
    color: var(--nordic-cosmic-text-secondary);
  }

  .control-button.secondary:hover {
    background: var(--nordic-cosmic-surface-hover);
    color: var(--nordic-cosmic-text-primary);
  }

  .button-icon {
    font-size: 1.2rem;
  }

  .pause-footer {
    margin-top: var(--nordic-space-xl);
    text-align: center;
  }

  .footer-info {
    margin-bottom: var(--nordic-space-lg);
  }

  .dismiss-hint {
    font-size: 0.875rem;
    color: var(--nordic-cosmic-text-muted);
    margin: 0;
    opacity: 0.7;
  }

  .dismiss-button {
    padding: var(--nordic-space-sm) var(--nordic-space-lg);
    border-radius: var(--nordic-radius-md);
    border: 1px solid var(--nordic-cosmic-border);
    background: var(--nordic-cosmic-surface-elevated);
    color: var(--nordic-cosmic-text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--nordic-transition-smooth);
    display: flex;
    align-items: center;
    gap: var(--nordic-space-sm);
    margin: 0 auto;
  }

  .dismiss-button:hover {
    background: var(--nordic-cosmic-surface-hover);
    color: var(--nordic-cosmic-text-primary);
    border-color: var(--nordic-aurora-red);
  }

  @media (max-height: 768px) {
    .pause-content {
      gap: var(--nordic-space-lg);
      padding: var(--nordic-space-lg);
    }
    
    .pause-title {
      font-size: 2rem;
    }
    
    .timer-circle {
      width: 150px;
      height: 150px;
    }
    
    .time-value {
      font-size: 2rem;
    }
  }
</style>
