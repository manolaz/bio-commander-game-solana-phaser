import React, { useState, useEffect } from 'react';

interface ComboDisplayProps {
  combo: number;
  isVisible: boolean;
}

/**
 * Combo Display Component
 * Shows current combo multiplier with animations
 */
export const ComboDisplay: React.FC<ComboDisplayProps> = ({
  combo,
  isVisible,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [scaleIn, setScaleIn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isVisible && combo > 1) {
      // Show combo with animation
      const fadeTimer = setTimeout(() => setFadeIn(true), 50);
      const scaleTimer = setTimeout(() => setScaleIn(true), 100);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(scaleTimer);
      };
    } else {
      // Hide combo
      setFadeIn(false);
      setScaleIn(false);
    }
  }, [isVisible, combo, isClient]);

  if (!isClient || combo <= 1) return null;

  const getComboColor = (comboLevel: number) => {
    if (comboLevel >= 10) return '#ff3838';
    if (comboLevel >= 7) return '#ff6348';
    if (comboLevel >= 5) return '#ffa502';
    if (comboLevel >= 3) return '#ffb142';
    return '#f39c12';
  };

  const getComboText = (comboLevel: number) => {
    if (comboLevel >= 10) return 'LEGENDARY!';
    if (comboLevel >= 7) return 'AMAZING!';
    if (comboLevel >= 5) return 'GREAT!';
    if (comboLevel >= 3) return 'NICE!';
    return 'COMBO!';
  };

  return (
    <div className={`absolute top-70 left-5 right-5 flex justify-center z-50 transition-all duration-200 ${
      fadeIn ? 'opacity-100' : 'opacity-0'
    } ${scaleIn ? 'scale-100' : 'scale-0'}`}>
      <div 
        className="bg-black bg-opacity-80 px-5 py-3 rounded-2xl border-2 shadow-lg"
        style={{ borderColor: getComboColor(combo) }}
      >
        <div 
          className="text-base font-black text-center mb-1 tracking-wide drop-shadow-lg"
          style={{ color: getComboColor(combo) }}
        >
          {getComboText(combo)}
        </div>
        <div 
          className="text-2xl font-black text-center tracking-widest drop-shadow-lg"
          style={{ color: getComboColor(combo) }}
        >
          {combo}x
        </div>
      </div>
    </div>
  );
}; 