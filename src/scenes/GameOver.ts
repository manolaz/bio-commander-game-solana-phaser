import { Scene } from 'phaser';
import { ScoreData } from '@/systems/ScoreManager';

export class GameOver extends Scene {
    private scoreData!: ScoreData;

    constructor() {
        super('GameOver');
    }

    init(data: { score: ScoreData }) {
        this.scoreData = data.score;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

        // Game Over title
        this.add.text(400, 150, 'GAME OVER', {
            fontSize: '48px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Score display
        this.add.text(400, 220, `Final Score: ${this.scoreData.currentScore.toLocaleString()}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // High score display
        if (this.scoreData.currentScore >= this.scoreData.highScore) {
            this.add.text(400, 250, 'NEW HIGH SCORE!', {
                fontSize: '20px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        } else {
            this.add.text(400, 250, `High Score: ${this.scoreData.highScore.toLocaleString()}`, {
                fontSize: '18px',
                color: '#cccccc',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }

        // Score breakdown
        this.add.text(400, 290, 'Score Breakdown:', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.add.text(400, 315, `Wave Bonus: +${this.scoreData.waveBonus}`, {
            fontSize: '14px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.add.text(400, 335, `Combo Bonus: +${this.scoreData.comboBonus}`, {
            fontSize: '14px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.add.text(400, 355, `Survival Bonus: +${this.scoreData.survivalBonus}`, {
            fontSize: '14px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Buttons
        const restartButton = this.add.text(400, 420, 'Play Again', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        const menuButton = this.add.text(400, 470, 'Main Menu', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#2196F3',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Make buttons interactive
        restartButton.setInteractive();
        menuButton.setInteractive();

        // Button hover effects
        restartButton.on('pointerover', () => {
            restartButton.setBackgroundColor('#45a049');
        });

        restartButton.on('pointerout', () => {
            restartButton.setBackgroundColor('#4CAF50');
        });

        menuButton.on('pointerover', () => {
            menuButton.setBackgroundColor('#1976D2');
        });

        menuButton.on('pointerout', () => {
            menuButton.setBackgroundColor('#2196F3');
        });

        // Button click handlers
        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start('Game');
        });

        this.input.keyboard.on('keydown-M', () => {
            this.scene.start('MainMenu');
        });

        // Instructions
        this.add.text(400, 520, 'Press R to restart or M for main menu', {
            fontSize: '14px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
    }
} 