import { Scene, GameObjects, Physics } from 'phaser';

export interface HazardConfig {
    id: string;
    type: 'spike' | 'laser' | 'poison' | 'electric' | 'fire' | 'ice' | 'wind';
    x: number;
    y: number;
    width?: number;
    height?: number;
    damage: number;
    duration: number;
    cooldown: number;
    isActive: boolean;
    pattern?: 'static' | 'moving' | 'rotating' | 'pulsing';
    direction?: 'horizontal' | 'vertical' | 'circular';
    speed?: number;
}

export interface HazardEffect {
    type: string;
    damage: number;
    duration: number;
    effect: 'damage' | 'slow' | 'burn' | 'freeze' | 'poison' | 'stun';
}

export class EnvironmentalHazard extends Physics.Arcade.Sprite {
    private config: HazardConfig;
    private graphics!: GameObjects.Graphics;
    private isActive: boolean = true;
    private lastActivation: number = 0;
    private activationTimer: number = 0;
    private effectTimer: number = 0;
    private patternTimer: number = 0;
    private originalPosition: { x: number; y: number };
    private currentEffect?: HazardEffect;

    constructor(scene: Scene, config: HazardConfig) {
        super(scene, config.x, config.y, 'hazard');
        this.config = config;
        this.originalPosition = { x: config.x, y: config.y };
        
        this.setupHazard();
        this.createVisualEffect();
    }

    private setupHazard(): void {
        // Enable physics
        this.scene.physics.add.existing(this);
        
        // Set collision body based on type
        this.setupCollisionBody();
        
        // Add to scene
        this.scene.add.existing(this);
    }

    private setupCollisionBody(): void {
        const width = this.config.width || 32;
        const height = this.config.height || 32;
        
        if (this.body) {
            this.body.setSize(width, height);
            this.body.setOffset(-width / 2, -height / 2);
            
            // Make it immovable
            this.body.immovable = true;
        }
    }

    private createVisualEffect(): void {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(5);
        
        this.updateVisualEffect();
    }

    private updateVisualEffect(): void {
        this.graphics.clear();
        
        if (!this.isActive) return;

        const width = this.config.width || 32;
        const height = this.config.height || 32;
        
        switch (this.config.type) {
            case 'spike':
                this.drawSpikeEffect(width, height);
                break;
            case 'laser':
                this.drawLaserEffect(width, height);
                break;
            case 'poison':
                this.drawPoisonEffect(width, height);
                break;
            case 'electric':
                this.drawElectricEffect(width, height);
                break;
            case 'fire':
                this.drawFireEffect(width, height);
                break;
            case 'ice':
                this.drawIceEffect(width, height);
                break;
            case 'wind':
                this.drawWindEffect(width, height);
                break;
        }
    }

    private drawSpikeEffect(width: number, height: number): void {
        const color = 0x666666;
        const activeColor = 0xff0000;
        
        this.graphics.fillStyle(this.isActive ? activeColor : color);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw spikes
        this.graphics.fillStyle(0x333333);
        for (let i = 0; i < 3; i++) {
            const x = -width / 2 + (i + 1) * width / 4;
            this.graphics.fillTriangle(x - 5, -height / 2, x + 5, -height / 2, x, -height / 2 - 10);
        }
    }

    private drawLaserEffect(width: number, height: number): void {
        const alpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        this.graphics.fillStyle(0xff0000, alpha);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw laser beam
        this.graphics.lineStyle(3, 0xff0000, 0.8);
        this.graphics.beginPath();
        this.graphics.moveTo(-width / 2, 0);
        this.graphics.lineTo(width / 2, 0);
        this.graphics.strokePath();
    }

    private drawPoisonEffect(width: number, height: number): void {
        const alpha = 0.4 + Math.sin(Date.now() * 0.005) * 0.2;
        this.graphics.fillStyle(0x00ff00, alpha);
        this.graphics.fillCircle(0, 0, width / 2);
        
        // Draw poison bubbles
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + Date.now() * 0.001;
            const radius = width / 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            this.graphics.fillStyle(0x00aa00, 0.6);
            this.graphics.fillCircle(x, y, 4);
        }
    }

    private drawElectricEffect(width: number, height: number): void {
        const alpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
        this.graphics.fillStyle(0x00ffff, alpha);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw lightning bolts
        this.graphics.lineStyle(2, 0x00ffff, 0.8);
        for (let i = 0; i < 3; i++) {
            this.drawLightningBolt(-width / 2, -height / 2, width / 2, height / 2);
        }
    }

    private drawLightningBolt(x1: number, y1: number, x2: number, y2: number): void {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        
        const segments = 5;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 20;
            const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 20;
            this.graphics.lineTo(x, y);
        }
        
        this.graphics.strokePath();
    }

    private drawFireEffect(width: number, height: number): void {
        const alpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.2;
        this.graphics.fillStyle(0xff6600, alpha);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw flames
        for (let i = 0; i < 3; i++) {
            const x = -width / 2 + (i + 1) * width / 4;
            const height = 15 + Math.sin(Date.now() * 0.01 + i) * 5;
            this.graphics.fillStyle(0xffaa00, 0.8);
            this.graphics.fillTriangle(x - 3, -height / 2, x + 3, -height / 2, x, -height / 2 - height);
        }
    }

    private drawIceEffect(width: number, height: number): void {
        const alpha = 0.4 + Math.sin(Date.now() * 0.005) * 0.1;
        this.graphics.fillStyle(0x00aaff, alpha);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw ice crystals
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const x = Math.cos(angle) * width / 3;
            const y = Math.sin(angle) * height / 3;
            this.graphics.fillStyle(0xffffff, 0.6);
            this.graphics.fillTriangle(x - 2, y, x + 2, y, x, y - 8);
        }
    }

    private drawWindEffect(width: number, height: number): void {
        const alpha = 0.3 + Math.sin(Date.now() * 0.008) * 0.2;
        this.graphics.fillStyle(0xcccccc, alpha);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);
        
        // Draw wind particles
        for (let i = 0; i < 8; i++) {
            const x = -width / 2 + Math.random() * width;
            const y = -height / 2 + Math.random() * height;
            this.graphics.fillStyle(0xffffff, 0.5);
            this.graphics.fillCircle(x, y, 2);
        }
    }

    public update(time: number, delta: number): void {
        this.updatePattern(delta);
        this.updateActivation(time);
        this.updateVisualEffect();
    }

    private updatePattern(delta: number): void {
        if (!this.config.pattern || !this.config.speed) return;

        this.patternTimer += delta;

        switch (this.config.pattern) {
            case 'moving':
                this.updateMovingPattern(delta);
                break;
            case 'rotating':
                this.updateRotatingPattern(delta);
                break;
            case 'pulsing':
                this.updatePulsingPattern(delta);
                break;
        }
    }

    private updateMovingPattern(delta: number): void {
        const speed = this.config.speed || 50;
        const direction = this.config.direction || 'horizontal';
        
        if (direction === 'horizontal') {
            const newX = this.x + Math.sin(this.patternTimer * 0.001) * speed;
            this.setPosition(newX, this.y);
        } else if (direction === 'vertical') {
            const newY = this.y + Math.sin(this.patternTimer * 0.001) * speed;
            this.setPosition(this.x, newY);
        } else if (direction === 'circular') {
            const radius = 50;
            const newX = this.originalPosition.x + Math.cos(this.patternTimer * 0.001) * radius;
            const newY = this.originalPosition.y + Math.sin(this.patternTimer * 0.001) * radius;
            this.setPosition(newX, newY);
        }
    }

    private updateRotatingPattern(delta: number): void {
        const rotationSpeed = (this.config.speed || 1) * 0.001;
        this.setRotation(this.rotation + rotationSpeed * delta);
    }

    private updatePulsingPattern(delta: number): void {
        const scale = 1 + Math.sin(this.patternTimer * 0.005) * 0.2;
        this.setScale(scale);
    }

    private updateActivation(time: number): void {
        if (this.config.cooldown > 0) {
            if (time - this.lastActivation >= this.config.cooldown) {
                this.activate();
                this.lastActivation = time;
            } else if (time - this.lastActivation >= this.config.duration) {
                this.deactivate();
            }
        }
    }

    public activate(): void {
        this.isActive = true;
        this.updateVisualEffect();
    }

    public deactivate(): void {
        this.isActive = false;
        this.updateVisualEffect();
    }

    public isHazardActive(): boolean {
        return this.isActive;
    }

    public getHazardEffect(): HazardEffect | null {
        if (!this.isActive) return null;

        switch (this.config.type) {
            case 'spike':
                return { type: 'spike', damage: this.config.damage, duration: 0, effect: 'damage' };
            case 'laser':
                return { type: 'laser', damage: this.config.damage, duration: 0, effect: 'damage' };
            case 'poison':
                return { type: 'poison', damage: this.config.damage, duration: 5000, effect: 'poison' };
            case 'electric':
                return { type: 'electric', damage: this.config.damage, duration: 2000, effect: 'stun' };
            case 'fire':
                return { type: 'fire', damage: this.config.damage, duration: 3000, effect: 'burn' };
            case 'ice':
                return { type: 'ice', damage: this.config.damage, duration: 4000, effect: 'freeze' };
            case 'wind':
                return { type: 'wind', damage: 0, duration: 2000, effect: 'slow' };
            default:
                return null;
        }
    }

    public getConfig(): HazardConfig {
        return { ...this.config };
    }

    public destroy(): void {
        if (this.graphics) {
            this.graphics.destroy();
        }
        super.destroy();
    }
}

export class HazardManager {
    private hazards: EnvironmentalHazard[] = [];
    private scene: Scene;
    private hazardTypes: Map<string, HazardConfig> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
        this.initializeHazardTypes();
    }

    private initializeHazardTypes(): void {
        this.hazardTypes.set('spike_trap', {
            id: 'spike_trap',
            type: 'spike',
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            damage: 20,
            duration: 1000,
            cooldown: 3000,
            isActive: true,
            pattern: 'static'
        });

        this.hazardTypes.set('laser_trap', {
            id: 'laser_trap',
            type: 'laser',
            x: 0,
            y: 0,
            width: 64,
            height: 8,
            damage: 15,
            duration: 2000,
            cooldown: 4000,
            isActive: true,
            pattern: 'moving',
            direction: 'horizontal',
            speed: 30
        });

        this.hazardTypes.set('poison_pool', {
            id: 'poison_pool',
            type: 'poison',
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            damage: 5,
            duration: 5000,
            cooldown: 0,
            isActive: true,
            pattern: 'static'
        });

        this.hazardTypes.set('electric_field', {
            id: 'electric_field',
            type: 'electric',
            x: 0,
            y: 0,
            width: 64,
            height: 64,
            damage: 25,
            duration: 1000,
            cooldown: 5000,
            isActive: true,
            pattern: 'pulsing'
        });

        this.hazardTypes.set('fire_trap', {
            id: 'fire_trap',
            type: 'fire',
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            damage: 30,
            duration: 1500,
            cooldown: 6000,
            isActive: true,
            pattern: 'pulsing'
        });

        this.hazardTypes.set('ice_trap', {
            id: 'ice_trap',
            type: 'ice',
            x: 0,
            y: 0,
            width: 56,
            height: 56,
            damage: 10,
            duration: 3000,
            cooldown: 8000,
            isActive: true,
            pattern: 'static'
        });

        this.hazardTypes.set('wind_tunnel', {
            id: 'wind_tunnel',
            type: 'wind',
            x: 0,
            y: 0,
            width: 80,
            height: 24,
            damage: 0,
            duration: 2000,
            cooldown: 0,
            isActive: true,
            pattern: 'moving',
            direction: 'horizontal',
            speed: 20
        });
    }

    public createHazard(type: string, x: number, y: number, customConfig?: Partial<HazardConfig>): EnvironmentalHazard | null {
        const baseConfig = this.hazardTypes.get(type);
        if (!baseConfig) return null;

        const config: HazardConfig = {
            ...baseConfig,
            x,
            y,
            ...customConfig
        };

        const hazard = new EnvironmentalHazard(this.scene, config);
        this.hazards.push(hazard);
        
        return hazard;
    }

    public createRandomHazard(x: number, y: number): EnvironmentalHazard | null {
        const types = Array.from(this.hazardTypes.keys());
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        return this.createHazard(randomType, x, y);
    }

    public update(time: number, delta: number): void {
        this.hazards.forEach(hazard => {
            hazard.update(time, delta);
        });
    }

    public getHazards(): EnvironmentalHazard[] {
        return [...this.hazards];
    }

    public getActiveHazards(): EnvironmentalHazard[] {
        return this.hazards.filter(hazard => hazard.isHazardActive());
    }

    public clearHazards(): void {
        this.hazards.forEach(hazard => hazard.destroy());
        this.hazards = [];
    }

    public destroy(): void {
        this.clearHazards();
    }
} 