export interface TimerState {
  phase: 'Idle' | 'Focus' | 'Break' | 'MicroBreak';
  seconds_left: number;
  cycle: number;
}

export interface Settings {
  focusMin: number;
  breakMin: number;
  microEvery: number;
  microMin: number;
  hardBreak: boolean;
  theme: string;
  obsidianVault: string | null;
  enableIdle: boolean;
  snoozeSec: number;
  idleThresholdMin: number | null;
  forceBlocks: string[] | null;
  webhookUrl: string | null;
}

export interface HotkeyConfig {
  start: string;
  stop: string;
  snooze: string;
}

export type TimerEvent =
  | {
      type: 'tick';
      payload: TimerState;
    }
  | {
      type: 'hk-start' | 'hk-stop' | 'hk-snooze';
      payload: undefined;
    };
