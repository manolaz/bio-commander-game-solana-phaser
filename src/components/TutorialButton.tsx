'use client';
import React, { useState } from 'react';

interface TutorialButtonProps {
  className?: string;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({ className = '' }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: '🎮 Getting Started',
      content: 'Welcome to Bio Commander! You are a T-Cell defending the human body against pathogens.'
    },
    {
      title: '🌍 World Navigation',
      content: 'Select different zones (Heart, Lungs, Brain, etc.) to explore and defend various body systems.'
    },
    {
      title: '🎯 Zone Exploration',
      content: 'Use arrow keys to navigate the hexagonal grid. Press SPACE to interact with tiles.'
    },
    {
      title: '⚔️ Combat System',
      content: 'Enter enemy tiles to start turn-based combat. Use action points and energy strategically.'
    },
    {
      title: '⚡ Power-ups',
      content: 'Collect power-ups to restore health, energy, and gain temporary buffs.'
    },
    {
      title: '🏆 Progress',
      content: 'Complete zones by defeating all enemies and bosses to unlock new areas.'
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowTutorial(true)}
        className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors ${className}`}
      >
        📖 Tutorial
      </button>

      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">🎮 Bio Commander Tutorial</h2>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">🎯 Quick Controls</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p><strong>Arrow Keys:</strong> Navigate grid</p>
                  <p><strong>Space:</strong> Interact with tiles</p>
                  <p><strong>ESC:</strong> Exit combat</p>
                </div>
                <div>
                  <p><strong>Mouse:</strong> Click buttons</p>
                  <p><strong>Enter:</strong> Confirm actions</p>
                  <p><strong>Tab:</strong> Switch focus</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowTutorial(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Got it! Let&apos;s Play! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialButton;