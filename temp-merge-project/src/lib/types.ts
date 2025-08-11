export type AppMode = 'config' | 'pause';

export type ActivityType = 'enkla' | 'andning' | 'stretching';

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  duration: number; // in seconds
  icon: string;
  description: string;
  instructions?: string[];
}

export interface AppSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // every N breaks
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  notificationsEnabled: boolean;
  selectedActivities: ActivityType[];
  reminderFrequency: number; // in minutes
}

export interface TimerState {
  mode: 'work' | 'break' | 'longBreak' | 'idle';
  remainingTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  currentSession: number;
  totalSessions: number;
}

export interface BreakSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  activity?: Activity;
  completed: boolean;
  dismissed: boolean;
}

export const defaultSettings: AppSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundVolume: 80,
  notificationsEnabled: true,
  selectedActivities: ['enkla', 'andning', 'stretching'],
  reminderFrequency: 30
};

export const defaultActivities: Activity[] = [
  {
    id: 'enkla-1',
    name: 'Enkla ögonrörelser',
    type: 'enkla',
    duration: 30,
    icon: '👀',
    description: 'Enkla ögonövningar för att vila ögonen',
    instructions: [
      'Titta långt bort i 20 sekunder',
      'Blinka långsamt 10 gånger',
      'Rulla ögonen i cirklar 5 gånger'
    ]
  },
  {
    id: 'enkla-2',
    name: 'Axelrullningar',
    type: 'enkla',
    duration: 45,
    icon: '🤷',
    description: 'Enkla axelrörelser för att släppa spänningar',
    instructions: [
      'Rulla axlarna bakåt 10 gånger',
      'Rulla axlarna framåt 10 gånger',
      'Lyft axlarna mot öronen, håll i 5 sekunder'
    ]
  },
  {
    id: 'andning-1',
    name: 'Djup andning',
    type: 'andning',
    duration: 60,
    icon: '🌬️',
    description: '4-7-8 andningsteknik för avslappning',
    instructions: [
      'Andas in genom näsan i 4 sekunder',
      'Håll andan i 7 sekunder',
      'Andas ut genom munnen i 8 sekunder',
      'Upprepa 4 gånger'
    ]
  },
  {
    id: 'andning-2',
    name: 'Boxandning',
    type: 'andning',
    duration: 90,
    icon: '📦',
    description: 'Fyrkants-andning för fokus och lugn',
    instructions: [
      'Andas in i 4 sekunder',
      'Håll andan i 4 sekunder',
      'Andas ut i 4 sekunder',
      'Håll andan i 4 sekunder',
      'Upprepa 6 gånger'
    ]
  },
  {
    id: 'stretching-1',
    name: 'Nackstretch',
    type: 'stretching',
    duration: 60,
    icon: '🦒',
    description: 'Gentle neck stretches för att släppa spänningar',
    instructions: [
      'Luta huvudet åt höger, håll i 15 sekunder',
      'Luta huvudet åt vänster, håll i 15 sekunder',
      'Titta upp, håll i 10 sekunder',
      'Titta ner, håll i 10 sekunder'
    ]
  },
  {
    id: 'stretching-2',
    name: 'Arm- och handledssträckning',
    type: 'stretching',
    duration: 75,
    icon: '💪',
    description: 'Stretching för armar och handleder',
    instructions: [
      'Sträck högra armen framåt, böj handleden uppåt',
      'Dra försiktigt med vänstra handen i 20 sekunder',
      'Upprepa med vänstra armen',
      'Rotera handlederna 10 gånger åt varje håll'
    ]
  }
];
