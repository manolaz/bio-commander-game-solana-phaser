import { EnemyType, EnemyStats } from '@/systems/EnemyManager';

export interface EnemyConfig {
    x: number;
    y: number;
    type: EnemyType;
}

export class EnemyEntity {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public type: EnemyType;
    public stats: EnemyStats;
    public isAlive: boolean = true;
    public lastAttackTime: number = 0;
    public attackCooldown: number = 1000; // 1 second
    public isAttacking: boolean = false;
    public direction: number = 1; // 1 for right, -1 for left
    public patrolTimer: number = 0;
    public patrolDuration: number = 2000; // 2 seconds
    public healthBar?: Phaser.GameObjects.Graphics;
    public damageGlow?: Phaser.GameObjects.Graphics;
    public scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, config: EnemyConfig) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(config.x, config.y, config.type.spriteKey);
        this.type = config.type;
        this.stats = { ...config.type.stats };
        
        this.setupSprite();
        this.setupAnimations(scene);
        this.createVisualEffects();
    }

    private setupSprite(): void {
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.1);
        this.sprite.setGravityY(300);
        
        // Set different colors for different enemy types
        switch (this.type.id) {
            case 'bacteria':
                this.sprite.setTint(0x00ff00); // Green
                break;
            case 'fungi':
                this.sprite.setTint(0xff8800); // Orange
                break;
            case 'virus':
                this.sprite.setTint(0xff0000); // Red
                break;
        }
    }

    private setupAnimations(scene: Phaser.Scene): void {
        // Create enemy animations
        scene.anims.create({
            key: 'enemy_idle',
            frames: scene.anims.generateFrameNumbers('dude', { start: 4, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemy_walk',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemy_attack',
            frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'enemy_hurt',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0
        });

        scene.anims.create({
            key: 'enemy_death',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        // Start with idle animation
        this.sprite.play('enemy_idle');
    }

    private createVisualEffects(): void {
        // Create health bar
        this.healthBar = this.scene.add.graphics();
        this.healthBar.setDepth(10);
        
        // Create damage glow effect
        this.damageGlow = this.scene.add.graphics();
        this.damageGlow.setDepth(1);
    }

    protected updateHealthBar(): void {
        if (!this.healthBar) return;

        this.healthBar.clear();
        
        const barWidth = 32;
        const barHeight = 6;
        const x = this.sprite.x - barWidth / 2;
        const y = this.sprite.y - 20;

        // Background
        this.healthBar.fillStyle(0x000000, 0.4);
        this.healthBar.fillRoundedRect(x, y, barWidth, barHeight, 4);

        // Health bar
        const healthPercentage = this.getHealthPercentage();
        const healthWidth = (barWidth * healthPercentage) / 100;
        
        let healthColor = 0x27ae60; // Green
        if (healthPercentage < 50) healthColor = 0xf39c12; // Yellow
        if (healthPercentage < 25) healthColor = 0xe74c3c; // Red

        this.healthBar.fillStyle(healthColor, 1);
        this.healthBar.fillRoundedRect(x, y, healthWidth, barHeight, 4);

        // Border
        this.healthBar.lineStyle(1, 0xffffff, 0.6);
        this.healthBar.strokeRoundedRect(x, y, barWidth, barHeight, 4);
    }

    private updateDamageGlow(): void {
        if (!this.damageGlow) return;

        this.damageGlow.clear();
        
        // Only show damage glow if health is less than max
        if (this.stats.health < this.stats.maxHealth) {
            const x = this.sprite.x;
            const y = this.sprite.y;
            const size = 24; // ENEMY_SIZE equivalent
            
            // Get enemy color based on type
            let glowColor = 0x00ff00; // Default green
            switch (this.type.id) {
                case 'bacteria':
                    glowColor = 0x00ff00;
                    break;
                case 'fungi':
                    glowColor = 0xff8800;
                    break;
                case 'virus':
                    glowColor = 0xff0000;
                    break;
            }
            
            this.damageGlow.fillStyle(glowColor, 0.3);
            this.damageGlow.fillCircle(x, y, size + 4);
        }
    }

    public update(time: number, delta: number): void {
        if (!this.isAlive) return;

        this.updateHealthBar();
        this.updateDamageGlow();
        this.updatePatrolBehavior(delta);
    }

    protected updatePatrolBehavior(delta: number): void {
        if (this.type.behavior !== 'patrol') return;

        this.patrolTimer += delta;
        
        if (this.patrolTimer >= this.patrolDuration) {
            this.direction *= -1; // Change direction
            this.patrolTimer = 0;
        }

        const speed = this.stats.speed * 0.5;
        this.sprite.setVelocityX(speed * this.direction);
        
        if (this.sprite.body && this.sprite.body.velocity.x !== 0) {
            this.sprite.play('enemy_walk', true);
            this.sprite.setFlipX(this.direction < 0);
        } else {
            this.sprite.play('enemy_idle', true);
        }
    }

    public takeDamage(damage: number): boolean {
        if (!this.isAlive) return false;

        this.stats.health = Math.max(0, this.stats.health - damage);
        this.isAlive = this.stats.health > 0;

        if (this.isAlive) {
            this.playHurtAnimation();
        } else {
            this.playDeathAnimation();
        }

        return this.isAlive;
    }

    private playHurtAnimation(): void {
        this.sprite.play('enemy_hurt', true);
        this.sprite.once('animationcomplete', () => {
            this.sprite.play('enemy_idle', true);
        });
    }

    private playDeathAnimation(): void {
        this.sprite.play('enemy_death', true);
        this.sprite.once('animationcomplete', () => {
            this.destroy();
        });
    }

    public canAttack(): boolean {
        return Date.now() - this.lastAttackTime > this.attackCooldown;
    }

    public performAttack(): void {
        if (!this.canAttack()) return;

        this.lastAttackTime = Date.now();
        this.isAttacking = true;

        this.sprite.play('enemy_attack', true);
        this.sprite.once('animationcomplete', () => {
            this.isAttacking = false;
            this.sprite.play('enemy_idle', true);
        });
    }

    public moveTowards(targetX: number, targetY: number, speed: number): void {
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, targetX, targetY);
        this.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        if (
            this.sprite.body &&
            (this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0)
        ) {
            this.sprite.play('enemy_walk', true);
            this.sprite.setFlipX(this.sprite.body.velocity.x < 0);
        }
    }

    public stopMoving(): void {
        this.sprite.setVelocity(0, 0);
        this.sprite.play('enemy_idle', true);
    }

    public getHealthPercentage(): number {
        return (this.stats.health / this.stats.maxHealth) * 100;
    }

    public getDistanceTo(target: Phaser.Physics.Arcade.Sprite): number {
        return Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            target.x, target.y
        );
    }

    public isInAttackRange(target: Phaser.Physics.Arcade.Sprite, range: number = 50): boolean {
        return this.getDistanceTo(target) <= range;
    }

    public destroy(): void {
        if (this.healthBar) {
            this.healthBar.destroy();
        }
        if (this.damageGlow) {
            this.damageGlow.destroy();
        }
        this.sprite.destroy();
    }

    public getPoints(): number {
        return this.stats.points;
    }

    public getDamage(): number {
        return this.stats.damage;
    }
} 