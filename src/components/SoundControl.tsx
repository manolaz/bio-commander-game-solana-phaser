'use client';
import React, { useState } from 'react';

interface SoundControlProps {
    onVolumeChange?: (volume: number) => void;
    onMuteToggle?: (muted: boolean) => void;
    initialVolume?: number;
    initialMuted?: boolean;
}

export const SoundControl: React.FC<SoundControlProps> = ({
    onVolumeChange,
    onMuteToggle,
    initialVolume = 0.7,
    initialMuted = false
}) => {
    const [volume, setVolume] = useState(initialVolume);
    const [muted, setMuted] = useState(initialMuted);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (onVolumeChange) {
            onVolumeChange(newVolume);
        }
    };

    const handleMuteToggle = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        if (onMuteToggle) {
            onMuteToggle(newMuted);
        }
    };

    return (
        <div className="fixed top-4 right-4 bg-black bg-opacity-50 p-3 rounded-lg text-white z-50">
            <div className="flex items-center space-x-3">
                <button
                    onClick={handleMuteToggle}
                    className="text-white hover:text-gray-300 transition-colors"
                    title={muted ? "Unmute" : "Mute"}
                >
                    {muted ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        disabled={muted}
                    />
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SoundControl; 