import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MusicControlProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const MusicControl: React.FC<MusicControlProps> = ({
  isPlaying,
  isLoading,
  onTogglePlay,
  onNextTrack,
  volume,
  onVolumeChange,
}) => {
  const handleVolumeChange = () => {
    // Cycle through volume levels: 0 -> 0.3 -> 0.6 -> 1.0 -> 0
    const volumeLevels = [0, 0.3, 0.6, 1.0];
    const currentIndex = volumeLevels.findIndex(v => Math.abs(v - volume) < 0.1);
    const nextIndex = (currentIndex + 1) % volumeLevels.length;
    onVolumeChange(volumeLevels[nextIndex]);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume <= 0.3) return '🔈';
    if (volume <= 0.6) return '🔉';
    return '🔊';
  };

  const getPlayIcon = () => {
    if (isLoading) return '⏳';
    return isPlaying ? '⏸️' : '▶️';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onTogglePlay}
        disabled={isLoading}
      >
        <Text style={styles.iconText}>{getPlayIcon()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onNextTrack}
        disabled={isLoading}
      >
        <Text style={styles.iconText}>⏭️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleVolumeChange}
      >
        <Text style={styles.iconText}>{getVolumeIcon()}</Text>
      </TouchableOpacity>

      {isLoading && (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    padding: 8,
    zIndex: 1000,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
}); 