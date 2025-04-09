import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const WayfindingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wayfinding</Text>
      <Text style={styles.subtitle}>
        Implementation of Situm's wayfinding features will be shown here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 