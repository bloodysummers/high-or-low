import { Level } from '@/types';

export const LEVELS: Level[] = [
  {
    id: 'octava',
    name: 'Octavas',
    description: 'Una octava es el intervalo más amplio en esta aplicación. Las dos notas tienen el mismo nombre pero están separadas por 12 semitonos.',
    semitones: 12,
    unlocked: true, // El primer nivel siempre está desbloqueado
  },
  {
    id: 'septima-mayor',
    name: 'Séptimas Mayores',
    description: 'Una séptima mayor está a 11 semitonos de distancia. Es un intervalo disonante que crea tensión.',
    semitones: 11,
    unlocked: false,
  },
  {
    id: 'septima-menor',
    name: 'Séptimas Menores',
    description: 'Una séptima menor está a 10 semitonos de distancia. Es común en acordes de séptima dominante.',
    semitones: 10,
    unlocked: false,
  },
  {
    id: 'sexta-mayor',
    name: 'Sextas Mayores',
    description: 'Una sexta mayor está a 9 semitonos de distancia. Tiene un sonido dulce y agradable.',
    semitones: 9,
    unlocked: false,
  },
  {
    id: 'sexta-menor',
    name: 'Sextas Menores',
    description: 'Una sexta menor está a 8 semitonos de distancia. Tiene un carácter más melancólico.',
    semitones: 8,
    unlocked: false,
  },
  {
    id: 'quinta-justa',
    name: 'Quintas Justas',
    description: 'Una quinta justa está a 7 semitonos de distancia. Es uno de los intervalos más consonantes y estables.',
    semitones: 7,
    unlocked: false,
  },
  {
    id: 'cuarta-justa',
    name: 'Cuartas Justas',
    description: 'Una cuarta justa está a 5 semitonos de distancia. Es el complemento de la quinta justa.',
    semitones: 5,
    unlocked: false,
  },
  {
    id: 'tercera-mayor',
    name: 'Terceras Mayores',
    description: 'Una tercera mayor está a 4 semitonos de distancia. Forma la base de los acordes mayores.',
    semitones: 4,
    unlocked: false,
  },
  {
    id: 'tercera-menor',
    name: 'Terceras Menores',
    description: 'Una tercera menor está a 3 semitonos de distancia. Forma la base de los acordes menores.',
    semitones: 3,
    unlocked: false,
  },
  {
    id: 'segunda-mayor',
    name: 'Segundas Mayores',
    description: 'Una segunda mayor está a 2 semitonos de distancia. Es el intervalo entre la mayoría de las notas consecutivas de una escala mayor.',
    semitones: 2,
    unlocked: false,
  },
  {
    id: 'segunda-menor',
    name: 'Segundas Menores',
    description: 'Una segunda menor está a 1 semitono de distancia. Es el intervalo más pequeño en la música occidental y el más difícil de distinguir.',
    semitones: 1,
    unlocked: false,
  },
  {
    id: 'random',
    name: 'Aleatorio',
    description: 'En este nivel se presentarán intervalos de cualquier tipo de forma aleatoria. ¡El desafío definitivo!',
    semitones: null,
    unlocked: false,
  },
];

export const TOTAL_QUESTIONS = 10;
export const PASSING_SCORE = 10; // Necesitas 10/10 para desbloquear el siguiente nivel

// Rango de notas MIDI (C3 a C6)
export const MIN_MIDI_NOTE = 48; // C3
export const MAX_MIDI_NOTE = 84; // C6
