'use client';
import React, { useState } from 'react';
import EventCenter from '@/events/eventCenter';

interface Zone {
    id: string;
    name: string;
    emoji: string;
    description: string;
    unlocked: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
}

const zones: Zone[] = [
    {
        id: 'heart',
        name: 'Heart Zone',
        emoji: '❤️',
        description: 'Defend the cardiovascular system',
        unlocked: true,
        difficulty: 'easy'
    },
    {
        id: 'lungs',
        name: 'Lungs Zone',
        emoji: '🫁',
        description: 'Protect the respiratory system',
        unlocked: true,
        difficulty: 'easy'
    },
    {
        id: 'brain',
        name: 'Brain Zone',
        emoji: '🧠',
        description: 'Guard the nervous system',
        unlocked: false,
        difficulty: 'medium'
    },
    {
        id: 'liver',
        name: 'Liver Zone',
        emoji: '🫀',
        description: 'Defend the digestive system',
        unlocked: false,
        difficulty: 'medium'
    },
    {
        id: 'stomach',
        name: 'Stomach Zone',
        emoji: '🫃',
        description: 'Protect the gastrointestinal tract',
        unlocked: false,
        difficulty: 'hard'
    },
    {
        id: 'kidneys',
        name: 'Kidneys Zone',
        emoji: '🫁',
        description: 'Guard the urinary system',
        unlocked: false,
        difficulty: 'hard'
    }
];

interface WorldNavigationProps {
    onZoneSelect: (zoneId: string) => void;
    currentZone: string;
}

export const WorldNavigation: React.FC<WorldNavigationProps> = ({ onZoneSelect, currentZone }) => {
    const [selectedZone, setSelectedZone] = useState(currentZone);

    const handleZoneClick = (zone: Zone) => {
        if (zone.unlocked) {
            setSelectedZone(zone.id);
            EventCenter.emit('selectedZone', zone.id);
            onZoneSelect(zone.id);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">World Map</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {zones.map((zone) => (
                    <div
                        key={zone.id}
                        onClick={() => handleZoneClick(zone)}
                        className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${zone.unlocked 
                                ? 'bg-gray-800 border-blue-500 hover:border-blue-400 hover:bg-gray-700' 
                                : 'bg-gray-900 border-gray-600 opacity-50 cursor-not-allowed'
                            }
                            ${selectedZone === zone.id ? 'border-yellow-400 bg-gray-700' : ''}
                        `}
                    >
                        <div className="text-3xl mb-2">{zone.emoji}</div>
                        <h3 className="text-lg font-semibold text-white mb-1">{zone.name}</h3>
                        <p className="text-sm text-gray-300 mb-2">{zone.description}</p>
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-medium ${getDifficultyColor(zone.difficulty)}`}>
                                {zone.difficulty.toUpperCase()}
                            </span>
                            {!zone.unlocked && (
                                <span className="text-xs text-gray-400">🔒 LOCKED</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-900 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">How to Play</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Select a zone to explore</li>
                    <li>• Use arrow keys to navigate the hexagonal grid</li>
                    <li>• Press space to interact with tiles</li>
                    <li>• Fight enemies in turn-based combat</li>
                    <li>• Collect power-ups to strengthen your T-Cell</li>
                    <li>• Complete zones to unlock new areas</li>
                </ul>
            </div>
        </div>
    );
};

export default WorldNavigation; 