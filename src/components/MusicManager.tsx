import React, { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

interface MusicManagerProps {
  isEnabled: boolean;
  volume?: number;
  onMusicEnd?: () => void;
}

const MUSIC_FILES = [
  require('../assets/music/CC8a1a.m4a'),
  require('../assets/music/cCC1a.m4a'),
  require('../assets/music/nc2.m4a'),
  require('../assets/music/KR1.m4a'),
];

export const MusicManager: React.FC<MusicManagerProps> = ({
  isEnabled,
  volume = 0.5,
  onMusicEnd,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Get a random music track
  const getRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * MUSIC_FILES.length);
    return randomIndex;
  };

  // Load and play a specific track
  const playTrack = async (trackIndex: number) => {
    try {
      setIsLoading(true);
      
      // Unload previous sound if it exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load new sound
      const { sound } = await Audio.Sound.createAsync(
        MUSIC_FILES[trackIndex],
        {
          shouldPlay: true,
          isLooping: false,
          volume: volume,
        }
      );

      soundRef.current = sound;
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);

      // Set up event listener for when track ends
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          // Track finished, play next random track
          const nextTrackIndex = getRandomTrack();
          playTrack(nextTrackIndex);
          onMusicEnd?.();
        }
      });

    } catch (error) {
      console.error('Error playing music track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start playing random music
  const startMusic = async () => {
    if (!isEnabled) return;
    
    const randomTrackIndex = getRandomTrack();
    await playTrack(randomTrackIndex);
  };

  // Stop music
  const stopMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  };

  // Pause music
  const pauseMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing music:', error);
    }
  };

  // Resume music
  const resumeMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error resuming music:', error);
    }
  };

  // Update volume
  const updateVolume = async (newVolume: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(newVolume);
      }
    } catch (error) {
      console.error('Error updating volume:', error);
    }
  };

  // Set up audio mode for background music
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting up audio mode:', error);
      }
    };

    setupAudio();
  }, []);

  // Handle music enable/disable
  useEffect(() => {
    if (isEnabled) {
      startMusic();
    } else {
      stopMusic();
    }
  }, [isEnabled]);

  // Handle volume changes
  useEffect(() => {
    updateVolume(volume);
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Expose methods for external control
  React.useImperativeHandle(React.useRef(), () => ({
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    updateVolume,
    isPlaying: () => isPlaying,
    isLoading: () => isLoading,
  }));

  // This component doesn't render anything visible
  return null;
};

export default MusicManager; 