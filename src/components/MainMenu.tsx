import React, { useEffect, useRef, useState } from 'react';

interface MainMenuProps {
  onStartGame: () => void;
  onShowTutorial: () => void;
  onShowSettings: () => void;
  highScore: number;
}

/**
 * Main Menu Component
 * Features animated bio-themed elements and modern UI design
 */
export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowTutorial,
  onShowSettings,
  highScore,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [scaleIn, setScaleIn] = useState(false);
  const [float, setFloat] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Entrance animations
    const fadeTimer = setTimeout(() => setFadeIn(true), 100);
    const slideTimer = setTimeout(() => setSlideIn(true), 200);
    const scaleTimer = setTimeout(() => setScaleIn(true), 300);

    // Floating animation
    const floatInterval = setInterval(() => {
      setFloat(prev => !prev);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(slideTimer);
      clearTimeout(scaleTimer);
      clearInterval(floatInterval);
    };
  }, [isClient]);

  const handleButtonPress = (action: () => void, buttonName: string) => {
    setSelectedButton(buttonName);
    setTimeout(() => {
      setSelectedButton(null);
      action();
    }, 150);
  };

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
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-indigo-900"></div>
        <div className="absolute top-1/6 left-1/20 right-1/20 bottom-1/6 bg-blue-500 bg-opacity-8 rounded-full"></div>
        <div className="absolute top-7/10 left-1/7 right-1/7 bottom-1/20 bg-purple-500 bg-opacity-8 rounded-full"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white bg-opacity-20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={`text-center transition-all duration-800 ${fadeIn ? 'opacity-100' : 'opacity-0'} ${slideIn ? 'translate-y-0' : 'translate-y-12'} ${scaleIn ? 'scale-100' : 'scale-90'}`}>
        {/* Logo section */}
        <div className={`mb-10 transition-transform duration-2000 ${float ? '-translate-y-2' : 'translate-y-0'}`}>
          <div className="text-7xl mb-4">🧬</div>
          <div className="text-4xl font-black text-white tracking-wider mb-2 drop-shadow-lg">BIO COMMANDER</div>
          <div className="text-lg text-gray-300 tracking-wide">Defend the Microscopic Realm</div>
        </div>

        {/* High score display */}
        <div className="mb-10 py-4 px-6 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10">
          <div className="text-sm text-gray-400 mb-1 tracking-wide">🏆 High Score</div>
          <div className="text-2xl font-black text-yellow-400 tracking-wide">{highScore.toLocaleString()}</div>
        </div>

        {/* Menu buttons */}
        <div className="mb-10 space-y-4">
          <button
            className={`w-full py-5 px-6 rounded-2xl font-black text-xl transition-all duration-200 ${
              selectedButton === 'start' 
                ? 'scale-95 bg-blue-700' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            } text-white border-2 border-white border-opacity-20 shadow-lg`}
            onClick={() => handleButtonPress(onStartGame, 'start')}
          >
            <div>🚀 Start Mission</div>
            <div className="text-sm font-normal opacity-70">Begin your bio-defense journey</div>
          </button>

          <button
            className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
              selectedButton === 'tutorial' 
                ? 'scale-95 bg-gray-700' 
                : 'bg-white bg-opacity-10 hover:bg-opacity-20 hover:scale-105'
            } text-white border border-white border-opacity-20 shadow-lg`}
            onClick={() => handleButtonPress(onShowTutorial, 'tutorial')}
          >
            <div>📚 Tutorial</div>
            <div className="text-sm font-normal opacity-70">Learn the basics</div>
          </button>

          <button
            className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
              selectedButton === 'settings' 
                ? 'scale-95 bg-gray-700' 
                : 'bg-white bg-opacity-10 hover:bg-opacity-20 hover:scale-105'
            } text-white border border-white border-opacity-20 shadow-lg`}
            onClick={() => handleButtonPress(onShowSettings, 'settings')}
          >
            <div>⚙️ Settings</div>
            <div className="text-sm font-normal opacity-70">Customize your experience</div>
          </button>
        </div>

        {/* Game features preview */}
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-xs text-gray-400">Shape Recognition</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs text-gray-400">Power-ups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="text-xs text-gray-400">Shield System</div>
          </div>
        </div>

        {/* Version info */}
        <div className="text-xs text-gray-400">v3.0 - Enhanced Bio-Defense</div>
      </div>
    </div>
  );
};