import EventCenter from '@/events/eventCenter';

export interface EnemyStats {
    health: number;
    maxHealth: number;
    attackPower: number;
    speed: number;
    damage: number;
    points: number;
}

export interface EnemyType {
    id: string;
    name: string;
    spriteKey: string;
    stats: EnemyStats;
    behavior: 'patrol' | 'chase' | 'ranged' | 'boss';
    spawnRate: number;
}

export interface ZoneConfig {
    id: string;
    name: string;
    emoji: string;
    enemies: EnemyConfig[];
    powerUps: PowerUpConfig[];
    background: string;
    difficulty: number;
}

export interface EnemyConfig {
    type: 'virus' | 'bacteria' | 'fungi';
    name: string;
    spriteKey: string;
    health: number;
    damage: number;
    speed: number;
    points: number;
    spawnRate: number;
}

export interface PowerUpConfig {
    type: string;
    name: string;
    spriteKey: string;
    value: number;
    rarity: string;
    spawnRate: number;
}

export class Enemy {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public stats: EnemyStats;
    public type: EnemyType;
    public isAlive: boolean = true;
    public lastAttackTime: number = 0;
    public attackCooldown: number = 1000; // 1 second

    constructor(sprite: Phaser.Physics.Arcade.Sprite, type: EnemyType) {
        this.sprite = sprite;
        this.type = type;
        this.stats = { ...type.stats };
    }

    public takeDamage(damage: number): boolean {
        this.stats.health = Math.max(0, this.stats.health - damage);
        this.isAlive = this.stats.health > 0;
        return this.isAlive;
    }

    public canAttack(): boolean {
        return Date.now() - this.lastAttackTime > this.attackCooldown;
    }

    public performAttack(): void {
        this.lastAttackTime = Date.now();
    }

    public getHealthPercentage(): number {
        return (this.stats.health / this.stats.maxHealth) * 100;
    }

    public moveTowards(targetX: number, targetY: number, speed: number): void {
        if (!this.sprite) return;
        
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, targetX, targetY);
        this.sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    public update(time: number, delta: number): void {
        // Basic enemy update logic
        if (!this.sprite) return;
        
        // Update any enemy-specific logic here
        // For now, just ensure the sprite exists
    }
}

export class EnemyManager {
    private enemies: Enemy[] = [];
    private enemyTypes: Map<string, EnemyType> = new Map();
    private spawnTimer: number = 0;
    private spawnInterval: number = 2000; // 2 seconds
    private maxEnemies: number = 10;
    private waveNumber: number = 1;
    private enemiesPerWave: number = 5;
    private enemiesSpawnedThisWave: number = 0;
    private waveInProgress: boolean = false;
    private zoneConfig: ZoneConfig | null = null;

    constructor() {
        this.initializeEnemyTypes();
    }

    public setZoneConfig(config: ZoneConfig): void {
        this.zoneConfig = config;
        this.updateEnemyTypesForZone();
    }

    private updateEnemyTypesForZone(): void {
        if (!this.zoneConfig) return;

        // Clear existing enemy types
        this.enemyTypes.clear();

        // Add zone-specific enemies
        this.zoneConfig.enemies.forEach(enemyConfig => {
            const enemyType: EnemyType = {
                id: enemyConfig.type,
                name: enemyConfig.name,
                spriteKey: enemyConfig.spriteKey,
                stats: {
                    health: enemyConfig.health,
                    maxHealth: enemyConfig.health,
                    attackPower: enemyConfig.damage,
                    speed: enemyConfig.speed * 50, // Convert to pixel speed
                    damage: enemyConfig.damage,
                    points: enemyConfig.points
                },
                behavior: this.getBehaviorForType(enemyConfig.type),
                spawnRate: enemyConfig.spawnRate
            };

            this.enemyTypes.set(enemyConfig.type, enemyType);
        });

        // Adjust difficulty based on zone
        this.adjustDifficultyForZone();
    }

    private getBehaviorForType(type: string): 'patrol' | 'chase' | 'ranged' | 'boss' {
        switch (type) {
            case 'virus': return 'ranged';
            case 'bacteria': return 'chase';
            case 'fungi': return 'patrol';
            default: return 'patrol';
        }
    }

    private adjustDifficultyForZone(): void {
        if (!this.zoneConfig) return;

        // Adjust spawn rates and intervals based on zone difficulty
        const difficultyMultiplier = this.zoneConfig.difficulty;
        this.spawnInterval = Math.max(500, 2000 - (difficultyMultiplier * 200));
        this.maxEnemies = Math.min(15, 5 + difficultyMultiplier * 2);
        this.enemiesPerWave = Math.min(25, 3 + difficultyMultiplier * 3);
    }

    private initializeEnemyTypes(): void {
        // Default enemy types (fallback)
        this.enemyTypes.set('bacteria', {
            id: 'bacteria',
            name: 'Bacteria',
            spriteKey: 'dude',
            stats: {
                health: 30,
                maxHealth: 30,
                attackPower: 10,
                speed: 50,
                damage: 5,
                points: 10
            },
            behavior: 'patrol',
            spawnRate: 0.6
        });

        this.enemyTypes.set('fungi', {
            id: 'fungi',
            name: 'Fungi',
            spriteKey: 'dude',
            stats: {
                health: 60,
                maxHealth: 60,
                attackPower: 15,
                speed: 80,
                damage: 8,
                points: 20
            },
            behavior: 'chase',
            spawnRate: 0.3
        });

        this.enemyTypes.set('virus', {
            id: 'virus',
            name: 'Virus',
            spriteKey: 'dude',
            stats: {
                health: 100,
                maxHealth: 100,
                attackPower: 20,
                speed: 120,
                damage: 12,
                points: 30
            },
            behavior: 'ranged',
            spawnRate: 0.1
        });
    }

    public update(time: number, delta: number, player: Phaser.Physics.Arcade.Sprite): void {
        // Update spawn timer
        this.spawnTimer += delta;

        // Start new wave if needed
        if (!this.waveInProgress && this.enemies.length === 0) {
            this.startNewWave();
        }

        // Spawn enemies
        if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies && this.waveInProgress) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }

        // Update enemy AI
        this.updateEnemyAI(player);

        // Clean up dead enemies
        this.cleanupDeadEnemies();
    }

    private startNewWave(): void {
        this.waveInProgress = true;
        this.enemiesSpawnedThisWave = 0;
        this.spawnInterval = Math.max(500, 2000 - (this.waveNumber * 100)); // Faster spawning as waves progress
        console.log(`Starting Wave ${this.waveNumber}`);
    }

    private spawnEnemy(): void {
        if (this.enemiesSpawnedThisWave >= this.enemiesPerWave) {
            this.waveInProgress = false;
            return;
        }

        const enemyType = this.selectEnemyType();
        if (!enemyType) return;

        // Emit spawn event for the scene to handle
        EventCenter.emit('enemySpawned', { type: enemyType });
        
        this.enemiesSpawnedThisWave++;
    }

    private selectEnemyType(): EnemyType | null {
        const random = Math.random();
        let cumulativeRate = 0;

        for (const [_, enemyType] of this.enemyTypes) {
            cumulativeRate += enemyType.spawnRate;
            if (random <= cumulativeRate) {
                return enemyType;
            }
        }

        return this.enemyTypes.get('bacteria') || null;
    }

    private updateEnemyAI(player: Phaser.Physics.Arcade.Sprite): void {
        this.enemies.forEach(enemy => {
            if (!enemy.isAlive || !enemy.sprite) return;

            const distanceToPlayer = Phaser.Math.Distance.Between(
                enemy.sprite.x, enemy.sprite.y,
                player.x, player.y
            );

            switch (enemy.type.behavior) {
                case 'patrol':
                    this.updatePatrolBehavior(enemy);
                    break;
                case 'chase':
                    this.updateChaseBehavior(enemy, player, distanceToPlayer);
                    break;
                case 'ranged':
                    this.updateRangedBehavior(enemy, player, distanceToPlayer);
                    break;
            }
        });
    }

    private updatePatrolBehavior(enemy: Enemy): void {
        // Simple patrol behavior - move back and forth
        if (!enemy.sprite || !enemy.sprite.body) return;

        const patrolSpeed = enemy.stats.speed * 0.5;
        enemy.sprite.setVelocityX(patrolSpeed);

        // Change direction at screen edges
        if (enemy.sprite.x <= 50 || enemy.sprite.x >= 750) {
            enemy.sprite.setVelocityX(-enemy.sprite.body.velocity.x);
        }
    }

    private updateChaseBehavior(enemy: Enemy, player: Phaser.Physics.Arcade.Sprite, distance: number): void {
        if (!enemy.sprite) return;

        const chaseSpeed = enemy.stats.speed;
        const attackRange = 50;

        if (distance > attackRange) {
            // Move towards player
            const angle = Phaser.Math.Angle.Between(enemy.sprite.x, enemy.sprite.y, player.x, player.y);
            enemy.sprite.setVelocity(
                Math.cos(angle) * chaseSpeed,
                Math.sin(angle) * chaseSpeed
            );
        } else {
            // Attack player
            enemy.sprite.setVelocity(0, 0);
            if (enemy.canAttack()) {
                enemy.performAttack();
                // Emit attack event
                EventCenter.emit('enemyAttack', { enemy, damage: enemy.stats.damage });
            }
        }
    }

    private updateRangedBehavior(enemy: Enemy, player: Phaser.Physics.Arcade.Sprite, distance: number): void {
        if (!enemy.sprite) return;

        const attackRange = 150;
        const optimalRange = 100;

        if (distance > attackRange) {
            // Move towards player
            const angle = Phaser.Math.Angle.Between(enemy.sprite.x, enemy.sprite.y, player.x, player.y);
            enemy.sprite.setVelocity(
                Math.cos(angle) * enemy.stats.speed * 0.7,
                Math.sin(angle) * enemy.stats.speed * 0.7
            );
        } else if (distance < optimalRange) {
            // Move away from player
            const angle = Phaser.Math.Angle.Between(player.x, player.y, enemy.sprite.x, enemy.sprite.y);
            enemy.sprite.setVelocity(
                Math.cos(angle) * enemy.stats.speed * 0.5,
                Math.sin(angle) * enemy.stats.speed * 0.5
            );
        } else {
            // Attack from range
            enemy.sprite.setVelocity(0, 0);
            if (enemy.canAttack()) {
                enemy.performAttack();
                // Emit ranged attack event
                EventCenter.emit('enemyRangedAttack', { enemy, damage: enemy.stats.damage });
            }
        }
    }

    private cleanupDeadEnemies(): void {
        this.enemies = this.enemies.filter(enemy => enemy.isAlive);
    }

    public addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }

    public removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    public getEnemies(): Enemy[] {
        return [...this.enemies];
    }

    public getWaveNumber(): number {
        return this.waveNumber;
    }

    public isWaveComplete(): boolean {
        return !this.waveInProgress && this.enemies.length === 0;
    }

    public nextWave(): void {
        this.waveNumber++;
        this.enemiesPerWave = Math.min(20, 5 + this.waveNumber * 2); // Cap at 20 enemies per wave
    }

    public getEnemyTypes(): Map<string, EnemyType> {
        return new Map(this.enemyTypes);
    }
} 