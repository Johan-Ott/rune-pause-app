<script lang="ts">
  import { onMount } from 'svelte';
  import { settingsStore, themeStore, availableActivities, currentActivityStore } from '../stores/appStore';
  import { currentLanguage, t, setLanguage, initializeLanguage } from '../i18n/language.js';
  import { EXERCISES, getRandomExercise } from '../data/exercises.js';
  import { soundManager } from '../audio/SoundManager.js';
  import { listen } from '@tauri-apps/api/event';
  import type { AppSettings, ActivityType } from '../types';
  import type { Exercise } from '../data/exercises.js';
  import type { Language } from '../i18n/translations.js';
  import { invoke } from '@tauri-apps/api/core';

  let settings: AppSettings;
  let activities: any[] = [];
  let showAdvanced = false;
  let translations = $t;
  let currentLang = $currentLanguage;
  let soundEnabled = true;
  let currentExercise: Exercise | null = null;

  // Subscribe to stores
  settingsStore.subscribe(s => settings = s);
  availableActivities.subscribe(a => activities = a);
  
  // Reactive subscriptions for i18n
  $: translations = $t;
  $: currentLang = $currentLanguage;

  const activityTypes: { type: ActivityType; label: string; icon: string }[] = [
    { type: 'enkla', label: 'Enkla', icon: '✨' },
    { type: 'andning', label: 'Andning', icon: '🌬️' },
    { type: 'stretching', label: 'Stretching', icon: '🤸' }
  ];

  async function handleRestNow() {
    try {
      console.log('Clicking rest now button...');
      await invoke('show_pause_window', { breakType: 'short' });
      console.log('show_pause_window called successfully');
    } catch (error) {
      console.error('Failed to start break:', error);
    }
  }

  async function handleQuit() {
    try {
      await invoke('quit_app');
    } catch (error) {
      console.error('Failed to quit:', error);
    }
  }

  function toggleActivityType(type: ActivityType) {
    const current = settings.selectedActivities;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    
    settingsStore.updateSelectedActivities(updated);
  }

  function updateWorkDuration(event: Event) {
    const target = event.target as HTMLInputElement;
    settingsStore.updateWorkDuration(parseInt(target.value));
  }

  function updateBreakDuration(event: Event) {
    const target = event.target as HTMLInputElement;
    settingsStore.updateBreakDuration(parseInt(target.value));
  }

  function updateReminderFrequency(event: Event) {
    const target = event.target as HTMLInputElement;
    settingsStore.updateReminderFrequency(parseInt(target.value));
  }

  function toggleSound() {
    settingsStore.updateSoundEnabled(!settings.soundEnabled);
  }

  function updateVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    settingsStore.updateSoundVolume(parseInt(target.value));
  }

  function updateLongBreakDuration(event: Event) {
    const target = event.target as HTMLInputElement;
    settingsStore.updateLongBreakDuration(parseInt(target.value));
  }

  onMount(async () => {
    initializeLanguage();
    soundEnabled = soundManager.getEnabled();
    
    // Listen for language changes from tray menu
    const unlisten = await listen('language_changed', (event) => {
      const language = event.payload as Language;
      setLanguage(language);
    });

    // Set initial theme
    document.documentElement.setAttribute('data-theme', 'dark');
    
    return () => {
      unlisten();
    };
  });
</script>

<div class="config-container night-glass-cosmic">
  <!-- Header med MEXRO design -->
  <header class="config-header">
    <div class="header-stars">
      <span class="star star-1">✨</span>
      <span class="star star-2">✨</span>
    </div>
    <div class="header-content">
      <h1 class="app-title runic-title">{translations.appName}</h1>
      <p class="app-subtitle">{translations.appSubtitle}</p>
    </div>
  </header>

  <!-- Timer Display -->
  <section class="timer-section">
    <div class="timer-display">
      <div class="timer-label">Nästa paus</div>
      <div class="timer-value">19:59</div>
    </div>
  </section>

  <!-- Quick Actions -->
  <section class="quick-actions">
    <button 
      class="rest-button primary-button" 
      on:click={handleRestNow}
    >
      <span class="button-icon">▶</span>
      <span class="button-text">{translations.restNow}</span>
    </button>
  </section>

  <!-- Settings Toggles -->
  <section class="settings-section">
    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-icon">⚙️</span>
        <span class="setting-label">Aktiva pauser</span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked={settings.autoStartBreaks}
          on:change={() => settingsStore.update(s => ({ ...s, autoStartBreaks: !s.autoStartBreaks }))}
        />
        <span class="toggle-slider"></span>
      </label>
    </div>

    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-icon">⚡</span>
        <span class="setting-label">Smart aktivitetsval</span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked={true}
          on:change={() => {}}
        />
        <span class="toggle-slider active"></span>
      </label>
    </div>
  </section>

  <!-- Energy Level -->
  <section class="settings-section">
    <h3 class="section-title">{translations.energyLevel}</h3>
    <div class="energy-selector">
      <select class="energy-dropdown">
        <option value="medium">Medium energi</option>
        <option value="low">Låg energi</option>
        <option value="high">Hög energi</option>
      </select>
    </div>
  </section>

  <!-- Activity Types -->
  <section class="settings-section">
    <h3 class="section-title">{translations.preferredActivities}</h3>
    <div class="activity-chips">
      {#each activityTypes as activityType}
        <button 
          class="activity-chip {settings.selectedActivities.includes(activityType.type) ? 'active' : ''}"
          on:click={() => toggleActivityType(activityType.type)}
        >
          {activityType.label}
        </button>
      {/each}
    </div>
  </section>

  <!-- Intervals -->
  <section class="settings-section">
    <h3 class="section-title">
      <span class="section-icon">⭐</span>
      INTERVALLER
    </h3>
    
    <div class="interval-setting">
      <div class="interval-header">
        <span class="interval-label">Kort paus</span>
        <span class="interval-value">{settings.breakDuration} min</span>
      </div>
      <input 
        type="range" 
        min="5" 
        max="30" 
        step="5"
        value={settings.breakDuration}
        on:input={updateBreakDuration}
        class="interval-slider"
      />
    </div>

    <div class="interval-setting">
      <div class="interval-header">
        <span class="interval-label">Lång paus</span>
        <span class="interval-value">{settings.longBreakDuration} min</span>
      </div>
      <input 
        type="range" 
        min="15" 
        max="90" 
        step="15"
        value={settings.longBreakDuration}
        on:input={updateLongBreakDuration}
        class="interval-slider"
      />
    </div>
  </section>

  <!-- Sound Settings -->
  <section class="settings-section">
    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-icon">🔇</span>
        <span class="setting-label">Ljud</span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked={settings.soundEnabled}
          on:change={toggleSound}
        />
        <span class="toggle-slider {settings.soundEnabled ? '' : 'inactive'}"></span>
      </label>
    </div>
  </section>

  <!-- Footer -->
  <footer class="config-footer">
    <div class="footer-branding">Nordic simplicity</div>
  </footer>
</div>

<style>
  .config-container {
    width: 380px;
    height: 640px;
    background: linear-gradient(140deg, #1a1d4a 0%, #2c3968 30%, #1e2559 70%, #1a1d4a 100%);
    padding: 32px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border-radius: 24px;
    border: 1px solid rgba(79, 172, 254, 0.15);
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    color: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: relative;
  }

  .config-container::-webkit-scrollbar {
    display: none;
  }

  .config-header {
    text-align: center;
    padding-bottom: 24px;
    position: relative;
  }

  .header-stars {
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    height: 40px;
  }

  .star {
    position: absolute;
    font-size: 16px;
    opacity: 0.6;
    animation: twinkle 3s ease-in-out infinite;
  }

  .star-1 {
    top: 8px;
    right: 60px;
    animation-delay: 0s;
  }

  .star-2 {
    top: 20px;
    left: 40px;
    animation-delay: 1.5s;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }

  .app-title {
    font-family: 'Cinzel', serif;
    font-size: 2.2rem;
    font-weight: 600;
    margin: 16px 0 12px 0;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
    line-height: 1.1;
  }

  .app-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
    font-weight: 400;
    line-height: 1.4;
    max-width: 280px;
    margin: 0 auto;
  }

  .timer-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .timer-display {
    background: rgba(79, 172, 254, 0.08);
    border: 1px solid rgba(79, 172, 254, 0.2);
    border-radius: 20px;
    padding: 28px 20px;
    text-align: center;
    backdrop-filter: blur(10px);
    width: 100%;
  }

  .timer-label {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .timer-value {
    font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', monospace;
    font-size: 3.2rem;
    font-weight: 300;
    color: #4facfe;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    letter-spacing: 0.05em;
  }

  .quick-actions {
    margin-bottom: 28px;
  }

  .rest-button {
    width: 100%;
    padding: 18px 24px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.15) 100%);
    border: 1px solid rgba(79, 172, 254, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .rest-button:hover {
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(79, 172, 254, 0.2);
  }

  .button-icon {
    font-size: 18px;
  }

  .settings-section {
    margin-bottom: 32px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px;
    backdrop-filter: blur(10px);
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .setting-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .setting-info {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .setting-icon {
    font-size: 18px;
    opacity: 0.8;
  }

  .setting-label {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 54px;
    height: 28px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 28px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 2px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input:checked + .toggle-slider,
  .toggle-slider.active {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-color: rgba(79, 172, 254, 0.3);
  }

  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }

  .toggle-slider.inactive {
    background: rgba(255, 255, 255, 0.15);
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: rgba(79, 172, 254, 0.8);
    margin: 0 0 20px 0;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title::before {
    content: '';
    width: 3px;
    height: 12px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 2px;
  }

  .section-icon {
    font-size: 14px;
    color: #4facfe;
  }

  .energy-selector {
    margin-bottom: 20px;
  }

  .energy-dropdown {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z' fill='%23ffffff'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 40px;
  }

  .energy-dropdown:focus {
    outline: none;
    border-color: #4facfe;
  }

  .activity-chips {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .activity-chip {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .activity-chip.active {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-color: #4facfe;
    color: white;
  }

  .activity-chip:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .interval-setting {
    margin-bottom: 20px;
  }

  .interval-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .interval-label {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .interval-value {
    font-size: 16px;
    color: #4facfe;
    font-weight: 600;
  }

  .interval-slider {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    outline: none;
    appearance: none;
    cursor: pointer;
  }

  .interval-slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .interval-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .config-footer {
    margin-top: auto;
    text-align: center;
    padding-top: 20px;
  }

  .footer-branding {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }
</style>
