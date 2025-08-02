import { DEFAULT_WIDTH } from '@/components/Game';
import { Umi } from '@metaplex-foundation/umi';
import { Scene } from 'phaser';
import { Player } from '@/entities/Player';
import { EnemyEntity } from '@/entities/Enemy';
import { EnemyManager } from '@/systems/EnemyManager';
import { ScoreManager } from '@/systems/ScoreManager';
import EventCenter from '@/events/eventCenter';

export class Game extends Scene {
    private umi!: Umi;
    private player!: Player;
    private enemyManager!: EnemyManager;
    private scoreManager!: ScoreManager;
    private enemies: EnemyEntity[] = [];
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameStarted: boolean = false;
    private gameOver: boolean = false;

    // UI Elements
    private healthText!: Phaser.GameObjects.Text;
    private energyText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private waveText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    init(args: { umi: Umi }) {
        this.umi = args.umi;
    }

    create() {
        this.setupGame();
        this.setupUI();
        this.setupInput();
        this.setupCollisions();
        this.setupEventListeners();
        
        this.gameStarted = true;
        this.scoreManager.startGame();
    }

    private setupGame(): void {
        // Create background
        this.add.image(400, 300, 'sky');

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 400, 'ground').setScale(0.5, 1).refreshBody();
        this.platforms.create(100, 300, 'ground').setScale(0.5, 1).refreshBody();
        this.platforms.create(700, 300, 'ground').setScale(0.5, 1).refreshBody();

        // Initialize game systems
        this.enemyManager = new EnemyManager();
        this.scoreManager = new ScoreManager();

        // Create player
        this.player = new Player(this, {
            x: DEFAULT_WIDTH / 2,
            y: 450,
            spriteKey: 'dude',
            stats: {
                health: 100,
                maxHealth: 100,
                energy: 100,
                maxEnergy: 100,
                attackPower: 25,
                defense: 10
            }
        });

        // Setup keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    private setupUI(): void {
        // Health display
        this.healthText = this.add.text(16, 16, 'Health: 100/100', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Energy display
        this.energyText = this.add.text(16, 40, 'Energy: 100/100', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Score display
        this.scoreText = this.add.text(16, 64, 'Score: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Wave display
        this.waveText = this.add.text(16, 88, 'Wave: 1', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Combo display
        this.comboText = this.add.text(16, 112, 'Combo: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Instructions
        this.add.text(DEFAULT_WIDTH / 2, 50, 'Arrow Keys: Move | Space: Attack | S: Special Attack', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    private setupInput(): void {
        // Add space key for attack
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.gameStarted && !this.gameOver) {
                this.playerAttack();
            }
        });

        // Add S key for special attack
        this.input.keyboard.on('keydown-S', () => {
            if (this.gameStarted && !this.gameOver) {
                this.playerSpecialAttack();
            }
        });
    }

    private setupCollisions(): void {
        // Player collision with platforms
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Enemy collision with platforms
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy.sprite, this.platforms);
        });
    }

    private setupEventListeners(): void {
        // Listen for enemy spawn events
        EventCenter.on('enemySpawned', (data: { type: any }) => {
            this.spawnEnemy(data.type);
        });

        // Listen for enemy attack events
        EventCenter.on('enemyAttack', (data: { enemy: any, damage: number }) => {
            this.handleEnemyAttack(data.enemy, data.damage);
        });

        // Listen for enemy ranged attack events
        EventCenter.on('enemyRangedAttack', (data: { enemy: any, damage: number }) => {
            this.handleEnemyRangedAttack(data.enemy, data.damage);
        });
    }

    private spawnEnemy(enemyType: any): void {
        const spawnX = Phaser.Math.Between(50, DEFAULT_WIDTH - 50);
        const spawnY = 50;

        const enemy = new EnemyEntity(this, {
            x: spawnX,
            y: spawnY,
            type: enemyType
        });

        this.enemies.push(enemy);

        // Setup collisions for new enemy
        this.physics.add.collider(enemy.sprite, this.platforms);
        this.physics.add.collider(enemy.sprite, this.player.sprite, this.handlePlayerEnemyCollision, undefined, this);
    }

    private playerAttack(): void {
        const damage = this.player.performBasicAttack();
        if (damage) {
            this.checkEnemyHits(damage);
        }
    }

    private playerSpecialAttack(): void {
        const damage = this.player.performSpecialAttack();
        if (damage) {
            this.checkEnemyHits(damage);
        }
    }

    private checkEnemyHits(damage: number): void {
        const attackRange = 80;
        let hitCount = 0;

        this.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                const distance = enemy.getDistanceTo(this.player.sprite);
                if (distance <= attackRange) {
                    const isAlive = enemy.takeDamage(damage);
                    if (!isAlive) {
                        hitCount++;
                        this.handleEnemyDeath(enemy);
                    }
                }
            }
        });

        if (hitCount > 0) {
            const comboData = this.player.getComboData();
            this.scoreManager.addEnemyKill(10, comboData.count);
        }
    }

    private handlePlayerEnemyCollision(playerSprite: any, enemySprite: any): void {
        const enemy = this.enemies.find(e => e.sprite === enemySprite);
        if (enemy && enemy.isAlive && !this.player.isInvulnerable) {
            const isAlive = this.player.takeDamage(enemy.getDamage());
            if (!isAlive) {
                this.endGame();
            }
        }
    }

    private handleEnemyAttack(enemy: any, damage: number): void {
        const enemyEntity = this.enemies.find(e => e === enemy);
        if (enemyEntity && enemyEntity.isInAttackRange(this.player.sprite)) {
            const isAlive = this.player.takeDamage(damage);
            if (!isAlive) {
                this.endGame();
            }
        }
    }

    private handleEnemyRangedAttack(enemy: any, damage: number): void {
        // For now, treat ranged attacks the same as melee
        this.handleEnemyAttack(enemy, damage);
    }

    private handleEnemyDeath(enemy: EnemyEntity): void {
        this.scoreManager.addEnemyKill(enemy.getPoints(), this.player.getComboData().count);
        
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    private endGame(): void {
        this.gameOver = true;
        const finalScore = this.scoreManager.endGame();
        
        console.log('Game Over! Final Score:', finalScore);
        
        // Emit game over event
        EventCenter.emit('gameOver', finalScore);
        
        // Transition to game over scene
        this.scene.start('GameOver', { score: finalScore });
    }

    update(time: number, delta: number) {
        if (!this.gameStarted || this.gameOver) return;

        // Update player
        this.player.update(time, delta);

        // Update enemies
        this.enemies.forEach(enemy => enemy.update(time, delta));

        // Update enemy manager and AI
        this.enemyManager.update(time, delta, this.player.sprite);
        this.updateEnemyAI();

        // Update score manager
        this.scoreManager.updateSurvivalBonus();

        // Handle player movement
        this.handlePlayerMovement();

        // Update UI
        this.updateUI();

        // Check for wave completion
        if (this.enemyManager.isWaveComplete()) {
            this.completeWave();
        }
    }

    private handlePlayerMovement(): void {
        const { left, right, up } = this.cursors;

        if (left.isDown) {
            this.player.move('left');
        } else if (right.isDown) {
            this.player.move('right');
        } else {
            this.player.move('stop');
        }

        if (up.isDown) {
            this.player.jump();
        }
    }

    private updateUI(): void {
        // Update health
        this.healthText.setText(`Health: ${this.player.getHealth()}/${this.player.getMaxHealth()}`);

        // Update energy
        this.energyText.setText(`Energy: ${Math.floor(this.player.getEnergy())}/${this.player.getMaxEnergy()}`);

        // Update score
        this.scoreText.setText(`Score: ${this.scoreManager.formatScore(this.scoreManager.getCurrentScore())}`);

        // Update wave
        this.waveText.setText(`Wave: ${this.enemyManager.getWaveNumber()}`);

        // Update combo
        const comboData = this.player.getComboData();
        this.comboText.setText(`Combo: ${comboData.count}x`);

        // Update health bar color based on health percentage
        const healthPercentage = this.player.getHealthPercentage();
        if (healthPercentage < 25) {
            this.healthText.setColor('#ff0000');
        } else if (healthPercentage < 50) {
            this.healthText.setColor('#ffff00');
        } else {
            this.healthText.setColor('#ffffff');
        }

        // Update energy bar color based on energy percentage
        const energyPercentage = this.player.getEnergyPercentage();
        if (energyPercentage < 25) {
            this.energyText.setColor('#ff0000');
        } else if (energyPercentage < 50) {
            this.energyText.setColor('#ffff00');
        } else {
            this.energyText.setColor('#ffffff');
        }
    }

    private updateEnemyAI(): void {
        this.enemies.forEach(enemy => {
            if (!enemy.isAlive) return;

            const distanceToPlayer = enemy.getDistanceTo(this.player.sprite);

            switch (enemy.type.behavior) {
                case 'patrol':
                    // Patrol behavior is handled in the EnemyEntity class
                    break;
                case 'chase':
                    this.updateChaseBehavior(enemy, distanceToPlayer);
                    break;
                case 'ranged':
                    this.updateRangedBehavior(enemy, distanceToPlayer);
                    break;
            }
        });
    }

    private updateChaseBehavior(enemy: EnemyEntity, distance: number): void {
        const chaseSpeed = enemy.stats.speed;
        const attackRange = 50;

        if (distance > attackRange) {
            // Move towards player
            enemy.moveTowards(this.player.sprite.x, this.player.sprite.y, chaseSpeed);
        } else {
            // Attack player
            enemy.stopMoving();
            if (enemy.canAttack()) {
                enemy.performAttack();
                const isAlive = this.player.takeDamage(enemy.getDamage());
                if (!isAlive) {
                    this.endGame();
                }
            }
        }
    }

    private updateRangedBehavior(enemy: EnemyEntity, distance: number): void {
        const attackRange = 150;
        const optimalRange = 100;

        if (distance > attackRange) {
            // Move towards player
            enemy.moveTowards(this.player.sprite.x, this.player.sprite.y, enemy.stats.speed * 0.7);
        } else if (distance < optimalRange) {
            // Move away from player
            const angle = Phaser.Math.Angle.Between(this.player.sprite.x, this.player.sprite.y, enemy.sprite.x, enemy.sprite.y);
            enemy.sprite.setVelocity(
                Math.cos(angle) * enemy.stats.speed * 0.5,
                Math.sin(angle) * enemy.stats.speed * 0.5
            );
        } else {
            // Attack from range
            enemy.stopMoving();
            if (enemy.canAttack()) {
                enemy.performAttack();
                const isAlive = this.player.takeDamage(enemy.getDamage());
                if (!isAlive) {
                    this.endGame();
                }
            }
        }
    }

    private completeWave(): void {
        const waveNumber = this.enemyManager.getWaveNumber();
        this.scoreManager.addWaveBonus(waveNumber);
        this.enemyManager.nextWave();
        
        console.log(`Wave ${waveNumber} completed! Starting wave ${waveNumber + 1}`);
    }
}