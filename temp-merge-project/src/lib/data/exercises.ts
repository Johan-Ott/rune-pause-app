export interface Exercise {
  id: string;
  name: Record<string, string>; // localized names
  description: Record<string, string>; // localized descriptions
  duration: number; // seconds
  type: 'physical' | 'mental' | 'visual' | 'breathing';
  difficulty: 'easy' | 'medium' | 'hard';
  targetAreas: string[];
  instructions: Record<string, string[]>; // localized step-by-step instructions
}

export const EXERCISES: Exercise[] = [
  // Physical Exercises
  {
    id: 'neck-rolls',
    name: {
      sv: 'Nackrullningar',
      en: 'Neck Rolls',
      pl: 'Obroty szyi',
      de: 'Nackenrollen',
      es: 'Giros de cuello'
    },
    description: {
      sv: 'Minska spänning i nacke och axlar',
      en: 'Reduce tension in neck and shoulders',
      pl: 'Zmniejsz napięcie w szyi i ramionach',
      de: 'Reduziere Spannung in Nacken und Schultern',
      es: 'Reduce la tensión en cuello y hombros'
    },
    duration: 60,
    type: 'physical',
    difficulty: 'easy',
    targetAreas: ['neck', 'shoulders'],
    instructions: {
      sv: [
        'Sitt upp rakt i stolen',
        'Rulla huvudet långsamt medurs 5 gånger',
        'Rulla huvudet långsamt moturs 5 gånger',
        'Sluta med att titta rakt fram'
      ],
      en: [
        'Sit up straight in your chair',
        'Roll your head slowly clockwise 5 times',
        'Roll your head slowly counterclockwise 5 times',
        'End by looking straight ahead'
      ],
      pl: [
        'Usiądź prosto na krześle',
        'Obracaj głowę powoli zgodnie z ruchem wskazówek zegara 5 razy',
        'Obracaj głowę powoli przeciwnie do ruchu wskazówek zegara 5 razy',
        'Zakończ patrząc prosto przed siebie'
      ],
      de: [
        'Setze dich gerade auf deinen Stuhl',
        'Rolle deinen Kopf langsam 5 Mal im Uhrzeigersinn',
        'Rolle deinen Kopf langsam 5 Mal gegen den Uhrzeigersinn',
        'Beende mit Blick geradeaus'
      ],
      es: [
        'Siéntate derecho en tu silla',
        'Rueda tu cabeza lentamente en sentido horario 5 veces',
        'Rueda tu cabeza lentamente en sentido antihorario 5 veces',
        'Termina mirando hacia adelante'
      ]
    }
  },
  {
    id: 'shoulder-shrugs',
    name: {
      sv: 'Axellyft',
      en: 'Shoulder Shrugs',
      pl: 'Unoszenie ramion',
      de: 'Schulterzucken',
      es: 'Encogimiento de hombros'
    },
    description: {
      sv: 'Lossa upp spända axlar',
      en: 'Release tight shoulders',
      pl: 'Rozluźnij napięte ramiona',
      de: 'Löse verspannte Schultern',
      es: 'Libera hombros tensos'
    },
    duration: 45,
    type: 'physical',
    difficulty: 'easy',
    targetAreas: ['shoulders', 'upper-back'],
    instructions: {
      sv: [
        'Sitt med ryggen rak',
        'Lyft axlarna upp mot öronen',
        'Håll i 3 sekunder',
        'Släpp ner långsamt',
        'Upprepa 8 gånger'
      ],
      en: [
        'Sit with your back straight',
        'Lift your shoulders up towards your ears',
        'Hold for 3 seconds',
        'Lower slowly',
        'Repeat 8 times'
      ],
      pl: [
        'Usiądź z prostymi plecami',
        'Unieś ramiona w kierunku uszu',
        'Trzymaj przez 3 sekundy',
        'Opuść powoli',
        'Powtórz 8 razy'
      ],
      de: [
        'Sitze mit geradem Rücken',
        'Hebe deine Schultern zu den Ohren',
        'Halte 3 Sekunden',
        'Senke langsam ab',
        'Wiederhole 8 Mal'
      ],
      es: [
        'Siéntate con la espalda recta',
        'Levanta los hombros hacia las orejas',
        'Mantén por 3 segundos',
        'Baja lentamente',
        'Repite 8 veces'
      ]
    }
  },
  {
    id: 'wrist-stretches',
    name: {
      sv: 'Handledssträckning',
      en: 'Wrist Stretches',
      pl: 'Rozciąganie nadgarstków',
      de: 'Handgelenksdehnung',
      es: 'Estiramientos de muñeca'
    },
    description: {
      sv: 'Förebygg och lindra belastningsskador',
      en: 'Prevent and relieve strain injuries',
      pl: 'Zapobiegaj i łagodź urazy przeciążeniowe',
      de: 'Verhindere und lindere Belastungsverletzungen',
      es: 'Prevenir y aliviar lesiones por tensión'
    },
    duration: 90,
    type: 'physical',
    difficulty: 'easy',
    targetAreas: ['wrists', 'forearms'],
    instructions: {
      sv: [
        'Sträck ut höger arm framför dig',
        'Böj handen nedåt med vänster hand',
        'Håll i 15 sekunder',
        'Böj handen uppåt, håll 15 sekunder',
        'Upprepa med vänster arm'
      ],
      en: [
        'Extend right arm in front of you',
        'Bend hand down with left hand',
        'Hold for 15 seconds',
        'Bend hand up, hold 15 seconds',
        'Repeat with left arm'
      ],
      pl: [
        'Wyciągnij prawą rękę przed siebie',
        'Zegnij dłoń w dół lewą ręką',
        'Trzymaj przez 15 sekund',
        'Zegnij dłoń w górę, trzymaj 15 sekund',
        'Powtórz z lewą ręką'
      ],
      de: [
        'Strecke den rechten Arm vor dir aus',
        'Beuge die Hand mit der linken Hand nach unten',
        'Halte 15 Sekunden',
        'Beuge die Hand nach oben, halte 15 Sekunden',
        'Wiederhole mit dem linken Arm'
      ],
      es: [
        'Extiende el brazo derecho frente a ti',
        'Dobla la mano hacia abajo con la mano izquierda',
        'Mantén por 15 segundos',
        'Dobla la mano hacia arriba, mantén 15 segundos',
        'Repite con el brazo izquierdo'
      ]
    }
  },

  // Visual Exercises
  {
    id: 'eye-focus',
    name: {
      sv: 'Ögonfokusering',
      en: 'Eye Focus Exercise',
      pl: 'Ćwiczenie skupienia wzroku',
      de: 'Augenfokus-Übung',
      es: 'Ejercicio de enfoque ocular'
    },
    description: {
      sv: 'Träna ögonfokus och minska överansträngning',
      en: 'Train eye focus and reduce strain',
      pl: 'Trenuj skupienie wzroku i zmniejsz zmęczenie',
      de: 'Trainiere Augenfokus und reduziere Belastung',
      es: 'Entrena el enfoque ocular y reduce la fatiga'
    },
    duration: 120,
    type: 'visual',
    difficulty: 'easy',
    targetAreas: ['eyes'],
    instructions: {
      sv: [
        'Fokusera på något nära (30 cm bort)',
        'Håll fokus i 5 sekunder',
        'Titta på något långt bort (6+ meter)',
        'Håll fokus i 5 sekunder',
        'Upprepa 10 gånger'
      ],
      en: [
        'Focus on something near (30cm away)',
        'Hold focus for 5 seconds',
        'Look at something far away (6+ meters)',
        'Hold focus for 5 seconds',
        'Repeat 10 times'
      ],
      pl: [
        'Skup się na czymś blisko (30 cm)',
        'Utrzymaj skupienie przez 5 sekund',
        'Spójrz na coś daleko (6+ metrów)',
        'Utrzymaj skupienie przez 5 sekund',
        'Powtórz 10 razy'
      ],
      de: [
        'Fokussiere auf etwas Nahes (30cm entfernt)',
        'Halte den Fokus 5 Sekunden',
        'Schaue auf etwas Fernes (6+ Meter)',
        'Halte den Fokus 5 Sekunden',
        'Wiederhole 10 Mal'
      ],
      es: [
        'Enfócate en algo cercano (30cm de distancia)',
        'Mantén el enfoque por 5 segundos',
        'Mira algo lejano (6+ metros)',
        'Mantén el enfoque por 5 segundos',
        'Repite 10 veces'
      ]
    }
  },
  {
    id: 'eye-circles',
    name: {
      sv: 'Ögoncirklar',
      en: 'Eye Circles',
      pl: 'Kółka oczami',
      de: 'Augenkreise',
      es: 'Círculos oculares'
    },
    description: {
      sv: 'Stärk ögonmusklerna',
      en: 'Strengthen eye muscles',
      pl: 'Wzmocnij mięśnie oczu',
      de: 'Stärke die Augenmuskeln',
      es: 'Fortalece los músculos oculares'
    },
    duration: 60,
    type: 'visual',
    difficulty: 'easy',
    targetAreas: ['eyes'],
    instructions: {
      sv: [
        'Sitt bekvämt med huvudet stilla',
        'Titta upp, sedan höger, ner, vänster',
        'Gör 5 cirklar medurs',
        'Gör 5 cirklar moturs',
        'Blinka flera gånger'
      ],
      en: [
        'Sit comfortably with head still',
        'Look up, then right, down, left',
        'Make 5 circles clockwise',
        'Make 5 circles counterclockwise',
        'Blink several times'
      ],
      pl: [
        'Usiądź wygodnie z nieruchomą głową',
        'Spójrz w górę, potem w prawo, w dół, w lewo',
        'Zrób 5 kółek zgodnie z ruchem wskazówek zegara',
        'Zrób 5 kółek przeciwnie do ruchu wskazówek zegara',
        'Mrugaj kilka razy'
      ],
      de: [
        'Sitze bequem mit stillstehendem Kopf',
        'Schaue nach oben, dann rechts, unten, links',
        'Mache 5 Kreise im Uhrzeigersinn',
        'Mache 5 Kreise gegen den Uhrzeigersinn',
        'Blinzle mehrmals'
      ],
      es: [
        'Siéntate cómodamente con la cabeza quieta',
        'Mira hacia arriba, luego derecha, abajo, izquierda',
        'Haz 5 círculos en sentido horario',
        'Haz 5 círculos en sentido antihorario',
        'Parpadea varias veces'
      ]
    }
  },

  // Breathing Exercises
  {
    id: 'box-breathing',
    name: {
      sv: 'Fyrkantsandning',
      en: 'Box Breathing',
      pl: 'Oddychanie kwadratowe',
      de: 'Box-Atmung',
      es: 'Respiración cuadrada'
    },
    description: {
      sv: 'Lugna nervsystemet och minska stress',
      en: 'Calm nervous system and reduce stress',
      pl: 'Uspokój układ nerwowy i zmniejsz stres',
      de: 'Beruhige das Nervensystem und reduziere Stress',
      es: 'Calma el sistema nervioso y reduce el estrés'
    },
    duration: 180,
    type: 'breathing',
    difficulty: 'medium',
    targetAreas: ['mind', 'stress'],
    instructions: {
      sv: [
        'Sitt bekvämt med ryggen rak',
        'Andas in i 4 sekunder',
        'Håll andan i 4 sekunder',
        'Andas ut i 4 sekunder',
        'Håll tom i 4 sekunder',
        'Upprepa 6 cykler'
      ],
      en: [
        'Sit comfortably with back straight',
        'Breathe in for 4 seconds',
        'Hold breath for 4 seconds',
        'Breathe out for 4 seconds',
        'Hold empty for 4 seconds',
        'Repeat 6 cycles'
      ],
      pl: [
        'Usiądź wygodnie z prostymi plecami',
        'Wdychaj przez 4 sekundy',
        'Zatrzymaj oddech na 4 sekundy',
        'Wydychaj przez 4 sekundy',
        'Zatrzymaj pusty na 4 sekundy',
        'Powtórz 6 cykli'
      ],
      de: [
        'Sitze bequem mit geradem Rücken',
        'Atme 4 Sekunden ein',
        'Halte den Atem 4 Sekunden an',
        'Atme 4 Sekunden aus',
        'Halte leer 4 Sekunden',
        'Wiederhole 6 Zyklen'
      ],
      es: [
        'Siéntate cómodamente con la espalda recta',
        'Inhala por 4 segundos',
        'Mantén la respiración por 4 segundos',
        'Exhala por 4 segundos',
        'Mantén vacío por 4 segundos',
        'Repite 6 ciclos'
      ]
    }
  },

  // Mental Exercises
  {
    id: 'mindful-moment',
    name: {
      sv: 'Medveten stund',
      en: 'Mindful Moment',
      pl: 'Moment uważności',
      de: 'Achtsamer Moment',
      es: 'Momento consciente'
    },
    description: {
      sv: 'Återställ fokus och mental klarhet',
      en: 'Reset focus and mental clarity',
      pl: 'Przywróć skupienie i jasność umysłu',
      de: 'Stelle Fokus und geistige Klarheit wieder her',
      es: 'Restablece el enfoque y la claridad mental'
    },
    duration: 120,
    type: 'mental',
    difficulty: 'easy',
    targetAreas: ['mind', 'focus'],
    instructions: {
      sv: [
        'Stäng ögonen eller titta ner',
        'Känn dina fötter mot golvet',
        'Märk din andning utan att förändra den',
        'Räkna 5 saker du hör',
        'Öppna ögonen långsamt'
      ],
      en: [
        'Close your eyes or look down',
        'Feel your feet on the ground',
        'Notice your breathing without changing it',
        'Count 5 things you can hear',
        'Open your eyes slowly'
      ],
      pl: [
        'Zamknij oczy lub spójrz w dół',
        'Poczuj stopy na podłodze',
        'Zauważ swój oddech nie zmieniając go',
        'Policz 5 rzeczy które słyszysz',
        'Otwórz oczy powoli'
      ],
      de: [
        'Schließe die Augen oder schaue nach unten',
        'Spüre deine Füße auf dem Boden',
        'Bemerke deinen Atem ohne ihn zu verändern',
        'Zähle 5 Dinge die du hörst',
        'Öffne die Augen langsam'
      ],
      es: [
        'Cierra los ojos o mira hacia abajo',
        'Siente tus pies en el suelo',
        'Nota tu respiración sin cambiarla',
        'Cuenta 5 cosas que puedes oír',
        'Abre los ojos lentamente'
      ]
    }
  },
  {
    id: 'gratitude-reflection',
    name: {
      sv: 'Tacksamhetsreflektion',
      en: 'Gratitude Reflection',
      pl: 'Refleksja wdzięczności',
      de: 'Dankbarkeitsreflexion',
      es: 'Reflexión de gratitud'
    },
    description: {
      sv: 'Förbättra humör och perspektiv',
      en: 'Improve mood and perspective',
      pl: 'Popraw nastrój i perspektywę',
      de: 'Verbessere Stimmung und Perspektive',
      es: 'Mejora el estado de ánimo y la perspectiva'
    },
    duration: 90,
    type: 'mental',
    difficulty: 'easy',
    targetAreas: ['mind', 'mood'],
    instructions: {
      sv: [
        'Tänk på 3 saker du är tacksam för idag',
        'Reflektera över varför de betyder något',
        'Känn tacksamhetskänslan i kroppen',
        'Le lite för dig själv'
      ],
      en: [
        'Think of 3 things you\'re grateful for today',
        'Reflect on why they matter to you',
        'Feel the gratitude sensation in your body',
        'Smile a little to yourself'
      ],
      pl: [
        'Pomyśl o 3 rzeczach za które jesteś wdzięczny dziś',
        'Zastanów się dlaczego są dla ciebie ważne',
        'Poczuj uczucie wdzięczności w ciele',
        'Uśmiechnij się trochę do siebie'
      ],
      de: [
        'Denke an 3 Dinge für die du heute dankbar bist',
        'Reflektiere warum sie dir wichtig sind',
        'Spüre das Dankbarkeitsgefühl in deinem Körper',
        'Lächle ein wenig zu dir selbst'
      ],
      es: [
        'Piensa en 3 cosas por las que estás agradecido hoy',
        'Reflexiona sobre por qué te importan',
        'Siente la sensación de gratitud en tu cuerpo',
        'Sonríe un poco para ti mismo'
      ]
    }
  }
];

export function getExercisesByType(type: Exercise['type']): Exercise[] {
  return EXERCISES.filter(exercise => exercise.type === type);
}

export function getExercisesByDifficulty(difficulty: Exercise['difficulty']): Exercise[] {
  return EXERCISES.filter(exercise => exercise.difficulty === difficulty);
}

export function getRandomExercise(filters?: { 
  type?: Exercise['type']; 
  difficulty?: Exercise['difficulty'];
  maxDuration?: number;
}): Exercise {
  let filteredExercises = EXERCISES;
  
  if (filters?.type) {
    filteredExercises = filteredExercises.filter(ex => ex.type === filters.type);
  }
  
  if (filters?.difficulty) {
    filteredExercises = filteredExercises.filter(ex => ex.difficulty === filters.difficulty);
  }
  
  if (filters?.maxDuration) {
    filteredExercises = filteredExercises.filter(ex => ex.duration <= filters.maxDuration!);
  }
  
  if (filteredExercises.length === 0) {
    return EXERCISES[0]!;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredExercises.length);
  return filteredExercises[randomIndex]!;
}
