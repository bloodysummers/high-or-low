# Mejoras de Audio - Sistema Multiplataforma con Timbre de Piano

## Cambios Implementados

### 🎹 Timbre de Piano Mejorado

El sistema ahora simula el timbre de un piano usando **síntesis aditiva con armónicos**:

#### Armónicos Implementados:
- **Fundamental** (100%): La frecuencia base de la nota
- **Primera octava** (50%): Frecuencia × 2
- **Quinta** (30%): Frecuencia × 3
- **Segunda octava** (20%): Frecuencia × 4
- **Armónico superior** (10%): Frecuencia × 5

#### Envelope ADSR tipo Piano:
- **Attack**: 5ms (muy rápido, como el martillo golpeando la cuerda)
- **Decay**: 100ms (caída rápida inicial)
- **Sustain**: 20% del volumen inicial (resonancia de las cuerdas)
- **Release**: Decaimiento exponencial natural

### 📱 Soporte Multiplataforma

#### Web (Chrome, Firefox, Safari)
- Usa **Web Audio API** nativa
- Múltiples osciladores para armónicos
- Envelopes complejos con rampas exponenciales
- Sonido de alta calidad sin archivos

#### Android e iOS
- Genera archivos **WAV en base64** dinámicamente
- Usa **expo-av** para reproducción
- Mismo timbre de piano con armónicos
- Compatible con todas las versiones de React Native/Expo

## Ventajas de Esta Solución

### ✅ Pros
1. **Sin archivos pregrabados**: No aumenta el tamaño de la app
2. **Dinámico**: Genera cualquier frecuencia MIDI (48-84)
3. **Timbre mejorado**: Suena más natural que una onda sinusoidal pura
4. **Multiplataforma**: Funciona en web, iOS y Android
5. **Bajo consumo**: Archivos WAV pequeños (< 50KB por nota)

### ⚠️ Consideraciones
1. **Latencia en móvil**: Hay un pequeño delay al generar el WAV
2. **Calidad limitada**: No es un piano real, pero es mucho mejor que una sinusoidal
3. **Memoria**: En móvil crea/destruye objetos Sound para cada nota

## Alternativas Consideradas

### Opción 1: Archivos de Audio Pregrabados (Rechazada)
- **Pros**: Mejor calidad, latencia cero
- **Contras**: 
  - ~3.5MB para 88 notas en MP3
  - Difícil actualizar/cambiar timbre
  - No flexible para diferentes duraciones

### Opción 2: Librería Nativa de Síntesis (react-native-audio-toolkit)
- **Pros**: Mejor rendimiento, más opciones
- **Contras**:
  - Requiere configuración nativa
  - No funciona con Expo Go
  - Más compleja de mantener

### Opción 3: Web Audio API en RN (Tone.js)
- **Pros**: API familiar, muy flexible
- **Contras**:
  - **No funciona en React Native** (solo web)
  - Requiere polyfills complejos

## Mejoras Futuras Posibles

1. **Cache de WAV**: Guardar WAVs generados en memoria
2. **Timbres adicionales**:
   - Guitarra (armónicos diferentes)
   - Flauta (solo fundamental + octava)
   - Sintetizador (formas de onda cuadradas/diente de sierra)
3. **Reverb/Efectos**: Agregar simulación de espacio
4. **Stereo**: Pan según la octava de la nota
5. **Velocity**: Variar volumen según dificultad

## Configuración de Timbre

Para cambiar el timbre, modifica los armónicos en `playWebTone` y `generateWAV`:

```typescript
// Piano (actual)
const harmonics = [
  { freq: frequency, gain: 0.5 },
  { freq: frequency * 2, gain: 0.25 },
  { freq: frequency * 3, gain: 0.15 },
  { freq: frequency * 4, gain: 0.1 },
];

// Flauta (más puro)
const harmonics = [
  { freq: frequency, gain: 0.7 },
  { freq: frequency * 2, gain: 0.2 },
  { freq: frequency * 3, gain: 0.1 },
];

// Guitarra (más armónicos impares)
const harmonics = [
  { freq: frequency, gain: 0.5 },
  { freq: frequency * 2, gain: 0.2 },
  { freq: frequency * 3, gain: 0.3 },
  { freq: frequency * 5, gain: 0.15 },
  { freq: frequency * 7, gain: 0.1 },
];
```

## Testing

Para probar en diferentes plataformas:

```bash
# Web
npm start -- --web

# iOS (requiere Mac)
npm run ios

# Android
npm run android
```

El audio debería funcionar en todas las plataformas con el mismo timbre de piano.
