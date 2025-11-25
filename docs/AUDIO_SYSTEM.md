# Sistema de Audio con Tone.js

## Descripción

High or Low utiliza **Tone.js** para sintetizar notas musicales en tiempo real. Esto elimina la necesidad de archivos de audio pregrabados y permite una generación dinámica de intervalos musicales.

## ¿Por qué Tone.js?

- **Síntesis en tiempo real**: No requiere archivos MP3/WAV
- **Ligereza**: Reduce el tamaño de la aplicación significativamente
- **Flexibilidad**: Permite ajustar parámetros de audio en el futuro (timbre, duración, etc.)
- **Compatibilidad**: Funciona tanto en web como en React Native con Expo

## Cómo Funciona

### 1. Generación de Notas MIDI

Las notas se representan como números MIDI (0-127), donde:
- C3 = 48 (nota más baja)
- C6 = 84 (nota más alta)
- Cada semitono = +1 al número MIDI

### 2. Conversión MIDI a Frecuencia

```typescript
frequency = 440 * 2^((midiNote - 69) / 12)
```

Donde:
- 440 Hz es la frecuencia de A4 (La 440)
- 69 es el número MIDI de A4

### 3. Síntesis de Audio

Usamos un sintetizador simple con onda sinusoidal:

```typescript
const synth = new Tone.Synth({
  oscillator: {
    type: 'sine'  // Onda sinusoidal pura
  },
  envelope: {
    attack: 0.005,   // Inicio rápido
    decay: 0.1,      // Decaimiento corto
    sustain: 0.3,    // Nivel sostenido bajo
    release: 0.1     // Release rápido
  }
});
```

### 4. Reproducción de Secuencias

Las notas se programan con tiempos específicos:

```typescript
synth.triggerAttackRelease(frequency, duration, time);
```

## Funciones Principales

### `generateNotePair(levelId)`

Genera un par de notas aleatorias para un nivel específico:
- Elige una nota base aleatoria dentro del rango permitido
- Aplica el intervalo correspondiente al nivel
- Decide aleatoriamente si la segunda nota será más aguda o grave
- Retorna las notas y la respuesta correcta

### `playGameNotes(firstNote, secondNote)`

Reproduce la secuencia de dos notas:
- Primera nota: 0.8 segundos de duración
- Pausa: 0.4 segundos
- Segunda nota: 0.8 segundos de duración

### `midiToFrequency(midiNote)`

Convierte un número MIDI a su frecuencia en Hz.

### `midiToNoteName(midiNote)`

Convierte un número MIDI a su nombre de nota (ej: "C4", "F#5").

## Consideraciones de Rendimiento

- Los sintetizadores se crean y destruyen por cada reproducción para evitar fugas de memoria
- Se usa `Tone.start()` para inicializar el contexto de audio (requerido por navegadores)
- Las promesas aseguran que el código espere a que termine la reproducción

## Mejoras Futuras

- Soporte para diferentes timbres (piano, guitarra, etc.)
- Velocidad de reproducción ajustable
- Reproducción de intervalos armónicos (simultáneos)
- Visualización de forma de onda
- Metrónomo integrado
