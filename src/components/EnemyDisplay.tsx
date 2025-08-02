import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Enemy {
  id: string;
  type: 'virus' | 'bacteria' | 'fungi';
  name: string;
  emoji: string;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  powerLevel: 1 | 2 | 3;
  position: { x: number; y: number };
  isAlive: boolean;
  isAttacking: boolean;
}

interface EnemyDisplayProps {
  enemies: Enemy[];
  onEnemyClick: (enemy: Enemy) => void;
  onEnemyDefeat: (enemyId: string) => void;
}

const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemies, onEnemyClick, onEnemyDefeat }) => {
  const [hoveredEnemy, setHoveredEnemy] = useState<string | null>(null);

  const getEnemyColor = (type: string) => {
    switch (type) {
      case 'virus': return '#ff4757';
      case 'bacteria': return '#e84393';
      case 'fungi': return '#fdcb6e';
      default: return '#ffffff';
    }
  };

  const getPowerLevelEmoji = (level: number) => {
    return '⚡'.repeat(level);
  };

  const getEnemySize = (powerLevel: number) => {
    return 30 + (powerLevel * 10);
  };

  const handleEnemyClick = (enemy: Enemy) => {
    if (enemy.isAlive) {
      onEnemyClick(enemy);
    }
  };

  const handleEnemyAttack = (enemy: Enemy) => {
    if (enemy.isAlive && !enemy.isAttacking) {
      // Simulate attack animation
      setTimeout(() => {
        onEnemyDefeat(enemy.id);
      }, 1000);
    }
  };

  return (
    <div className="enemy-display relative w-full h-full overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Enemies */}
      {enemies.map((enemy) => (
        <motion.div
          key={enemy.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: enemy.isAlive ? 1 : 0,
            opacity: enemy.isAlive ? 1 : 0,
            x: enemy.position.x,
            y: enemy.position.y
          }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute cursor-pointer transition-all duration-300 ${
            enemy.isAttacking ? 'animate-pulse' : ''
          }`}
          style={{
            left: enemy.position.x,
            top: enemy.position.y,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => handleEnemyClick(enemy)}
          onMouseEnter={() => setHoveredEnemy(enemy.id)}
          onMouseLeave={() => setHoveredEnemy(null)}
        >
          {/* Enemy Body */}
          <div
            className="relative rounded-full border-2 flex items-center justify-center"
            style={{
              width: getEnemySize(enemy.powerLevel),
              height: getEnemySize(enemy.powerLevel),
              backgroundColor: getEnemyColor(enemy.type),
              borderColor: getEnemyColor(enemy.type),
              boxShadow: `0 0 20px ${getEnemyColor(enemy.type)}40`
            }}
          >
            {/* Enemy Emoji */}
            <span className="text-2xl">{enemy.emoji}</span>
            
            {/* Power Level Indicator */}
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-1 rounded-full">
              {getPowerLevelEmoji(enemy.powerLevel)}
            </div>
          </div>

          {/* Health Bar */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Enemy Name */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-white text-xs font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
              {enemy.name}
            </div>
          </div>

          {/* Hover Info */}
          <AnimatePresence>
            {hoveredEnemy === enemy.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-3 min-w-48 z-10"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{enemy.emoji}</div>
                  <h3 className="text-white font-bold mb-2">{enemy.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-red-900 bg-opacity-50 p-2 rounded">
                      <div className="text-red-300">Health</div>
                      <div className="text-white font-bold">{enemy.health}/{enemy.maxHealth}</div>
                    </div>
                    <div className="bg-orange-900 bg-opacity-50 p-2 rounded">
                      <div className="text-orange-300">Damage</div>
                      <div className="text-white font-bold">{enemy.damage}</div>
                    </div>
                    <div className="bg-blue-900 bg-opacity-50 p-2 rounded">
                      <div className="text-blue-300">Speed</div>
                      <div className="text-white font-bold">{enemy.speed}</div>
                    </div>
                    <div className="bg-yellow-900 bg-opacity-50 p-2 rounded">
                      <div className="text-yellow-300">Power</div>
                      <div className="text-white font-bold">{getPowerLevelEmoji(enemy.powerLevel)}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnemyAttack(enemy);
                    }}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition-colors"
                  >
                    ⚔️ Attack
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Enemy Types Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">🦠 Enemy Types</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Virus</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
            <span>Bacteria</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Fungi</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600">
          <h4 className="font-bold mb-1">⚡ Power Levels</h4>
          <div className="space-y-1 text-xs">
            <div>⚡ Weak</div>
            <div>⚡⚡ Medium</div>
            <div>⚡⚡⚡ Strong</div>
          </div>
        </div>
      </div>

      {/* Battle Stats */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">⚔️ Battle Stats</h3>
        <div className="space-y-1 text-sm">
          <div>Enemies Alive: {enemies.filter(e => e.isAlive).length}</div>
          <div>Enemies Defeated: {enemies.filter(e => !e.isAlive).length}</div>
          <div>Total Enemies: {enemies.length}</div>
        </div>
      </div>
    </div>
  );
};

export default EnemyDisplay; 