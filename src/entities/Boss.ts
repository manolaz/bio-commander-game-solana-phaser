import { EnemyEntity, EnemyConfig } from './Enemy';
import { EnemyType } from '@/systems/EnemyManager';

export interface BossPhase {
    id: string;
    name: string;
    healthThreshold: number; // Percentage of health when this phase starts
    attackPatterns: BossAttackPattern[];
    movementPattern: 'stationary' | 'patrol' | 'chase' | 'teleport';
    speed: number;
    damageMultiplier: number;
    specialAbilities: string[];
}

export interface BossAttackPattern {
    id: string;
    name: string;
    damage: number;
    range: number;
    cooldown: number;
    lastUsed: number;
    effect: 'single' | 'area' | 'projectile' | 'summon' | 'buff';
    description: string;
}

export interface BossConfig extends EnemyConfig {
    phases: BossPhase[];
    currentPhase: number;
    isEnraged: boolean;
    enrageThreshold: number; // Health percentage when boss becomes enraged
}

export class Boss extends EnemyEntity {
    private phases: BossPhase[];
    private currentPhaseIndex: number = 0;
    private isEnraged: boolean = false;
    private enrageThreshold: number = 0.25; // 25% health
    private phaseTransitionTime: number = 0;
    private phaseTransitionDuration: number = 2000; // 2 seconds
    private isTransitioning: boolean = false;
    private specialEffects: Map<string, any> = new Map();
    private summonedMinions: any[] = [];
    private lastPhaseChange: number = 0;

    constructor(scene: Phaser.Scene, config: BossConfig) {
        super(scene, config);
        this.phases = config.phases;
        this.enrageThreshold = config.enrageThreshold || 0.25;
        this.setupBoss();
    }

    private setupBoss(): void {
        // Make boss larger and more imposing
        this.sprite.setScale(1.5);
        
        // Add boss-specific visual effects
        this.createBossEffects();
        
        // Initialize first phase
        this.activatePhase(0);
    }

    private createBossEffects(): void {
        // Create aura effect
        const aura = this.scene.add.graphics();
        aura.setDepth(5);
        this.specialEffects.set('aura', aura);

        // Create phase indicator
        const phaseIndicator = this.scene.add.text(0, 0, '', {
            fontSize: '16px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 2
        });
        phaseIndicator.setDepth(10);
        this.specialEffects.set('phaseIndicator', phaseIndicator);
    }

    public update(time: number, delta: number): void {
        super.update(time, delta);
        
        if (this.isTransitioning) {
            this.updatePhaseTransition(delta);
        } else {
            this.updateBossAI(time, delta);
        }
        
        this.updateBossEffects();
        this.checkPhaseTransition();
        this.checkEnrageState();
    }

    private updateBossAI(time: number, delta: number): void {
        const currentPhase = this.getCurrentPhase();
        if (!currentPhase) return;

        // Update movement based on phase
        this.updateMovementPattern(currentPhase.movementPattern, delta);

        // Update attack patterns
        this.updateAttackPatterns(time, currentPhase.attackPatterns);

        // Update special abilities
        this.updateSpecialAbilities(time, currentPhase.specialAbilities);
    }

    private updateMovementPattern(pattern: string, delta: number): void {
        const player = this.scene.children.getByName('player') as Phaser.Physics.Arcade.Sprite;
        if (!player) return;

        const distance = this.getDistanceTo(player);

        switch (pattern) {
            case 'stationary':
                this.stopMoving();
                break;
            case 'patrol':
                this.updatePatrolBehavior(delta);
                break;
            case 'chase':
                if (distance > 100) {
                    const currentPhase = this.getCurrentPhase();
                    if (currentPhase) {
                        this.moveTowards(player.x, player.y, currentPhase.speed);
                    }
                } else {
                    this.stopMoving();
                }
                break;
            case 'teleport':
                if (distance < 50 || distance > 300) {
                    this.teleportToRandomLocation();
                }
                break;
        }
    }

    private updateAttackPatterns(time: number, patterns: BossAttackPattern[]): void {
        for (const pattern of patterns) {
            if (time - pattern.lastUsed >= pattern.cooldown) {
                if (this.shouldUseAttackPattern(pattern)) {
                    this.executeAttackPattern(pattern);
                    pattern.lastUsed = time;
                }
            }
        }
    }

    private shouldUseAttackPattern(pattern: BossAttackPattern): boolean {
        const player = this.scene.children.getByName('player') as Phaser.Physics.Arcade.Sprite;
        if (!player) return false;

        const distance = this.getDistanceTo(player);
        return distance <= pattern.range;
    }

    private executeAttackPattern(pattern: BossAttackPattern): void {
        const player = this.scene.children.getByName('player') as Phaser.Physics.Arcade.Sprite;
        if (!player) return;

        const currentPhase = this.getCurrentPhase();
        const damage = pattern.damage * (this.isEnraged ? 1.5 : 1) * (currentPhase?.damageMultiplier || 1);

        switch (pattern.effect) {
            case 'single':
                this.performSingleAttack(player, damage);
                break;
            case 'area':
                this.performAreaAttack(damage);
                break;
            case 'projectile':
                this.performProjectileAttack(player, damage);
                break;
            case 'summon':
                this.performSummonAttack();
                break;
            case 'buff':
                this.performBuffAttack();
                break;
        }

        // Play attack animation
        this.playAttackAnimation();
    }

    private performSingleAttack(target: Phaser.Physics.Arcade.Sprite, damage: number): void {
        // Direct attack on target
        if (target && typeof target.body !== 'undefined') {
            // Emit damage event
            this.scene.events.emit('bossAttack', { target, damage, type: 'single' });
        }
    }

    private performAreaAttack(damage: number): void {
        // Area attack around boss
        const radius = 150;
        const enemies = this.scene.children.getAll('enemy') as Phaser.Physics.Arcade.Sprite[];
        
        enemies.forEach(enemy => {
            const distance = this.getDistanceTo(enemy);
            if (distance <= radius) {
                this.scene.events.emit('bossAttack', { target: enemy, damage, type: 'area' });
            }
        });

        // Create area attack visual effect
        this.createAreaAttackEffect(radius);
    }

    private performProjectileAttack(target: Phaser.Physics.Arcade.Sprite, damage: number): void {
        // Create projectile
        const projectile = this.scene.add.circle(this.sprite.x, this.sprite.y, 8, 0xff0000);
        this.scene.physics.add.existing(projectile);
        
        // Move projectile towards target
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);
        const velocity = this.scene.physics.velocityFromRotation(angle, 200);
        (projectile.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);

        // Destroy projectile after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            projectile.destroy();
        });
    }

    private performSummonAttack(): void {
        // Summon minions
        const minionCount = 2;
        for (let i = 0; i < minionCount; i++) {
            const angle = (i / minionCount) * Math.PI * 2;
            const distance = 100;
            const x = this.sprite.x + Math.cos(angle) * distance;
            const y = this.sprite.y + Math.sin(angle) * distance;
            
            // Create minion (simplified for now)
            const minion = this.scene.add.circle(x, y, 12, 0x00ff00);
            this.scene.physics.add.existing(minion);
            this.summonedMinions.push(minion);
        }
    }

    private performBuffAttack(): void {
        // Apply buff to boss
        this.stats.attackPower *= 1.5;
        this.stats.speed *= 1.2;
        
        // Visual buff effect
        this.createBuffEffect();
        
        // Reset buff after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            this.stats.attackPower /= 1.5;
            this.stats.speed /= 1.2;
        });
    }

    private updateSpecialAbilities(time: number, abilities: string[]): void {
        // Update special abilities based on phase
        abilities.forEach(ability => {
            switch (ability) {
                case 'shield':
                    this.updateShieldAbility();
                    break;
                case 'heal':
                    this.updateHealAbility(time);
                    break;
                case 'rage':
                    this.updateRageAbility();
                    break;
            }
        });
    }

    private updateShieldAbility(): void {
        // Boss has temporary invincibility
        if (!this.isInvulnerable) {
            this.isInvulnerable = true;
            this.scene.time.delayedCall(3000, () => {
                this.isInvulnerable = false;
            });
        }
    }

    private updateHealAbility(time: number): void {
        // Boss heals over time
        if (time % 5000 < 16) { // Every 5 seconds
            this.heal(10);
        }
    }

    private updateRageAbility(): void {
        // Boss becomes more aggressive
        if (this.getHealthPercentage() < 30 && !this.isEnraged) {
            this.isEnraged = true;
            this.stats.attackPower *= 2;
            this.stats.speed *= 1.5;
        }
    }

    private checkPhaseTransition(): void {
        const healthPercentage = this.getHealthPercentage();
        const currentPhase = this.getCurrentPhase();
        
        if (!currentPhase) return;

        // Check if health is below threshold for next phase
        if (healthPercentage <= currentPhase.healthThreshold && this.currentPhaseIndex < this.phases.length - 1) {
            this.transitionToNextPhase();
        }
    }

    private transitionToNextPhase(): void {
        this.isTransitioning = true;
        this.phaseTransitionTime = 0;
        this.lastPhaseChange = Date.now();

        // Start transition animation
        this.startPhaseTransitionAnimation();

        // Transition to next phase after animation
        this.scene.time.delayedCall(this.phaseTransitionDuration, () => {
            this.currentPhaseIndex++;
            this.activatePhase(this.currentPhaseIndex);
            this.isTransitioning = false;
        });
    }

    private startPhaseTransitionAnimation(): void {
        // Create transition effect
        const transitionEffect = this.scene.add.graphics();
        transitionEffect.fillStyle(0xff0000, 0.5);
        transitionEffect.fillCircle(this.sprite.x, this.sprite.y, 100);
        
        // Animate transition
        this.scene.tweens.add({
            targets: transitionEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: this.phaseTransitionDuration,
            ease: 'Power2',
            onComplete: () => {
                transitionEffect.destroy();
            }
        });
    }

    private activatePhase(phaseIndex: number): void {
        if (phaseIndex >= this.phases.length) return;

        const phase = this.phases[phaseIndex];
        
        // Update boss stats based on phase
        this.stats.speed = phase.speed;
        this.stats.attackPower *= phase.damageMultiplier;

        // Update phase indicator
        const phaseIndicator = this.specialEffects.get('phaseIndicator');
        if (phaseIndicator) {
            phaseIndicator.setText(`Phase ${phaseIndex + 1}: ${phase.name}`);
        }

        console.log(`Boss entered phase: ${phase.name}`);
    }

    private updatePhaseTransition(delta: number): void {
        this.phaseTransitionTime += delta;
        
        // Boss is invulnerable during transition
        this.isInvulnerable = true;
        
        // Stop movement during transition
        this.stopMoving();
    }

    private checkEnrageState(): void {
        const healthPercentage = this.getHealthPercentage();
        
        if (healthPercentage <= this.enrageThreshold * 100 && !this.isEnraged) {
            this.enrage();
        }
    }

    private enrage(): void {
        this.isEnraged = true;
        
        // Increase stats
        this.stats.attackPower *= 1.5;
        this.stats.speed *= 1.3;
        
        // Visual enrage effect
        this.createEnrageEffect();
        
        console.log('Boss is now ENRAGED!');
    }

    private createEnrageEffect(): void {
        // Red aura effect
        const aura = this.specialEffects.get('aura');
        if (aura) {
            aura.clear();
            aura.fillStyle(0xff0000, 0.3);
            aura.fillCircle(this.sprite.x, this.sprite.y, 80);
        }
    }

    private createAreaAttackEffect(radius: number): void {
        const effect = this.scene.add.graphics();
        effect.fillStyle(0xff0000, 0.3);
        effect.fillCircle(this.sprite.x, this.sprite.y, radius);
        
        this.scene.tweens.add({
            targets: effect,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                effect.destroy();
            }
        });
    }

    private createBuffEffect(): void {
        const effect = this.scene.add.graphics();
        effect.fillStyle(0x00ff00, 0.5);
        effect.fillCircle(this.sprite.x, this.sprite.y, 60);
        
        this.scene.tweens.add({
            targets: effect,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                effect.destroy();
            }
        });
    }

    private updateBossEffects(): void {
        const aura = this.specialEffects.get('aura');
        const phaseIndicator = this.specialEffects.get('phaseIndicator');
        
        if (aura) {
            aura.clear();
            const color = this.isEnraged ? 0xff0000 : 0x666666;
            const alpha = this.isEnraged ? 0.3 : 0.1;
            aura.fillStyle(color, alpha);
            aura.fillCircle(this.sprite.x, this.sprite.y, 60);
        }
        
        if (phaseIndicator) {
            phaseIndicator.setPosition(this.sprite.x - 50, this.sprite.y - 80);
        }
    }

    private teleportToRandomLocation(): void {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        
        this.sprite.setPosition(x, y);
        
        // Teleport effect
        this.createTeleportEffect();
    }

    private createTeleportEffect(): void {
        const effect = this.scene.add.graphics();
        effect.fillStyle(0x00ffff, 0.5);
        effect.fillCircle(this.sprite.x, this.sprite.y, 50);
        
        this.scene.tweens.add({
            targets: effect,
            scaleX: 0.1,
            scaleY: 0.1,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                effect.destroy();
            }
        });
    }

    public getCurrentPhase(): BossPhase | null {
        return this.phases[this.currentPhaseIndex] || null;
    }

    public getPhaseIndex(): number {
        return this.currentPhaseIndex;
    }

    public isEnragedState(): boolean {
        return this.isEnraged;
    }

    public getSummonedMinions(): any[] {
        return [...this.summonedMinions];
    }

    public override takeDamage(damage: number): boolean {
        if (this.isTransitioning) {
            return true; // Invulnerable during phase transition
        }
        
        return super.takeDamage(damage);
    }

    public destroy(): void {
        // Clean up special effects
        this.specialEffects.forEach(effect => {
            if (effect && effect.destroy) {
                effect.destroy();
            }
        });
        
        // Clean up summoned minions
        this.summonedMinions.forEach(minion => {
            if (minion && minion.destroy) {
                minion.destroy();
            }
        });
        
        super.destroy();
    }
} 