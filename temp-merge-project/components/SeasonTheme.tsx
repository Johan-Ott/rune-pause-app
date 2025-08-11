import React, { useState, useEffect } from 'react';

interface SeasonalTheme {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay: 'morning' | 'midday' | 'evening' | 'night';
  rune: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    glass: string;
  };
  seasonDescription: string;
  timeDescription: string;
}

// Säsongsdata
const seasons = {
  spring: {
    rune: 'ᚢᚱᚢᚾ', // Vårens runa
    description: 'Vårens tid för förnyelse',
    months: [2, 3, 4] // Mars, April, Maj
  },
  summer: {
    rune: 'ᛋᚢᛚ', // Sommarens runa
    description: 'Solens kraft och värme',
    months: [5, 6, 7] // Juni, Juli, Augusti
  },
  autumn: {
    rune: 'ᚺᚨᚢᛊᛏ', // Höstens runa
    description: 'Skördens tid för reflektion',
    months: [8, 9, 10] // September, Oktober, November
  },
  winter: {
    rune: 'ᛁᛊ', // Vinterns runa
    description: 'Vinterns vila och inre kraft',
    months: [11, 0, 1] // December, Januari, Februari
  }
};

// Tid-på-dagen data
const timeOfDayThemes = {
  morning: {
    name: 'Morgon',
    rune: 'ᛞᚨᚷ', // Dag
    description: 'Nya början och frisk energi',
    hours: [5, 6, 7, 8, 9, 10, 11],
    colors: {
      primary: '#f59e0b', // Amber
      secondary: '#fbbf24',
      accent: '#f97316', // Orange
      gradient: 'from-amber-200 via-orange-200 to-yellow-100',
      glass: 'rgba(251, 191, 36, 0.1)'
    }
  },
  midday: {
    name: 'Middag',
    rune: 'ᛊᚢᚾ', // Sol
    description: 'Kraftfull energi och klarhet',
    hours: [12, 13, 14, 15, 16, 17],
    colors: {
      primary: '#3b82f6', // Blue
      secondary: '#10b981', // Emerald
      accent: '#06b6d4', // Cyan
      gradient: 'from-blue-200 via-cyan-200 to-emerald-200',
      glass: 'rgba(59, 130, 246, 0.1)'
    }
  },
  evening: {
    name: 'Kväll',
    rune: 'ᚨᚠᛏᚾ', // Afton
    description: 'Avkoppling och reflektion',
    hours: [18, 19, 20, 21, 22],
    colors: {
      primary: '#f97316', // Orange
      secondary: '#dc2626', // Red
      accent: '#c2410c', // Orange-red
      gradient: 'from-orange-200 via-red-200 to-pink-200',
      glass: 'rgba(249, 115, 22, 0.1)'
    }
  },
  night: {
    name: 'Natt',
    rune: 'ᚾᚨᛏᛏ', // Natt
    description: 'Djup vila och inre fred',
    hours: [23, 0, 1, 2, 3, 4],
    colors: {
      primary: '#6366f1', // Indigo
      secondary: '#8b5cf6', // Violet
      accent: '#3730a3', // Indigo-dark
      gradient: 'from-indigo-900 via-purple-900 to-slate-900',
      glass: 'rgba(99, 102, 241, 0.1)'
    }
  }
};

const getCurrentSeason = (): keyof typeof seasons => {
  const month = new Date().getMonth();
  
  for (const [seasonName, seasonData] of Object.entries(seasons)) {
    if (seasonData.months.includes(month)) {
      return seasonName as keyof typeof seasons;
    }
  }
  return 'winter'; // Fallback
};

const getCurrentTimeOfDay = (): keyof typeof timeOfDayThemes => {
  const hour = new Date().getHours();
  
  for (const [timeName, timeData] of Object.entries(timeOfDayThemes)) {
    if (timeData.hours.includes(hour)) {
      return timeName as keyof typeof timeOfDayThemes;
    }
  }
  return 'night'; // Fallback
};

export const useSeasonalTheme = (): SeasonalTheme => {
  const [currentSeason, setCurrentSeason] = useState<keyof typeof seasons>(getCurrentSeason());
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<keyof typeof timeOfDayThemes>(getCurrentTimeOfDay());

  useEffect(() => {
    const updateTheme = () => {
      setCurrentSeason(getCurrentSeason());
      setCurrentTimeOfDay(getCurrentTimeOfDay());
    };

    // Uppdatera varje minut för att fånga tid-ändringar
    const interval = setInterval(updateTheme, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const season = seasons[currentSeason];
  const timeOfDay = timeOfDayThemes[currentTimeOfDay];

  // Kombinera säsongs- och tidsruna
  const combinedRune = `${season.rune}${timeOfDay.rune}`;

  return {
    season: currentSeason,
    timeOfDay: currentTimeOfDay,
    rune: combinedRune,
    description: `${season.description} • ${timeOfDay.description}`,
    colors: timeOfDay.colors,
    seasonDescription: season.description,
    timeDescription: timeOfDay.description
  };
};

// Hook för att få specifika CSS-klasser baserat på tid
export const useTimeBasedStyles = () => {
  const theme = useSeasonalTheme();
  
  const getGlassStyles = () => {
    switch (theme.timeOfDay) {
      case 'morning':
        return {
          light: 'backdrop-blur-12 bg-amber-50/10 border-amber-200/20',
          strong: 'backdrop-blur-16 bg-amber-50/15 border-amber-200/25',
          dark: 'backdrop-blur-16 bg-amber-900/20 border-amber-400/10'
        };
      case 'midday':
        return {
          light: 'backdrop-blur-12 bg-blue-50/10 border-blue-200/20',
          strong: 'backdrop-blur-16 bg-blue-50/15 border-blue-200/25',
          dark: 'backdrop-blur-16 bg-blue-900/20 border-blue-400/10'
        };
      case 'evening':
        return {
          light: 'backdrop-blur-12 bg-orange-50/10 border-orange-200/20',
          strong: 'backdrop-blur-16 bg-orange-50/15 border-orange-200/25',
          dark: 'backdrop-blur-16 bg-orange-900/20 border-orange-400/10'
        };
      case 'night':
        return {
          light: 'backdrop-blur-12 bg-indigo-50/5 border-indigo-200/15',
          strong: 'backdrop-blur-16 bg-indigo-50/8 border-indigo-200/20',
          dark: 'backdrop-blur-16 bg-indigo-900/25 border-indigo-400/15'
        };
      default:
        return {
          light: 'glass-light',
          strong: 'glass-strong',
          dark: 'glass-dark'
        };
    }
  };

  const getBackgroundGradient = () => {
    switch (theme.timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50';
      case 'midday':
        return 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50';
      case 'evening':
        return 'bg-gradient-to-br from-orange-100 via-red-50 to-pink-50';
      case 'night':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
      default:
        return 'bg-gradient-to-br from-slate-100 to-slate-200';
    }
  };

  return {
    theme,
    glassStyles: getGlassStyles(),
    backgroundGradient: getBackgroundGradient()
  };
};

export default useSeasonalTheme;