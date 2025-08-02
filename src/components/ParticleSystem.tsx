import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Particle } from '../utils/types';

interface ParticleSystemProps {
  particles: Particle[];
}

/**
 * Particle System Component
 * Renders visual particle effects for various game events
 * Features smooth animations and performance optimization
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(particle => (
        <View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life / particle.maxLife,
              transform: [
                { scale: particle.life / particle.maxLife },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
}); 