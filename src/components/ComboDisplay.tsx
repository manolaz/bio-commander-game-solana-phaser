import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ComboDisplayProps {
  combo: number;
  isVisible: boolean;
}

/**
 * Combo Display Component
 * Shows current combo multiplier with animations
 */
export const ComboDisplay: React.FC<ComboDisplayProps> = ({
  combo,
  isVisible,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible && combo > 1) {
      // Show combo with animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide combo
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, combo, scaleAnim, fadeAnim]);

  if (combo <= 1) return null;

  const getComboColor = (comboLevel: number) => {
    if (comboLevel >= 10) return '#ff3838';
    if (comboLevel >= 7) return '#ff6348';
    if (comboLevel >= 5) return '#ffa502';
    if (comboLevel >= 3) return '#ffb142';
    return '#f39c12';
  };

  const getComboText = (comboLevel: number) => {
    if (comboLevel >= 10) return 'LEGENDARY!';
    if (comboLevel >= 7) return 'AMAZING!';
    if (comboLevel >= 5) return 'GREAT!';
    if (comboLevel >= 3) return 'NICE!';
    return 'COMBO!';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.comboContainer, { borderColor: getComboColor(combo) }]}>
        <Text style={[styles.comboText, { color: getComboColor(combo) }]}>
          {getComboText(combo)}
        </Text>
        <Text style={[styles.comboMultiplier, { color: getComboColor(combo) }]}>
          {combo}x
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 280,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1500,
  },
  comboContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  comboText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  comboMultiplier: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
}); 