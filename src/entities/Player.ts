import { CombatSystem, CombatStats } from '@/systems/CombatSystem';

export interface PlayerConfig {
    x: number;
    y: number;
    spriteKey: string;
    stats?: Partial<CombatStats>;
}

export class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public combatSystem: CombatSystem;
    public isAttacking: boolean = false;
    public isInvulnerable: boolean = false;
    public lastAttackTime: number = 0;
    public attackCooldown: number = 500; // 500ms between attacks
    public invulnerabilityDuration: number = 1000; // 1 second of invulnerability after taking damage
    public lastDamageTime: number = 0;
    public isShieldActive: boolean = false;
    public shieldDuration: number = 3000; // 3 seconds
    public shieldStartTime: number = 0;

    constructor(scene: Phaser.Scene, config: PlayerConfig) {
        this.sprite = scene.physics.add.sprite(config.x, config.y, config.spriteKey);
        this.combatSystem = new CombatSystem(config.stats);
        
        this.setupSprite();
        this.setupAnimations(scene);
    }

    private setupSprite(): void {
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.2);
        this.sprite.setGravityY(300);
    }

    private setupAnimations(scene: Phaser.Scene): void {
        // Create player animations
        scene.anims.create({
            key: 'player_idle',
            frames: scene.anims.generateFrameNumbers('dude', { start: 4, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_walk',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_attack',
            frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 15,
            repeat: 0
        });

        scene.anims.create({
            key: 'player_hurt',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: 0
        });

        // Start with idle animation
        this.sprite.play('player_idle');
    }

    public update(time: number, delta: number): void {
        this.updateInvulnerability();
        this.updateShield();
        this.updateEnergyRegeneration(delta);
    }

    private updateInvulnerability(): void {
        if (this.isInvulnerable && Date.now() - this.lastDamageTime > this.invulnerabilityDuration) {
            this.isInvulnerable = false;
            this.sprite.setAlpha(1);
        }
    }

    private updateShield(): void {
        if (this.isShieldActive && Date.now() - this.shieldStartTime > this.shieldDuration) {
            this.deactivateShield();
        }
    }

    private updateEnergyRegeneration(delta: number): void {
        // Regenerate energy over time
        const energyRegenRate = 0.5; // energy per second
        const energyToAdd = (energyRegenRate * delta) / 1000;
        this.combatSystem.restoreEnergy(energyToAdd);
    }

    public move(direction: 'left' | 'right' | 'stop'): void {
        const speed = 160;
        
        switch (direction) {
            case 'left':
                this.sprite.setVelocityX(-speed);
                this.sprite.play('player_walk', true);
                this.sprite.setFlipX(true);
                break;
            case 'right':
                this.sprite.setVelocityX(speed);
                this.sprite.play('player_walk', true);
                this.sprite.setFlipX(false);
                break;
            case 'stop':
                this.sprite.setVelocityX(0);
                this.sprite.play('player_idle', true);
                break;
        }
    }

    public jump(): void {
        if (this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-400);
        }
    }

    public attack(): boolean {
        const currentTime = Date.now();
        
        if (this.isAttacking || currentTime - this.lastAttackTime < this.attackCooldown) {
            return false;
        }

        this.isAttacking = true;
        this.lastAttackTime = currentTime;

        // Play attack animation
        this.sprite.play('player_attack', true);

        // Reset attack state when animation completes
        this.sprite.once('animationcomplete', () => {
            this.isAttacking = false;
            this.sprite.play('player_idle', true);
        });

        return true;
    }

    public performBasicAttack(): number | null {
        if (!this.attack()) {
            return null;
        }

        return this.combatSystem.performBasicAttack();
    }

    public performSpecialAttack(): number | null {
        if (!this.attack()) {
            return null;
        }

        return this.combatSystem.performSpecialAttack();
    }

    public takeDamage(damage: number): boolean {
        if (this.isInvulnerable || this.isShieldActive) {
            return true; // Still alive
        }

        // Apply shield reduction if active
        const actualDamage = this.isShieldActive ? Math.floor(damage * 0.5) : damage;

        const isAlive = this.combatSystem.takeDamage(actualDamage);
        
        if (isAlive) {
            this.startInvulnerability();
            this.playHurtAnimation();
        }

        return isAlive;
    }

    private startInvulnerability(): void {
        this.isInvulnerable = true;
        this.lastDamageTime = Date.now();
        
        // Flash effect
        this.sprite.setAlpha(0.5);
    }

    private playHurtAnimation(): void {
        this.sprite.play('player_hurt', true);
        this.sprite.once('animationcomplete', () => {
            this.sprite.play('player_idle', true);
        });
    }

    public activateShield(): void {
        this.isShieldActive = true;
        this.shieldStartTime = Date.now();
        
        // Visual effect for shield
        this.sprite.setTint(0x00ffff);
    }

    public deactivateShield(): void {
        this.isShieldActive = false;
        this.sprite.clearTint();
    }

    public heal(amount: number): void {
        this.combatSystem.heal(amount);
    }

    public restoreEnergy(amount: number): void {
        this.combatSystem.restoreEnergy(amount);
    }

    public getHealth(): number {
        return this.combatSystem.getStats().health;
    }

    public getMaxHealth(): number {
        return this.combatSystem.getStats().maxHealth;
    }

    public getEnergy(): number {
        return this.combatSystem.getStats().energy;
    }

    public getMaxEnergy(): number {
        return this.combatSystem.getStats().maxEnergy;
    }

    public getHealthPercentage(): number {
        return this.combatSystem.getHealthPercentage();
    }

    public getEnergyPercentage(): number {
        return this.combatSystem.getEnergyPercentage();
    }

    public isAlive(): boolean {
        return this.combatSystem.isAlive();
    }

    public getComboData() {
        return this.combatSystem.getComboData();
    }

    public resetCombo(): void {
        this.combatSystem.resetCombo();
    }

    public destroy(): void {
        this.sprite.destroy();
    }
} 