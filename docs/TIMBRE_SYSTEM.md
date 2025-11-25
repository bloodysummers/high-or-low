# Sistema de Timbres Configurables

## Descripción General

El sistema de timbres permite a los usuarios personalizar el sonido de las notas durante el entrenamiento auditivo. El sistema es completamente modular y soporta múltiples timbres con características únicas.

## Arquitectura

### Archivos Clave

1. **`/constants/timbres.ts`**
   - Define todos los timbres disponibles
   - Cada timbre tiene: armónicos, envelope ADSR, y multiplicador de volumen
   - Exporta `TimbreType`, `TIMBRES`, y `DEFAULT_TIMBRE`

2. **`/functions/storage.ts`**
   - `saveTimbre(timbre: TimbreType)`: Guarda el timbre seleccionado
   - `getTimbre()`: Recupera el timbre guardado o devuelve el predeterminado

3. **`/functions/audio.ts`**
   - `playWebTone()`: Usa el timbre configurado para Web Audio API
   - `playMobileTone()`: Usa el timbre configurado para generar WAV
   - `generateWAV()`: Genera archivos WAV con armónicos del timbre

4. **`/app/(tabs)/settings.tsx`**
   - Interfaz para seleccionar el timbre
   - RadioButtons con descripciones de cada timbre
   - Guarda automáticamente la selección

## Timbres Disponibles

### 1. Piano (Predeterminado)
- **Armónicos**: Fundamental, octava, quinta, segunda octava, armónicos superiores
- **Envelope**: Attack 5ms, Decay 100ms, Sustain 0.2
- **Volumen**: 0.3
- **Características**: Timbre rico con ataque rápido y decaimiento pronunciado

### 2. Guitarra
- **Armónicos**: Fundamental + armónicos impares prominentes (3ª, 5ª, 7ª, 9ª)
- **Envelope**: Attack 10ms, Decay 150ms, Sustain 0.4
- **Volumen**: 0.35
- **Características**: Sonido cálido con resonancia característica

### 3. Flauta
- **Armónicos**: Fundamental + pocas armónicas (2ª, 3ª)
- **Envelope**: Attack 50ms, Decay 50ms, Sustain 0.6
- **Volumen**: 0.4
- **Características**: Timbre suave y claro, ideal para principiantes

### 4. Sintetizador (Senoidal)
- **Armónicos**: Solo fundamental (onda pura)
- **Envelope**: Attack 10ms, Decay 50ms, Sustain 0.7
- **Volumen**: 0.25
- **Características**: Sonido simple y limpio, útil para estudiar intervalos puros

### 5. Sintetizador (Cuadrada)
- **Armónicos**: Fundamental + armónicos impares (3ª, 5ª, 7ª, 9ª)
- **Envelope**: Attack 10ms, Decay 100ms, Sustain 0.5
- **Volumen**: 0.2
- **Características**: Sonido sintético clásico, similar a consolas retro

### 6. Sintetizador (Diente de Sierra)
- **Armónicos**: Fundamental + todos los armónicos (2ª, 3ª, 4ª, 5ª, 6ª)
- **Envelope**: Attack 10ms, Decay 100ms, Sustain 0.6
- **Volumen**: 0.15
- **Características**: Sonido brillante y rico, ideal para intervalos complejos

## Estructura de Datos

```typescript
interface Harmonic {
  freq: number;  // Frecuencia del armónico
  gain: number;  // Ganancia relativa (0-1)
}

interface Envelope {
  attack: number;   // Tiempo de ataque en segundos
  decay: number;    // Tiempo de decaimiento en segundos
  sustain: number;  // Nivel de sustain (0-1)
  release?: number; // Tiempo de release (opcional)
}

interface TimbreConfig {
  id: string;
  name: string;
  harmonics: (frequency: number) => Harmonic[];
  envelope: Envelope;
  volumeMultiplier: number;
}
```

## Síntesis de Audio

### Web (Web Audio API)
1. Cargar timbre configurado desde AsyncStorage
2. Obtener configuración del timbre
3. Crear osciladores para cada armónico
4. Aplicar envelope ADSR individual y general
5. Conectar al destino de audio

### Móvil (Expo AV + WAV Generation)
1. Cargar timbre configurado desde AsyncStorage
2. Generar samples con armónicos del timbre
3. Aplicar envelope ADSR
4. Codificar como WAV en base64
5. Reproducir con expo-av

## Cómo Agregar un Nuevo Timbre

1. **Definir configuración en `/constants/timbres.ts`**:
```typescript
'nuevo-timbre': {
  id: 'nuevo-timbre',
  name: 'Nombre Descriptivo',
  harmonics: (frequency: number) => [
    { freq: frequency, gain: 1.0 },
    { freq: frequency * 2, gain: 0.5 },
    // ... más armónicos
  ],
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
  },
  volumeMultiplier: 0.3,
}
```

2. **Actualizar tipo `TimbreType`**:
```typescript
export type TimbreType = 'piano' | 'guitar' | 'flute' | 'synth-sine' | 'synth-square' | 'synth-sawtooth' | 'nuevo-timbre';
```

3. **Agregar opción en `/app/(tabs)/settings.tsx`**:
```typescript
{ 
  value: 'nuevo-timbre', 
  label: 'Nombre Descriptivo', 
  description: 'Descripción del timbre' 
}
```

## Persistencia

- El timbre seleccionado se guarda en AsyncStorage con la clave `@high_or_low_timbre`
- Se carga automáticamente al iniciar la app
- Si no hay timbre guardado, se usa `DEFAULT_TIMBRE` (piano)

## Mejoras Futuras

- [ ] Cache de archivos WAV generados para mejorar rendimiento en móvil
- [ ] Vista previa de timbre en la pantalla de configuración
- [ ] Timbre personalizado (ajustar armónicos manualmente)
- [ ] Efectos adicionales (reverb, chorus, delay)
- [ ] Animación visual del timbre seleccionado
- [ ] Preset de timbres por nivel de dificultad
