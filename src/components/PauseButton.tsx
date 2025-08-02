import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface PauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

/**
 * Pause Button Component
 * Allows players to pause and resume the game
 * Features smooth animations and clear visual feedback
 */
export const PauseButton: React.FC<PauseButtonProps> = ({
  isPaused,
  onTogglePause,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onTogglePause}
      accessibilityLabel={isPaused ? "Resume game" : "Pause game"}
      accessibilityRole="button"
      accessibilityHint={isPaused ? "Resume the current game session" : "Pause the current game session"}
    >
      <Text style={styles.buttonIcon}>
        {isPaused ? '▶️' : '⏸️'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonIcon: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
});