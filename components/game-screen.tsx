import { TOTAL_QUESTIONS } from '@/constants/levels';
import { GameState } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ProgressBar, Text } from 'react-native-paper';

interface GameScreenProps {
  gameState: GameState;
  onAnswer: (answer: 'higher' | 'lower') => void;
  onPlayNotes: () => void;
  isPlaying: boolean;
}

export default function GameScreen({
  gameState,
  onAnswer,
  onPlayNotes,
  isPlaying,
}: GameScreenProps) {
  const isGameFinished = gameState.currentQuestion > TOTAL_QUESTIONS;
  const progress = gameState.currentQuestion / TOTAL_QUESTIONS;
  const hasNavigated = useRef(false);

  // Auto-play notes when question changes
  useEffect(() => {
    if (!isGameFinished) {
      onPlayNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentQuestion, isGameFinished]);

  // Navigate to results when game finishes
  useEffect(() => {
    if (isGameFinished && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push({
        pathname: '/(tabs)/training/results',
        params: {
          levelId: gameState.currentLevel,
          score: gameState.score.toString(),
        },
      });
    }
  }, [isGameFinished, gameState.currentLevel, gameState.score]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.questionNumber}>
          Pregunta {gameState.currentQuestion} de {TOTAL_QUESTIONS}
        </Text>
        <ProgressBar progress={progress} style={styles.progressBar} />
        <Text variant="titleSmall" style={styles.scoreDisplay}>
          Puntuación: {gameState.score}
        </Text>
      </View>

      <View style={styles.content}>
        <Button
          mode="outlined"
          onPress={onPlayNotes}
          disabled={isPlaying}
          icon="play"
          style={styles.playButton}
          contentStyle={styles.playButtonContent}
        >
          {isPlaying ? 'Reproduciendo...' : 'Reproducir notas'}
        </Button>

        <Text variant="headlineSmall" style={styles.question}>
          ¿Es la segunda nota más grave o más aguda?
        </Text>

        <View style={styles.answerButtons}>
          <Button
            mode="contained"
            onPress={() => onAnswer('lower')}
            style={[styles.answerButton, styles.lowerButton]}
            contentStyle={styles.answerButtonContent}
            disabled={isPlaying}
          >
            Más grave
          </Button>
          <Button
            mode="contained"
            onPress={() => onAnswer('higher')}
            style={[styles.answerButton, styles.higherButton]}
            contentStyle={styles.answerButtonContent}
            disabled={isPlaying}
          >
            Más aguda
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  questionNumber: {
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  scoreDisplay: {
    color: '#999',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    marginBottom: 40,
    borderRadius: 8,
  },
  playButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  question: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  answerButtons: {
    width: '100%',
    flexDirection: 'row',
    gap: 15,
  },
  answerButton: {
    flex: 1,
    borderRadius: 8,
  },
  answerButtonContent: {
    paddingVertical: 15,
  },
  lowerButton: {
    backgroundColor: '#e74c3c',
  },
  higherButton: {
    backgroundColor: '#3498db',
  },
});
