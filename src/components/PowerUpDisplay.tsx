import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PowerUp {
  id: string;
  type: 'health' | 'energy' | 'shield' | 'speed' | 'damage' | 'multishot' | 'invincible' | 'ultimate';
  name: string;
  emoji: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  position: { x: number; y: number };
  isCollected: boolean;
  isActive: boolean;
  duration?: number; // in seconds
}

interface PowerUpDisplayProps {
  powerUps: PowerUp[];
  onPowerUpClick: (powerUp: PowerUp) => void;
  onPowerUpCollect: (powerUpId: string) => void;
}

const PowerUpDisplay: React.FC<PowerUpDisplayProps> = ({ powerUps, onPowerUpClick, onPowerUpCollect }) => {
  const [hoveredPowerUp, setHoveredPowerUp] = useState<string | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#00b894';
      case 'rare': return '#74b9ff';
      case 'epic': return '#a29bfe';
      case 'legendary': return '#fdcb6e';
      default: return '#ffffff';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '0 0 10px #00b894';
      case 'rare': return '0 0 15px #74b9ff';
      case 'epic': return '0 0 20px #a29bfe';
      case 'legendary': return '0 0 25px #fdcb6e';
      default: return '0 0 5px #ffffff';
    }
  };

  const getPowerUpSize = (rarity: string) => {
    switch (rarity) {
      case 'common': return 40;
      case 'rare': return 50;
      case 'epic': return 60;
      case 'legendary': return 70;
      default: return 40;
    }
  };

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (!powerUp.isCollected) {
      onPowerUpClick(powerUp);
    }
  };

  const handlePowerUpCollect = (powerUp: PowerUp) => {
    if (!powerUp.isCollected) {
      onPowerUpCollect(powerUp.id);
    }
  };

  return (
    <div className="powerup-display relative w-full h-full overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Power-ups */}
      {powerUps.map((powerUp) => (
        <motion.div
          key={powerUp.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: powerUp.isCollected ? 0 : 1,
            opacity: powerUp.isCollected ? 0 : 1,
            x: powerUp.position.x,
            y: powerUp.position.y
          }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          className={`absolute cursor-pointer transition-all duration-300 ${
            powerUp.isActive ? 'animate-pulse' : ''
          }`}
          style={{
            left: powerUp.position.x,
            top: powerUp.position.y,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => handlePowerUpClick(powerUp)}
          onMouseEnter={() => setHoveredPowerUp(powerUp.id)}
          onMouseLeave={() => setHoveredPowerUp(null)}
        >
          {/* Power-up Body */}
          <div
            className="relative rounded-full border-2 flex items-center justify-center"
            style={{
              width: getPowerUpSize(powerUp.rarity),
              height: getPowerUpSize(powerUp.rarity),
              backgroundColor: getRarityColor(powerUp.rarity),
              borderColor: getRarityColor(powerUp.rarity),
              boxShadow: getRarityGlow(powerUp.rarity)
            }}
          >
            {/* Power-up Emoji */}
            <span className="text-2xl">{powerUp.emoji}</span>
            
            {/* Rarity Badge */}
            <div 
              className="absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full text-black font-bold"
              style={{ backgroundColor: getRarityColor(powerUp.rarity) }}
            >
              {powerUp.rarity.charAt(0).toUpperCase()}
            </div>

            {/* Active Indicator */}
            {powerUp.isActive && (
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            )}
          </div>

          {/* Power-up Name */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div 
              className="text-white text-xs font-semibold px-2 py-1 rounded"
              style={{ backgroundColor: getRarityColor(powerUp.rarity) }}
            >
              {powerUp.name}
            </div>
          </div>

          {/* Hover Info */}
          <AnimatePresence>
            {hoveredPowerUp === powerUp.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-40 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-4 min-w-56 z-10"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{powerUp.emoji}</div>
                  <h3 className="text-white font-bold mb-2">{powerUp.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">Type: {powerUp.type}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-900 bg-opacity-50 p-3 rounded">
                      <div className="text-green-300 text-sm">Effect Value</div>
                      <div className="text-white font-bold text-xl">+{powerUp.value}</div>
                    </div>
                    <div 
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: `${getRarityColor(powerUp.rarity)}20` }}
                    >
                      <div className="text-sm" style={{ color: getRarityColor(powerUp.rarity) }}>Rarity</div>
                      <div className="text-white font-bold">{powerUp.rarity}</div>
                    </div>
                  </div>

                  {powerUp.duration && (
                    <div className="bg-blue-900 bg-opacity-50 p-3 rounded mb-4">
                      <div className="text-blue-300 text-sm">Duration</div>
                      <div className="text-white font-bold">{powerUp.duration}s</div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePowerUpCollect(powerUp);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition-colors"
                    >
                      ✨ Collect
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePowerUpClick(powerUp);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition-colors"
                    >
                      ℹ️ Info
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Power-up Types Legend */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-4 text-white">
        <h3 className="font-bold mb-3">⚡ Power-up Types</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-2xl mr-2">❤️</span>
            <span>Health</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            <span>Energy</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🛡️</span>
            <span>Shield</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">💨</span>
            <span>Speed</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚔️</span>
            <span>Damage</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            <span>Multi-shot</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-600">
          <h4 className="font-bold mb-2">🌟 Rarity Levels</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Common</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Rare</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span>Epic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Legendary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Stats */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">📦 Collection Stats</h3>
        <div className="space-y-1 text-sm">
          <div>Power-ups Available: {powerUps.filter(p => !p.isCollected).length}</div>
          <div>Power-ups Collected: {powerUps.filter(p => p.isCollected).length}</div>
          <div>Active Power-ups: {powerUps.filter(p => p.isActive).length}</div>
          <div>Total Power-ups: {powerUps.length}</div>
        </div>
      </div>

      {/* Active Power-ups Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-lg p-3 text-white">
        <h3 className="font-bold mb-2 text-center">🎯 Active Power-ups</h3>
        <div className="flex space-x-2">
          {powerUps.filter(p => p.isActive).map((powerUp) => (
            <div
              key={powerUp.id}
              className="flex items-center space-x-1 px-2 py-1 rounded"
              style={{ backgroundColor: `${getRarityColor(powerUp.rarity)}20` }}
            >
              <span className="text-lg">{powerUp.emoji}</span>
              <span className="text-xs">{powerUp.name}</span>
            </div>
          ))}
          {powerUps.filter(p => p.isActive).length === 0 && (
            <span className="text-gray-400 text-sm">No active power-ups</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerUpDisplay; 