import { TimbreType } from '@/constants/timbres';
import { getTimbre, saveTimbre } from '@/functions/storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, List, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [selectedTimbre, setSelectedTimbre] = useState<TimbreType>('piano');

  useFocusEffect(
    useCallback(() => {
      loadTimbre();
    }, [])
  );

  const loadTimbre = async () => {
    const timbre = await getTimbre();
    setSelectedTimbre(timbre);
  };

  const handleTimbreChange = async (timbre: TimbreType) => {
    setSelectedTimbre(timbre);
    await saveTimbre(timbre);
  };

  const timbreOptions: { value: TimbreType; label: string; description: string }[] = [
    { 
      value: 'piano', 
      label: 'Piano', 
      description: 'Timbre rico con armónicos característicos del piano' 
    },
    { 
      value: 'guitar', 
      label: 'Guitarra', 
      description: 'Sonido cálido con armónicos impares prominentes' 
    },
    { 
      value: 'flute', 
      label: 'Flauta', 
      description: 'Timbre suave y claro con pocos armónicos' 
    },
    { 
      value: 'synth-sine', 
      label: 'Sintetizador (Senoidal)', 
      description: 'Onda pura sin armónicos, sonido simple y limpio' 
    },
    { 
      value: 'synth-square', 
      label: 'Sintetizador (Cuadrada)', 
      description: 'Sonido sintético con armónicos impares' 
    },
    { 
      value: 'synth-sawtooth', 
      label: 'Sintetizador (Diente de Sierra)', 
      description: 'Sonido brillante con todos los armónicos' 
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Appbar.Header>
        <Appbar.Content title="Configuración" />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Timbre de Audio</List.Subheader>
          
          {timbreOptions.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              description={option.description}
              left={() => (
                <RadioButton
                  value={option.value}
                  status={selectedTimbre === option.value ? 'checked' : 'unchecked'}
                  onPress={() => handleTimbreChange(option.value)}
                />
              )}
              onPress={() => handleTimbreChange(option.value)}
            />
          ))}
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
