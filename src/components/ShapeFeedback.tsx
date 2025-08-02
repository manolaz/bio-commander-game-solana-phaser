import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ShapeFeedbackProps {
  message: string;
  onComplete?: () => void;
}

/**
 * Shape Feedback Component
 * Displays temporary feedback messages for shape recognition results
 * Features smooth animations and auto-dismissal
 */
export const ShapeFeedback: React.FC<ShapeFeedbackProps> = ({
  message,
  onComplete,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (message) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 2 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete?.();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, fadeAnim, scaleAnim, onComplete]);

  if (!message) return null;

  const getMessageStyle = (msg: string) => {
    if (msg.includes('💥') || msg.includes('🛡️')) {
      return styles.successMessage;
    }
    if (msg.includes('❌') || msg.includes('⚡')) {
      return styles.errorMessage;
    }
    return styles.defaultMessage;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getMessageStyle(message),
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 2000,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  successMessage: {
    backgroundColor: 'rgba(39, 174, 96, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorMessage: {
    backgroundColor: 'rgba(231, 76, 60, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  defaultMessage: {
    backgroundColor: 'rgba(52, 73, 94, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});