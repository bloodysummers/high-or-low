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
      { freq: frequency, gain: 0.5 },
      { freq: frequency * 2, gain: 0.25 },
      { freq: frequency * 3, gain: 0.15 },
      { freq: frequency * 4, gain: 0.1 },
      { freq: frequency * 5, gain: 0.05 },
    ],
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.2,
    },
    volumeMultiplier: 0.3,
  },
  guitar: {
    id: 'guitar',
    name: 'Guitarra',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 0.5 },
      { freq: frequency * 2, gain: 0.2 },
      { freq: frequency * 3, gain: 0.3 },
      { freq: frequency * 5, gain: 0.15 },
      { freq: frequency * 7, gain: 0.1 },
      { freq: frequency * 9, gain: 0.05 },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.4,
    },
    volumeMultiplier: 0.35,
  },
  flute: {
    id: 'flute',
    name: 'Flauta',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 0.7 },
      { freq: frequency * 2, gain: 0.2 },
      { freq: frequency * 3, gain: 0.1 },
    ],
    envelope: {
      attack: 0.05,
      decay: 0.05,
      sustain: 0.6,
    },
    volumeMultiplier: 0.4,
  },
  'synth-sine': {
    id: 'synth-sine',
    name: 'Sintetizador (Senoidal)',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 1.0 },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.7,
    },
    volumeMultiplier: 0.25,
  },
  'synth-square': {
    id: 'synth-square',
    name: 'Sintetizador (Cuadrada)',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 1.0 },
      { freq: frequency * 3, gain: 0.33 },
      { freq: frequency * 5, gain: 0.2 },
      { freq: frequency * 7, gain: 0.14 },
      { freq: frequency * 9, gain: 0.11 },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
    },
    volumeMultiplier: 0.2,
  },
  'synth-sawtooth': {
    id: 'synth-sawtooth',
    name: 'Sintetizador (Diente de Sierra)',
    harmonics: (frequency: number) => [
      { freq: frequency, gain: 1.0 },
      { freq: frequency * 2, gain: 0.5 },
      { freq: frequency * 3, gain: 0.33 },
      { freq: frequency * 4, gain: 0.25 },
      { freq: frequency * 5, gain: 0.2 },
      { freq: frequency * 6, gain: 0.17 },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
    },
    volumeMultiplier: 0.15,
  },
};

export const DEFAULT_TIMBRE: TimbreType = 'piano';
