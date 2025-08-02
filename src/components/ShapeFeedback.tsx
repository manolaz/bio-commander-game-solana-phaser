import React, { useEffect, useState } from 'react';

interface ShapeFeedbackProps {
  message: string;
  onComplete?: () => void;
}

/**
 * Shape Feedback Component
 * Displays temporary feedback messages for shape recognition results
 * Features smooth animations and auto-dismissal
 */
export const ShapeFeedback: React.FC<ShapeFeedbackProps> = ({
  message,
  onComplete,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [scaleIn, setScaleIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !message) return;

    setIsVisible(true);
    
    // Entrance animation
    const fadeTimer = setTimeout(() => setFadeIn(true), 50);
    const scaleTimer = setTimeout(() => setScaleIn(true), 100);

    // Auto-dismiss after 2 seconds
    const dismissTimer = setTimeout(() => {
      setFadeIn(false);
      setScaleIn(false);
      
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 300);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(scaleTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, isClient, onComplete]);

  if (!isClient || !isVisible) return null;

  const getMessageStyle = (msg: string) => {
    if (msg.includes('💥') || msg.includes('🛡️')) {
      return 'bg-green-600 bg-opacity-95 border-green-400';
    }
    if (msg.includes('❌') || msg.includes('⚡')) {
      return 'bg-red-600 bg-opacity-95 border-red-400';
    }
    return 'bg-gray-600 bg-opacity-95 border-gray-400';
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-2xl z-50 min-w-48 text-center shadow-2xl border-2 transition-all duration-300 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      } ${scaleIn ? 'scale-100' : 'scale-80'} ${getMessageStyle(message)}`}
    >
      <div className="text-white text-lg font-bold tracking-wide drop-shadow-lg">
        {message}
      </div>
    </div>
  );
};