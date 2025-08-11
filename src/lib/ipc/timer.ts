import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

export async function startTimer(ms: number) {
  await invoke('start_timer', { ms });
  await updateTrayTimer();
}
export async function pauseTimer() {
  await invoke('pause_timer');
  await updateTrayTimer();
}
export async function resumeTimer() {
  await invoke('resume_timer');
  await updateTrayTimer();
}
export async function stopTimer() {
  await invoke('stop_timer');
  await updateTrayTimer();
}
export async function getStatus(): Promise<{ 
  is_running: boolean; 
  is_paused: boolean; 
  elapsed_ms: number; 
  duration: { secs: number; nanos: number } | null;
}> {
  return await invoke('get_status');
}

export async function updateTrayTimer() {
  const status = await getStatus();
  let timerText = "00:00";
  let statusIndicator = "⏹"; // Stopped
  
  if (status.is_running && status.duration) {
    const totalMs = status.duration.secs * 1000 + status.duration.nanos / 1000000;
    const remainingMs = Math.max(0, totalMs - status.elapsed_ms);
    timerText = formatTime(remainingMs);
    
    if (status.is_paused) {
      statusIndicator = "⏸"; // Paused
      timerText += " (Paused)";
    } else {
      statusIndicator = "▶"; // Running
    }
  }
  
  // Show both status icon and timer
  const displayText = `${statusIndicator} ${timerText}`;
  await invoke('update_tray_timer', { timerText: displayText });
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function bindTrayListeners() {
  listen('tray://pause', () => pauseTimer());
  listen('tray://resume', () => resumeTimer());
}
