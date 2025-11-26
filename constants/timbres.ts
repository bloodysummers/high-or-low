// Definición de armónicos y envelope para cada timbre

export interface Harmonic {
  freq: number;
  gain: number;
}

export interface Envelope {
  attack: number;
  decay: number;
  sustain: number;
  release?: number;
}

export interface TimbreConfig {
  id: string;
  name: string;
  harmonics: (frequency: number) => Harmonic[];
  envelope: Envelope;
  volumeMultiplier: number;
}

export type TimbreType = 'piano' | 'guitar' | 'flute' | 'synth-sine' | 'synth-square' | 'synth-sawtooth';

export const TIMBRES: Record<TimbreType, TimbreConfig> = {
  piano: {
    id: 'piano',
    name: 'Piano',
    harmonics: (frequency: number) => [
      // Tricord simulado: 3 osciladores ligeramente desafinados
      { freq: frequency * 0.998, gain: 0.33 },      // String 1 (slightly flat)
      { freq: frequency, gain: 0.35 },              // String 2 (center)
      { freq: frequency * 1.002, gain: 0.32 },      // String 3 (slightly sharp)
      // Armónicos según posición del martillo (aprox. 1/7 de la cuerda)
      { freq: frequency * 2, gain: 0.15 },          // 2nd harmonic
      { freq: frequency * 4, gain: 0.08 },          // 4th harmonic
      { freq: frequency * 5, gain: 0.05 },          // 5th harmonic
      { freq: frequency * 7, gain: 0.03 },          // 7th harmonic (débil)
    ],
    envelope: {
      attack: 0.002,     // Attack muy rápido (martillo)
      decay: 0.15,       // Decay más lento para sonido más sostenido
      sustain: 0.4,      // Sustain al 40% para mayor duración
    },
    volumeMultiplier: 0.28,
  },
  guitar: {
    id: 'guitar',
    name: 'Guitarra',
    harmonics: (frequency: number) => [
      // Fundamental + armónicos impares más fuertes
      { freq: frequency, gain: 0.6 },
      { freq: frequency * 2, gain: 0.15 },
      { freq: frequency * 3, gain: 0.35 },         // Tercera muy fuerte
      { freq: frequency * 4, gain: 0.08 },
      { freq: frequency * 5, gain: 0.2 },
      { freq: frequency * 6, gain: 0.05 },
      { freq: frequency * 7, gain: 0.12 },
    ],
    envelope: {
      attack: 0.003,
      decay: 0.2,
      sustain: 0.35,
    },
    volumeMultiplier: 0.25,
  },
  flute: {
    id: 'flute',
    name: 'Flauta',
    harmonics: (frequency: number) => [
      // Flauta tiene fundamental débil, segunda armónica fuerte
      { freq: frequency, gain: 0.5 },
      { freq: frequency * 2, gain: 0.7 },          // Segunda muy prominente
      { freq: frequency * 3, gain: 0.15 },
      { freq: frequency * 4, gain: 0.05 },
    ],
    envelope: {
      attack: 0.08,      // Attack más lento (soplido)
      decay: 0.03,
      sustain: 0.75,
    },
    volumeMultiplier: 0.35,
  },
  'synth-sine': {
    id: 'synth-sine',
    name: 'Sintetizador (Senoidal)',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 1.0 },
    ],
    envelope: {
      attack: 0.005,
      decay: 0.05,
      sustain: 0.8,
    },
    volumeMultiplier: 0.3,
  },
  'synth-square': {
    id: 'synth-square',
    name: 'Sintetizador (Cuadrada)',
    harmonics: (frequency: number) => [
      // Onda cuadrada: solo armónicos impares con amplitud 1/n
      { freq: frequency, gain: 1.0 },
      { freq: frequency * 3, gain: 0.333 },
      { freq: frequency * 5, gain: 0.2 },
      { freq: frequency * 7, gain: 0.143 },
      { freq: frequency * 9, gain: 0.111 },
      { freq: frequency * 11, gain: 0.091 },
    ],
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.7,
    },
    volumeMultiplier: 0.18,
  },
  'synth-sawtooth': {
    id: 'synth-sawtooth',
    name: 'Sintetizador (Diente de Sierra)',
    harmonics: (frequency: number) => [
      // Diente de sierra: todos los armónicos con amplitud 1/n
      { freq: frequency, gain: 1.0 },
      { freq: frequency * 2, gain: 0.5 },
      { freq: frequency * 3, gain: 0.333 },
      { freq: frequency * 4, gain: 0.25 },
      { freq: frequency * 5, gain: 0.2 },
      { freq: frequency * 6, gain: 0.167 },
      { freq: frequency * 7, gain: 0.143 },
      { freq: frequency * 8, gain: 0.125 },
    ],
    envelope: {
      attack: 0.005,
      decay: 0.08,
      sustain: 0.65,
    },
    volumeMultiplier: 0.12,
  },
};

export const DEFAULT_TIMBRE: TimbreType = 'piano';
