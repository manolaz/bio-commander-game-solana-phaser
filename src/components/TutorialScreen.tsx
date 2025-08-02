import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TutorialScreenProps {
  onBack: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

/**
 * Tutorial Screen Component
 * Features comprehensive game tutorial with modern design
 */
export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Welcome to Bio Commander',
      description: 'You are a T-cell defending the microscopic realm against invading pathogens.',
      icon: '🧬',
      tips: [
        'Your mission is to protect the body from viruses and bacteria',
        'Use shape recognition to attack enemies effectively',
        'Manage your health and energy carefully'
      ]
    },
    {
      title: 'Movement & Control',
      description: 'Control your T-cell by dragging it around the screen.',
      icon: '🎮',
      tips: [
        'Drag your finger to move the T-cell',
        'Stay away from enemies to avoid damage',
        'Position yourself strategically for attacks'
      ]
    },
    {
      title: 'Shape Recognition',
      description: 'Draw shapes to perform different attacks against enemies.',
      icon: '✏️',
      tips: [
        'Draw a circle for area damage',
        'Draw a triangle for piercing attacks',
        'Draw a square for shield activation',
        'Draw a star for ultimate power'
      ]
    },
    {
      title: 'Enemy Types',
      description: 'Different enemies require different strategies.',
      icon: '🦠',
      tips: [
        'Viruses are fast but weak',
        'Bacteria are slow but tough',
        'Some enemies have special abilities',
        'Watch for enemy attack patterns'
      ]
    },
    {
      title: 'Power-ups & Resources',
      description: 'Collect power-ups to enhance your abilities.',
      icon: '⚡',
      tips: [
        'Health packs restore your health',
        'Energy orbs replenish your energy',
        'Shield power-ups provide temporary protection',
        'Use power-ups strategically'
      ]
    },
    {
      title: 'Advanced Strategies',
      description: 'Master these techniques to become an elite bio-commander.',
      icon: '🎯',
      tips: [
        'Chain attacks for combo bonuses',
        'Use the environment to your advantage',
        'Learn enemy spawn patterns',
        'Practice shape drawing for accuracy'
      ]
    }
  ];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutorial</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentStep + 1} / {tutorialSteps.length}
          </Text>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Step Icon */}
          <View style={styles.stepIconContainer}>
            <Text style={styles.stepIcon}>{currentTutorialStep.icon}</Text>
          </View>

          {/* Step Title */}
          <Text style={styles.stepTitle}>{currentTutorialStep.title}</Text>

          {/* Step Description */}
          <Text style={styles.stepDescription}>{currentTutorialStep.description}</Text>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Key Points:</Text>
            {currentTutorialStep.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Interactive Demo Placeholder */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Interactive Demo</Text>
            <View style={styles.demoPlaceholder}>
              <Text style={styles.demoText}>Demo coming soon...</Text>
            </View>
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={prevStep}
            disabled={currentStep === 0}
          >
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.stepIndicators}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepIndicator,
                  index === currentStep && styles.stepIndicatorActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.navButton, styles.primaryNavButton]}
            onPress={nextStep}
          >
            <Text style={styles.primaryNavButtonText}>
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
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
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderRadius: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  progressContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(102, 126, 234, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f39c12',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  tipBullet: {
    fontSize: 16,
    color: '#667eea',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    flex: 1,
  },
  demoContainer: {
    marginBottom: 32,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoPlaceholder: {
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  primaryNavButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  navButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  primaryNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  stepIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepIndicatorActive: {
    backgroundColor: '#667eea',
  },
});