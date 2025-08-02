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

    EventCenter.on("ready", () => {
        setReady(true);
    });

    useEffect(() => {
        if (ready && wallet.connected) {
            EventCenter.emit("umi", umi);
        }
    }, [ready, wallet.connected, umi]);

    useEffect(() => {
        // Pass the selected zone to the game
        EventCenter.emit("selectedZone", selectedZone);
        
        const config: Phaser.Types.Core.GameConfig = {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            type: Phaser.AUTO,
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
        const game = new Phaser.Game(config)
        return () => {
            game.destroy(true)
        }
    }, [selectedZone])
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="relative">
                <div id="game-container" className="border-4 border-blue-500 rounded-lg shadow-2xl"></div>
            </div>
        </div>
    )
}


export default Game;