import { TimbreType } from '@/constants/timbres';
import { getTimbre, resetProgress, saveTimbre } from '@/functions/storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Divider, List, RadioButton } from 'react-native-paper';
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

  const handleResetProgress = () => {
    console.log('handleResetProgress called'); // Debug
    
    // En web, usar confirm/alert nativo del navegador
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres eliminar todos tus puntajes y progreso? Esta acción no se puede deshacer.'
      );
      
      if (confirmed) {
        resetProgress().then(() => {
          window.alert('Se ha reseteado todo el progreso. Todos los niveles excepto el primero estarán bloqueados.');
        });
      }
    } else {
      // En móvil, usar Alert.alert
      Alert.alert(
        'Resetear Progreso',
        '¿Estás seguro de que quieres eliminar todos tus puntajes y progreso? Esta acción no se puede deshacer.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Resetear',
            style: 'destructive',
            onPress: async () => {
              console.log('Resetting progress...'); // Debug
              await resetProgress();
              Alert.alert('Éxito', 'Se ha reseteado todo el progreso. Todos los niveles excepto el primero estarán bloqueados.');
            },
          },
        ]
      );
    }
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

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>Datos</List.Subheader>
          <View style={styles.resetContainer}>
            <Button
              mode="outlined"
              onPress={handleResetProgress}
              icon="delete-forever"
              textColor="#f44336"
              buttonColor="transparent"
              style={styles.resetButton}
            >
              Resetear Progreso
            </Button>
          </View>
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    backgroundColor: '#121212',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#333',
  },
  resetContainer: {
    padding: 16,
  },
  resetButton: {
    borderColor: '#f44336',
  },
});
