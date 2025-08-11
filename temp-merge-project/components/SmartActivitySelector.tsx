import React from 'react';

export type ActivityType = 'simple' | 'breathing' | 'stretch';

export interface Activity {
  title: string;
  description: string;
  rune: string;
  type: ActivityType;
  subType?: string; // För stretch: 'desk' eller 'full'
  timePreference?: ('morning' | 'midday' | 'evening' | 'night')[];
  energyLevel?: 'low' | 'medium' | 'high';
  duration?: 'short' | 'medium' | 'long';
}

// Utökad aktivitetsdatabas med tid-preferenser
const activityDatabase: Record<'short' | 'long', Activity[]> = {
  short: [
    { 
      title: 'Andas', 
      description: 'Tre djupa andetag', 
      rune: 'ᚨ', 
      type: 'simple',
      timePreference: ['morning', 'midday', 'evening', 'night'],
      energyLevel: 'low',
      duration: 'short'
    },
    { 
      title: 'Vila ögonen', 
      description: 'Blicka bort från skärmen', 
      rune: 'ᛋ', 
      type: 'simple',
      timePreference: ['midday', 'evening'],
      energyLevel: 'low',
      duration: 'short'
    },
    { 
      title: 'Sträck ut', 
      description: 'Lyft armarna över huvudet', 
      rune: 'ᚱ', 
      type: 'simple',
      timePreference: ['morning', 'midday'],
      energyLevel: 'medium',
      duration: 'short'
    },
    { 
      title: 'Morgonandning', 
      description: 'Energigivande andningsteknik', 
      rune: 'ᚨᚾᛞ', 
      type: 'breathing',
      timePreference: ['morning'],
      energyLevel: 'medium',
      duration: 'medium'
    },
    { 
      title: 'Fokusandning', 
      description: 'Koncentrationsförbättrande teknik', 
      rune: 'ᚠᛟᚲ', 
      type: 'breathing',
      timePreference: ['midday'],
      energyLevel: 'medium',
      duration: 'medium'
    },
    { 
      title: 'Kvällsandning', 
      description: 'Avslappnande andningsteknik', 
      rune: 'ᚱᛟ', 
      type: 'breathing',
      timePreference: ['evening', 'night'],
      energyLevel: 'low',
      duration: 'medium'
    },
    { 
      title: 'Snabbstretch', 
      description: 'Kort stretchsekvens', 
      rune: 'ᛊᚱᚨ', 
      type: 'stretch',
      subType: 'desk',
      timePreference: ['morning', 'midday'],
      energyLevel: 'medium',
      duration: 'short'
    }
  ],
  long: [
    { 
      title: 'Gå en runda', 
      description: 'Promenera i några minuter', 
      rune: 'ᚠ', 
      type: 'simple',
      timePreference: ['morning', 'midday', 'evening'],
      energyLevel: 'high',
      duration: 'long'
    },
    { 
      title: 'Drick vatten', 
      description: 'Återfukta kroppen', 
      rune: 'ᚲ', 
      type: 'simple',
      timePreference: ['morning', 'midday', 'evening', 'night'],
      energyLevel: 'low',
      duration: 'short'
    },
    { 
      title: 'Vila helt', 
      description: 'Slut ögonen och vila', 
      rune: 'ᛁ', 
      type: 'simple',
      timePreference: ['evening', 'night'],
      energyLevel: 'low',
      duration: 'medium'
    },
    { 
      title: 'Morgonyoga', 
      description: 'Energigivande stretchrutiner', 
      rune: 'ᛊᛏᚱ', 
      type: 'stretch',
      subType: 'full',
      timePreference: ['morning'],
      energyLevel: 'high',
      duration: 'long'
    },
    { 
      title: 'Arbetspaus-stretch', 
      description: 'Skrivbordsvänliga övningar', 
      rune: 'ᚨᚱᛒ', 
      type: 'stretch',
      subType: 'desk',
      timePreference: ['midday'],
      energyLevel: 'medium',
      duration: 'medium'
    },
    { 
      title: 'Kvällsstretch', 
      description: 'Avslappnande stretchövningar', 
      rune: 'ᚲᚢᚨ', 
      type: 'stretch',
      subType: 'full',
      timePreference: ['evening'],
      energyLevel: 'low',
      duration: 'long'
    },
    { 
      title: 'Djup andning', 
      description: 'Avancerad andningsteknik', 
      rune: 'ᚨᚾᛞ', 
      type: 'breathing',
      timePreference: ['morning', 'evening'],
      energyLevel: 'medium',
      duration: 'long'
    },
    { 
      title: 'Meditation', 
      description: 'Guidad mindfulness-övning', 
      rune: 'ᛗᛖᛞ', 
      type: 'breathing',
      timePreference: ['evening', 'night'],
      energyLevel: 'low',
      duration: 'long'
    },
    { 
      title: 'Fullkroppsstretch', 
      description: 'Omfattande stretchrutiner', 
      rune: 'ᚺᛖᛚ', 
      type: 'stretch',
      subType: 'full',
      timePreference: ['morning', 'evening'],
      energyLevel: 'high',
      duration: 'long'
    }
  ]
};

interface SmartActivitySelectorProps {
  pauseType: 'short' | 'long';
  timeOfDay: 'morning' | 'midday' | 'evening' | 'night';
  autoSelect?: boolean;
  userPreferences?: {
    preferredTypes?: ActivityType[];
    energyLevel?: 'low' | 'medium' | 'high';
    avoidTypes?: ActivityType[];
  };
}

export class SmartActivitySelector {
  static selectActivity(props: SmartActivitySelectorProps): Activity {
    const { pauseType, timeOfDay, userPreferences = {} } = props;
    const availableActivities = activityDatabase[pauseType];

    // Filtrera aktiviteter baserat på tid på dagen
    let filteredActivities = availableActivities.filter(activity => 
      !activity.timePreference || activity.timePreference.includes(timeOfDay)
    );

    // Filtrera baserat på användarpreferenser
    if (userPreferences.preferredTypes && userPreferences.preferredTypes.length > 0) {
      const preferredActivities = filteredActivities.filter(activity =>
        userPreferences.preferredTypes!.includes(activity.type)
      );
      if (preferredActivities.length > 0) {
        filteredActivities = preferredActivities;
      }
    }

    // Undvik vissa typer
    if (userPreferences.avoidTypes && userPreferences.avoidTypes.length > 0) {
      filteredActivities = filteredActivities.filter(activity =>
        !userPreferences.avoidTypes!.includes(activity.type)
      );
    }

    // Viktning baserat på tid på dagen
    const weightedActivities = filteredActivities.map(activity => {
      let weight = 1;

      // Högre vikt för tid-specifika aktiviteter
      if (activity.timePreference && activity.timePreference.includes(timeOfDay)) {
        weight += 2;
      }

      // Viktning baserat på energinivå och tid
      if (timeOfDay === 'morning' && activity.energyLevel === 'high') weight += 1.5;
      if (timeOfDay === 'midday' && activity.energyLevel === 'medium') weight += 1.5;
      if ((timeOfDay === 'evening' || timeOfDay === 'night') && activity.energyLevel === 'low') weight += 1.5;

      // Viktning baserat på användarens energipreferens
      if (userPreferences.energyLevel && activity.energyLevel === userPreferences.energyLevel) {
        weight += 1;
      }

      return { activity, weight };
    });

    // Slumpmässigt val baserat på viktning
    const totalWeight = weightedActivities.reduce((sum, item) => sum + item.weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (const item of weightedActivities) {
      randomValue -= item.weight;
      if (randomValue <= 0) {
        return item.activity;
      }
    }

    // Fallback till första aktiviteten
    return filteredActivities[0] || availableActivities[0];
  }

  static getAllActivities(pauseType: 'short' | 'long'): Activity[] {
    return activityDatabase[pauseType];
  }

  static getActivitiesForTime(pauseType: 'short' | 'long', timeOfDay: 'morning' | 'midday' | 'evening' | 'night'): Activity[] {
    return activityDatabase[pauseType].filter(activity =>
      !activity.timePreference || activity.timePreference.includes(timeOfDay)
    );
  }
}

export default SmartActivitySelector;