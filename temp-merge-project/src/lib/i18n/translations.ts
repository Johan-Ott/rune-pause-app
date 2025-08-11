export type Language = 'sv' | 'en' | 'pl' | 'de' | 'es';

export interface Translations {
  // App general
  appName: string;
  appSubtitle: string;
  
  // Timer states
  working: string;
  paused: string;
  break: string;
  
  // Actions
  startWork: string;
  startBreak: string;
  pause: string;
  resume: string;
  skip: string;
  
  // Settings sections
  timerSettings: string;
  behaviorSettings: string;
  energyLevel: string;
  preferredActivities: string;
  
  // Settings labels
  workDuration: string;
  breakDuration: string;
  autoStartBreaks: string;
  smartActivitySelection: string;
  
  // Energy levels
  lowEnergy: string;
  mediumEnergy: string;
  highEnergy: string;
  
  // Activity types
  physical: string;
  mental: string;
  visual: string;
  breathing: string;
  
  // Menu items
  openMEXRO: string;
  restNow: string;
  quit: string;
  language: string;
  
  // Exercise UI
  exercise: string;
  duration: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  
  // Common
  minutes: string;
  seconds: string;
  close: string;
  save: string;
  cancel: string;
}

export const translations: Record<Language, Translations> = {
  sv: {
    appName: 'MEXRO',
    appSubtitle: 'Nordic Pomodoro Timer med Smart Vila',
    
    working: 'Arbetar',
    paused: 'Pausad',
    break: 'Vila',
    
    startWork: 'Börja arbeta',
    startBreak: 'Ta paus',
    pause: 'Pausa',
    resume: 'Fortsätt',
    skip: 'Hoppa över',
    
    timerSettings: 'TIMER-INSTÄLLNINGAR',
    behaviorSettings: 'BETEENDE',
    energyLevel: 'ENERGINIVÅ',
    preferredActivities: 'FÖREDRAGNA AKTIVITETER',
    
    workDuration: 'Arbetstid',
    breakDuration: 'Vilotid',
    autoStartBreaks: 'Starta pauser automatiskt',
    smartActivitySelection: 'Smart aktivitetsval',
    
    lowEnergy: 'Låg energi',
    mediumEnergy: 'Medium energi',
    highEnergy: 'Hög energi',
    
    physical: 'Fysiska',
    mental: 'Mentala',
    visual: 'Visuella',
    breathing: 'Andning',
    
    openMEXRO: 'Öppna MEXRO',
    restNow: 'Vila nu',
    quit: 'Avsluta',
    language: 'Språk',
    
    exercise: 'Övning',
    duration: 'Varaktighet',
    difficulty: 'Svårighet',
    easy: 'Lätt',
    medium: 'Medium',
    hard: 'Svår',
    
    minutes: 'minuter',
    seconds: 'sekunder',
    close: 'Stäng',
    save: 'Spara',
    cancel: 'Avbryt'
  },
  
  en: {
    appName: 'MEXRO',
    appSubtitle: 'Nordic Pomodoro Timer with Smart Rest',
    
    working: 'Working',
    paused: 'Paused',
    break: 'Break',
    
    startWork: 'Start work',
    startBreak: 'Take break',
    pause: 'Pause',
    resume: 'Resume',
    skip: 'Skip',
    
    timerSettings: 'TIMER SETTINGS',
    behaviorSettings: 'BEHAVIOR',
    energyLevel: 'ENERGY LEVEL',
    preferredActivities: 'PREFERRED ACTIVITIES',
    
    workDuration: 'Work duration',
    breakDuration: 'Break duration',
    autoStartBreaks: 'Auto-start breaks',
    smartActivitySelection: 'Smart activity selection',
    
    lowEnergy: 'Low energy',
    mediumEnergy: 'Medium energy',
    highEnergy: 'High energy',
    
    physical: 'Physical',
    mental: 'Mental',
    visual: 'Visual',
    breathing: 'Breathing',
    
    openMEXRO: 'Open MEXRO',
    restNow: 'Rest now',
    quit: 'Quit',
    language: 'Language',
    
    exercise: 'Exercise',
    duration: 'Duration',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    
    minutes: 'minutes',
    seconds: 'seconds',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel'
  },
  
  pl: {
    appName: 'MEXRO',
    appSubtitle: 'Nordycki Timer Pomodoro z Inteligentnym Odpoczynkiem',
    
    working: 'Praca',
    paused: 'Zatrzymany',
    break: 'Przerwa',
    
    startWork: 'Rozpocznij pracę',
    startBreak: 'Zrób przerwę',
    pause: 'Pauza',
    resume: 'Wznów',
    skip: 'Pomiń',
    
    timerSettings: 'USTAWIENIA TIMERA',
    behaviorSettings: 'ZACHOWANIE',
    energyLevel: 'POZIOM ENERGII',
    preferredActivities: 'PREFEROWANE AKTYWNOŚCI',
    
    workDuration: 'Czas pracy',
    breakDuration: 'Czas przerwy',
    autoStartBreaks: 'Automatyczne rozpoczynanie przerw',
    smartActivitySelection: 'Inteligentny wybór aktywności',
    
    lowEnergy: 'Niska energia',
    mediumEnergy: 'Średnia energia',
    highEnergy: 'Wysoka energia',
    
    physical: 'Fizyczne',
    mental: 'Mentalne',
    visual: 'Wzrokowe',
    breathing: 'Oddychanie',
    
    openMEXRO: 'Otwórz MEXRO',
    restNow: 'Odpocznij teraz',
    quit: 'Zakończ',
    language: 'Język',
    
    exercise: 'Ćwiczenie',
    duration: 'Czas trwania',
    difficulty: 'Trudność',
    easy: 'Łatwy',
    medium: 'Średni',
    hard: 'Trudny',
    
    minutes: 'minut',
    seconds: 'sekund',
    close: 'Zamknij',
    save: 'Zapisz',
    cancel: 'Anuluj'
  },
  
  de: {
    appName: 'MEXRO',
    appSubtitle: 'Nordischer Pomodoro Timer mit Intelligenter Pause',
    
    working: 'Arbeiten',
    paused: 'Pausiert',
    break: 'Pause',
    
    startWork: 'Arbeit beginnen',
    startBreak: 'Pause machen',
    pause: 'Pausieren',
    resume: 'Fortsetzen',
    skip: 'Überspringen',
    
    timerSettings: 'TIMER-EINSTELLUNGEN',
    behaviorSettings: 'VERHALTEN',
    energyLevel: 'ENERGIELEVEL',
    preferredActivities: 'BEVORZUGTE AKTIVITÄTEN',
    
    workDuration: 'Arbeitszeit',
    breakDuration: 'Pausenzeit',
    autoStartBreaks: 'Pausen automatisch starten',
    smartActivitySelection: 'Intelligente Aktivitätsauswahl',
    
    lowEnergy: 'Niedrige Energie',
    mediumEnergy: 'Mittlere Energie',
    highEnergy: 'Hohe Energie',
    
    physical: 'Körperlich',
    mental: 'Mental',
    visual: 'Visuell',
    breathing: 'Atmung',
    
    openMEXRO: 'MEXRO öffnen',
    restNow: 'Jetzt pausieren',
    quit: 'Beenden',
    language: 'Sprache',
    
    exercise: 'Übung',
    duration: 'Dauer',
    difficulty: 'Schwierigkeit',
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Schwer',
    
    minutes: 'Minuten',
    seconds: 'Sekunden',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen'
  },
  
  es: {
    appName: 'MEXRO',
    appSubtitle: 'Timer Pomodoro Nórdico con Descanso Inteligente',
    
    working: 'Trabajando',
    paused: 'Pausado',
    break: 'Descanso',
    
    startWork: 'Comenzar trabajo',
    startBreak: 'Tomar descanso',
    pause: 'Pausar',
    resume: 'Reanudar',
    skip: 'Saltar',
    
    timerSettings: 'CONFIGURACIÓN DEL TIMER',
    behaviorSettings: 'COMPORTAMIENTO',
    energyLevel: 'NIVEL DE ENERGÍA',
    preferredActivities: 'ACTIVIDADES PREFERIDAS',
    
    workDuration: 'Duración del trabajo',
    breakDuration: 'Duración del descanso',
    autoStartBreaks: 'Iniciar descansos automáticamente',
    smartActivitySelection: 'Selección inteligente de actividades',
    
    lowEnergy: 'Energía baja',
    mediumEnergy: 'Energía media',
    highEnergy: 'Energía alta',
    
    physical: 'Físico',
    mental: 'Mental',
    visual: 'Visual',
    breathing: 'Respiración',
    
    openMEXRO: 'Abrir MEXRO',
    restNow: 'Descansar ahora',
    quit: 'Salir',
    language: 'Idioma',
    
    exercise: 'Ejercicio',
    duration: 'Duración',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    
    minutes: 'minutos',
    seconds: 'segundos',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar'
  }
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.sv;
}
