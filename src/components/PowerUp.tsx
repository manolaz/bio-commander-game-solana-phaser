import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { GAME_CONSTANTS } from '../utils/gameConstants';

interface PowerUpData {
  id: string;
  type: 'health' | 'energy' | 'shield';
  x: number;
  y: number;
  animatedX: Animated.Value;
  animatedY: Animated.Value;
  collected: boolean;
}

interface PowerUpProps {
  powerUp: PowerUpData;
}

const POWER_UP_CONFIG = {
  health: { emoji: '❤️', color: '#e74c3c', value: 30 },
  energy: { emoji: '⚡', color: '#f39c12', value: 25 },
  shield: { emoji: '🛡️', color: '#3498db', value: 0 },
};

/**
 * Power-Up Component
 * Renders collectible power-ups with animations
 */
const PowerUpComponent: React.FC<PowerUpProps> = ({ powerUp }) => {
  const config = POWER_UP_CONFIG[powerUp.type];

  if (powerUp.collected) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.color,
          transform: [
            { translateX: powerUp.animatedX },
            { translateY: powerUp.animatedY },
          ],
        },
      ]}
      accessibilityLabel={`${powerUp.type} power-up`}
      accessibilityRole="image"
    >
      <Text style={styles.emoji}>{config.emoji}</Text>
      
      {/* Glow effect */}
      <Animated.View 
        style={[
          styles.glow,
          { backgroundColor: config.color }
        ]} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  emoji: {
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.3,
    top: -4,
    left: -4,
  },
});

export const PowerUp = React.memo(PowerUpComponent);
PowerUp.displayName = 'PowerUp';