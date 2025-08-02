import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/components/Game';
import { Umi } from '@metaplex-foundation/umi';
import { Scene, GameObjects } from 'phaser';
import { SoundManager } from '../systems/SoundManager';
import EventCenter from '@/events/eventCenter';

export class MainMenu extends Scene {
    private umi!: Umi;
    private background!: GameObjects.Graphics;
    private logo!: GameObjects.Text;
    private title!: GameObjects.Text;
    private buttons: GameObjects.Text[] = [];
    private soundManager!: SoundManager;
    private selectedZone: string = 'heart';

    constructor() {
        super('MainMenu');
    }

    init(args: { umi: Umi }) {
        this.umi = args.umi;
    }

    create() {
        // Listen for selected zone
        EventCenter.on('selectedZone', (zoneId: string) => {
            this.selectedZone = zoneId;
        });

        // Initialize sound manager
        this.soundManager = new SoundManager(this);
        this.soundManager.initialize();
        
        // Start menu music
        this.soundManager.playMusic('menu');

        this.createBackground();
        this.createLogo();
        this.createButtons();
        this.createAnimations();
    }

    private createBackground() {
        // Main background gradient
        this.background = this.add.graphics();
        this.background.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x16213e);
        this.background.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        // Gradient layers
        const gradient1 = this.add.graphics();
        gradient1.fillStyle(0x667eea, 0.1);
        gradient1.fillEllipse(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 4, 400, 200);

        const gradient2 = this.add.graphics();
        gradient2.fillStyle(0x9b59b6, 0.1);
        gradient2.fillEllipse(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.75, 300, 150);
    }

    private createLogo() {
        // Logo icon
        this.logo = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 4, '🧬', {
            fontSize: '80px'
        }).setOrigin(0.5);

        // Game title
        this.title = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.35, 'BIO COMMANDER', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#667eea',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.42, 'Defend the Microscopic Realm', {
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)'
        }).setOrigin(0.5);

        // Zone info
        this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.48, `Selected Zone: ${this.selectedZone}`, {
            fontSize: '14px',
            color: '#9b59b6',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Wallet info
        this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.55, this.umi.identity.publicKey.toString(), {
            fontSize: '14px',
            color: '#0f0',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    private createButtons() {
        const buttonConfigs = [
            { text: 'Start Game', scene: 'Game', y: 0.7 },
            { text: 'Tutorial', scene: 'TutorialScreen', y: 0.8 },
            { text: 'Settings', scene: 'SettingsScreen', y: 0.9 }
        ];

        buttonConfigs.forEach(config => {
            const button = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * config.y, config.text, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);

            button.setInteractive();
            
            // Add hover sound
            button.on('pointerover', () => {
                button.setBackgroundColor('rgba(102, 126, 234, 0.3)');
                this.soundManager.playUIHover();
            });

            button.on('pointerout', () => {
                button.setBackgroundColor('rgba(255, 255, 255, 0.1)');
            });

            button.on('pointerdown', () => {
                this.soundManager.playUIClick();
                this.soundManager.vibrateShort();
                
                // Fade out music before scene transition
                this.soundManager.fadeMusic(500);
                
                // Delay scene transition to allow music fade
                this.time.delayedCall(500, () => {
                    if (config.scene === 'Game') {
                        this.scene.start(config.scene, { 
                            umi: this.umi, 
                            selectedZone: this.selectedZone 
                        });
                    } else {
                        this.scene.start(config.scene, { umi: this.umi });
                    }
                });
            });

            this.buttons.push(button);
        });
    }

    private createAnimations() {
        // Logo pulse animation
        this.tweens.add({
            targets: this.logo,
            scale: { from: 1, to: 1.1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Button entrance animation
        this.buttons.forEach((button, index) => {
            button.setAlpha(0);
            button.setY(button.y + 50);
            
            this.tweens.add({
                targets: button,
                alpha: 1,
                y: button.y - 50,
                duration: 500,
                delay: index * 200,
                ease: 'Back.easeOut'
            });
        });
    }

    shutdown() {
        // Clean up sound manager when scene is destroyed
        if (this.soundManager) {
            this.soundManager.destroy();
        }
    }
}