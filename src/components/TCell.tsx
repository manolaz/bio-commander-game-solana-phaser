import React from 'react';
import { Animated, Text, StyleSheet, PanResponderGestureState } from 'react-native';
import { GAME_CONSTANTS } from '../utils/gameConstants';

interface TCellProps {
  position: Animated.ValueXY;
  panHandlers: any;
  attackAnimation: Animated.Value;
  shieldAnimation: Animated.Value;
  isShielded: boolean;
}

/**
 * T-Cell Hero Component
 * The player-controlled character with drag-to-move functionality
 * Features smooth animations and visual feedback for actions
 */
export const TCell: React.FC<TCellProps> = ({
  position,
  panHandlers,
  attackAnimation,
  shieldAnimation,
  isShielded,
}) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { 
              scale: attackAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              })
            },
          ],
        },
      ]}
      {...panHandlers}
      accessibilityLabel="T-cell hero - drag to move"
      accessibilityRole="button"
      accessibilityHint="Drag this cell around the screen to avoid enemies"
    >
      <Text style={styles.cellEmoji} accessibilityHidden>🔵</Text>
      
      {/* Shield Effect */}
      {isShielded && (
        <Animated.View 
          style={[
            styles.shield,
            {
              opacity: shieldAnimation,
              transform: [{
                scale: shieldAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.1],
                })
              }]
            }
          ]}
        >
          <Text style={styles.shieldEmoji} accessibilityHidden>🛡️</Text>
        </Animated.View>
      )}
      
      {/* Glow Effect */}
      <Animated.View 
        style={[
          styles.glow,
          {
            opacity: attackAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            })
          }
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.T_CELL_SIZE,
    height: GAME_CONSTANTS.T_CELL_SIZE,
    borderRadius: 28,
    backgroundColor: 'rgba(52, 152, 219, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cellEmoji: {
    fontSize: 28,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  shield: {
    position: 'absolute',
    width: GAME_CONSTANTS.T_CELL_SIZE + 24,
    height: GAME_CONSTANTS.T_CELL_SIZE + 24,
    borderRadius: 40,
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    top: -12,
    left: -12,
    borderWidth: 3,
    borderColor: 'rgba(39, 174, 96, 0.6)',
  },
  shieldEmoji: {
    fontSize: 32,
    color: '#27ae60',
    textShadowColor: 'rgba(39, 174, 96, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  glow: {
    position: 'absolute',
    width: GAME_CONSTANTS.T_CELL_SIZE + 16,
    height: GAME_CONSTANTS.T_CELL_SIZE + 16,
    borderRadius: 32,
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
    top: -8,
    left: -8,
  },
});