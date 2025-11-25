import { LEVELS, TOTAL_QUESTIONS } from '@/constants/levels';
import { updateLevelScore } from '@/functions/storage';
import { IntervalType } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Drawer as DrawerLayout } from 'react-native-drawer-layout';
import { Appbar, Button, Card, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    levelId: IntervalType;
    score: string;
  }>();

  const [nextLevelUnlocked, setNextLevelUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState<Set<string>>(new Set(['octava']));

  const levelId = params.levelId as IntervalType;
  const score = parseInt(params.score || '0');
  const level = LEVELS.find(l => l.id === levelId);
  const currentLevelIndex = LEVELS.findIndex(l => l.id === levelId);
  const nextLevel = currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;

  useEffect(() => {
    saveAndCheckProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAndCheckProgress = async () => {
    try {
      // Guardar el score y obtener el progreso actualizado
      const progress = await updateLevelScore(levelId, score);
      
      // Cargar niveles desbloqueados
      const unlocked = new Set<string>();
      Object.entries(progress).forEach(([levelId, data]) => {
        if (data.unlocked) {
          unlocked.add(levelId);
        }
      });
      setUnlockedLevels(unlocked);
      
      // Verificar si el siguiente nivel está desbloqueado
      if (nextLevel) {
        setNextLevelUnlocked(progress[nextLevel.id]?.unlocked || false);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    router.back();
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      router.push({
        pathname: '/(tabs)/training',
        params: { selectedLevel: nextLevel.id }
      });
    }
  };

  const handleLevelSelect = (selectedLevelId: IntervalType) => {
    setDrawerOpen(false);
    router.push({
      pathname: '/(tabs)/training',
      params: { selectedLevel: selectedLevelId }
    });
  };

  const isPerfectScore = score === TOTAL_QUESTIONS;
  const isGoodScore = score >= 7;

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <Appbar.Header>
        <Appbar.Content title="Niveles" />
        <Appbar.Action icon="close" onPress={() => setDrawerOpen(false)} />
      </Appbar.Header>
      <ScrollView>
        {LEVELS.map((lvl) => {
          const isUnlocked = unlockedLevels.has(lvl.id);
          return (
            <List.Item
              key={lvl.id}
              title={lvl.name}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isUnlocked ? 'music-note' : 'lock'}
                />
              )}
              disabled={!isUnlocked}
              onPress={() => handleLevelSelect(lvl.id)}
              style={lvl.id === levelId ? styles.selectedLevel : undefined}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Text variant="bodyLarge" style={styles.loadingText}>
            Guardando resultados...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Appbar.Content title="Resultados" />
        </Appbar.Header>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineLarge" style={styles.title}>
                ¡Nivel Completado!
              </Text>

              <Text variant="titleLarge" style={styles.levelName}>
                {level?.name}
              </Text>

              <View style={styles.scoreContainer}>
                <Text variant="displayLarge" style={[
                  styles.score,
                  isPerfectScore ? styles.perfectScore : isGoodScore ? styles.goodScore : styles.normalScore
                ]}>
                  {score}/{TOTAL_QUESTIONS}
                </Text>
              </View>

              <Text variant="bodyLarge" style={styles.message}>
                {isPerfectScore
                  ? '¡Perfecto! 🎉'
                  : isGoodScore
                  ? '¡Muy bien! 👏'
                  : 'Sigue practicando 💪'}
              </Text>

              {isPerfectScore && nextLevel && (
                <Text variant="bodyMedium" style={styles.unlockMessage}>
                  {nextLevelUnlocked
                    ? `Has desbloqueado: ${nextLevel.name}`
                    : `Nivel ${nextLevel.name} desbloqueado`}
                </Text>
              )}
            </Card.Content>

            <Card.Actions style={styles.actions}>
              <Button mode="outlined" onPress={handleRetry}>
                Reintentar
              </Button>
              {nextLevel && nextLevelUnlocked && (
                <Button mode="contained" onPress={handleNextLevel}>
                  Siguiente Nivel
                </Button>
              )}
            </Card.Actions>
          </Card>
        </View>
      </SafeAreaView>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  selectedLevel: {
    backgroundColor: 'rgba(103, 80, 164, 0.2)',
  },
  card: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  levelName: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  score: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  perfectScore: {
    color: '#4CAF50',
  },
  goodScore: {
    color: '#2196F3',
  },
  normalScore: {
    color: '#FF9800',
  },
  message: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  unlockMessage: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
  },
});
