import { LEVELS, MAX_MIDI_NOTE, MIN_MIDI_NOTE } from '@/constants/levels';
import { TIMBRES, TimbreType } from '@/constants/timbres';
import { IntervalType } from '@/types';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { getTimbre } from './storage';

// Convertir número MIDI a frecuencia
export function midiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

// Convertir número MIDI a nombre de nota
export function midiToNoteName(midiNote: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  return `${noteNames[noteIndex]}${octave}`;
}

// Generar dos notas aleatorias para un nivel específico
export function generateNotePair(levelId: IntervalType): {
  firstNote: number;
  secondNote: number;
  correctAnswer: 'higher' | 'lower';
} {
  const level = LEVELS.find(l => l.id === levelId);
  
  if (!level) {
    throw new Error(`Level ${levelId} not found`);
  }

  let semitones: number;
  
  if (level.semitones === null) {
    // Random: elegir un semitono aleatorio entre 1 y 12
    semitones = Math.floor(Math.random() * 12) + 1;
  } else {
    semitones = level.semitones;
  }

  // Generar la primera nota aleatoria
  // Asegurarse de que haya espacio para el intervalo
  const maxFirstNote = MAX_MIDI_NOTE - semitones;
  const minFirstNote = MIN_MIDI_NOTE + semitones;
  
  const firstNote = Math.floor(Math.random() * (maxFirstNote - minFirstNote + 1)) + minFirstNote;
  
  // Decidir aleatoriamente si la segunda nota es más aguda o más grave
  const isHigher = Math.random() < 0.5;
  const secondNote = isHigher ? firstNote + semitones : firstNote - semitones;
  
  return {
    firstNote,
    secondNote,
    correctAnswer: isHigher ? 'higher' : 'lower',
  };
}

// Reproducir una secuencia de notas
export async function playNoteSequence(notes: number[], duration: number = 0.5, gap: number = 0.3): Promise<void> {
  console.log('Starting audio playback with expo-av');
  
  try {
    // Configurar el modo de audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // En React Native, usamos un generador de tonos simple con Web Audio cuando está disponible
    // o reproducimos tonos sintetizados
    for (let i = 0; i < notes.length; i++) {
      const midiNote = notes[i];
      const frequency = midiToFrequency(midiNote);
      
      console.log(`Playing note ${midiNote} (${frequency}Hz) at index ${i}`);
      
      // Crear un tono simple usando Web Audio API (solo funciona en web)
      if (Platform.OS === 'web') {
        await playWebTone(frequency, duration);
      } else {
        // Para móvil, usamos un tono generado dinámicamente
        await playMobileTone(frequency, duration);
      }
      
      // Esperar el gap entre notas (excepto después de la última)
      if (i < notes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, gap * 1000));
      }
    }
    
    console.log('Audio playback completed');
  } catch (error) {
    console.error('Error in playNoteSequence:', error);
    throw error;
  }
}

// Reproducir tono en web usando Web Audio API con timbre de piano
async function playWebTone(frequency: number, duration: number): Promise<void> {
  if (typeof window === 'undefined' || !window.AudioContext) {
    throw new Error('Web Audio API not available');
  }

  const timbreType = await getTimbre();
  const timbreConfig = TIMBRES[timbreType];

  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const mainGain = audioContext.createGain();
    mainGain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    // Obtener armónicos del timbre configurado
    const harmonics = timbreConfig.harmonics(frequency);

    harmonics.forEach(({ freq, gain }) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(mainGain);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      // Envelope según configuración del timbre
      const { attack, decay, sustain } = timbreConfig.envelope;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(gain * sustain, now + attack + decay);
      gainNode.gain.exponentialRampToValueAtTime(gain * sustain * 0.7, now + duration * 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    });

    // Envelope general
    mainGain.gain.setValueAtTime(timbreConfig.volumeMultiplier, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    setTimeout(() => {
      mainGain.disconnect();
      audioContext.close();
      resolve();
    }, duration * 1000 + 100);
  });
}

// Reproducir tono en móvil usando expo-av con audio generado
async function playMobileTone(frequency: number, duration: number): Promise<void> {
  try {
    const timbreType = await getTimbre();
    const { Audio: ExpoAudio } = await import('expo-av');
    
    // Generar WAV en base64
    const wavData = generateWAV(frequency, duration, timbreType);
    const { sound } = await ExpoAudio.Sound.createAsync({
      uri: `data:audio/wav;base64,${wavData}`,
    });
    
    await sound.playAsync();
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        await sound.unloadAsync();
        resolve();
      }, duration * 1000 + 100);
    });
  } catch (error) {
    console.error('Error playing mobile tone:', error);
    // Fallback: solo esperar
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  }
}

// Generar archivo WAV en base64 (simplificado)
function generateWAV(frequency: number, duration: number, timbreType: TimbreType): string {
  const timbreConfig = TIMBRES[timbreType];
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // Header WAV
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, 1, true); // NumChannels (mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Datos de audio con armónicos según el timbre configurado
  const harmonics = timbreConfig.harmonics(frequency);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    harmonics.forEach(({ freq, gain }) => {
      sample += Math.sin(2 * Math.PI * freq * t) * gain;
    });

    // Envelope según configuración del timbre
    const { attack, decay, sustain } = timbreConfig.envelope;
    
    let envelope = 1;
    if (t < attack) {
      envelope = t / attack;
    } else if (t < attack + decay) {
      envelope = 1 - (1 - sustain) * ((t - attack) / decay);
    } else {
      envelope = sustain * Math.exp(-(t - attack - decay) * 2);
    }

    const value = Math.floor(sample * envelope * 32767 * timbreConfig.volumeMultiplier);
    view.setInt16(44 + i * 2, value, true);
  }

  // Convertir a base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

// Reproducir una sola nota
export async function playNote(midiNote: number, duration: number = 0.5): Promise<void> {
  return playNoteSequence([midiNote], duration, 0);
}

// Reproducir el par de notas del juego
export async function playGameNotes(firstNote: number, secondNote: number): Promise<void> {
  return playNoteSequence([firstNote, secondNote], 0.8, 0.4);
}
