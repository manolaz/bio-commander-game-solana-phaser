import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HighScoreDisplayProps {
  currentScore: number;
  highScore: number;
}

/**
 * High Score Display Component
 * Shows current score and best score achieved
 */
export const HighScoreDisplay: React.FC<HighScoreDisplayProps> = ({
  currentScore,
  highScore,
}) => {
  const isNewRecord = currentScore > highScore && currentScore > 0;

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>Current:</Text>
        <Text style={styles.scoreValue}>{currentScore}</Text>
      </View>
      
      <View style={styles.scoreRow}>
        <View style={styles.highScoreContainer}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.scoreLabel}>Best:</Text>
          <Text style={[styles.scoreValue, styles.highScoreValue]}>
            {Math.max(currentScore, highScore)}
          </Text>
        </View>
      </View>
      
      {isNewRecord && (
        <Text style={styles.newRecordText}>🏆 NEW RECORD!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 120,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2c3e50',
  },
  highScoreValue: {
    color: '#f39c12',
  },
  newRecordText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(231, 76, 60, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trophyIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
});