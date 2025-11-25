import { LEVELS } from '@/constants/levels';
import { DEFAULT_TIMBRE, TimbreType } from '@/constants/timbres';
import { IntervalType, Progress } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@high_or_low_progress';
const TIMBRE_KEY = '@high_or_low_timbre';

// Obtener el progreso guardado
export async function getProgress(): Promise<Progress> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  
  // Si no hay progreso guardado, inicializar con valores por defecto
  return initializeProgress();
}

// Inicializar progreso por defecto
function initializeProgress(): Progress {
  const progress: Progress = {};
  
  LEVELS.forEach((level) => {
    progress[level.id] = {
      bestScore: 0,
      unlocked: level.id === 'octava', // Solo el primer nivel desbloqueado
    };
  });
  
  return progress;
}

// Guardar el progreso
export async function saveProgress(progress: Progress): Promise<void> {
  try {
    const jsonValue = JSON.stringify(progress);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

// Actualizar el score de un nivel
export async function updateLevelScore(
  levelId: IntervalType,
  score: number
): Promise<Progress> {
  const progress = await getProgress();
  
  // Actualizar el mejor score si es mayor
  if (score > progress[levelId].bestScore) {
    progress[levelId].bestScore = score;
  }
  
  // Desbloquear el siguiente nivel si se obtuvo un score perfecto (10/10)
  if (score === 10) {
    const currentLevelIndex = LEVELS.findIndex((l) => l.id === levelId);
    if (currentLevelIndex !== -1 && currentLevelIndex < LEVELS.length - 1) {
      const nextLevel = LEVELS[currentLevelIndex + 1];
      progress[nextLevel.id].unlocked = true;
    }
  }
  
  await saveProgress(progress);
  return progress;
}

// Verificar si un nivel está desbloqueado
export async function isLevelUnlocked(levelId: IntervalType): Promise<boolean> {
  const progress = await getProgress();
  return progress[levelId]?.unlocked || false;
}

// Obtener el mejor score de un nivel
export async function getBestScore(levelId: IntervalType): Promise<number> {
  const progress = await getProgress();
  return progress[levelId]?.bestScore || 0;
}

// Resetear todo el progreso (útil para desarrollo/testing)
export async function resetProgress(): Promise<void> {
  const progress = initializeProgress();
  await saveProgress(progress);
}

// Guardar el timbre seleccionado
export async function saveTimbre(timbre: TimbreType): Promise<void> {
  try {
    await AsyncStorage.setItem(TIMBRE_KEY, timbre);
  } catch (e) {
    console.error('Error saving timbre:', e);
  }
}

// Obtener el timbre seleccionado
export async function getTimbre(): Promise<TimbreType> {
  try {
    const timbre = await AsyncStorage.getItem(TIMBRE_KEY);
    if (timbre != null) {
      return timbre as TimbreType;
    }
  } catch (e) {
    console.error('Error loading timbre:', e);
  }
  
  return DEFAULT_TIMBRE;
}
