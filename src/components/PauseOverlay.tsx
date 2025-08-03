import React from 'react';

interface PauseOverlayProps {
  isVisible: boolean;
}

/**
 * Pause Overlay Component
 * Displays when the game is paused with clear visual feedback
 */
export const PauseOverlay: React.FC<PauseOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex justify-center items-center mb-5 mx-auto">
          <span className="text-5xl">⏸️</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-wide">
          Game Paused
        </h2>
        <p className="text-gray-600 tracking-wide">
          Tap the pause button to resume
        </p>
      </div>
    </div>
  );
};