import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayLarge" style={styles.title}>
          High or Low
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Entrena tu oído musical
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push('/(tabs)/training')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Comenzar
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#999',
    marginBottom: 50,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
});
