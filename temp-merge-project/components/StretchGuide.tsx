import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import { useTimeBasedStyles } from './SeasonTheme';

interface StretchGuideProps {
  onComplete: () => void;
  darkMode?: boolean;
  stretchType?: 'desk' | 'full';
}

interface StretchStep {
  name: string;
  description: string;
  duration: number;
  instruction: string;
  tips?: string;
}

const stretchRoutines = {
  desk: {
    name: 'Skrivbordsstretching',
    description: 'Perfekt för långa arbetsdagar',
    rune: 'ᛊᛏᚱᛖᚲ', // Sträck
    exercises: [
      {
        name: 'Nackrotation',
        description: 'Mjuka rotationer för att lösa spänningar',
        duration: 30,
        instruction: 'Rotera huvudet långsamt i cirkel. Först åt höger, sedan åt vänster.',
        tips: 'Håll axlarna avslappnade'
      },
      {
        name: 'Axelrullningar',
        description: 'Lossa upp axlarna och övre ryggen',
        duration: 20,
        instruction: 'Lyft axlarna mot öronen, rulla bakåt och låt dem falla.',
        tips: 'Gör stora, långsamma rörelser'
      },
      {
        name: 'Armsträckning',
        description: 'Sträck armarna över huvudet',
        duration: 25,
        instruction: 'Sträck armarna rakt upp, lås fingrarna och sträck mot taket.',
        tips: 'Andas djupt och känn sträckningen'
      },
      {
        name: 'Sidosträckning',
        description: 'Sträck kroppen åt sidorna',
        duration: 30,
        instruction: 'Lutåt höger med höger arm över huvudet. Upprepa åt vänster.',
        tips: 'Håll höfterna rakt framåt'
      }
    ]
  },
  full: {
    name: 'Hel kroppsstretch',
    description: 'Omfattande stretchrutinning',
    rune: 'ᚺᛖᛚ', // Hel
    exercises: [
      {
        name: 'Kattsträckning',
        description: 'Ryggsträckning i stående',
        duration: 30,
        instruction: 'Böj dig framåt, runda ryggen som en katt och sträck sedan bakåt.',
        tips: 'Rör dig långsamt och kontrollerat'
      },
      {
        name: 'Vadstretch',
        description: 'Sträck bak på benen',
        duration: 40,
        instruction: 'Stå emot vägg, sätt ena foten bakåt och tryck hälen mot golvet.',
        tips: 'Håll benet rakt'
      },
      {
        name: 'Höftflexorer',
        description: 'Öppna upp höfterna',
        duration: 35,
        instruction: 'Ta ett stort steg bakåt och sänk kroppen. Känn sträckningen i höften.',
        tips: 'Håll ryggen rak'
      },
      {
        name: 'Axel och bröst',
        description: 'Öppna bröstkorgen',
        duration: 30,
        instruction: 'För armarna bakåt och känn sträckningen över bröstet.',
        tips: 'Håll huvudet upprätt'
      },
      {
        name: 'Total avslappning',
        description: 'Djup avslappning',
        duration: 45,
        instruction: 'Stå rak, andas djupt och känn hur hela kroppen slappnar av.',
        tips: 'Fokusera på andningen'
      }
    ]
  }
};

export default function StretchGuide({ onComplete, darkMode = false, stretchType = 'desk' }: StretchGuideProps) {
  const [currentRoutine] = useState<keyof typeof stretchRoutines>(stretchType);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { theme, glassStyles } = useTimeBasedStyles();

  const routine = stretchRoutines[currentRoutine];
  const currentStep = routine.exercises[currentStepIndex];
  const progress = ((currentStepIndex + 1) / routine.exercises.length) * 100;

  // Auto-starta när komponenten laddas
  useEffect(() => {
    setTimeLeft(currentStep.duration);
    setIsActive(true);
  }, [currentStep.duration]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentStepIndex + 1 >= routine.exercises.length) {
            // Rutinen är klar
            setIsActive(false);
            setTimeout(onComplete, 1000);
            return 0;
          } else {
            // Nästa steg
            setCurrentStepIndex(prev => prev + 1);
            return routine.exercises[currentStepIndex + 1].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentStepIndex, routine.exercises, onComplete]);

  const resetRoutine = () => {
    setCurrentStepIndex(0);
    setTimeLeft(routine.exercises[0].duration);
    setIsActive(true);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 text-white relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="text-4xl sm:text-5xl mb-4 opacity-90">
          {routine.rune}
        </div>
        <h1 className="text-2xl sm:text-3xl font-light mb-2">
          {routine.name}
        </h1>
        <p className="text-sm sm:text-base opacity-70 font-light">
          {routine.description}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6 sm:mb-8">
        <div className="night-glass-ethereal rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.accent}, #a855f7)`,
              boxShadow: '0 0 10px rgba(147, 197, 253, 0.5)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs sm:text-sm opacity-60 mt-2">
          <span>Steg {currentStepIndex + 1} av {routine.exercises.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>



      {/* Current exercise */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="night-glass-cosmic rounded-2xl p-6 sm:p-8 mb-6 text-center night-shimmer"
        >
          {/* Timer - alltid synlig */}
          <div className="mb-6">
            <motion.div
              className="text-4xl sm:text-5xl font-light mb-2"
              animate={{ 
                scale: timeLeft <= 3 && timeLeft > 0 ? [1, 1.1, 1] : 1,
                color: timeLeft <= 3 && timeLeft > 0 ? ['#ffffff', '#ef4444', '#ffffff'] : '#ffffff'
              }}
              transition={{ duration: 0.5 }}
            >
              {timeLeft}s
            </motion.div>
            <div className="w-32 sm:w-40 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                animate={{ width: `${((currentStep.duration - timeLeft) / currentStep.duration) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">
            {currentStep.name}
          </h2>
          
          <p className="text-sm sm:text-base opacity-80 mb-4 sm:mb-6 leading-relaxed">
            {currentStep.instruction}
          </p>

          {currentStep.tips && (
            <div className="glass-subtle rounded-xl p-3 sm:p-4">
              <p className="text-xs sm:text-sm opacity-70 italic">
                💡 Tips: {currentStep.tips}
              </p>
            </div>
          )}
        </motion.div>

        {/* Endast återställ-knapp */}
        <div className="flex justify-center">
          <Button
            onClick={resetRoutine}
            variant="outline"
            className="night-glass-ethereal night-hover text-white border-blue-300/30 px-6 sm:px-8 py-3 rounded-xl transition-all duration-300 night-shimmer"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Börja om
          </Button>
        </div>
      </div>


    </div>
  );
}