import { useEffect, useRef } from 'react';

export type SoundType = 'wind' | 'forest' | 'rain' | 'silence';

interface SoundSystemProps {
  enabled: boolean;
  soundType: SoundType;
  volume?: number;
}

// Mock audio context för nordiska ljud
const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  // Simulerar olika nordiska ljud genom oscillatorer
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const createWindSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 4);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 2);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 4);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { oscillator, gainNode };
  };
  
  const createForestSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 6);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 3);
    gainNode.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 6);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { oscillator, gainNode };
  };
  
  return { audioContext, createWindSound, createForestSound };
};

export function SoundSystem({ enabled, soundType, volume = 0.3 }: SoundSystemProps) {
  const audioRef = useRef<any>(null);
  const currentSoundRef = useRef<any>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = createAudioContext();
    }
  }, []);

  useEffect(() => {
    if (!enabled || !audioRef.current || soundType === 'silence') {
      if (currentSoundRef.current) {
        currentSoundRef.current.oscillator?.stop();
        currentSoundRef.current = null;
      }
      return;
    }

    // Stop current sound
    if (currentSoundRef.current) {
      currentSoundRef.current.oscillator?.stop();
    }

    // Start new sound
    try {
      if (soundType === 'wind') {
        currentSoundRef.current = audioRef.current.createWindSound();
        currentSoundRef.current.oscillator.start();
      } else if (soundType === 'forest') {
        currentSoundRef.current = audioRef.current.createForestSound();
        currentSoundRef.current.oscillator.start();
      }
    } catch (error) {
      console.log('Audio not available');
    }

    return () => {
      if (currentSoundRef.current) {
        currentSoundRef.current.oscillator?.stop();
        currentSoundRef.current = null;
      }
    };
  }, [enabled, soundType, volume]);

  return null;
}