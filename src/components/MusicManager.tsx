import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MusicManagerProps {
  isEnabled: boolean;
  volume?: number;
  onMusicEnd?: () => void;
}

const MUSIC_FILES = [
  '/assets/music/CC8a1a.m4a',
  '/assets/music/cCC1a.m4a',
  '/assets/music/nc2.m4a',
  '/assets/music/KR1.m4a',
];

export const MusicManager: React.FC<MusicManagerProps> = ({
  isEnabled,
  volume = 0.5,
  onMusicEnd,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get a random music track
  const getRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * MUSIC_FILES.length);
    return randomIndex;
  };

  // Load and play a specific track
  const playTrack = async (trackIndex: number) => {
    if (!isClient) return;
    
    try {
      setIsLoading(true);
      
      // Create new audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = MUSIC_FILES[trackIndex];
      audio.volume = volume;
      audio.loop = false;

      // Set up event listeners
      audio.onended = () => {
        // Track finished, play next random track
        const nextTrackIndex = getRandomTrack();
        playTrack(nextTrackIndex);
        onMusicEnd?.();
      };

      audio.oncanplaythrough = () => {
        audio.play().then(() => {
          setCurrentTrackIndex(trackIndex);
          setIsPlaying(true);
          setIsLoading(false);
        }).catch((error) => {
          console.error('Error playing music track:', error);
          setIsLoading(false);
        });
      };

      audio.onerror = (error) => {
        console.error('Error loading music track:', error);
        setIsLoading(false);
      };

    } catch (error) {
      console.error('Error playing music track:', error);
      setIsLoading(false);
    }
  };

  // Start playing random music
  const startMusic = useCallback(async () => {
    if (!isEnabled || !isClient) return;
    
    const randomTrackIndex = getRandomTrack();
    await playTrack(randomTrackIndex);
  }, [isEnabled, isClient]);

  // Stop music
  const stopMusic = useCallback(async () => {
    if (!isClient || !audioRef.current) return;
    
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  }, [isClient]);

  // Pause music
  const pauseMusic = async () => {
    if (!isClient || !audioRef.current) return;
    
    try {
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing music:', error);
    }
  };

  // Resume music
  const resumeMusic = async () => {
    if (!isClient || !audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error resuming music:', error);
    }
  };

  // Update volume
  const updateVolume = useCallback(async (newVolume: number) => {
    if (!isClient || !audioRef.current) return;
    
    try {
      audioRef.current.volume = newVolume;
    } catch (error) {
      console.error('Error updating volume:', error);
    }
  }, [isClient]);

  // Handle music enable/disable
  useEffect(() => {
    if (isClient) {
      if (isEnabled) {
        startMusic();
      } else {
        stopMusic();
      }
    }
  }, [isEnabled, isClient, startMusic, stopMusic]);

  // Handle volume changes
  useEffect(() => {
    if (isClient) {
      updateVolume(volume);
    }
  }, [volume, isClient, updateVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
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