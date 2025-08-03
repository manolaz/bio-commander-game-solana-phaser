import { Scene } from 'phaser';
import { Boss, BossConfig, BossPhase } from '@/entities/Boss';
import { HazardManager } from '@/systems/EnvironmentalHazards';
import { AchievementSystem } from '@/systems/AchievementSystem';
import { AdvancedPowerUpManager } from '@/entities/AdvancedPowerUp';
import { AdvancedCombatSystem } from '@/systems/AdvancedCombatSystem';
import { Player } from '@/entities/Player';
import { EnemyEntity } from '@/entities/Enemy';
import EventCenter from '@/events/eventCenter';

export interface GameplayState {
    currentWave: number;
    bossActive: boolean;
    hazardsActive: boolean;
    powerUpsActive: boolean;
    achievementsEnabled: boolean;
    playerLevel: number;
    totalScore: number;
    gameTime: number;
}

export class AdvancedGameplayManager {
    private scene: Scene;
    private player: Player;
    private boss?: Boss;
    private hazardManager!: HazardManager;
    private achievementSystem!: AchievementSystem;
    private powerUpManager!: AdvancedPowerUpManager;
    private advancedCombatSystem!: AdvancedCombatSystem;
    
    private gameplayState: GameplayState;
    private bossSpawnWave: number = 5; // Spawn boss every 5 waves
    private hazardSpawnWave: number = 3; // Start hazards at wave 3
    private powerUpSpawnWave: number = 2; // Start power-ups at wave 2
    
    private activeEffects: Map<string, any> = new Map();
    private gameStartTime: number = 0;
    private lastBossSpawn: number = 0;

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        
        this.gameplayState = {
            currentWave: 1,
            bossActive: false,
            hazardsActive: false,
            powerUpsActive: false,
            achievementsEnabled: true,
            playerLevel: 1,
            totalScore: 0,
            gameTime: 0
        };

        this.initializeSystems();
        this.setupEventListeners();
    }

    private initializeSystems(): void {
        // Initialize all advanced systems
        this.hazardManager = new HazardManager(this.scene);
        this.achievementSystem = new AchievementSystem(this.scene);
        this.powerUpManager = new AdvancedPowerUpManager(this.scene);
        this.advancedCombatSystem = new AdvancedCombatSystem();
        
        this.gameStartTime = Date.now();
    }

    private setupEventListeners(): void {
        // Listen for game events
        EventCenter.on('enemyDefeated', (enemy: EnemyEntity) => {
            this.handleEnemyDefeated(enemy);
        });

        EventCenter.on('waveCompleted', (waveNumber: number) => {
            this.handleWaveCompleted(waveNumber);
        });

        EventCenter.on('playerDamaged', (damage: number) => {
            this.handlePlayerDamaged(damage);
        });

        EventCenter.on('powerUpCollected', (powerUpData: any) => {
            this.handlePowerUpCollected(powerUpData);
        });

        EventCenter.on('shapeRecognized', (shapeData: any) => {
            this.handleShapeRecognized(shapeData);
        });

        // Listen for achievement events
        this.scene.events.on('grantExperience', (data: { amount: number }) => {
            this.advancedCombatSystem.addExperience(data.amount);
        });

        this.scene.events.on('grantSkillPoints', (data: { amount: number }) => {
            // Add skill points to player
            console.log(`Granted ${data.amount} skill points`);
        });

        this.scene.events.on('unlockWeapon', (data: { weaponId: string }) => {
            this.advancedCombatSystem.switchWeapon(data.weaponId);
        });

        this.scene.events.on('unlockSpecialMove', (data: { moveId: string }) => {
            console.log(`Unlocked special move: ${data.moveId}`);
        });
    }

    public update(time: number, delta: number): void {
        this.updateGameTime();
        this.updateSystems(time, delta);
        this.checkBossSpawn();
        this.updateActiveEffects();
        this.updateAchievements();
    }

    private updateGameTime(): void {
        this.gameplayState.gameTime = Date.now() - this.gameStartTime;
    }

    private updateSystems(time: number, delta: number): void {
        // Update hazard manager
        if (this.gameplayState.hazardsActive) {
            this.hazardManager.update(time, delta);
        }

        // Update power-up manager
        if (this.gameplayState.powerUpsActive) {
            this.powerUpManager.update(time, delta);
        }

        // Update boss
        if (this.boss && this.gameplayState.bossActive) {
            this.boss.update(time, delta);
        }
    }

    private checkBossSpawn(): void {
        if (this.gameplayState.currentWave % this.bossSpawnWave === 0 && 
            !this.gameplayState.bossActive && 
            Date.now() - this.lastBossSpawn > 10000) {
            this.spawnBoss();
        }
    }

    private spawnBoss(): void {
        const bossConfig: BossConfig = {
            x: 400,
            y: 200,
            type: this.getBossTypeForWave(),
            phases: this.getBossPhasesForWave(),
            currentPhase: 0,
            isEnraged: false,
            enrageThreshold: 0.25
        };

        this.boss = new Boss(this.scene, bossConfig);
        this.gameplayState.bossActive = true;
        this.lastBossSpawn = Date.now();

        // Emit boss spawn event
        EventCenter.emit('bossSpawned', this.boss);

        console.log(`Boss spawned at wave ${this.gameplayState.currentWave}`);
    }

    private getBossTypeForWave(): any {
        // Return different boss types based on wave number
        const bossTypes = ['bacteria_boss', 'fungi_boss', 'virus_boss'];
        const index = Math.floor((this.gameplayState.currentWave - 1) / this.bossSpawnWave) % bossTypes.length;
        return bossTypes[index];
    }

    private getBossPhasesForWave(): BossPhase[] {
        const waveDifficulty = Math.floor(this.gameplayState.currentWave / this.bossSpawnWave);
        
        const basePhases: BossPhase[] = [
            {
                id: 'phase1',
                name: 'Aggressive',
                healthThreshold: 100,
                attackPatterns: [
                    {
                        id: 'basic_attack',
                        name: 'Basic Attack',
                        damage: 20,
                        range: 100,
                        cooldown: 2000,
                        lastUsed: 0,
                        effect: 'single',
                        description: 'Basic melee attack'
                    }
                ],
                movementPattern: 'chase',
                speed: 80,
                damageMultiplier: 1.0,
                specialAbilities: []
            }
        ];

        // Add more phases for higher difficulty
        if (waveDifficulty >= 1) {
            basePhases.push({
                id: 'phase2',
                name: 'Enraged',
                healthThreshold: 50,
                attackPatterns: [
                    {
                        id: 'area_attack',
                        name: 'Area Attack',
                        damage: 30,
                        range: 150,
                        cooldown: 4000,
                        lastUsed: 0,
                        effect: 'area',
                        description: 'Area damage attack'
                    }
                ],
                movementPattern: 'teleport',
                speed: 120,
                damageMultiplier: 1.5,
                specialAbilities: ['rage']
            });
        }

        if (waveDifficulty >= 2) {
            basePhases.push({
                id: 'phase3',
                name: 'Ultimate',
                healthThreshold: 25,
                attackPatterns: [
                    {
                        id: 'ultimate_attack',
                        name: 'Ultimate Attack',
                        damage: 50,
                        range: 200,
                        cooldown: 6000,
                        lastUsed: 0,
                        effect: 'projectile',
                        description: 'Powerful projectile attack'
                    }
                ],
                movementPattern: 'teleport',
                speed: 150,
                damageMultiplier: 2.0,
                specialAbilities: ['shield', 'heal']
            });
        }

        return basePhases;
    }

    private handleEnemyDefeated(enemy: EnemyEntity): void {
        // Update achievements
        this.achievementSystem.handleEvent('enemy_defeated', {
            type: 'enemy_defeated',
            value: 1,
            data: { enemyType: enemy.type.id }
        });

        // Add experience
        this.advancedCombatSystem.addExperience(enemy.getPoints());

        // Check for level up
        const newLevel = this.advancedCombatSystem.getLevel();
        if (newLevel > this.gameplayState.playerLevel) {
            this.handleLevelUp(newLevel);
        }
    }

    private handleWaveCompleted(waveNumber: number): void {
        this.gameplayState.currentWave = waveNumber;

        // Update achievements
        this.achievementSystem.handleEvent('wave_completed', {
            type: 'wave_completed',
            value: waveNumber,
            data: { noDamage: this.player.getHealth() === this.player.getMaxHealth() }
        });

        // Enable systems based on wave progression
        if (waveNumber >= this.powerUpSpawnWave && !this.gameplayState.powerUpsActive) {
            this.gameplayState.powerUpsActive = true;
            console.log('Power-ups enabled');
        }

        if (waveNumber >= this.hazardSpawnWave && !this.gameplayState.hazardsActive) {
            this.gameplayState.hazardsActive = true;
            this.spawnInitialHazards();
            console.log('Environmental hazards enabled');
        }

        // Spawn additional hazards for higher waves
        if (waveNumber > this.hazardSpawnWave) {
            this.spawnWaveHazards(waveNumber);
        }
    }

    private handlePlayerDamaged(damage: number): void {
        // Update achievements
        this.achievementSystem.handleEvent('player_damaged', {
            type: 'player_damaged',
            value: damage
        });
    }

    private handlePowerUpCollected(powerUpData: any): void {
        // Apply power-up effect
        this.applyPowerUpEffect(powerUpData.effect);

        // Update achievements
        this.achievementSystem.handleEvent('powerup_collected', {
            type: 'powerup_collected',
            value: 1,
            data: { powerUpType: powerUpData.type, rarity: powerUpData.rarity }
        });
    }

    private handleShapeRecognized(shapeData: any): void {
        // Update achievements
        this.achievementSystem.handleEvent('shape_drawn', {
            type: 'shape_drawn',
            value: 1,
            data: { shapeType: shapeData.type }
        });

        // Apply shape-based effects
        this.applyShapeEffect(shapeData);
    }

    private handleLevelUp(newLevel: number): void {
        this.gameplayState.playerLevel = newLevel;
        
        // Update achievements
        this.achievementSystem.handleEvent('level_up', {
            type: 'level_up',
            value: newLevel
        });

        // Show level up notification
        this.showLevelUpNotification(newLevel);
    }

    private applyPowerUpEffect(effect: any): void {
        const effectId = `${effect.type}_${Date.now()}`;
        this.activeEffects.set(effectId, {
            ...effect,
            id: effectId
        });

        // Apply immediate effects
        switch (effect.type) {
            case 'health':
                this.player.heal(effect.value);
                break;
            case 'energy':
                this.player.restoreEnergy(effect.value);
                break;
            case 'shield':
                this.player.activateShield();
                break;
            case 'speed_boost':
                // Apply speed boost to player
                break;
            case 'damage_boost':
                // Apply damage boost to combat system
                break;
            case 'invincibility':
                // Make player invincible
                break;
        }

        // Set up duration-based effects
        if (effect.duration > 0) {
            this.scene.time.delayedCall(effect.duration, () => {
                this.removeEffect(effectId);
            });
        }
    }

    private applyShapeEffect(shapeData: any): void {
        switch (shapeData.type) {
            case 'circle':
                // Healing effect
                this.player.heal(30);
                break;
            case 'triangle':
                // Attack boost
                break;
            case 'square':
                // Shield effect
                this.player.activateShield();
                break;
            case 'star':
                // Ultimate attack
                break;
            case 'line':
                // Piercing attack
                break;
        }
    }

    private removeEffect(effectId: string): void {
        const effect = this.activeEffects.get(effectId);
        if (!effect) return;

        // Remove effect
        switch (effect.type) {
            case 'shield':
                this.player.deactivateShield();
                break;
            case 'speed_boost':
                // Remove speed boost
                break;
            case 'damage_boost':
                // Remove damage boost
                break;
            case 'invincibility':
                // Remove invincibility
                break;
        }

        this.activeEffects.delete(effectId);
    }

    private updateActiveEffects(): void {
        const currentTime = Date.now();
        
        this.activeEffects.forEach((effect, effectId) => {
            if (effect.duration > 0 && currentTime - effect.startTime > effect.duration) {
                this.removeEffect(effectId);
            }
        });
    }

    private updateAchievements(): void {
        // Update time-based achievements
        this.achievementSystem.handleEvent('time_survived', {
            type: 'time_survived',
            value: Math.floor(this.gameplayState.gameTime / 1000)
        });
    }

    private spawnInitialHazards(): void {
        // Spawn some initial hazards
        this.hazardManager.createHazard('spike_trap', 200, 500);
        this.hazardManager.createHazard('laser_trap', 600, 300);
        this.hazardManager.createHazard('poison_pool', 400, 400);
    }

    private spawnWaveHazards(waveNumber: number): void {
        const hazardCount = Math.min(waveNumber - this.hazardSpawnWave, 3);
        
        for (let i = 0; i < hazardCount; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            this.hazardManager.createRandomHazard(x, y);
        }
    }

    private showLevelUpNotification(level: number): void {
        // Create level up notification
        const notification = this.scene.add.container(400, 300);
        notification.setDepth(1000);

        // Background
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRoundedRect(-150, -50, 300, 100, 10);
        background.lineStyle(3, 0x00ff00, 1);
        background.strokeRoundedRect(-150, -50, 300, 100, 10);
        notification.add(background);

        // Text
        const title = this.scene.add.text(0, -20, 'LEVEL UP!', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        notification.add(title);

        const levelText = this.scene.add.text(0, 10, `Level ${level}`, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        notification.add(levelText);

        // Animation
        notification.setScale(0);
        this.scene.tweens.add({
            targets: notification,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(2000, () => {
                    this.scene.tweens.add({
                        targets: notification,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 200,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            notification.destroy();
                        }
                    });
                });
            }
        });

        // Play sound
        this.scene.sound.play('level_up', { volume: 0.5 });
    }

    public getGameplayState(): GameplayState {
        return { ...this.gameplayState };
    }

    public getBoss(): Boss | undefined {
        return this.boss;
    }

    public getHazardManager(): HazardManager {
        return this.hazardManager;
    }

    public getAchievementSystem(): AchievementSystem {
        return this.achievementSystem;
    }

    public getPowerUpManager(): AdvancedPowerUpManager {
        return this.powerUpManager;
    }

    public getAdvancedCombatSystem(): AdvancedCombatSystem {
        return this.advancedCombatSystem;
    }

    public isBossActive(): boolean {
        return this.gameplayState.bossActive;
    }

    public getCurrentWave(): number {
        return this.gameplayState.currentWave;
    }

    public getGameTime(): number {
        return this.gameplayState.gameTime;
    }

    public destroy(): void {
        if (this.boss) {
            this.boss.destroy();
        }
        this.hazardManager.destroy();
        this.powerUpManager.destroy();
    }
} 