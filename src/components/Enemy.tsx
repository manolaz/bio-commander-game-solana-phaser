import React from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { GAME_CONSTANTS, ENEMY_TYPES } from '../utils/gameConstants';

interface EnemyData {
  id: string;
  type: keyof typeof ENEMY_TYPES;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  animatedX: Animated.Value;
  animatedY: Animated.Value;
}

interface EnemyProps {
  enemy: EnemyData;
}

/**
 * Enemy Component
 * Renders individual enemy entities with health bars and animations
 * Supports different enemy types with unique visual characteristics
 */
const EnemyComponent: React.FC<EnemyProps> = ({ enemy }) => {
  const enemyConfig = ENEMY_TYPES[enemy.type];
  const healthPercentage = (enemy.hp / enemy.maxHp) * 100;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: enemyConfig.color,
          transform: [
            { translateX: enemy.animatedX },
            { translateY: enemy.animatedY },
          ],
        },
      ]}
      accessibilityLabel={`${enemy.type} enemy with ${enemy.hp} health remaining`}
      accessibilityRole="image"
    >
      {/* Enemy Character */}
      <Text style={styles.enemyEmoji} accessibilityHidden>
        {enemyConfig.emoji}
      </Text>
      
      {/* Health Bar */}
      <View style={styles.healthBarContainer}>
        <View style={styles.healthBarBackground}>
          <Animated.View 
            style={[
              styles.healthBarFill,
              { 
                width: `${healthPercentage}%`,
                backgroundColor: healthPercentage > 50 ? '#27ae60' : 
                               healthPercentage > 25 ? '#f39c12' : '#e74c3c'
              }
            ]} 
          />
        </View>
      </View>
      
      {/* Damage Indicator Glow */}
      {enemy.hp < enemy.maxHp && (
        <View style={[styles.damageGlow, { backgroundColor: enemyConfig.color }]} />
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.ENEMY_SIZE,
    height: GAME_CONSTANTS.ENEMY_SIZE,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  enemyEmoji: {
    fontSize: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  healthBarContainer: {
    position: 'absolute',
    top: -10,
    left: 2,
    right: 2,
  },
  healthBarBackground: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  damageGlow: {
    position: 'absolute',
    width: GAME_CONSTANTS.ENEMY_SIZE + 8,
    height: GAME_CONSTANTS.ENEMY_SIZE + 8,
    borderRadius: 24,
    opacity: 0.3,
    top: -4,
    left: -4,
  },
});

export const Enemy = React.memo(EnemyComponent);
Enemy.displayName = 'Enemy';