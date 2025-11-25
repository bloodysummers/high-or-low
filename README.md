# High or Low

Una aplicación de entrenamiento auditivo musical desarrollada con React Native y Expo.

## Descripción

High or Low es una aplicación que ayuda a desarrollar el oído musical mediante ejercicios de reconocimiento de intervalos. La aplicación presenta dos notas musicales al usuario y éste debe determinar si la segunda nota es más aguda o más grave que la primera.

## Características

- **Sistema de niveles progresivos**: Desde octavas (más fácil) hasta segundas menores (más difícil), más un modo aleatorio
- **Síntesis de audio en tiempo real**: Utiliza Tone.js para generar notas musicales dinámicamente
- **Sistema de progreso**: Las puntuaciones se guardan localmente y se desbloquean nuevos niveles al obtener puntuaciones perfectas
- **Interfaz intuitiva**: Desarrollada con React Native Paper para una experiencia de usuario moderna

## Niveles de Dificultad

1. **Octavas** (12 semitonos) - Desbloqueado por defecto
2. **Séptimas Mayores** (11 semitonos)
3. **Séptimas Menores** (10 semitonos)
4. **Sextas Mayores** (9 semitonos)
5. **Sextas Menores** (8 semitonos)
6. **Quintas Justas** (7 semitonos)
7. **Cuartas Justas** (5 semitonos)
8. **Terceras Mayores** (4 semitonos)
9. **Terceras Menores** (3 semitonos)
10. **Segundas Mayores** (2 semitonos)
11. **Segundas Menores** (1 semitono)
12. **Aleatorio** (cualquier intervalo)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npx expo start
```

## Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Navegación basada en archivos
- **React Native Paper** - Componentes de UI con Material Design
- **Tone.js** - Síntesis de audio y generación de notas MIDI
- **AsyncStorage** - Almacenamiento local de progreso

## Estructura del Proyecto

```
/app
  /(tabs)
    training.tsx    # Pantalla principal de entrenamiento
    progress.tsx    # Seguimiento de progreso (próximamente)
    settings.tsx    # Configuración (próximamente)
  index.tsx         # Pantalla de inicio
  _layout.tsx       # Layout principal

/components
  game-screen.tsx   # Componente del juego

/constants
  levels.ts         # Definición de niveles de dificultad

/functions
  audio.ts          # Lógica de síntesis y reproducción de audio
  storage.ts        # Gestión de progreso con AsyncStorage

/types
  index.ts          # Definiciones de tipos TypeScript
```

## Cómo Jugar

1. Abre la aplicación y presiona "Comenzar"
2. Selecciona un nivel del menú lateral (comienza con "Octavas")
3. Lee la descripción del intervalo y presiona "Iniciar"
4. Escucha las dos notas que se reproducen automáticamente
5. Decide si la segunda nota es más grave o más aguda
6. Responde 10 preguntas por nivel
7. Obtén 10/10 para desbloquear el siguiente nivel

## Roadmap

- [ ] Pantalla de progreso con estadísticas detalladas
- [ ] Configuración de velocidad de reproducción
- [ ] Modo de práctica libre
- [ ] Soporte para reproducción ascendente/descendente
- [ ] Gráficos de progreso histórico
- [ ] Desafíos diarios

## Licencia

MIT