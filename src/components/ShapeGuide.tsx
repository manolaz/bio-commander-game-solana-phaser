import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';


/**
 * Shape Guide Component
 * Collapsible reference guide for combat shapes and their effects
 * Features smooth animations and improved accessibility
 */
export const ShapeGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animationValue, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const contentHeight = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const shapes = [
    { symbol: '—', name: 'Line', effect: 'Basic Attack (10 dmg, 5 energy)', color: '#e74c3c' },
    { symbol: '○', name: 'Circle', effect: 'Shield (15 energy)', color: '#27ae60' },
    { symbol: '△', name: 'Triangle', effect: 'Power Attack (25 dmg, 20 energy)', color: '#f39c12' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        accessibilityLabel={`Combat shapes guide. Currently ${isExpanded ? 'expanded' : 'collapsed'}`}
        accessibilityRole="button"
        accessibilityHint="Tap to show or hide combat shape instructions"
      >
        <Text style={styles.headerTitle}>Combat Shapes</Text>
        <Text style={styles.chevronIcon}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Expandable Content */}
      <Animated.View style={[styles.content, { height: contentHeight }]}>
        <View style={styles.shapesContainer}>
          {shapes.map((shape, index) => (
            <View key={index} style={styles.shapeRow}>
              <View style={[styles.shapeSymbol, { backgroundColor: shape.color }]}>
                <Text style={styles.symbolText}>{shape.symbol}</Text>
              </View>
              <View style={styles.shapeInfo}>
                <Text style={styles.shapeName}>{shape.name}</Text>
                <Text style={styles.shapeEffect}>{shape.effect}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  content: {
    overflow: 'hidden',
  },
  shapesContainer: {
    padding: 16,
  },
  shapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shapeSymbol: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  shapeInfo: {
    flex: 1,
  },
  shapeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  shapeEffect: {
    fontSize: 12,
    color: '#5d6d7e',
    lineHeight: 16,
  },
  chevronIcon: {
    fontSize: 16,
    color: '#5d6d7e',
    fontWeight: 'bold',
  },
});