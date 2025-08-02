import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface AchievementDisplayProps {
  achievement: Achievement;
  onDismiss: () => void;
}

/**
 * Achievement Display Component
 * Shows achievement unlock notifications with animations
 */
export const AchievementDisplay: React.FC<AchievementDisplayProps> = ({
  achievement,
  onDismiss,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Entrance animation
    const fadeTimer = setTimeout(() => setFadeIn(true), 100);
    const slideTimer = setTimeout(() => setSlideIn(true), 200);

    // Auto-dismiss after 3 seconds
    const dismissTimer = setTimeout(() => {
      setFadeIn(false);
      setSlideIn(false);
      
      setTimeout(() => {
        onDismiss();
      }, 300);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(slideTimer);
      clearTimeout(dismissTimer);
    };
  }, [isClient, onDismiss]);

  const handleDismiss = () => {
    setFadeIn(false);
    setSlideIn(false);
    
    setTimeout(() => {
      onDismiss();
    }, 200);
  };

  if (!isClient) return null;

  return (
    <div className={`absolute top-25 left-5 right-5 z-50 transition-all duration-500 ${
      fadeIn ? 'opacity-100' : 'opacity-0'
    } ${slideIn ? 'translate-y-0' : '-translate-y-24'}`}>
      <button
        className="w-full flex items-center bg-green-500 bg-opacity-95 p-4 rounded-2xl shadow-lg border-2 border-green-400 transition-all duration-200 hover:scale-105"
        onClick={handleDismiss}
      >
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-bold text-white mb-1 drop-shadow-lg">
            Achievement Unlocked!
          </div>
          <div className="text-xs text-white text-opacity-90 drop-shadow-lg">
            {achievement.title}
          </div>
        </div>
      </button>
    </div>
  );
}; 