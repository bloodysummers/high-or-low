import { GameScreen } from '@/components';
import { LEVELS, TOTAL_QUESTIONS } from '@/constants/levels';
import { generateNotePair, playGameNotes } from '@/functions/audio';
import { getProgress } from '@/functions/storage';
import { GameState, IntervalType } from '@/types';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Drawer as DrawerLayout } from 'react-native-drawer-layout';
import { Appbar, Button, Card, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainingScreen() {
  const params = useLocalSearchParams<{ selectedLevel?: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<IntervalType | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<Set<string>>(new Set(['octava']));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadProgress = useCallback(async () => {
    const progress = await getProgress();
    const unlocked = new Set<string>();
    Object.entries(progress).forEach(([levelId, data]) => {
      if (data.unlocked) {
        unlocked.add(levelId);
      }
    });
    setUnlockedLevels(unlocked);
  }, []);

  // Load progress on mount and when screen comes into focus
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Reload progress when screen comes into focus (returning from results)
  useFocusEffect(
    useCallback(() => {
      loadProgress();
      // Reset game state when returning from results
      setGameState(null);
    }, [loadProgress])
  );

  // Handle selectedLevel from params (when coming from results)
  useEffect(() => {
    if (params.selectedLevel) {
      setSelectedLevel(params.selectedLevel as IntervalType);
      setGameState(null);
    }
  }, [params.selectedLevel]);

  const handleLevelSelect = (levelId: IntervalType) => {
    setSelectedLevel(levelId);
    setDrawerOpen(false);
    setGameState(null); // Reset game state when changing levels
  };

  const startGame = () => {
    if (!selectedLevel) return;

    const { firstNote, secondNote, correctAnswer } = generateNotePair(selectedLevel);
    
    setGameState({
      currentLevel: selectedLevel,
      score: 0,
      totalQuestions: TOTAL_QUESTIONS,
      currentQuestion: 1,
      firstNote,
      secondNote,
      correctAnswer,
    });
  };

  const playNotes = async () => {
    if (!gameState || isPlaying) return;
    
    setIsPlaying(true);
    try {
      await playGameNotes(gameState.firstNote, gameState.secondNote);
    } catch (error) {
      console.error('Error playing notes:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleAnswer = async (answer: 'higher' | 'lower') => {
    if (!gameState || gameState.currentQuestion > TOTAL_QUESTIONS) return;

    const isCorrect = answer === gameState.correctAnswer;
    const newScore = isCorrect ? gameState.score + 1 : gameState.score;

    if (gameState.currentQuestion < TOTAL_QUESTIONS) {
      // Generate next question
      const { firstNote, secondNote, correctAnswer } = generateNotePair(gameState.currentLevel);
      
      setGameState({
        ...gameState,
        score: newScore,
        currentQuestion: gameState.currentQuestion + 1,
        firstNote,
        secondNote,
        correctAnswer,
      });
    } else {
      // Game finished - update to question 11 to trigger navigation
      setGameState({
        ...gameState,
        score: newScore,
        currentQuestion: TOTAL_QUESTIONS + 1,
      });
    }
  };

  const selectedLevelData = LEVELS.find(l => l.id === selectedLevel);

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <Appbar.Header>
        <Appbar.Content title="Niveles" />
        <Appbar.Action icon="close" onPress={() => setDrawerOpen(false)} />
      </Appbar.Header>
      <ScrollView>
        {LEVELS.map((level) => {
          const isUnlocked = unlockedLevels.has(level.id);
          return (
            <List.Item
              key={level.id}
              title={level.name}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isUnlocked ? 'music-note' : 'lock'}
                />
              )}
              disabled={!isUnlocked}
              onPress={() => handleLevelSelect(level.id)}
              style={selectedLevel === level.id ? styles.selectedLevel : undefined}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <DrawerLayout
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      drawerType="front"
      renderDrawerContent={renderDrawerContent}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => setDrawerOpen(true)} />
          <Appbar.Content title={selectedLevelData?.name || 'Entrenamiento'} />
        </Appbar.Header>

        {!selectedLevel && (
          <View style={styles.emptyState}>
            <Text variant="titleLarge" style={styles.emptyText}>
              Selecciona un nivel del menú
            </Text>
            <Button
              mode="contained"
              onPress={() => setDrawerOpen(true)}
              style={styles.menuButton}
            >
              Abrir menú
            </Button>
          </View>
        )}

        {selectedLevel && !gameState && (
          <View style={styles.levelIntro}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text variant="headlineMedium" style={styles.levelTitle}>
                  {selectedLevelData?.name}
                </Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {selectedLevelData?.description}
                </Text>
                <Button mode="contained" onPress={startGame} style={styles.startButton}>
                  Iniciar
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {gameState && (
          <GameScreen
            gameState={gameState}
            onAnswer={handleAnswer}
            onPlayNotes={playNotes}
            isPlaying={isPlaying}
          />
        )}
      </SafeAreaView>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  selectedLevel: {
    backgroundColor: 'rgba(103, 80, 164, 0.2)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuButton: {
    marginTop: 10,
  },
  levelIntro: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 20,
  },
  cardContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  levelTitle: {
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    color: '#ccc',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  startButton: {
    minWidth: 120,
  },
});
