import { Scene } from 'phaser';

export interface ZoneRewards {
    experience: number;
    powerUps: string[];
    unlockedZones: string[];
    specialReward?: string;
}

export class ZoneCompleteScene extends Scene {
    private zone: string = 'heart';
    private discoveredTiles: number = 0;
    private totalTiles: number = 0;
    private rewards!: ZoneRewards;
    private background!: Phaser.GameObjects.Graphics;
    private container!: Phaser.GameObjects.Container;
    private continueButton!: Phaser.GameObjects.Container;

    constructor() {
        super('ZoneCompleteScene');
    }

    init(data: { zone: string; discoveredTiles: number; totalTiles: number }) {
        this.zone = data.zone;
        this.discoveredTiles = data.discoveredTiles;
        this.totalTiles = data.totalTiles;
        this.calculateRewards();
    }

    create() {
        this.setupBackground();
        this.setupUI();
        this.setupAnimations();
        this.setupInput();
    }

    private setupBackground(): void {
        // Create gradient background
        this.background = this.add.graphics();
        this.background.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x8e44ad, 0x8e44ad, 1);
        this.background.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Add particle effects
        this.createParticleEffects();
    }

    private createParticleEffects(): void {
        const particles = this.add.particles(this.cameras.main.centerX, this.cameras.main.centerY, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.7, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: 0x667eea,
            lifespan: 1200,
            quantity: 20
        });
    }

    private setupUI(): void {
        this.container = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);

        // Zone completion title
        const title = this.add.text(0, -200, 'ZONE COMPLETE!', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(title);

        // Zone name
        const zoneName = this.add.text(0, -140, `${this.getZoneEmoji()} ${this.zone.toUpperCase()} ZONE`, {
            fontSize: '32px',
            color: '#4a90e2',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(zoneName);

        // Exploration stats
        const explorationPercent = Math.round((this.discoveredTiles / this.totalTiles) * 100);
        const statsText = this.add.text(0, -80, `Exploration: ${explorationPercent}% (${this.discoveredTiles}/${this.totalTiles} tiles)`, {
            fontSize: '20px',
            color: '#cccccc'
        }).setOrigin(0.5);
        this.container.add(statsText);

        // Rewards section
        this.createRewardsSection();

        // Continue button
        this.createContinueButton();
    }

    private createRewardsSection(): void {
        const rewardsTitle = this.add.text(0, 0, 'REWARDS EARNED', {
            fontSize: '24px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(rewardsTitle);

        // Experience reward
        const expText = this.add.text(0, 40, `Experience: +${this.rewards.experience} XP`, {
            fontSize: '18px',
            color: '#00ff00'
        }).setOrigin(0.5);
        this.container.add(expText);

        // Power-ups earned
        if (this.rewards.powerUps.length > 0) {
            const powerUpText = this.add.text(0, 70, `Power-ups: ${this.rewards.powerUps.join(', ')}`, {
                fontSize: '18px',
                color: '#ff8800'
            }).setOrigin(0.5);
            this.container.add(powerUpText);
        }

        // Unlocked zones
        if (this.rewards.unlockedZones.length > 0) {
            const unlockText = this.add.text(0, 100, `Unlocked: ${this.rewards.unlockedZones.join(', ')}`, {
                fontSize: '18px',
                color: '#4a90e2'
            }).setOrigin(0.5);
            this.container.add(unlockText);
        }

        // Special reward
        if (this.rewards.specialReward) {
            const specialText = this.add.text(0, 130, `Special: ${this.rewards.specialReward}`, {
                fontSize: '18px',
                color: '#ff00ff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.container.add(specialText);
        }
    }

    private createContinueButton(): void {
        this.continueButton = this.add.container(0, 200);

        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x4a90e2, 0.8);
        buttonBg.fillRoundedRect(-100, -25, 200, 50, 10);
        buttonBg.lineStyle(3, 0xffffff, 0.8);
        buttonBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        this.continueButton.add(buttonBg);

        // Button text
        const buttonText = this.add.text(0, 0, 'Continue to Next Zone', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.continueButton.add(buttonText);

        // Make button interactive
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        
        buttonBg.on('pointerdown', () => {
            this.continueToNextZone();
        });

        buttonBg.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x5ba0f2, 0.9);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 10);
            buttonBg.lineStyle(3, 0xffffff, 1);
            buttonBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        });

        buttonBg.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x4a90e2, 0.8);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 10);
            buttonBg.lineStyle(3, 0xffffff, 0.8);
            buttonBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        });

        this.container.add(this.continueButton);
    }

    private setupAnimations(): void {
        // Animate container entrance
        this.container.setScale(0);
        this.tweens.add({
            targets: this.container,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        // Animate title
        const title = this.container.getAt(0) as Phaser.GameObjects.Text;
        this.tweens.add({
            targets: title,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private setupInput(): void {
        // Handle enter and space key
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-ENTER', () => {
                this.continueToNextZone();
            });

            this.input.keyboard.on('keydown-SPACE', () => {
                this.continueToNextZone();
            });
        }
    }

    private calculateRewards(): void {
        const explorationPercent = (this.discoveredTiles / this.totalTiles) * 100;
        
        this.rewards = {
            experience: Math.round(100 + (explorationPercent * 2)),
            powerUps: this.getRandomPowerUps(),
            unlockedZones: this.getUnlockedZones(),
            specialReward: explorationPercent >= 90 ? this.getSpecialReward() : undefined
        };
    }

    private getRandomPowerUps(): string[] {
        const allPowerUps = ['health', 'energy', 'shield', 'speed_boost', 'damage_boost'];
        const numPowerUps = Math.floor(Math.random() * 3) + 1; // 1-3 power-ups
        const selected: string[] = [];
        
        for (let i = 0; i < numPowerUps; i++) {
            const powerUp = allPowerUps[Math.floor(Math.random() * allPowerUps.length)];
            if (!selected.includes(powerUp)) {
                selected.push(powerUp);
            }
        }
        
        return selected;
    }

    private getUnlockedZones(): string[] {
        const zoneProgression: Record<string, string[]> = {
            'heart': ['lungs'],
            'lungs': ['brain'],
            'brain': ['liver'],
            'liver': ['stomach'],
            'stomach': ['kidneys'],
            'kidneys': []
        };
        
        return zoneProgression[this.zone] || [];
    }

    private getSpecialReward(): string {
        const specialRewards = [
            'Ultimate Weapon',
            'Invincibility Shield',
            'Time Slow Ability',
            'Multi-Shot Power',
            'Healing Aura'
        ];
        
        return specialRewards[Math.floor(Math.random() * specialRewards.length)];
    }

    private getZoneEmoji(): string {
        const zoneEmojis: Record<string, string> = {
            'heart': '❤️',
            'lungs': '🫁',
            'brain': '🧠',
            'liver': '🫀',
            'stomach': '🫃',
            'kidneys': '🫁'
        };
        return zoneEmojis[this.zone] || '🏥';
    }

    private continueToNextZone(): void {
        // Save progress
        this.saveProgress();
        
        // Return to world navigation
        this.scene.stop();
        this.scene.resume('WorldNavigationScene');
    }

    private saveProgress(): void {
        // Save zone completion
        const savedProgress = localStorage.getItem('bioCommanderProgress') || '{}';
        const progress = JSON.parse(savedProgress);
        
        progress.completedZones = progress.completedZones || {};
        progress.completedZones[this.zone] = {
            completed: true,
            explorationPercent: Math.round((this.discoveredTiles / this.totalTiles) * 100),
            discoveredTiles: this.discoveredTiles,
            totalTiles: this.totalTiles,
            rewards: this.rewards,
            completedAt: new Date().toISOString()
        };
        
        // Save unlocked zones
        progress.unlockedZones = progress.unlockedZones || ['heart'];
        this.rewards.unlockedZones.forEach(zone => {
            if (!progress.unlockedZones.includes(zone)) {
                progress.unlockedZones.push(zone);
            }
        });
        
        // Save total experience
        progress.totalExperience = (progress.totalExperience || 0) + this.rewards.experience;
        
        localStorage.setItem('bioCommanderProgress', JSON.stringify(progress));
    }

    update(time: number, delta: number) {
        // Scene doesn't need continuous updates
    }
} 