import { writable } from 'svelte/store';

export const timer = writable<{ 
  is_running: boolean; 
  is_paused: boolean; 
  elapsed_ms: number; 
  duration: { secs: number; nanos: number } | null;
  display?: string;
}>({ 
  is_running: false, 
  is_paused: false, 
  elapsed_ms: 0, 
  duration: null,
  display: "00:00"
});
