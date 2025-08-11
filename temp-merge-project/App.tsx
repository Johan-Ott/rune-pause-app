import React, { useState, useEffect } from 'react';
import ConfigView from './components/ConfigView';
import PauseView from './components/PauseView';
import { SoundType } from './components/SoundSystem';

export type PauseSettings = {
  shortBreakInterval: number;
  longBreakInterval: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  enabled: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  soundType: SoundType;
  darkMode: boolean;
  autoSelectActivity: boolean;
  activityPreferences: {
    preferredTypes: ('simple' | 'breathing' | 'stretch')[];
    energyLevel: 'low' | 'medium' | 'high';
    avoidTypes: ('simple' | 'breathing' | 'stretch')[];
  };
};

export type AppMode = 'config' | 'pause';

export default function App() {
  const [mode, setMode] = useState<AppMode>('config');
  const [settings, setSettings] = useState<PauseSettings>({
    shortBreakInterval: 20,
    longBreakInterval: 60,
    shortBreakDuration: 20,
    longBreakDuration: 300,
    enabled: true,
    notifications: true,
    soundEnabled: false,
    soundType: 'wind',
    darkMode: false,
    autoSelectActivity: true,
    activityPreferences: {
      preferredTypes: [],
      energyLevel: 'medium',
      avoidTypes: []
    }
  });

  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [pauseType, setPauseType] = useState<'short' | 'long'>('short');

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rune-pause-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (e) {
        console.log('Could not load saved settings');
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('rune-pause-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply dark mode and system tray styling to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Apply system tray styling in config mode
    if (mode === 'config') {
      document.body.classList.add('system-tray');
    } else {
      document.body.classList.remove('system-tray');
    }
  }, [settings.darkMode, mode]);

  useEffect(() => {
    if (settings.enabled && !nextBreakTime) {
      const now = new Date();
      const nextBreak = new Date(now.getTime() + settings.shortBreakInterval * 60 * 1000);
      setNextBreakTime(nextBreak);
    }
  }, [settings.enabled, nextBreakTime, settings.shortBreakInterval]);

  useEffect(() => {
    if (!nextBreakTime || !settings.enabled) return;

    const checkTime = () => {
      const now = new Date();
      if (now >= nextBreakTime) {
        setMode('pause');
        const isLongBreak = Math.random() > 0.7;
        setPauseType(isLongBreak ? 'long' : 'short');
      }
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [nextBreakTime, settings.enabled]);

  const skipPause = () => {
    setMode('config');
    scheduleNextBreak();
  };

  const completePause = () => {
    setMode('config');
    scheduleNextBreak();
  };

  const scheduleNextBreak = () => {
    const now = new Date();
    const interval = pauseType === 'long' ? settings.longBreakInterval : settings.shortBreakInterval;
    const nextBreak = new Date(now.getTime() + interval * 60 * 1000);
    setNextBreakTime(nextBreak);
  };

  if (mode === 'pause') {
    return (
      <PauseView
        type={pauseType}
        duration={pauseType === 'long' ? settings.longBreakDuration : settings.shortBreakDuration}
        onSkip={skipPause}
        onComplete={completePause}
        soundEnabled={settings.soundEnabled}
        soundType={settings.soundType}
        autoSelectActivity={settings.autoSelectActivity}
        activityPreferences={settings.activityPreferences}
      />
    );
  }

  return (
    <div className="flex items-center justify-center">
      <ConfigView
        settings={settings}
        onSettingsChange={setSettings}
        nextBreakTime={nextBreakTime}
        onTriggerPause={() => {
          setPauseType('short');
          setMode('pause');
        }}
      />
    </div>
  );
}