import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GAME_CONSTANTS } from '../utils/gameConstants';

interface GameHUDProps {
  health: number;
  energy: number;
  score: number;
  isShielded: boolean;
  difficultyLevel?: number;
  gameTime?: number;
}

/**
 * Game HUD Component
 * Displays player stats including health, energy, score, and shield status
 * Features enhanced visual hierarchy and accessibility
 */
export const GameHUD: React.FC<GameHUDProps> = ({
  health,
  energy,
  score,
  isShielded,
  difficultyLevel = 1,
  gameTime = 0,
}) => {
  const renderProgressBar = (
    value: number,
    maxValue: number,
    color: string,
    label: string
  ) => (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel} accessibilityLabel={`${label}: ${value} out of ${maxValue}`}>
        {label}: {value}
      </Text>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill,
            { backgroundColor: color, width: `${(value / maxValue) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container} accessibilityRole="header">
      {renderProgressBar(health, GAME_CONSTANTS.MAX_HEALTH, '#e74c3c', 'Health')}
      {renderProgressBar(energy, GAME_CONSTANTS.MAX_ENERGY, '#3498db', 'Energy')}
      
      <Text style={styles.scoreText} accessibilityLabel={`Current score: ${score} points`}>
        Score: {score}
      </Text>
      
      <View style={styles.statsRow}>
        {isShielded && (
          <Text 
            style={styles.shieldIndicator}
            accessibilityLabel="Shield is currently active"
            accessibilityLiveRegion="polite"
          >
            🛡️ SHIELDED
          </Text>
        )}
        
        <Text 
          style={styles.difficultyIndicator}
          accessibilityLabel={`Difficulty level ${difficultyLevel}`}
        >
          Level {difficultyLevel}
        </Text>
        
        <Text 
          style={styles.timeIndicator}
          accessibilityLabel={`Game time: ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}`}
        >
          {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  barContainer: {
    marginBottom: 14,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#ffffff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  barBackground: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f39c12',
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(243, 156, 18, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  shieldIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#27ae60',
    textShadowColor: 'rgba(39, 174, 96, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.3)',
  },
  difficultyIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e67e22',
    textShadowColor: 'rgba(230, 126, 34, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(230, 126, 34, 0.3)',
  },
  timeIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9b59b6',
    textShadowColor: 'rgba(155, 89, 182, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
});