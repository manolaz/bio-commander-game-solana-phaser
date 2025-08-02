'use client';
import React from 'react';

interface SoundTestProps {
    onPlayExplosion?: () => void;
    onPlayLaserShoot?: () => void;
    onPlayHitHurt?: () => void;
    onPlayPickupCoin?: () => void;
    onPlayPowerUp?: () => void;
    onPlaySynth?: () => void;
}

export const SoundTest: React.FC<SoundTestProps> = ({
    onPlayExplosion,
    onPlayLaserShoot,
    onPlayHitHurt,
    onPlayPickupCoin,
    onPlayPowerUp,
    onPlaySynth
}) => {
    return (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-50 p-3 rounded-lg text-white z-50">
            <h3 className="text-sm font-bold mb-2">Sound Test</h3>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onPlayExplosion}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                >
                    Explosion
                </button>
                <button
                    onClick={onPlayLaserShoot}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                >
                    Laser Shoot
                </button>
                <button
                    onClick={onPlayHitHurt}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
                >
                    Hit/Hurt
                </button>
                <button
                    onClick={onPlayPickupCoin}
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                >
                    Pickup Coin
                </button>
                <button
                    onClick={onPlayPowerUp}
                    className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
                >
                    Power Up
                </button>
                <button
                    onClick={onPlaySynth}
                    className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded text-xs"
                >
                    Synth
                </button>
            </div>
        </div>
    );
};

export default SoundTest; 