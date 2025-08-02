import { Scene, GameObjects, Physics } from 'phaser';

export type AdvancedPowerUpType = 
    | 'health' | 'energy' | 'shield' 
    | 'speed_boost' | 'damage_boost' | 'invincibility'
    | 'time_slow' | 'multi_shot' | 'explosive_rounds'
    | 'healing_aura' | 'damage_aura' | 'magnetic_field'
    | 'ultimate_weapon' | 'combo_extender' | 'lucky_charm';

export interface AdvancedPowerUpConfig {
    type: AdvancedPowerUpType;
    emoji: string;
    color: number;
    value: number;
    duration: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    effect: 'instant' | 'duration' | 'toggle';
    description: string;
    specialEffect?: string;
}

export interface PowerUpEffect {
    type: AdvancedPowerUpType;
    value: number;
    duration: number;
    startTime: number;
    isActive: boolean;
}

export class AdvancedPowerUp extends Physics.Arcade.Sprite {
    private config: AdvancedPowerUpConfig;
    private glow!: GameObjects.Graphics;
    private collected: boolean = false;
    private pulseTween?: Phaser.Tweens.Tween;
    private rotationTween?: Phaser.Tweens.Tween;
    private rarityParticles?: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private rarityEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Scene, x: number, y: number, type: AdvancedPowerUpType) {
        super(scene, x, y, 'advanced_powerup');
        
        this.config = AdvancedPowerUp.getConfig(type);
        this.createPowerUp();
        this.setupPhysics();
        this.startAnimations();
        this.createRarityEffects();
    }

    private static getConfig(type: AdvancedPowerUpType): AdvancedPowerUpConfig {
        const configs: Record<AdvancedPowerUpType, AdvancedPowerUpConfig> = {
            // Basic power-ups
            health: {
                type: 'health',
                emoji: '❤️',
                color: 0xe74c3c,
                value: 50,
                duration: 0,
                rarity: 'common',
                effect: 'instant',
                description: 'Restore health'
            },
            energy: {
                type: 'energy',
                emoji: '⚡',
                color: 0xf39c12,
                value: 40,
                duration: 0,
                rarity: 'common',
                effect: 'instant',
                description: 'Restore energy'
            },
            shield: {
                type: 'shield',
                emoji: '🛡️',
                color: 0x3498db,
                value: 0,
                duration: 8000,
                rarity: 'common',
                effect: 'duration',
                description: 'Temporary invincibility'
            },

            // Combat buffs
            speed_boost: {
                type: 'speed_boost',
                emoji: '💨',
                color: 0x00ff00,
                value: 1.5,
                duration: 10000,
                rarity: 'rare',
                effect: 'duration',
                description: 'Increased movement speed'
            },
            damage_boost: {
                type: 'damage_boost',
                emoji: '⚔️',
                color: 0xff0000,
                value: 2.0,
                duration: 12000,
                rarity: 'rare',
                effect: 'duration',
                description: 'Increased attack damage'
            },
            invincibility: {
                type: 'invincibility',
                emoji: '✨',
                color: 0xffff00,
                value: 0,
                duration: 5000,
                rarity: 'epic',
                effect: 'duration',
                description: 'Complete invincibility'
            },

            // Special abilities
            time_slow: {
                type: 'time_slow',
                emoji: '⏰',
                color: 0x00ffff,
                value: 0.5,
                duration: 8000,
                rarity: 'epic',
                effect: 'duration',
                description: 'Slow down enemies',
                specialEffect: 'time_warp'
            },
            multi_shot: {
                type: 'multi_shot',
                emoji: '🎯',
                color: 0xff00ff,
                value: 3,
                duration: 15000,
                rarity: 'epic',
                effect: 'duration',
                description: 'Fire multiple projectiles',
                specialEffect: 'spread_shot'
            },
            explosive_rounds: {
                type: 'explosive_rounds',
                emoji: '💥',
                color: 0xff6600,
                value: 0,
                duration: 10000,
                rarity: 'epic',
                effect: 'duration',
                description: 'Explosive projectiles',
                specialEffect: 'explosion'
            },

            // Aura effects
            healing_aura: {
                type: 'healing_aura',
                emoji: '🌟',
                color: 0x00ff00,
                value: 5,
                duration: 12000,
                rarity: 'rare',
                effect: 'duration',
                description: 'Continuous healing',
                specialEffect: 'healing_waves'
            },
            damage_aura: {
                type: 'damage_aura',
                emoji: '🔥',
                color: 0xff4400,
                value: 10,
                duration: 10000,
                rarity: 'rare',
                effect: 'duration',
                description: 'Damage nearby enemies',
                specialEffect: 'damage_waves'
            },
            magnetic_field: {
                type: 'magnetic_field',
                emoji: '🧲',
                color: 0x0066ff,
                value: 0,
                duration: 8000,
                rarity: 'rare',
                effect: 'duration',
                description: 'Attract power-ups',
                specialEffect: 'magnetic_pull'
            },

            // Legendary power-ups
            ultimate_weapon: {
                type: 'ultimate_weapon',
                emoji: '🗡️',
                color: 0xff00ff,
                value: 5.0,
                duration: 20000,
                rarity: 'legendary',
                effect: 'duration',
                description: 'Ultimate weapon power',
                specialEffect: 'ultimate_mode'
            },
            combo_extender: {
                type: 'combo_extender',
                emoji: '🔗',
                color: 0xffff00,
                value: 0,
                duration: 15000,
                rarity: 'legendary',
                effect: 'duration',
                description: 'Extended combo window',
                specialEffect: 'combo_lock'
            },
            lucky_charm: {
                type: 'lucky_charm',
                emoji: '🍀',
                color: 0x00ff00,
                value: 0,
                duration: 30000,
                rarity: 'legendary',
                effect: 'duration',
                description: 'Increased luck and drops',
                specialEffect: 'lucky_aura'
            }
        };
        return configs[type];
    }

    private createPowerUp() {
        // Create the main power-up sprite using graphics
        const graphics = this.scene.add.graphics();
        
        // Background circle with rarity-based size
        const size = this.getRaritySize();
        graphics.fillStyle(this.config.color);
        graphics.fillCircle(0, 0, size);
        
        // Border with rarity-based thickness
        const borderThickness = this.getRarityBorderThickness();
        graphics.lineStyle(borderThickness, 0xffffff, 0.8);
        graphics.strokeCircle(0, 0, size);
        
        // Convert graphics to texture
        graphics.generateTexture('advanced_powerup', size * 2, size * 2);
        graphics.destroy();

        // Set the texture
        this.setTexture('advanced_powerup');

        // Create glow effect
        this.glow = this.scene.add.graphics();
        this.glow.fillStyle(this.config.color, 0.3);
        this.glow.fillCircle(0, 0, size + 8);
        this.glow.setPosition(this.x, this.y);

        // Add emoji text
        const emojiText = this.scene.add.text(0, 0, this.config.emoji, {
            fontSize: '24px'
        }).setOrigin(0.5);
        emojiText.setPosition(this.x, this.y);

        // Add to scene
        this.scene.add.existing(this);
    }

    private getRaritySize(): number {
        switch (this.config.rarity) {
            case 'common': return 16;
            case 'rare': return 20;
            case 'epic': return 24;
            case 'legendary': return 28;
            default: return 16;
        }
    }

    private getRarityBorderThickness(): number {
        switch (this.config.rarity) {
            case 'common': return 2;
            case 'rare': return 3;
            case 'epic': return 4;
            case 'legendary': return 5;
            default: return 2;
        }
    }

    private setupPhysics() {
        // Enable physics
        this.scene.physics.add.existing(this);
        
        // Set body size based on rarity
        const size = this.getRaritySize();
        this.body.setSize(size * 1.5, size * 1.5);
        this.body.setOffset(-size * 0.75, -size * 0.75);
    }

    private startAnimations() {
        const size = this.getRaritySize();
        
        // Floating animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 15,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulse animation for glow
        this.pulseTween = this.scene.tweens.add({
            targets: this.glow,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotation animation
        this.rotationTween = this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });

        // Rarity-specific animations
        this.addRarityAnimations();
    }

    private addRarityAnimations(): void {
        switch (this.config.rarity) {
            case 'rare':
                this.addRareAnimations();
                break;
            case 'epic':
                this.addEpicAnimations();
                break;
            case 'legendary':
                this.addLegendaryAnimations();
                break;
        }
    }

    private addRareAnimations(): void {
        // Color cycling for rare items
        this.scene.tweens.add({
            targets: this,
            tint: 0x00ff00,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private addEpicAnimations(): void {
        // Rainbow effect for epic items
        this.scene.tweens.add({
            targets: this,
            tint: 0xff00ff,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Scale pulsing
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private addLegendaryAnimations(): void {
        // Golden glow effect
        this.scene.tweens.add({
            targets: this,
            tint: 0xffff00,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Intense scaling
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createRarityEffects(): void {
        if (this.config.rarity === 'epic' || this.config.rarity === 'legendary') {
            this.rarityParticles = this.scene.add.particles('particle');
            
            const particleColor = this.config.rarity === 'legendary' ? 0xffff00 : 0xff00ff;
            
            this.rarityEmitter = this.rarityParticles.createEmitter({
                x: this.x,
                y: this.y,
                speed: { min: 20, max: 40 },
                scale: { start: 0.3, end: 0 },
                alpha: { start: 0.8, end: 0 },
                tint: particleColor,
                lifespan: 1000,
                quantity: 2,
                frequency: 200
            });
        }
    }

    collect(): PowerUpEffect {
        if (this.collected) {
            return this.createEffect();
        }

        this.collected = true;

        // Stop animations
        if (this.pulseTween) {
            this.pulseTween.stop();
        }
        if (this.rotationTween) {
            this.rotationTween.stop();
        }

        // Collection animation
        this.scene.tweens.add({
            targets: [this, this.glow],
            scaleX: 1.8,
            scaleY: 1.8,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });

        // Play collection sound based on rarity
        this.playCollectionSound();

        // Create collection particles
        this.createCollectionParticles();

        // Emit collection event
        this.scene.events.emit('powerUpCollected', {
            type: this.config.type,
            rarity: this.config.rarity,
            effect: this.createEffect()
        });

        return this.createEffect();
    }

    private createEffect(): PowerUpEffect {
        return {
            type: this.config.type,
            value: this.config.value,
            duration: this.config.duration,
            startTime: Date.now(),
            isActive: true
        };
    }

    private playCollectionSound(): void {
        const soundMap: Record<string, string> = {
            'common': 'powerup_collect',
            'rare': 'powerup_rare',
            'epic': 'powerup_epic',
            'legendary': 'powerup_legendary'
        };

        const soundKey = soundMap[this.config.rarity] || 'powerup_collect';
        this.scene.sound.play(soundKey, { volume: 0.6 });
    }

    private createCollectionParticles() {
        const particles = this.scene.add.particles('particle');
        
        const emitter = particles.createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: 80, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: this.config.color,
            lifespan: 800,
            quantity: 15
        });

        // Stop emitting after a short time
        this.scene.time.delayedCall(100, () => {
            emitter.stop();
            this.scene.time.delayedCall(800, () => {
                particles.destroy();
            });
        });
    }

    isCollected(): boolean {
        return this.collected;
    }

    getType(): AdvancedPowerUpType {
        return this.config.type;
    }

    getConfig(): AdvancedPowerUpConfig {
        return { ...this.config };
    }

    getRarity(): string {
        return this.config.rarity;
    }

    destroy() {
        if (this.pulseTween) {
            this.pulseTween.stop();
        }
        if (this.rotationTween) {
            this.rotationTween.stop();
        }
        if (this.glow) {
            this.glow.destroy();
        }
        if (this.rarityParticles) {
            this.rarityParticles.destroy();
        }
        super.destroy();
    }

    update() {
        // Update glow position to follow power-up
        if (this.glow && this.active) {
            this.glow.setPosition(this.x, this.y);
        }

        // Update particle emitter position
        if (this.rarityEmitter && this.active) {
            this.rarityEmitter.setPosition(this.x, this.y);
        }
    }
}

export class AdvancedPowerUpManager {
    private powerUps: AdvancedPowerUp[] = [];
    private scene: Scene;
    private spawnTimer: number = 0;
    private spawnInterval: number = 8000; // 8 seconds
    private maxPowerUps: number = 3;
    private rarityWeights: Map<string, number> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
        this.initializeRarityWeights();
    }

    private initializeRarityWeights(): void {
        this.rarityWeights.set('common', 0.6);   // 60%
        this.rarityWeights.set('rare', 0.25);    // 25%
        this.rarityWeights.set('epic', 0.12);    // 12%
        this.rarityWeights.set('legendary', 0.03); // 3%
    }

    public update(time: number, delta: number): void {
        this.spawnTimer += delta;

        if (this.spawnTimer >= this.spawnInterval && this.powerUps.length < this.maxPowerUps) {
            this.spawnRandomPowerUp();
            this.spawnTimer = 0;
        }

        // Update existing power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.update();
        });

        // Clean up collected power-ups
        this.cleanupCollectedPowerUps();
    }

    private spawnRandomPowerUp(): void {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        
        const type = this.selectRandomPowerUpType();
        const powerUp = new AdvancedPowerUp(this.scene, x, y, type);
        
        this.powerUps.push(powerUp);
    }

    private selectRandomPowerUpType(): AdvancedPowerUpType {
        const types: AdvancedPowerUpType[] = [
            'health', 'energy', 'shield',
            'speed_boost', 'damage_boost', 'invincibility',
            'time_slow', 'multi_shot', 'explosive_rounds',
            'healing_aura', 'damage_aura', 'magnetic_field',
            'ultimate_weapon', 'combo_extender', 'lucky_charm'
        ];

        // Weight selection based on rarity
        const rarity = this.selectRarityByWeight();
        const rarityTypes = types.filter(type => {
            const config = AdvancedPowerUp.getConfig(type);
            return config.rarity === rarity;
        });

        return rarityTypes[Math.floor(Math.random() * rarityTypes.length)];
    }

    private selectRarityByWeight(): string {
        const random = Math.random();
        let cumulative = 0;

        for (const [rarity, weight] of this.rarityWeights) {
            cumulative += weight;
            if (random <= cumulative) {
                return rarity;
            }
        }

        return 'common'; // Fallback
    }

    private cleanupCollectedPowerUps(): void {
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isCollected());
    }

    public getPowerUps(): AdvancedPowerUp[] {
        return [...this.powerUps];
    }

    public clearPowerUps(): void {
        this.powerUps.forEach(powerUp => powerUp.destroy());
        this.powerUps = [];
    }

    public destroy(): void {
        this.clearPowerUps();
    }
} 