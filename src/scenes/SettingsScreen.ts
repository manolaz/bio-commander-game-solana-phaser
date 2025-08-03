import { Scene, GameObjects } from 'phaser';

export interface GameSettings {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    musicVolume: number;
    difficulty: 'easy' | 'normal' | 'hard';
    particleEffects: boolean;
    autoSave: boolean;
}

type BooleanKeys<T> = { [K in keyof T]: T[K] extends boolean ? K : never }[keyof T];

export class SettingsScreen extends Scene {
    private background!: GameObjects.Graphics;
    private title!: GameObjects.Text;
    private backButton!: GameObjects.Text;
    private settings: GameSettings;
    private settingElements: Map<string, GameObjects.GameObject> = new Map();

    constructor() {
        super('SettingsScreen');
        this.settings = {
            soundEnabled: true,
            vibrationEnabled: true,
            musicVolume: 0.6,
            difficulty: 'normal',
            particleEffects: true,
            autoSave: true
        };
    }

    create() {
        this.createBackground();
        this.createHeader();
        this.createAudioSettings();
        this.createGameplaySettings();
        this.createAboutSection();
        this.loadSettings();
    }

    private createBackground() {
        // Main background gradient
        this.background = this.add.graphics();
        this.background.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x16213e);
        this.background.fillRect(0, 0, 800, 600);
    }

    private createHeader() {
        // Back button
        this.backButton = this.add.text(50, 50, '← Back', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: { x: 15, y: 10 }
        }).setOrigin(0, 0.5);

        this.backButton.setInteractive();
        this.backButton.on('pointerdown', () => {
            this.saveSettings();
            this.scene.start('MainMenu');
        });

        // Title
        this.title = this.add.text(400, 50, 'Settings', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5, 0.5);
    }

    private createAudioSettings() {
        const sectionY = 120;
        
        // Section title
        this.add.text(100, sectionY, 'Audio', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        });

        // Sound Effects toggle
        this.createToggleSetting('Sound Effects', sectionY + 40, 'soundEnabled');

        // Vibration toggle
        this.createToggleSetting('Vibration', sectionY + 80, 'vibrationEnabled');

        // Music Volume
        this.createVolumeSetting(sectionY + 120);
    }

    private createGameplaySettings() {
        const sectionY = 280;
        
        // Section title
        this.add.text(100, sectionY, 'Gameplay', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        });

        // Difficulty selection
        this.createDifficultySetting(sectionY + 40);

        // Particle Effects toggle
        this.createToggleSetting('Particle Effects', sectionY + 80, 'particleEffects');

        // Auto Save toggle
        this.createToggleSetting('Auto Save', sectionY + 120, 'autoSave');
    }

    private createAboutSection() {
        const sectionY = 440;
        
        // Section title
        this.add.text(100, sectionY, 'About', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        });

        // About text
        this.add.text(400, sectionY + 40, 'Glorius, Bio Commander of the Corpus Humanus', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(400, sectionY + 70, 'Version 1.0.0', {
            fontSize: '14px',
            color: '#cccccc'
        }).setOrigin(0.5);

        this.add.text(400, sectionY + 100, 'Defend the human body from pathogens in this exciting beat \'em up adventure!', {
            fontSize: '14px',
            color: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
    }

    private createToggleSetting(label: string, y: number, settingKey: BooleanKeys<GameSettings>) {
        // Label
        this.add.text(100, y, label, {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        // Toggle button
        const toggleButton = this.add.graphics();
        toggleButton.setPosition(600, y);
        this.updateToggleButton(toggleButton, this.settings[settingKey] as boolean);

        toggleButton.setInteractive(new Phaser.Geom.Rectangle(-25, -15, 50, 30), Phaser.Geom.Rectangle.Contains);
        toggleButton.on('pointerdown', () => {
            this.settings[settingKey] = !this.settings[settingKey];
            this.updateToggleButton(toggleButton, this.settings[settingKey] as boolean);
        });

        this.settingElements.set(settingKey, toggleButton);
    }

    private updateToggleButton(button: GameObjects.Graphics, isOn: boolean) {
        button.clear();
        
        // Background
        button.fillStyle(isOn ? 0x4CAF50 : 0x767577);
        button.fillRoundedRect(-25, -15, 50, 30, 15);
        
        // Thumb
        button.fillStyle(0xffffff);
        button.fillCircle(isOn ? 10 : -10, 0, 12);
    }

    private createVolumeSetting(y: number) {
        // Label
        this.add.text(100, y, 'Music Volume', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        // Volume buttons
        const volumeOptions = [
            { label: 'Off', value: 0 },
            { label: 'Low', value: 0.3 },
            { label: 'Medium', value: 0.6 },
            { label: 'High', value: 1.0 }
        ];

        volumeOptions.forEach((option, index) => {
            const button = this.add.text(400 + (index * 80), y, option.label, {
                fontSize: '12px',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: { x: 12, y: 6 }
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.settings.musicVolume = option.value;
                this.updateVolumeButtons(volumeOptions, option.value);
            });

            this.settingElements.set(`volume_${option.value}`, button);
        });

        this.updateVolumeButtons(volumeOptions, this.settings.musicVolume);
    }

    private updateVolumeButtons(options: any[], currentValue: number) {
        options.forEach(option => {
            const button = this.settingElements.get(`volume_${option.value}`) as GameObjects.Text;
            if (button) {
                if (option.value === currentValue) {
                    button.setBackgroundColor('#4CAF50');
                    button.setColor('#ffffff');
                } else {
                    button.setBackgroundColor('rgba(255, 255, 255, 0.05)');
                    button.setColor('#ffffff');
                }
            }
        });
    }

    private createDifficultySetting(y: number) {
        // Label
        this.add.text(100, y, 'Difficulty', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        // Difficulty buttons
        const difficultyOptions = [
            { label: 'Easy', value: 'easy' },
            { label: 'Normal', value: 'normal' },
            { label: 'Hard', value: 'hard' }
        ];

        difficultyOptions.forEach((option, index) => {
            const button = this.add.text(400 + (index * 80), y, option.label, {
                fontSize: '12px',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: { x: 12, y: 6 }
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.settings.difficulty = option.value as 'easy' | 'normal' | 'hard';
                this.updateDifficultyButtons(difficultyOptions, option.value);
            });

            this.settingElements.set(`difficulty_${option.value}`, button);
        });

        this.updateDifficultyButtons(difficultyOptions, this.settings.difficulty);
    }

    private updateDifficultyButtons(options: any[], currentValue: string) {
        options.forEach(option => {
            const button = this.settingElements.get(`difficulty_${option.value}`) as GameObjects.Text;
            if (button) {
                if (option.value === currentValue) {
                    button.setBackgroundColor('#FF6B35');
                    button.setColor('#ffffff');
                } else {
                    button.setBackgroundColor('rgba(255, 255, 255, 0.05)');
                    button.setColor('#ffffff');
                }
            }
        });
    }

    private loadSettings() {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        }
    }

    private saveSettings() {
        // Save settings to localStorage
        try {
            localStorage.setItem('gameSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    getSettings(): GameSettings {
        return { ...this.settings };
    }
} 