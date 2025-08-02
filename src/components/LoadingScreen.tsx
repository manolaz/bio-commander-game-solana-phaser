import React, { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

/**
 * Loading Screen Component
 * Features animated bio-themed elements and smooth transitions
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isClient, setIsClient] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [scaleIn, setScaleIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [rotate, setRotate] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Initial fade in
    const fadeTimer = setTimeout(() => setFadeIn(true), 100);
    const scaleTimer = setTimeout(() => setScaleIn(true), 800);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1000);

    // Rotate animation
    const rotateInterval = setInterval(() => {
      setRotate(prev => !prev);
    }, 3000);

    // Complete loading after 2.5 seconds
    const completeTimer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(scaleTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
      clearInterval(pulseInterval);
      clearInterval(rotateInterval);
    };
  }, [isClient, onLoadingComplete]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🧬</div>
          <div className="text-2xl font-bold">BIO COMMANDER</div>
          <div className="text-sm text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center transition-opacity duration-800 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background gradient effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-indigo-900"></div>
        <div className="absolute top-1/5 left-1/10 right-1/10 bottom-1/5 bg-blue-500 bg-opacity-10 rounded-full"></div>
        <div className="absolute top-3/5 left-1/5 right-1/5 bottom-1/10 bg-purple-500 bg-opacity-10 rounded-full"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={`text-center transition-all duration-600 ${fadeIn ? 'opacity-100' : 'opacity-0'} ${scaleIn ? 'scale-100' : 'scale-90'}`}>
        {/* Logo */}
        <div className={`mb-16 transition-transform duration-1000 ${pulse ? 'scale-110' : 'scale-100'}`}>
          <div className="text-8xl mb-4">🧬</div>
          <div className="text-4xl font-black text-white tracking-wider mb-2 drop-shadow-lg">BIO COMMANDER</div>
          <div className="text-lg text-gray-300 tracking-wide">Defend the Microscopic Realm</div>
        </div>

        {/* Loading indicator */}
        <div className="mb-16">
          <div className={`w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6 transition-transform duration-3000 ${rotate ? 'rotate-360' : 'rotate-0'}`}>
            <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mt-2"></div>
          </div>
          
          <div className="text-lg text-gray-300 mb-6">Initializing Bio-Defense Systems</div>
          
          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading tips */}
        <div className="space-y-2 text-sm text-gray-400">
          <div>💡 Tip: Draw shapes to attack enemies</div>
          <div>🛡️ Collect power-ups for special abilities</div>
          <div>⚡ Manage your energy wisely</div>
        </div>
      </div>
    </div>
  );
};