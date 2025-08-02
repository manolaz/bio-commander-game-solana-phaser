import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BodyZone {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  gradient: string;
  enemies: Enemy[];
  powerUps: PowerUp[];
  unlocked: boolean;
  completed: boolean;
}

interface Enemy {
  id: string;
  type: 'virus' | 'bacteria' | 'fungi';
  name: string;
  emoji: string;
  health: number;
  damage: number;
  speed: number;
  powerLevel: 1 | 2 | 3; // ⚡ ⚡⚡ ⚡⚡⚡
}

interface PowerUp {
  id: string;
  type: 'health' | 'energy' | 'shield' | 'speed' | 'damage' | 'multishot' | 'invincible' | 'ultimate';
  name: string;
  emoji: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GameWorldProps {
  onEnterZone?: (zoneId: string) => void;
}

const GameWorld: React.FC<GameWorldProps> = ({ onEnterZone }) => {
  const [currentZone, setCurrentZone] = useState<string>('heart');
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const bodyZones: BodyZone[] = [
    {
      id: 'heart',
      name: 'Heart',
      emoji: '❤️',
      x: 200,
      y: 300,
      radius: 80,
      color: '#ff4757',
      gradient: 'url(#heartGradient)',
      unlocked: true,
      completed: false,
      enemies: [
        { id: 'corona', type: 'virus', name: 'Corona Virus', emoji: '🦠', health: 100, damage: 25, speed: 2, powerLevel: 2 },
        { id: 'flu', type: 'virus', name: 'Flu Virus', emoji: '🦠', health: 75, damage: 15, speed: 3, powerLevel: 1 }
      ],
      powerUps: [
        { id: 'heart-health', type: 'health', name: 'Heart Health', emoji: '❤️', value: 50, rarity: 'common' },
        { id: 'heart-shield', type: 'shield', name: 'Cardiac Shield', emoji: '🛡️', value: 30, rarity: 'rare' }
      ]
    },
    {
      id: 'lungs',
      name: 'Lungs',
      emoji: '🫁',
      x: 400,
      y: 200,
      radius: 60,
      color: '#0984e3',
      gradient: 'url(#lungGradient)',
      unlocked: true,
      completed: false,
      enemies: [
        { id: 'pneumonia', type: 'bacteria', name: 'Pneumonia', emoji: '🦠', health: 150, damage: 30, speed: 1, powerLevel: 3 },
        { id: 'tuberculosis', type: 'bacteria', name: 'Tuberculosis', emoji: '🦠', health: 200, damage: 40, speed: 1, powerLevel: 3 }
      ],
      powerUps: [
        { id: 'oxygen-boost', type: 'energy', name: 'Oxygen Boost', emoji: '💨', value: 75, rarity: 'epic' },
        { id: 'breath-shield', type: 'shield', name: 'Breath Shield', emoji: '🛡️', value: 45, rarity: 'rare' }
      ]
    },
    {
      id: 'brain',
      name: 'Brain',
      emoji: '🧠',
      x: 650,
      y: 200,
      radius: 70,
      color: '#6c5ce7',
      gradient: 'url(#brainGradient)',
      unlocked: false,
      completed: false,
      enemies: [
        { id: 'meningitis', type: 'bacteria', name: 'Meningitis', emoji: '🦠', health: 300, damage: 50, speed: 2, powerLevel: 3 },
        { id: 'encephalitis', type: 'virus', name: 'Encephalitis', emoji: '🦠', health: 250, damage: 45, speed: 3, powerLevel: 3 }
      ],
      powerUps: [
        { id: 'neural-boost', type: 'speed', name: 'Neural Boost', emoji: '⚡', value: 100, rarity: 'legendary' },
        { id: 'mind-shield', type: 'shield', name: 'Mind Shield', emoji: '🛡️', value: 60, rarity: 'epic' }
      ]
    },
    {
      id: 'liver',
      name: 'Liver',
      emoji: '🫀',
      x: 350,
      y: 485,
      radius: 65,
      color: '#e17055',
      gradient: 'url(#liverGradient)',
      unlocked: false,
      completed: false,
      enemies: [
        { id: 'hepatitis', type: 'virus', name: 'Hepatitis', emoji: '🦠', health: 180, damage: 35, speed: 2, powerLevel: 2 },
        { id: 'cirrhosis', type: 'fungi', name: 'Cirrhosis', emoji: '🍄', health: 220, damage: 40, speed: 1, powerLevel: 3 }
      ],
      powerUps: [
        { id: 'detox-boost', type: 'health', name: 'Detox Boost', emoji: '🧪', value: 80, rarity: 'epic' },
        { id: 'liver-shield', type: 'shield', name: 'Liver Shield', emoji: '🛡️', value: 50, rarity: 'rare' }
      ]
    }
  ];

  const handleZoneClick = (zone: BodyZone) => {
    if (zone.unlocked) {
      setCurrentZone(zone.id);
      setShowDetails(true);
    }
  };

  const handleEnemyClick = (enemy: Enemy) => {
    setSelectedEnemy(enemy);
  };

  const handlePowerUpClick = (powerUp: PowerUp) => {
    setSelectedPowerUp(powerUp);
  };

  const getPowerLevelEmoji = (level: number) => {
    return '⚡'.repeat(level);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#00b894';
      case 'rare': return '#74b9ff';
      case 'epic': return '#a29bfe';
      case 'legendary': return '#fdcb6e';
      default: return '#ffffff';
    }
  };

  return (
    <div className="game-world relative w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Body Zones */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ee5a52', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lungGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#74b9ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0984e3', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a29bfe', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6c5ce7', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="liverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fdcb6e', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e17055', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Blood Vessels */}
        <g id="blood-vessels" opacity="0.7">
          <path d="M 200 300 Q 300 250 400 200" stroke="#ff4757" strokeWidth="8" fill="none"/>
          <path d="M 200 300 Q 300 350 400 400" stroke="#ff4757" strokeWidth="6" fill="none"/>
          <path d="M 400 200 Q 500 250 600 150" stroke="#ff4757" strokeWidth="6" fill="none"/>
          <path d="M 400 400 Q 500 450 600 500" stroke="#ff4757" strokeWidth="6" fill="none"/>
        </g>

        {/* Body Zones */}
        {bodyZones.map((zone) => (
          <g key={zone.id} className="cursor-pointer" onClick={() => handleZoneClick(zone)}>
            <motion.circle
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill={zone.unlocked ? zone.gradient : '#333'}
              stroke={zone.unlocked ? zone.color : '#666'}
              strokeWidth="3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={zone.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
            />
            <text
              x={zone.x}
              y={zone.y + 10}
              textAnchor="middle"
              fill="white"
              fontSize="40"
              fontFamily="Arial"
              className="pointer-events-none"
            >
              {zone.emoji}
            </text>
            <text
              x={zone.x}
              y={zone.y + zone.radius + 30}
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontFamily="Arial"
              className="pointer-events-none"
            >
              {zone.name}
            </text>
            {!zone.unlocked && (
              <text
                x={zone.x}
                y={zone.y + zone.radius + 50}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize="12"
                fontFamily="Arial"
                className="pointer-events-none"
              >
                🔒 Locked
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Zone Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 w-80 h-full bg-black bg-opacity-80 backdrop-blur-sm p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {bodyZones.find(z => z.id === currentZone)?.name} Zone
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:text-red-400 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Zone Info */}
            <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">
                  {bodyZones.find(z => z.id === currentZone)?.emoji}
                </span>
                <div>
                  <h3 className="text-white font-semibold">
                    {bodyZones.find(z => z.id === currentZone)?.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Defend this vital organ from pathogens
                  </p>
                </div>
              </div>
            </div>

            {/* Enemies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">🦠 Enemies</h3>
              <div className="space-y-2">
                {bodyZones.find(z => z.id === currentZone)?.enemies.map((enemy) => (
                  <motion.div
                    key={enemy.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEnemyClick(enemy)}
                    className="p-3 bg-red-900 bg-opacity-50 rounded-lg cursor-pointer border border-red-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{enemy.emoji}</span>
                        <div>
                          <p className="text-white font-medium">{enemy.name}</p>
                          <p className="text-red-300 text-sm">
                            HP: {enemy.health} | DMG: {enemy.damage}
                          </p>
                        </div>
                      </div>
                      <span className="text-yellow-400 text-sm">
                        {getPowerLevelEmoji(enemy.powerLevel)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Power-ups */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">⚡ Power-ups</h3>
              <div className="space-y-2">
                {bodyZones.find(z => z.id === currentZone)?.powerUps.map((powerUp) => (
                  <motion.div
                    key={powerUp.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePowerUpClick(powerUp)}
                    className="p-3 bg-green-900 bg-opacity-50 rounded-lg cursor-pointer border border-green-500"
                    style={{ borderColor: getRarityColor(powerUp.rarity) }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{powerUp.emoji}</span>
                        <div>
                          <p className="text-white font-medium">{powerUp.name}</p>
                          <p className="text-green-300 text-sm">
                            Value: {powerUp.value} | {powerUp.rarity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-opacity-50"
                            style={{ backgroundColor: getRarityColor(powerUp.rarity) }}>
                        {powerUp.rarity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (onEnterZone) {
                    onEnterZone(currentZone);
                  }
                  setShowDetails(false);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                🚀 Enter Zone
              </button>
              <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                📊 Zone Stats
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enemy Details Modal */}
      <AnimatePresence>
        {selectedEnemy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedEnemy(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 block">{selectedEnemy.emoji}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedEnemy.name}</h3>
                <p className="text-gray-300 mb-4">Type: {selectedEnemy.type}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-900 p-3 rounded">
                    <p className="text-red-300 text-sm">Health</p>
                    <p className="text-white font-bold">{selectedEnemy.health}</p>
                  </div>
                  <div className="bg-orange-900 p-3 rounded">
                    <p className="text-orange-300 text-sm">Damage</p>
                    <p className="text-white font-bold">{selectedEnemy.damage}</p>
                  </div>
                  <div className="bg-blue-900 p-3 rounded">
                    <p className="text-blue-300 text-sm">Speed</p>
                    <p className="text-white font-bold">{selectedEnemy.speed}</p>
                  </div>
                  <div className="bg-yellow-900 p-3 rounded">
                    <p className="text-yellow-300 text-sm">Power</p>
                    <p className="text-white font-bold">{getPowerLevelEmoji(selectedEnemy.powerLevel)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedEnemy(null)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power-up Details Modal */}
      <AnimatePresence>
        {selectedPowerUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedPowerUp(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 block">{selectedPowerUp.emoji}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedPowerUp.name}</h3>
                <p className="text-gray-300 mb-4">Type: {selectedPowerUp.type}</p>
                
                <div className="bg-green-900 p-4 rounded mb-4">
                  <p className="text-green-300 text-sm">Effect Value</p>
                  <p className="text-white font-bold text-2xl">+{selectedPowerUp.value}</p>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: getRarityColor(selectedPowerUp.rarity) }}>
                    {selectedPowerUp.rarity.toUpperCase()}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedPowerUp(null)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">🌌 Bio Commander World</h2>
          <p className="text-sm text-gray-300">Current Zone: {bodyZones.find(z => z.id === currentZone)?.name}</p>
          <p className="text-sm text-gray-300">Zones Unlocked: {bodyZones.filter(z => z.unlocked).length}/{bodyZones.length}</p>
        </div>
      </div>
    </div>
  );
};

export default GameWorld; 