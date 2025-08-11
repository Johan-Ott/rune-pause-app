import React from 'react';
import { Play, Power, Volume2, VolumeX, Zap, Settings, Moon, Sun, Timer, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { motion } from 'motion/react';
import { useTimeBasedStyles } from './SeasonTheme';
import { SoundSystem, SoundType } from './SoundSystem';
import type { PauseSettings } from '../App';

interface ConfigViewProps {
  settings: PauseSettings;
  onSettingsChange: (settings: PauseSettings) => void;
  nextBreakTime: Date | null;
  onTriggerPause: () => void;
}

export default function ConfigView({ settings, onSettingsChange, nextBreakTime, onTriggerPause }: ConfigViewProps) {
  const { theme } = useTimeBasedStyles();
  const timeUntilBreak = nextBreakTime ? Math.max(0, Math.floor((nextBreakTime.getTime() - Date.now()) / 1000)) : 0;
  const minutesLeft = Math.floor(timeUntilBreak / 60);
  const secondsLeft = timeUntilBreak % 60;

  const updateSettings = (updates: Partial<PauseSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateActivityPreferences = (updates: Partial<PauseSettings['activityPreferences']>) => {
    updateSettings({
      activityPreferences: { ...settings.activityPreferences, ...updates }
    });
  };

  const togglePreferredType = (type: 'simple' | 'breathing' | 'stretch') => {
    const current = settings.activityPreferences.preferredTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateActivityPreferences({ preferredTypes: updated });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="modern-container rounded-xl overflow-hidden"
      >
        <SoundSystem 
          enabled={settings.soundEnabled || false}
          soundType={settings.soundType || 'silence'}
        />
        
        {/* Header med dark mode toggle i högra hörnet */}
        <div className="modern-header p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            
            {/* Centrerad rune-R som fungerar i båda lägen */}
            <div 
              className="text-3xl relative text-primary"
              style={{ 
                fontFamily: '"Times New Roman", serif',
                fontWeight: 'bold',
                letterSpacing: '0.1em'
              }}
            >
              <span className="relative">
                ᚱ
                <div 
                  className="absolute inset-0 text-primary opacity-30"
                  style={{ filter: 'blur(4px)' }}
                >
                  ᚱ
                </div>
              </span>
            </div>
            
            {/* Dark mode toggle högst upp till höger */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-muted-foreground" />
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                  className="modern-switch scale-75"
                />
                <Moon className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Status/Countdown direkt under */}
          <div className="mt-3 text-center">
            {settings.enabled && nextBreakTime ? (
              <div className="flex items-center gap-2 justify-center">
                <Timer className="w-3 h-3 text-muted-foreground" />
                <p className="text-lg font-light tabular-nums text-foreground">
                  {minutesLeft.toString().padStart(2, '0')}:{secondsLeft.toString().padStart(2, '0')}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <Power className="w-3 h-3 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  Vilotimer inaktiverad
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main content utan extra boxes */}
        <div className="p-4 space-y-3">
          {/* Diskreta action buttons i två kolumner */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onTriggerPause}
              className="h-9 text-xs font-normal border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              disabled={!settings.enabled}
            >
              <Play className="w-3 h-3 mr-1.5" />
              Vila nu
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className="h-9 text-xs font-normal border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
            >
              <Power className="w-3 h-3 mr-1.5" />
              {settings.enabled ? 'Pausa' : 'Aktivera'}
            </Button>
          </div>

          {/* Settings direkt utan boxes */}
          <div className="space-y-3">
            {settings.enabled && (
              <>
                {/* Smart aktivitet - utan extra box */}
                <motion.div 
                  className="space-y-2 py-2 border-t border-border/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <Label className="text-sm">Smart val</Label>
                    </div>
                    <Switch
                      checked={settings.autoSelectActivity}
                      onCheckedChange={(checked) => updateSettings({ autoSelectActivity: checked })}
                      className="modern-switch scale-75"
                    />
                  </div>
                  
                  {settings.autoSelectActivity && (
                    <motion.div 
                      className="space-y-2 pl-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <select 
                        value={settings.activityPreferences.energyLevel}
                        onChange={(e) => updateActivityPreferences({ energyLevel: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full p-2 text-xs rounded-lg modern-select"
                      >
                        <option value="low">Låg energi</option>
                        <option value="medium">Medium energi</option>
                        <option value="high">Hög energi</option>
                      </select>

                      <div className="flex gap-1">
                        {([
                          { key: 'simple', label: 'Vila', color: 'from-green-400 to-green-600' },
                          { key: 'breathing', label: 'Andning', color: 'from-blue-400 to-blue-600' },
                          { key: 'stretch', label: 'Stretch', color: 'from-blue-500 to-blue-700' }
                        ] as const).map(({ key, label, color }) => (
                          <button
                            key={key}
                            onClick={() => togglePreferredType(key)}
                            className={`flex-1 py-1.5 px-2 text-xs rounded-lg transition-all ${
                              settings.activityPreferences.preferredTypes.includes(key)
                                ? `bg-gradient-to-r ${color} text-white font-medium` 
                                : 'modern-interactive text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Intervals - clean utan box */}
                <motion.div 
                  className="space-y-3 py-2 border-t border-border/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm">Intervaller</Label>
                  </div>
                  
                  <div className="space-y-3 pl-6">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-muted-foreground">Kort paus</Label>
                        <span className="text-xs font-medium text-primary">
                          {settings.shortBreakInterval} min
                        </span>
                      </div>
                      <Slider
                        value={[settings.shortBreakInterval]}
                        onValueChange={([value]) => updateSettings({ shortBreakInterval: value })}
                        min={5}
                        max={60}
                        step={5}
                        className="modern-slider"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-muted-foreground">Lång paus</Label>
                        <span className="text-xs font-medium text-primary">
                          {settings.longBreakInterval} min
                        </span>
                      </div>
                      <Slider
                        value={[settings.longBreakInterval]}
                        onValueChange={([value]) => updateSettings({ longBreakInterval: value })}
                        min={30}
                        max={120}
                        step={15}
                        className="modern-slider"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Sound - clean utan box */}
                <motion.div 
                  className="space-y-2 py-2 border-t border-border/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? 
                        <Volume2 className="w-4 h-4 text-muted-foreground" /> : 
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      }
                      <Label className="text-sm">Ljud</Label>
                    </div>
                    <Switch
                      checked={settings.soundEnabled || false}
                      onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                      className="modern-switch scale-75"
                    />
                  </div>

                  {settings.soundEnabled && (
                    <div className="pl-6">
                      <select 
                        value={settings.soundType || 'wind'}
                        onChange={(e) => updateSettings({ soundType: e.target.value as SoundType })}
                        className="w-full p-2 text-xs rounded-lg modern-select"
                      >
                        <option value="wind">🌬️ Nordanvind</option>
                        <option value="forest">🌲 Skogsrus</option>
                        <option value="rain">🌧️ Regndroppar</option>
                        <option value="silence">🤫 Tystnad</option>
                      </select>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}