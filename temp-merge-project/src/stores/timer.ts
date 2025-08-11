import { writable, type Writable } from 'svelte/store';
import type { TimerState } from '$types';

// Timer state store
export const timerState: Writable<TimerState> = writable({
  phase: 'Idle',
  seconds_left: 0,
  cycle: 0,
});

// Running state store
export const isRunning: Writable<boolean> = writable(false);

// Settings modal visibility
export const showSettings: Writable<boolean> = writable(false);

// Theme store
export const theme: Writable<'light' | 'dark' | 'auto'> = writable('auto');
