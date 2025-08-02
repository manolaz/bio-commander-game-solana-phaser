import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZoneProgress {
  id: string;
  name: string;
  emoji: string;
  progress: number;
  unlocked: boolean;
  enemiesDefeated: number;
  totalEnemies: number;
  powerUpsCollected: number;
  totalPowerUps: number;
}

interface WorldNavigationProps {
  onEnterZone?: (zoneId: string) => void;
}

const WorldNavigation: React.FC<WorldNavigationProps> = ({ onEnterZone }) => {
  const [selectedZone, setSelectedZone] = useState<string>('heart');
  const [showZoneDetails, setShowZoneDetails] = useState(false);

  const zones: ZoneProgress[] = [
    {
      id: 'heart',
      name: 'Heart',
      emoji: '❤️',
      progress: 75,
      unlocked: true,
      enemiesDefeated: 15,
      totalEnemies: 20,
      powerUpsCollected: 8,
      totalPowerUps: 10
    },
    {
      id: 'lungs',
      name: 'Lungs',
      emoji: '🫁',
      progress: 45,
      unlocked: true,
      enemiesDefeated: 12,
      totalEnemies: 25,
      powerUpsCollected: 5,
      totalPowerUps: 12
    },
    {
      id: 'brain',
      name: 'Brain',
      emoji: '🧠',
      progress: 0,
      unlocked: false,
      enemiesDefeated: 0,
      totalEnemies: 30,
      powerUpsCollected: 0,
      totalPowerUps: 15
    },
    {
      id: 'liver',
      name: 'Liver',
      emoji: '🫀',
      progress: 0,
      unlocked: false,
      enemiesDefeated: 0,
      totalEnemies: 25,
      powerUpsCollected: 0,
      totalPowerUps: 12
    },
    {
      id: 'stomach',
      name: 'Stomach',
      emoji: '🫃',
      progress: 0,
      unlocked: false,
      enemiesDefeated: 0,
      totalEnemies: 20,
      powerUpsCollected: 0,
      totalPowerUps: 10
    },
    {
      id: 'kidneys',
      name: 'Kidneys',
      emoji: '🫁',
      progress: 0,
      unlocked: false,
      enemiesDefeated: 0,
      totalEnemies: 18,
      powerUpsCollected: 0,
      totalPowerUps: 8
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#00b894';
    if (progress >= 60) return '#fdcb6e';
    if (progress >= 40) return '#e17055';
    return '#ff7675';
  };

  const getZoneStatus = (zone: ZoneProgress) => {
    if (!zone.unlocked) return '🔒 Locked';
    if (zone.progress === 100) return '✅ Completed';
    if (zone.progress > 0) return '🔄 In Progress';
    return '🆕 Available';
  };

  return (
    <div className="world-navigation bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🌌 Bio Commander World</h1>
        <p className="text-gray-300">Navigate through the human body and defend vital organs</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">📊 Overall Progress</h2>
          <span className="text-3xl">🏆</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {zones.filter(z => z.unlocked).length}/{zones.length}
            </div>
            <div className="text-sm text-gray-300">Zones Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {zones.reduce((sum, z) => sum + z.enemiesDefeated, 0)}
            </div>
            <div className="text-sm text-gray-300">Enemies Defeated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {zones.reduce((sum, z) => sum + z.powerUpsCollected, 0)}
            </div>
            <div className="text-sm text-gray-300">Power-ups Collected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(zones.reduce((sum, z) => sum + z.progress, 0) / zones.length)}%
            </div>
            <div className="text-sm text-gray-300">Average Progress</div>
          </div>
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (zone.unlocked) {
                setSelectedZone(zone.id);
                setShowZoneDetails(true);
              }
            }}
            className={`relative bg-black bg-opacity-40 rounded-lg p-6 cursor-pointer border-2 transition-all duration-300 ${
              zone.unlocked 
                ? 'border-blue-500 hover:border-blue-400 hover:bg-opacity-50' 
                : 'border-gray-600 cursor-not-allowed opacity-60'
            }`}
          >
            {/* Zone Icon */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{zone.emoji}</div>
              <h3 className="text-xl font-bold text-white">{zone.name}</h3>
              <p className="text-sm text-gray-300">{getZoneStatus(zone)}</p>
            </div>

            {/* Progress Bar */}
            {zone.unlocked && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Progress</span>
                  <span>{zone.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getProgressColor(zone.progress) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            {zone.unlocked && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Enemies:</span>
                  <span className="text-red-400">
                    {zone.enemiesDefeated}/{zone.totalEnemies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Power-ups:</span>
                  <span className="text-green-400">
                    {zone.powerUpsCollected}/{zone.totalPowerUps}
                  </span>
                </div>
              </div>
            )}

            {/* Lock Icon */}
            {!zone.unlocked && (
              <div className="absolute top-4 right-4 text-2xl">🔒</div>
            )}

            {/* Completion Badge */}
            {zone.progress === 100 && (
              <div className="absolute top-4 right-4 text-2xl">✅</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Zone Details Modal */}
      <AnimatePresence>
        {showZoneDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowZoneDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {zones.find(z => z.id === selectedZone)?.emoji}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {zones.find(z => z.id === selectedZone)?.name} Zone
                </h3>
                
                <div className="space-y-4 mt-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white font-bold">
                        {zones.find(z => z.id === selectedZone)?.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${zones.find(z => z.id === selectedZone)?.progress}%`,
                          backgroundColor: getProgressColor(zones.find(z => z.id === selectedZone)?.progress || 0)
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg">
                      <div className="text-red-400 text-sm">Enemies Defeated</div>
                      <div className="text-white font-bold text-xl">
                        {zones.find(z => z.id === selectedZone)?.enemiesDefeated}/{zones.find(z => z.id === selectedZone)?.totalEnemies}
                      </div>
                    </div>
                    <div className="bg-green-900 bg-opacity-50 p-3 rounded-lg">
                      <div className="text-green-400 text-sm">Power-ups Collected</div>
                      <div className="text-white font-bold text-xl">
                        {zones.find(z => z.id === selectedZone)?.powerUpsCollected}/{zones.find(z => z.id === selectedZone)?.totalPowerUps}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => {
                        if (onEnterZone) {
                          onEnterZone(selectedZone);
                        }
                        setShowZoneDetails(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      🚀 Enter Zone
                    </button>
                    <button 
                      onClick={() => setShowZoneDetails(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tips */}
      <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💡 Navigation Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p className="mb-2"><span className="text-green-400">✅</span> Completed zones show full progress</p>
            <p className="mb-2"><span className="text-blue-400">🔄</span> In-progress zones show current completion</p>
            <p className="mb-2"><span className="text-gray-400">🔒</span> Locked zones require completing previous zones</p>
          </div>
          <div>
            <p className="mb-2"><span className="text-red-400">🦠</span> Defeat all enemies to unlock new zones</p>
            <p className="mb-2"><span className="text-yellow-400">⚡</span> Collect power-ups to enhance your abilities</p>
            <p className="mb-2"><span className="text-purple-400">🏆</span> Complete zones to earn achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldNavigation; 