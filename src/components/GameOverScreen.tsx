import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

/**
 * Game Over Screen Component
 * Displays final score and restart option with enhanced visual design
 * Features motivational messaging and clear call-to-action
 */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
}) => {
  const getScoreMessage = (score: number): string => {
    if (score >= 500) return "🏆 Legendary Commander!";
    if (score >= 300) return "⭐ Elite Defender!";
    if (score >= 150) return "🎯 Skilled Warrior!";
    if (score >= 50) return "💪 Good Effort!";
    return "🌱 Keep Training!";
  };

  const getEncouragementMessage = (score: number): string => {
    if (score >= 500) return "You&apos;ve mastered the microscopic battlefield!";
    if (score >= 300) return "Exceptional defense against the invasion!";
    if (score >= 150) return "Your T-cell fought valiantly!";
    if (score >= 50) return "You&apos;re getting the hang of bio-combat!";
    return "Every commander starts somewhere. Try again!";
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mission Complete</Text>
          <Text style={styles.subtitle}>The microscopic battle has ended</Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreIconContainer}>
            <Text style={styles.trophyIcon}>🏆</Text>
          </View>
          <Text style={styles.scoreLabel}>Final Score</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          <Text style={styles.scoreMessage}>{getScoreMessage(score)}</Text>
        </View>

        {/* Encouragement */}
        <View style={styles.messageSection}>
          <Text style={styles.encouragementText}>
            {getEncouragementMessage(score)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={onRestart}
            accessibilityLabel="Restart game"
            accessibilityRole="button"
            accessibilityHint="Start a new game session"
          >
            <Text style={styles.restartButtonText}>🔄 New Mission</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Preview */}
        <View style={styles.statsPreview}>
          <View style={styles.statItem}>
            <Text style={styles.targetIcon}>🎯</Text>
            <Text style={styles.statText}>Enemies Defeated: {Math.floor(score / 15)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 26, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  container: {
    backgroundColor: 'rgba(26, 26, 58, 0.95)',
    padding: 32,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 25,
    maxWidth: SCREEN_WIDTH - 40,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    backdropFilter: 'blur(20px)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(102, 126, 234, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.2)',
  },
  scoreIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f39c12',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(243, 156, 18, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  messageSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  encouragementText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonSection: {
    width: '100%',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  statsPreview: {
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  trophyIcon: {
    fontSize: 32,
    textAlign: 'center',
  },
  targetIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
});