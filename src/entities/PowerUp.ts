import { Scene, GameObjects, Physics } from 'phaser';

export type PowerUpType = 'health' | 'energy' | 'shield';

export interface PowerUpConfig {
    type: PowerUpType;
    emoji: string;
    color: number;
    value: number;
    duration?: number;
}

export class PowerUp extends Physics.Arcade.Sprite {
    private config: PowerUpConfig;
    private glow!: GameObjects.Graphics;
    private collected: boolean = false;
    private pulseTween?: Phaser.Tweens.Tween;

    constructor(scene: Scene, x: number, y: number, type: PowerUpType) {
        super(scene, x, y, 'powerup');
        
        this.config = PowerUp.getConfig(type);
        this.createPowerUp();
        this.setupPhysics();
        this.startAnimations();
    }

    private static getConfig(type: PowerUpType): PowerUpConfig {
        const configs: Record<PowerUpType, PowerUpConfig> = {
            health: {
                type: 'health',
                emoji: '❤️',
                color: 0xe74c3c,
                value: 30
            },
            energy: {
                type: 'energy',
                emoji: '⚡',
                color: 0xf39c12,
                value: 25
            },
            shield: {
                type: 'shield',
                emoji: '🛡️',
                color: 0x3498db,
                value: 0,
                duration: 5000 // 5 seconds
            }
        };
        return configs[type];
    }

    private createPowerUp() {
        // Create the main power-up sprite using graphics
        const graphics = this.scene.add.graphics();
        
        // Background circle
        graphics.fillStyle(this.config.color);
        graphics.fillCircle(0, 0, 16);
        
        // Border
        graphics.lineStyle(2, 0xffffff, 0.8);
        graphics.strokeCircle(0, 0, 16);
        
        // Convert graphics to texture
        graphics.generateTexture('powerup', 32, 32);
        graphics.destroy();

        // Set the texture
        this.setTexture('powerup');

        // Create glow effect
        this.glow = this.scene.add.graphics();
        this.glow.fillStyle(this.config.color, 0.3);
        this.glow.fillCircle(0, 0, 20);
        this.glow.setPosition(this.x, this.y);

        // Add emoji text
        const emojiText = this.scene.add.text(0, 0, this.config.emoji, {
            fontSize: '20px'
        }).setOrigin(0.5);
        emojiText.setPosition(this.x, this.y);

        // Add to scene
        this.scene.add.existing(this);
    }

    private setupPhysics() {
        // Enable physics
        this.scene.physics.add.existing(this);
        
        // Set body size
        if (this.body) {
            this.body.setSize(24, 24);
            this.body.setOffset(4, 4);
        }
    }

    private startAnimations() {
        // Floating animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulse animation for glow
        this.pulseTween = this.scene.tweens.add({
            targets: this.glow,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotation animation
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    collect(): PowerUpConfig {
        if (this.collected) {
            return this.config;
        }

        this.collected = true;

        // Stop animations
        if (this.pulseTween) {
            this.pulseTween.stop();
        }

        // Collection animation
        this.scene.tweens.add({
            targets: [this, this.glow],
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });

        // Play collection sound
        this.scene.sound.play('powerup_collect', { volume: 0.5 });

        // Create collection particles
        this.createCollectionParticles();

        return this.config;
    }

    private createCollectionParticles() {
        const particles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: this.config.color,
            lifespan: 500,
            quantity: 10
        });

        // Stop emitting after a short time
        this.scene.time.delayedCall(100, () => {
            particles.stop();
            this.scene.time.delayedCall(800, () => {
                particles.destroy();
            });
        });
    }

    isCollected(): boolean {
        return this.collected;
    }

    getType(): PowerUpType {
        return this.config.type;
    }

    getValue(): number {
        return this.config.value;
    }

    getDuration(): number | undefined {
        return this.config.duration;
    }

    destroy() {
        if (this.pulseTween) {
            this.pulseTween.stop();
        }
        this.glow.destroy();
        super.destroy();
    }

    update() {
        // Update glow position to follow power-up
        if (this.glow && this.active) {
            this.glow.setPosition(this.x, this.y);
        }
    }
} 