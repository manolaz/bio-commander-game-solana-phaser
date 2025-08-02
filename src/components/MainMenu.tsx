import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MainMenuProps {
  onStartGame: () => void;
  onShowTutorial: () => void;
  onShowSettings: () => void;
  highScore: number;
}

/**
 * Main Menu Component
 * Features animated bio-themed elements and modern UI design
 */
export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowTutorial,
  onShowSettings,
  highScore,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, scaleAnim, floatAnim]);

  const float = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const handleButtonPress = (action: () => void, buttonName: string) => {
    setSelectedButton(buttonName);
    setTimeout(() => {
      setSelectedButton(null);
      action();
    }, 150);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Animated background */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Floating particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * SCREEN_WIDTH,
                top: Math.random() * SCREEN_HEIGHT,
                opacity: Math.random() * 0.4 + 0.1,
                transform: [{ translateY: float }],
              },
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Logo section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              transform: [{ translateY: float }],
            },
          ]}
        >
          <Text style={styles.logoIcon}>🧬</Text>
          <Text style={styles.gameTitle}>BIO COMMANDER</Text>
          <Text style={styles.gameSubtitle}>Defend the Microscopic Realm</Text>
        </Animated.View>

        {/* High score display */}
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>🏆 High Score</Text>
          <Text style={styles.highScoreValue}>{highScore.toLocaleString()}</Text>
        </View>

        {/* Menu buttons */}
        <View style={styles.menuButtons}>
          <TouchableOpacity
            style={[
              styles.menuButton,
              styles.primaryButton,
              selectedButton === 'start' && styles.buttonPressed,
            ]}
            onPress={() => handleButtonPress(onStartGame, 'start')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>🚀 Start Mission</Text>
            <Text style={styles.buttonSubtext}>Begin your bio-defense journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              styles.secondaryButton,
              selectedButton === 'tutorial' && styles.buttonPressed,
            ]}
            onPress={() => handleButtonPress(onShowTutorial, 'tutorial')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>📚 Tutorial</Text>
            <Text style={styles.buttonSubtext}>Learn the basics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              styles.secondaryButton,
              selectedButton === 'settings' && styles.buttonPressed,
            ]}
            onPress={() => handleButtonPress(onShowSettings, 'settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>⚙️ Settings</Text>
            <Text style={styles.buttonSubtext}>Customize your experience</Text>
          </TouchableOpacity>
        </View>

        {/* Game features preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Shape Recognition</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Power-ups</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <Text style={styles.featureText}>Shield System</Text>
          </View>
        </View>

        {/* Version info */}
        <Text style={styles.versionText}>v3.0 - Enhanced Bio-Defense</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a3a',
  },
  gradientLayer2: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    right: '5%',
    bottom: '15%',
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderRadius: 300,
  },
  gradientLayer3: {
    position: 'absolute',
    top: '70%',
    left: '15%',
    right: '15%',
    bottom: '5%',
    backgroundColor: 'rgba(155, 89, 182, 0.08)',
    borderRadius: 200,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(102, 126, 234, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  gameSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    textAlign: 'center',
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  highScoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  highScoreValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f39c12',
    letterSpacing: 1,
  },
  menuButtons: {
    width: '100%',
    marginBottom: 40,
  },
  menuButton: {
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
});