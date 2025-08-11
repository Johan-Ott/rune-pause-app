import { invoke } from '@tauri-apps/api/core';
import type { Settings } from '$types';

/**
 * Timer API service for communicating with Tauri backend
 */
export class TimerAPI {
  /**
   * Start the timer
   */
  static async start(): Promise<void> {
    await invoke('start_timer');
  }

  /**
   * Stop the timer
   */
  static async stop(): Promise<void> {
    await invoke('stop_timer');
  }

  /**
   * Snooze the current break
   */
  static async snooze(): Promise<void> {
    await invoke('cmd_snooze');
  }

  /**
   * Load application settings
   */
  static async loadSettings(): Promise<Settings> {
    return await invoke('cmd_load_settings');
  }

  /**
   * Save application settings
   */
  static async saveSettings(settings: Settings): Promise<void> {
    await invoke('cmd_save_settings', { settings });
  }

  /**
   * Update global hotkeys
   */
  static async updateHotkeys(hotkeys: Record<string, string>): Promise<void> {
    await invoke('cmd_update_hotkeys', { hotkeys });
  }

  /**
   * Write pause log entry
   */
  static async writePauseLog(message: string): Promise<void> {
    await invoke('write_pause_log', { message });
  }
}
