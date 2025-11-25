import { Stack } from 'expo-router';
import React from 'react';

export default function TrainingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
