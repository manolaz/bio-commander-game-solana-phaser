import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

/**
 * Game Over Screen Component
 * Displays final score and restart option with enhanced visual design
 * Features motivational messaging and clear call-to-action
 */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
}) => {
  const getScoreMessage = (score: number): string => {
    if (score >= 500) return "🏆 Legendary Commander!";
    if (score >= 300) return "⭐ Elite Defender!";
    if (score >= 150) return "🎯 Skilled Warrior!";
    if (score >= 50) return "💪 Good Effort!";
    return "🌱 Keep Training!";
  };

  const getEncouragementMessage = (score: number): string => {
    if (score >= 500) return "You've mastered the microscopic battlefield!";
    if (score >= 300) return "Exceptional defense against the invasion!";
    if (score >= 150) return "Your T-cell fought valiantly!";
    if (score >= 50) return "You're getting the hang of bio-combat!";
    return "Every commander starts somewhere. Try again!";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Mission Complete
          </h1>
          <p className="text-gray-600">
            The microscopic battle has ended
          </p>
        </div>

        {/* Score Section */}
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-yellow-100 flex justify-center items-center mb-4 mx-auto">
            <span className="text-4xl">🏆</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Final Score</p>
          <p className="text-4xl font-bold text-gray-800 mb-2">
            {score.toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {getScoreMessage(score)}
          </p>
        </div>

        {/* Encouragement */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            {getEncouragementMessage(score)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            🔄 New Mission
          </button>
        </div>

        {/* Stats Preview */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span className="text-gray-600">
              Enemies Defeated: {Math.floor(score / 15)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};