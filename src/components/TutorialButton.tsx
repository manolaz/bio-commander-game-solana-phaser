import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Animated,
  ScrollView,
  Dimensions
} from 'react-native';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Minimalist Tutorial Button Component
 * Provides contextual help without interfering with gameplay
 * Features smooth animations and accessible design
 */
export const TutorialButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonOpacity] = useState(new Animated.Value(0.6));

  const handleButtonPress = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const animateButtonHover = (toValue: number) => {
    Animated.timing(buttonOpacity, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const tutorialSections = [
    {
      title: '🎯 Objective',
      content: 'Control your T-cell to defend against microscopic invaders. Survive as long as possible while earning points!'
    },
    {
      title: '🕹️ Controls',
      content: 'Drag the blue T-cell around the screen to move. Avoid enemy contact to preserve your health.'
    },
    {
      title: '⚔️ Combat Shapes',
      content: '— Line: Basic Attack (10 damage, 5 energy)\n○ Circle: Shield (blocks damage, 15 energy)\n△ Triangle: Power Attack (25 damage, 20 energy)'
    },
    {
      title: '👾 Enemies',
      content: '🦠 Viruses: Fast, weak (20 HP, 10 points)\n🧫 Bacteria: Slow, strong (50 HP, 25 points)'
    },
    {
      title: '💡 Strategy Tips',
      content: '• Use shields when overwhelmed\n• Save energy for power attacks\n• Keep moving to avoid being surrounded\n• Energy regenerates over time'
    }
  ];

  return (
    <>
      {/* Floating Help Button */}
      <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={handleButtonPress}
          onPressIn={() => animateButtonHover(1)}
          onPressOut={() => animateButtonHover(0.6)}
          accessibilityLabel="Open game tutorial"
          accessibilityRole="button"
          accessibilityHint="Shows game instructions and controls"
        >
          <Text style={styles.helpIcon}>❓</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Tutorial Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        accessibilityViewIsModal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bio Commander Guide</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                accessibilityLabel="Close tutorial"
                accessibilityRole="button"
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {tutorialSections.map((section, index) => (
                <View key={index} style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionContent}>{section.content}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleClose}
                accessibilityLabel="Start playing"
                accessibilityRole="button"
              >
                <Text style={styles.startButtonText}>Start Playing! 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 2000,
  },
  helpButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34495e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    maxWidth: SCREEN_WIDTH - 40,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(127, 140, 141, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionContent: {
    fontSize: 16,
    color: '#5d6d7e',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  helpIcon: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});