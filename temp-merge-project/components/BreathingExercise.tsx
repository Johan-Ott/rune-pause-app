import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Pause, Play } from 'lucide-react';
import { useTimeBasedStyles } from './SeasonTheme';

interface BreathingExerciseProps {
  onComplete: () => void;
  darkMode?: boolean;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

const breathingPatterns = {
  '4-7-8': {
    name: '4-7-8 Teknik',
    description: 'Klassisk lugnande andningsteknik',
    phases: [
      { phase: 'inhale' as BreathingPhase, duration: 4, instruction: 'Andas in' },
      { phase: 'hold' as BreathingPhase, duration: 7, instruction: 'Håll andan' },
      { phase: 'exhale' as BreathingPhase, duration: 8, instruction: 'Andas ut' },
      { phase: 'pause' as BreathingPhase, duration: 2, instruction: 'Vila' }
    ],
    rune: 'ᚨᚾᛞ' // And - andning
  },
  'box': {
    name: 'Box Andning',
    description: 'Fyrkantandning för balans',
    phases: [
      { phase: 'inhale' as BreathingPhase, duration: 4, instruction: 'Andas in' },
      { phase: 'hold' as BreathingPhase, duration: 4, instruction: 'Håll' },
      { phase: 'exhale' as BreathingPhase, duration: 4, instruction: 'Andas ut' },
      { phase: 'pause' as BreathingPhase, duration: 4, instruction: 'Vila' }
    ],
    rune: 'ᚠᚤᚱ' // Fyr - fyra
  }
};

export default function BreathingExercise({ onComplete, darkMode = false }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<keyof typeof breathingPatterns>('4-7-8');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalCycles] = useState(3);
  const { theme, glassStyles } = useTimeBasedStyles();

  const pattern = breathingPatterns[currentPattern];
  const currentPhase = pattern.phases[currentPhaseIndex];

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length;
          
          if (nextPhaseIndex === 0) {
            // Completed a full cycle
            const newCyclesCompleted = cyclesCompleted + 1;
            setCyclesCompleted(newCyclesCompleted);
            
            if (newCyclesCompleted >= totalCycles) {
              setIsActive(false);
              setTimeout(onComplete, 1000);
              return 0;
            }
          }
          
          setCurrentPhaseIndex(nextPhaseIndex);
          return pattern.phases[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentPhaseIndex, cyclesCompleted, totalCycles, pattern.phases, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setTimeLeft(pattern.phases[0].duration);
    setCyclesCompleted(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(0);
    setCyclesCompleted(0);
  };

  // Calculate breathing animation scale
  const getBreathingScale = () => {
    if (!isActive) return 1;
    
    const progress = (currentPhase.duration - timeLeft) / currentPhase.duration;
    
    switch (currentPhase.phase) {
      case 'inhale':
        return 1 + (0.5 * progress); // Scale from 1 to 1.5
      case 'hold':
        return 1.5; // Stay at max size
      case 'exhale':
        return 1.5 - (0.5 * progress); // Scale from 1.5 back to 1
      case 'pause':
        return 1; // Stay at base size
      default:
        return 1;
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase?.phase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-purple-600';
      case 'exhale':
        return 'from-green-400 to-green-600';
      case 'pause':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-white relative z-10">
      {/* Header med rune */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="text-4xl sm:text-5xl mb-4 opacity-90">
          {pattern.rune}
        </div>
        <h1 className="text-2xl sm:text-3xl font-light mb-2">
          {pattern.name}
        </h1>
        <p className="text-sm sm:text-base opacity-70 font-light">
          {pattern.description}
        </p>
      </motion.div>

      {/* Huvudanimation - andningscirkel */}
      <div className="relative mb-8 sm:mb-12">
        <motion.div
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full night-glass-cosmic flex items-center justify-center relative overflow-hidden"
          animate={{
            scale: getBreathingScale(),
          }}
          transition={{
            duration: 1,
            ease: "easeInOut"
          }}
        >
          {/* Gradient bakgrund som ändras med fas */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getPhaseColor()} opacity-30 rounded-full`} />
          
          {/* Mitten-content */}
          <div className="text-center z-10">
            <div className="text-3xl sm:text-4xl font-light mb-2">
              {timeLeft}
            </div>
            <div className="text-sm sm:text-base opacity-80 font-light">
              {currentPhase?.instruction || 'Vila'}
            </div>
          </div>
          
          {/* Pulsande ring */}
          <motion.div
            className="absolute inset-2 border border-white/20 rounded-full"
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Progress ring */}
        <div className="absolute inset-0 w-48 h-48 sm:w-64 sm:h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="283"
              animate={{
                strokeDashoffset: currentPhase ? 283 - (283 * (currentPhase.duration - timeLeft) / currentPhase.duration) : 283
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
        {/* Pattern selector */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-subtle rounded-xl p-3 sm:p-4 mb-4"
          >
            <select
              value={currentPattern}
              onChange={(e) => setCurrentPattern(e.target.value as keyof typeof breathingPatterns)}
              className="bg-transparent text-white text-sm sm:text-base outline-none"
            >
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <option key={key} value={key} className="bg-slate-800 text-white">
                  {pattern.name}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Main controls */}
        <div className="flex items-center space-x-4">
          {!isActive ? (
            <Button
              onClick={startExercise}
              className="night-glass-mystical night-hover text-white border-0 px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 night-shimmer"
            >
              <Play className="w-4 h-4 mr-2" />
              Starta
            </Button>
          ) : (
            <Button
              onClick={pauseExercise}
              className="night-glass-mystical night-hover text-white border-0 px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 night-shimmer"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausa
            </Button>
          )}

          <Button
            onClick={resetExercise}
            variant="outline"
            className="night-glass-ethereal night-hover text-white border-blue-300/30 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300"
          >
            Återställ
          </Button>
        </div>

        {/* Progress info */}
        <div className="text-center night-glass-ethereal rounded-xl p-3 sm:p-4">
          <div className="text-sm sm:text-base opacity-90">
            Cykel {cyclesCompleted + 1} av {totalCycles}
          </div>
          {currentPhase && (
            <div className="text-xs sm:text-sm opacity-70 mt-1">
              Fas: {currentPhase.instruction}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}