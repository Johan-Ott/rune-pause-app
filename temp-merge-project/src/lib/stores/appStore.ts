import { writable, derived } from 'svelte/store';
import type { AppSettings, AppMode, TimerState, BreakSession, Activity } from '../types';
import { defaultSettings, defaultActivities } from '../types';

// App mode store
export const modeStore = writable<AppMode>('config');

// Settings store with persistence
function createSettingsStore() {
  const { subscribe, set, update } = writable<AppSettings>(defaultSettings);

  return {
    subscribe,
    set,
    update,
    reset: () => set(defaultSettings),
    updateWorkDuration: (duration: number) => update(s => ({ ...s, workDuration: duration })),
    updateBreakDuration: (duration: number) => update(s => ({ ...s, breakDuration: duration })),
    updateLongBreakDuration: (duration: number) => update(s => ({ ...s, longBreakDuration: duration })),
    updateSoundEnabled: (enabled: boolean) => update(s => ({ ...s, soundEnabled: enabled })),
    updateSoundVolume: (volume: number) => update(s => ({ ...s, soundVolume: volume })),
    updateSelectedActivities: (activities: typeof defaultSettings.selectedActivities) => 
      update(s => ({ ...s, selectedActivities: activities })),
    updateReminderFrequency: (frequency: number) => 
      update(s => ({ ...s, reminderFrequency: frequency }))
  };
}

export const settingsStore = createSettingsStore();

// Timer state store
export const timerStore = writable<TimerState>({
  mode: 'idle',
  remainingTime: 0,
  isRunning: false,
  isPaused: false,
  currentSession: 0,
  totalSessions: 0
});

// Current break session store
export const currentBreakStore = writable<BreakSession | null>(null);

// Activities store
export const activitiesStore = writable<Activity[]>(defaultActivities);

// Current selected activity store
export const currentActivityStore = writable<Activity | null>(null);

// Theme store
export const themeStore = writable<'light' | 'dark'>('dark');

// Derived stores
export const isBreakTime = derived(
  timerStore,
  $timer => $timer.mode === 'break' || $timer.mode === 'longBreak'
);

export const isWorkTime = derived(
  timerStore,
  $timer => $timer.mode === 'work'
);

export const availableActivities = derived(
  [activitiesStore, settingsStore],
  ([$activities, $settings]) => {
    return $activities.filter(activity => 
      $settings.selectedActivities.includes(activity.type)
    );
  }
);

export const currentProgress = derived(
  [timerStore, settingsStore],
  ([$timer, $settings]) => {
    if ($timer.mode === 'idle') return 0;
    
    let totalTime = 0;
    switch ($timer.mode) {
      case 'work':
        totalTime = $settings.workDuration * 60;
        break;
      case 'break':
        totalTime = $settings.breakDuration * 60;
        break;
      case 'longBreak':
        totalTime = $settings.longBreakDuration * 60;
        break;
    }
    
    return totalTime > 0 ? (totalTime - $timer.remainingTime) / totalTime : 0;
  }
);

// Persistence helpers
if (typeof window !== 'undefined') {
  // Load settings from localStorage on initialization
  const savedSettings = localStorage.getItem('rune-pause-settings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      settingsStore.set({ ...defaultSettings, ...parsed });
    } catch (e) {
      console.warn('Failed to parse saved settings:', e);
    }
  }

  // Save settings to localStorage on changes
  settingsStore.subscribe(settings => {
    localStorage.setItem('rune-pause-settings', JSON.stringify(settings));
  });

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('rune-pause-theme') as 'light' | 'dark';
  if (savedTheme) {
    themeStore.set(savedTheme);
  }

  // Save theme to localStorage on changes
  themeStore.subscribe(theme => {
    localStorage.setItem('rune-pause-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  });
}
