import { CombatSystem, CombatStats } from '@/systems/CombatSystem';

export interface PlayerConfig {
    x: number;
    y: number;
    spriteKey: string;
    stats?: Partial<CombatStats>;
    soundManager?: any; // SoundManager reference
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
    
    // Visual effects
    private shieldEffect?: Phaser.GameObjects.Graphics;
    private glowEffect?: Phaser.GameObjects.Graphics;
    private attackEffect?: Phaser.GameObjects.Graphics;
    private scene: Phaser.Scene;
    
    // Hero image management
    private heroImages: string[] = ['hero1', 'hero2', 'hero3', 'hero4', 'hero5'];
    private currentHeroIndex: number = 0;
    private lastRotationTime: number = 0;
    private rotationCooldown: number = 2000; // 2 seconds between rotations
    private soundManager: any; // SoundManager reference

    constructor(scene: Phaser.Scene, config: PlayerConfig) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(config.x, config.y, config.spriteKey);
        this.combatSystem = new CombatSystem(config.stats);
        this.soundManager = config.soundManager;
        
        this.setupSprite();
        this.setupAnimations(scene);
        this.createVisualEffects();
    }

    private setupSprite(): void {
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.2);
        this.sprite.setGravityY(300);
        
        // Set initial hero image
        this.setRandomHeroImage();
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

    private createVisualEffects(): void {
        // Create shield effect
        this.shieldEffect = this.scene.add.graphics();
        this.shieldEffect.setDepth(1);
        
        // Create glow effect
        this.glowEffect = this.scene.add.graphics();
        this.glowEffect.setDepth(0);
        
        // Create attack effect
        this.attackEffect = this.scene.add.graphics();
        this.attackEffect.setDepth(2);
    }

    private updateVisualEffects(): void {
        if (!this.shieldEffect || !this.glowEffect || !this.attackEffect) return;

        const x = this.sprite.x;
        const y = this.sprite.y;
        const size = 32; // T_CELL_SIZE equivalent

        // Clear all effects
        this.shieldEffect.clear();
        this.glowEffect.clear();
        this.attackEffect.clear();

        // Update glow effect (always visible)
        this.glowEffect.fillStyle(0x3498db, 0.3);
        this.glowEffect.fillCircle(x, y, size + 8);

        // Update shield effect (only when active)
        if (this.isShieldActive) {
            const shieldAlpha = 0.2 + (Math.sin(Date.now() * 0.01) * 0.1);
            this.shieldEffect.fillStyle(0x27ae60, shieldAlpha);
            this.shieldEffect.lineStyle(3, 0x27ae60, 0.6);
            this.shieldEffect.fillCircle(x, y, size + 12);
            this.shieldEffect.strokeCircle(x, y, size + 12);
        }

        // Update attack effect (during attack animation)
        if (this.isAttacking) {
            const attackAlpha = 0.8 * (1 - Math.abs(Math.sin(Date.now() * 0.02)));
            this.attackEffect.fillStyle(0x3498db, attackAlpha);
            this.attackEffect.fillCircle(x, y, size + 16);
        }
    }

    private setRandomHeroImage(): void {
        const randomIndex = Math.floor(Math.random() * this.heroImages.length);
        this.currentHeroIndex = randomIndex;
        this.sprite.setTexture(this.heroImages[randomIndex]);
        
        // Set appropriate scale for SVG images (they might be larger than the original sprites)
        this.sprite.setScale(0.5); // Adjust scale as needed
    }

    private rotateHeroImage(): void {
        const currentTime = Date.now();
        if (currentTime - this.lastRotationTime > this.rotationCooldown) {
            this.setRandomHeroImage();
            this.lastRotationTime = currentTime;
        }
    }

    public update(time: number, delta: number): void {
        this.updateInvulnerability();
        this.updateShield();
        this.updateEnergyRegeneration(delta);
        this.updateVisualEffects();
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
                // Rotate hero image after movement
                this.rotateHeroImage();
                break;
            case 'right':
                this.sprite.setVelocityX(speed);
                this.sprite.play('player_walk', true);
                this.sprite.setFlipX(false);
                // Rotate hero image after movement
                this.rotateHeroImage();
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
            // Rotate hero image after jump
            this.rotateHeroImage();
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
        
        // Rotate hero image after attack
        this.rotateHeroImage();

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
            // Play hit/hurt sound when taking damage
            if (this.soundManager) {
                this.soundManager.playHitHurt();
            }
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
        
        // Play power-up sound when activating shield
        if (this.soundManager) {
            this.soundManager.playPowerUp();
        }
    }

    public deactivateShield(): void {
        this.isShieldActive = false;
        this.sprite.clearTint();
    }

    public heal(amount: number): void {
        this.combatSystem.heal(amount);
        // Play power-up sound when healing
        if (this.soundManager) {
            this.soundManager.playPowerUp();
        }
    }

    public restoreEnergy(amount: number): void {
        this.combatSystem.restoreEnergy(amount);
        // Play power-up sound when restoring energy
        if (this.soundManager) {
            this.soundManager.playPowerUp();
        }
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
        if (this.shieldEffect) this.shieldEffect.destroy();
        if (this.glowEffect) this.glowEffect.destroy();
        if (this.attackEffect) this.attackEffect.destroy();
        this.sprite.destroy();
    }
} 