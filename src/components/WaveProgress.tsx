import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wave } from '../utils/types';

interface WaveProgressProps {
  wave: Wave;
  progress: number;
  enemiesRemaining: number;
}

/**
 * Wave Progress Component
 * Displays current wave progress and enemy count
 */
export const WaveProgress: React.FC<WaveProgressProps> = ({
  wave,
  progress,
  enemiesRemaining,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.waveText}>Wave {wave.number}</Text>
        <Text style={styles.enemiesText}>{enemiesRemaining} enemies left</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    textShadowColor: 'rgba(102, 126, 234, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  enemiesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
    textShadowColor: 'rgba(231, 76, 60, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    minWidth: 35,
    textAlign: 'right',
  },
}); 