'use client';
import React, { useEffect, useState } from 'react'
import * as Phaser from 'phaser';
import { Boot } from '@/scenes/Boot';
import { Preloader } from '@/scenes/Preloader';
import { WalletConnect } from '@/scenes/WalletConnect';
import { MainMenu } from '@/scenes/MainMenu';
import { Game as MainGame } from '@/scenes/Game';
import { GameOver } from '@/scenes/GameOver';
import { WorldMapScene } from '@/scenes/WorldMapScene';
import { TurnBasedCombatScene } from '@/scenes/TurnBasedCombatScene';
import { ZoneCompleteScene } from '@/scenes/ZoneCompleteScene';
import { SettingsScreen } from '@/scenes/SettingsScreen';
import { TutorialScreen } from '@/scenes/TutorialScreen';
import { LoadingScreen } from '@/scenes/LoadingScreen';
import { useUmi } from '@/providers/useUmi';
import EventCenter from '@/events/eventCenter';
import { useWallet } from '@solana/wallet-adapter-react';

export const DEFAULT_WIDTH: number = 800;
export const DEFAULT_HEIGHT: number = 600;

interface GameProps {
  selectedZone?: string;
}

const Game: React.FC<GameProps> = ({ selectedZone = 'heart' }) => {
    const wallet = useWallet();
    const umi = useUmi();
    const [ready, setReady] = useState(false);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingTimeout, setLoadingTimeout] = useState(false);

    useEffect(() => {
        const handleReady = () => {
            setReady(true);
        };

        EventCenter.on("ready", handleReady);
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            console.log('Loading timeout reached, forcing ready state');
            setLoadingTimeout(true);
            setReady(true);
        }, 10000); // 10 second timeout
        
        return () => {
            EventCenter.off("ready", handleReady);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (ready && (wallet.connected || loadingTimeout)) {
            EventCenter.emit("umi", umi);
        }
    }, [ready, wallet.connected, umi, loadingTimeout]);

    useEffect(() => {
        try {
            // Pass the selected zone to the game
            EventCenter.emit("selectedZone", selectedZone);
            
            const config: Phaser.Types.Core.GameConfig = {
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                type: Phaser.AUTO,
                parent: 'game-container',
                scene: [
                    Boot,
                    Preloader,
                    LoadingScreen,
                    WalletConnect,
                    MainMenu,
                    MainGame,
                    GameOver,
                    WorldMapScene,
                    TurnBasedCombatScene,
                    ZoneCompleteScene,
                    SettingsScreen,
                    TutorialScreen,
                ],
                render: {
                    pixelArt: true,
                },
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoRound: true,
                },
                pixelArt: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 800 },
                        debug: false
                    }
                },
            };
            
            const game = new Phaser.Game(config);
            setGameInstance(game);
            
            return () => {
                if (game) {
                    game.destroy(true);
                    setGameInstance(null);
                }
            };
        } catch (err) {
            console.error('Failed to initialize game:', err);
            setError(err instanceof Error ? err.message : 'Failed to initialize game');
        }
    }, [selectedZone]);

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Game Error</h2>
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.location.reload();
                            }
                        }} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                        Reload Game
                    </button>
                </div>
            </div>
        );
    }

    if (!ready) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Initializing Game</h2>
                    <p className="text-gray-300 mb-4">Loading Bio Commander...</p>
                    {loadingTimeout && (
                        <button 
                            onClick={() => setReady(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                        >
                            Start Game Anyway
                        </button>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="relative">
                <div id="game-container" className="border-4 border-blue-500 rounded-lg shadow-2xl"></div>
            </div>
        </div>
    );
}


export default Game;