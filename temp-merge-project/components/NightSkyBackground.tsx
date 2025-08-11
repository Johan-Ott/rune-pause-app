import React from 'react';
import { motion } from 'motion/react';

interface NightSkyBackgroundProps {
  children?: React.ReactNode;
  intensity?: 'subtle' | 'normal' | 'intense';
}

export default function NightSkyBackground({ children, intensity = 'normal' }: NightSkyBackgroundProps) {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'subtle':
        return {
          opacity: 0.6,
          particleCount: 3,
          shimmerDelay: 5
        };
      case 'intense':
        return {
          opacity: 1,
          particleCount: 8,
          shimmerDelay: 2
        };
      default:
        return {
          opacity: 0.8,
          particleCount: 5,
          shimmerDelay: 3
        };
    }
  };

  const config = getIntensityClasses();

  return (
    <div className="relative min-h-screen overflow-hidden night-sky-background">
      {/* Baslager - natthimmel gradient */}
      <div className="absolute inset-0 night-sky-background" />

      {/* Stjärnor lager */}
      <div 
        className="absolute inset-0 stars-layer" 
        style={{ opacity: config.opacity }}
      />

      {/* Nordljus */}
      <motion.div
        className="absolute inset-0 aurora-borealis"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Magiska partiklar */}
      <div 
        className="absolute inset-0 magic-particles"
        style={{ opacity: config.opacity * 0.6 }}
      />

      {/* Runmönster för djup */}
      <div 
        className="absolute inset-0 night-rune-pattern"
        style={{ opacity: 0.4 }}
      />

      {/* Floating meteoriter/stjärnfall */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: config.particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-200 to-transparent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, -100, -200],
              y: [0, 50, 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Mjuk vinjett */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />

      {/* Innehåll */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}