import React, { useState, useEffect } from 'react';
import { X, Shuffle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useTimeBasedStyles } from './SeasonTheme';
import { SoundSystem, SoundType } from './SoundSystem';
import BreathingExercise from './BreathingExercise';
import StretchGuide from './StretchGuide';
import { SmartActivitySelector, Activity, ActivityType } from './SmartActivitySelector';
import NightSkyBackground from './NightSkyBackground';
import type { PauseSettings } from '../App';

interface PauseViewProps {
  type: 'short' | 'long';
  duration: number;
  onSkip: () => void;
  onComplete: () => void;
  soundEnabled?: boolean;
  soundType?: SoundType;
  autoSelectActivity?: boolean;
  activityPreferences?: PauseSettings['activityPreferences'];
}

export default function PauseView({ 
  type, 
  duration, 
  onSkip, 
  onComplete, 
  soundEnabled = false, 
  soundType = 'wind',
  autoSelectActivity = false,
  activityPreferences = { preferredTypes: [], energyLevel: 'medium', avoidTypes: [] }
}: PauseViewProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentView, setCurrentView] = useState<'selection' | 'activity'>('selection');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { theme, glassStyles } = useTimeBasedStyles();
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);

  // Initialisera aktiviteter baserat på inställningar
  useEffect(() => {
    if (autoSelectActivity) {
      // Automatiskt välja en aktivitet
      const smartActivity = SmartActivitySelector.selectActivity({
        pauseType: type,
        timeOfDay: theme.timeOfDay,
        userPreferences: activityPreferences
      });
      
      if (smartActivity.type !== 'simple') {
        setSelectedActivity(smartActivity);
        setCurrentView('activity');
      } else {
        // För enkla aktiviteter, visa bara meddelandet
        setSelectedActivity(smartActivity);
        setCurrentView('selection');
      }
    } else {
      // Visa alla tillgängliga aktiviteter för manuell val
      const activities = SmartActivitySelector.getActivitiesForTime(type, theme.timeOfDay);
      setAvailableActivities(activities);
    }
  }, [type, theme.timeOfDay, autoSelectActivity, activityPreferences]);

  useEffect(() => {
    if (currentView === 'selection' && timeLeft <= 0) {
      onComplete();
      return;
    }

    if (currentView === 'selection') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, onComplete, currentView]);

  const selectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    if (activity.type !== 'simple') {
      setCurrentView('activity');
    }
  };

  const handleActivityComplete = () => {
    onComplete();
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedActivity(null);
  };

  const handleRandomSelect = () => {
    const smartActivity = SmartActivitySelector.selectActivity({
      pauseType: type,
      timeOfDay: theme.timeOfDay,
      userPreferences: activityPreferences
    });
    selectActivity(smartActivity);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Render specific activity med natthimmel
  if (currentView === 'activity' && selectedActivity) {
    switch (selectedActivity.type) {
      case 'breathing':
        return (
          <NightSkyBackground intensity="subtle">
            <SoundSystem enabled={soundEnabled} soundType={soundType} />
            <BreathingExercise onComplete={handleActivityComplete} />
            
            {/* Konsistent navigation - alltid samma positioner */}
            <Button
              variant="ghost"  
              className="absolute top-4 left-4 sm:top-6 sm:left-6 night-glass-ethereal night-hover text-white border-0 px-3 py-2 rounded-lg transition-all duration-300 night-shimmer text-sm z-50"
              onClick={handleBackToSelection}
            >
              ← Tillbaka
            </Button>
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 night-glass-ethereal night-hover text-white border-0 px-3 py-2 rounded-lg transition-all duration-300 night-shimmer hover:bg-white/20 text-sm z-50"
              onClick={onSkip}
            >
              Hoppa över paus
            </Button>
          </NightSkyBackground>
        );
      case 'stretch':
        return (
          <NightSkyBackground intensity="subtle">
            <SoundSystem enabled={soundEnabled} soundType={soundType} />
            <StretchGuide 
              onComplete={handleActivityComplete}
              stretchType={selectedActivity.subType as 'desk' | 'full' | undefined}
            />
            
            {/* Konsistent navigation - alltid samma positioner */}
            <Button
              variant="ghost"  
              className="absolute top-4 left-4 sm:top-6 sm:left-6 night-glass-ethereal night-hover text-white border-0 px-3 py-2 rounded-lg transition-all duration-300 night-shimmer text-sm z-50"
              onClick={handleBackToSelection}
            >
              ← Tillbaka
            </Button>
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 night-glass-ethereal night-hover text-white border-0 px-3 py-2 rounded-lg transition-all duration-300 night-shimmer hover:bg-white/20 text-sm z-50"
              onClick={onSkip}
            >
              Hoppa över paus
            </Button>
          </NightSkyBackground>
        );
      default:
        return null;
    }
  }

  // Selection view med natthimmel tema
  return (
    <NightSkyBackground intensity="normal">
      <div className="fixed inset-0 flex items-center justify-center text-white overflow-hidden">
        <SoundSystem 
          enabled={soundEnabled}
          soundType={soundType}
        />

        {/* Hoppa över paus knapp - konsistent positionering */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 night-glass-ethereal night-hover text-white border-0 px-3 py-2 rounded-lg transition-all duration-300 night-shimmer hover:bg-white/20 text-sm z-50"
          onClick={onSkip}
        >
          Hoppa över paus
        </Button>

        <div className="text-center space-y-6 sm:space-y-8 max-w-sm sm:max-w-md mx-auto px-4 sm:px-6 relative z-20">
          {/* Header med magisk effekt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Rune med glöd-effekt */}
            <motion.div 
              className="relative text-5xl sm:text-6xl opacity-95"
              animate={{ 
                filter: ['drop-shadow(0 0 10px rgba(147, 197, 253, 0.3))', 
                        'drop-shadow(0 0 20px rgba(147, 197, 253, 0.5))', 
                        'drop-shadow(0 0 10px rgba(147, 197, 253, 0.3))'] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {theme.rune}
              {/* Subtila sparkles omkring runan */}
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-blue-200 opacity-60 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-3 h-3 text-green-200 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {type === 'short' ? 'Kort paus' : 'Lång paus'}
            </motion.h1>
            
            <motion.p 
              className="text-sm opacity-80 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {theme.description}
            </motion.p>
          </motion.div>

          {/* Timer utan bakgrund - renare look */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="p-6 sm:p-8"
          >
            <div className="text-5xl sm:text-6xl font-light tracking-wider mb-6">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            
            <div className="w-40 sm:w-48 h-2 mx-auto rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, #60a5fa)`
                }}
                initial={{ width: 0, boxShadow: '0 0 0px rgba(147, 197, 253, 0)' }}
                animate={{ 
                  width: `${((duration - timeLeft) / duration) * 100}%`,
                  boxShadow: '0 0 15px rgba(147, 197, 253, 0.6)'
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Aktivitetsval med förbättrad design */}
          {autoSelectActivity && selectedActivity ? (
            // Auto-vald aktivitet med magisk känsla
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <h2 className="text-lg font-light opacity-90">Smart vald aktivitet</h2>
                <Sparkles className="w-4 h-4 text-green-300" />
              </div>
              
              <motion.div 
                className={`night-glass-mystical text-left p-5 rounded-2xl transition-all duration-300 night-shimmer ${
                  selectedActivity.type !== 'simple' ? 'cursor-pointer night-hover' : ''
                }`}
                onClick={() => selectedActivity.type !== 'simple' ? selectActivity(selectedActivity) : null}
                whileHover={{ scale: selectedActivity.type !== 'simple' ? 1.02 : 1 }}
                whileTap={{ scale: selectedActivity.type !== 'simple' ? 0.98 : 1 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="text-3xl opacity-95"
                    animate={{ 
                      filter: ['drop-shadow(0 0 5px rgba(147, 197, 253, 0.2))', 
                              'drop-shadow(0 0 10px rgba(147, 197, 253, 0.4))', 
                              'drop-shadow(0 0 5px rgba(147, 197, 253, 0.2))'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {selectedActivity.rune}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{selectedActivity.title}</h3>
                    <p className="text-sm opacity-80 font-light leading-relaxed">{selectedActivity.description}</p>
                    {selectedActivity.type !== 'simple' && (
                      <p className="text-xs opacity-60 mt-2 italic flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Klicka för interaktiv guide
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <Button
                onClick={handleRandomSelect}
                variant="outline"
                className="night-glass-ethereal night-hover text-white border-blue-300/30 px-5 py-2.5 rounded-xl transition-all duration-300 night-shimmer"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Välj annan
              </Button>
            </motion.div>
          ) : (
            // Manuell aktivitetsval med förbättrad grid
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                  <h2 className="text-lg font-light opacity-90">Välj din aktivitet</h2>
                </div>
                <Button
                  onClick={handleRandomSelect}
                  variant="outline"
                  size="sm"
                  className="night-glass-ethereal night-hover text-white border-blue-300/30 px-3 py-1.5 rounded-lg transition-all duration-300"
                >
                  <Shuffle className="w-3 h-3 mr-1" />
                  Slumpa
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {availableActivities.map((activity, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    onClick={() => selectActivity(activity)}
                    className="night-glass-mystical night-hover text-left p-4 rounded-xl transition-all duration-300 cursor-pointer night-shimmer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="text-2xl opacity-95"
                        animate={{ 
                          filter: ['drop-shadow(0 0 3px rgba(147, 197, 253, 0.1))', 
                                  'drop-shadow(0 0 8px rgba(147, 197, 253, 0.3))', 
                                  'drop-shadow(0 0 3px rgba(147, 197, 253, 0.1))'] 
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                      >
                        {activity.rune}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{activity.title}</h3>
                        <p className="text-sm opacity-80 font-light leading-relaxed">{activity.description}</p>
                        {activity.type !== 'simple' && (
                          <p className="text-xs opacity-60 mt-1 italic flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Interaktiv guide
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Magisk "powered by" text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs opacity-40 italic font-light px-4 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3 h-3" />
            <span style={{ fontFamily: '"Cinzel", serif' }}>ᛞᚨᚷᚱᛟ</span>
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </NightSkyBackground>
  );
}