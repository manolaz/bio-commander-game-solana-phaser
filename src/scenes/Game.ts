import { DEFAULT_WIDTH } from '@/components/Game';
import { Umi } from '@metaplex-foundation/umi';
import { Scene } from 'phaser';
import { Player } from '@/entities/Player';
import { EnemyEntity } from '@/entities/Enemy';
import { EnemyManager } from '@/systems/EnemyManager';
import { ScoreManager } from '@/systems/ScoreManager';
import { SoundManager } from '@/systems/SoundManager';
import { GameHUD } from '@/systems/GameHUD';
import EventCenter from '@/events/eventCenter';

export class Game extends Scene {
    private umi!: Umi;
    private player!: Player;
    private enemyManager!: EnemyManager;
    private scoreManager!: ScoreManager;
    private soundManager!: SoundManager;
    private gameHUD!: GameHUD;
    private enemies: EnemyEntity[] = [];
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameStarted: boolean = false;
    private gameOver: boolean = false;
    private currentWave: number = 1;
    private waveStartTime: number = 0;

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
        
        // Start gameplay music
        this.soundManager.playMusic('gameplay');
        
        // Play game start sound
        this.soundManager.playGameStart();
        this.soundManager.vibrateShort();
        
        this.gameStarted = true;
        this.scoreManager.startGame();
        this.waveStartTime = Date.now();
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
        this.soundManager = new SoundManager(this);
        this.soundManager.initialize();

        // Create player
        this.player = new Player(this, {
            x: DEFAULT_WIDTH / 2,
            y: 450,
            spriteKey: 'hero1', // Use hero1 as the initial sprite key
            stats: {
                health: 100,
                maxHealth: 100,
                energy: 100,
                maxEnergy: 100,
                attackPower: 25,
                defense: 10
            },
            soundManager: this.soundManager
        });

        // Setup keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    private setupUI(): void {
        // Create GameHUD
        this.gameHUD = new GameHUD({
            scene: this,
            x: 20,
            y: 20,
            width: 760,
            height: 120
        });

        // Initialize HUD with player stats
        this.gameHUD.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
        this.gameHUD.updateEnergy(this.player.getEnergy(), this.player.getMaxEnergy());
        this.gameHUD.updateScore(0);
        this.gameHUD.updateDifficultyLevel(this.currentWave);
        this.gameHUD.updateShieldStatus(this.player.isShieldActive);
    }

    private setupInput(): void {
        // Add space key for attack
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.gameOver) {
                this.playerAttack();
            }
        });

        // Add shift key for special attack
        this.input.keyboard.on('keydown-SHIFT', () => {
            if (!this.gameOver) {
                this.playerSpecialAttack();
            }
        });
    }

    private setupCollisions(): void {
        // Player-Platform collisions
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Player-Enemy collisions will be set up dynamically when enemies are spawned
    }

    private setupEventListeners(): void {
        // Listen for enemy spawn events
        EventCenter.on('enemySpawned', (enemy: EnemyEntity) => {
            this.enemies.push(enemy);
            this.physics.add.collider(this.player.sprite, enemy.sprite, this.handlePlayerEnemyCollision, undefined, this);
        });

        // Listen for enemy death events
        EventCenter.on('enemyDied', (enemy: EnemyEntity) => {
            this.handleEnemyDeath(enemy);
        });

        // Listen for player damage events
        EventCenter.on('playerDamaged', (damage: number) => {
            this.soundManager.playHitHurt();
            this.soundManager.vibrateShort();
        });

        // Listen for player healing events
        EventCenter.on('playerHealed', (amount: number) => {
            this.soundManager.playPowerUp();
            this.soundManager.vibrateShort();
        });

        // Listen for score events
        EventCenter.on('scoreIncreased', (points: number) => {
            if (points >= 100) {
                this.soundManager.playSynth();
            }
        });
    }

    private spawnEnemy(enemyType: any): void {
        const enemy = new EnemyEntity(this, {
            x: Math.random() * 800,
            y: 0,
            type: enemyType
        });

        this.enemies.push(enemy);
        this.physics.add.collider(this.player.sprite, enemy.sprite, this.handlePlayerEnemyCollision, undefined, this);
    }

    private playerAttack(): void {
        const damage = this.player.performBasicAttack();
        if (damage !== null) {
            this.soundManager.playExplosion();
            this.soundManager.vibrateShort();
            this.checkEnemyHits(damage);
        }
    }

    private playerSpecialAttack(): void {
        const damage = this.player.performSpecialAttack();
        if (damage !== null) {
            this.soundManager.playLaserShoot();
            this.soundManager.vibrateLong();
            this.checkEnemyHits(damage);
        }
    }

    private checkEnemyHits(damage: number): void {
        this.enemies.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(
                this.player.sprite.x,
                this.player.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y
            );

            if (distance < 100) {
                const isAlive = enemy.takeDamage(damage);
                this.soundManager.playHitHurt();
                
                if (!isAlive) {
                    this.handleEnemyDeath(enemy);
                }
            }
        });
    }

    private handlePlayerEnemyCollision(playerSprite: any, enemySprite: any): void {
        const enemy = this.enemies.find(e => e.sprite === enemySprite);
        if (!enemy) return;

        // Player takes damage
        const damage = enemy.stats.attackPower - this.player.combatSystem.getStats().defense;
        const isAlive = this.player.takeDamage(Math.max(1, damage));

        // Play damage sound
        this.soundManager.playHitHurt();
        this.soundManager.vibrateShort();

        // Check if player is dead
        if (!isAlive) {
            this.endGame();
        }
    }

    private handleEnemyAttack(enemy: any, damage: number): void {
        const isAlive = this.player.takeDamage(damage);
        this.soundManager.playHitHurt();
        this.soundManager.vibrateShort();
        
        if (!isAlive) {
            this.endGame();
        }
    }

    private handleEnemyRangedAttack(enemy: any, damage: number): void {
        const isAlive = this.player.takeDamage(damage);
        this.soundManager.playLaserShoot();
        this.soundManager.vibrateShort();
        
        if (!isAlive) {
            this.endGame();
        }
    }

    private handleEnemyDeath(enemy: EnemyEntity): void {
        // Remove enemy from array
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }

        // Play death sound
        this.soundManager.playExplosion();
        this.soundManager.vibrateShort();

        // Update score
        this.scoreManager.addEnemyKill(enemy.stats.points, 1);
        this.gameHUD.updateScore(this.scoreManager.getCurrentScore());

        // Check if wave is complete
        if (this.enemies.length === 0) {
            this.completeWave();
        }
    }

    private endGame(): void {
        this.gameOver = true;
        
        // Play game over sound and music
        this.soundManager.playGameOver();
        this.soundManager.fadeMusic(1000);
        this.soundManager.vibratePattern();
        
        // Stop all game systems - EnemyManager doesn't have a stop method, so we just set gameOver
        // this.waveInProgress = false; // This line was removed from the new_code, so it's removed here.
        
        // Transition to game over scene
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver', { 
                umi: this.umi,
                score: this.scoreManager.getCurrentScore(),
                wave: this.currentWave
            });
        });
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

        // Update GameHUD
        this.gameHUD.update(delta);

        // Check for wave completion
        if (this.enemyManager.isWaveComplete()) {
            this.completeWave();
        }
    }

    private handlePlayerMovement(): void {
        const { left, right, up } = this.cursors;

        if (left?.isDown) {
            this.player.move('left');
        } else if (right?.isDown) {
            this.player.move('right');
        } else {
            this.player.move('stop');
        }

        if (up?.isDown && this.player.sprite.body?.touching.down) {
            this.player.jump();
        }
    }

    private updateUI(): void {
        // Update HUD with current player stats
        this.gameHUD.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
        this.gameHUD.updateEnergy(this.player.getEnergy(), this.player.getMaxEnergy());
        this.gameHUD.updateScore(this.scoreManager.getCurrentScore());
        this.gameHUD.updateDifficultyLevel(this.currentWave);
        this.gameHUD.updateShieldStatus(this.player.isShieldActive);
    }

    private updateEnemyAI(): void {
        this.enemies.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(
                this.player.sprite.x,
                this.player.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y
            );

            if (enemy.type.behavior === 'chase') {
                this.updateChaseBehavior(enemy, distance);
            } else if (enemy.type.behavior === 'ranged') {
                this.updateRangedBehavior(enemy, distance);
            }
        });
    }

    private updateChaseBehavior(enemy: EnemyEntity, distance: number): void {
        if (distance < 200) {
            // Chase player
            const direction = this.player.sprite.x > enemy.sprite.x ? 1 : -1;
            enemy.moveTowards(this.player.sprite.x, this.player.sprite.y, enemy.stats.speed);
        } else {
            // Patrol - enemy will handle this internally
        }

        // Attack if close enough
        if (distance < 50 && enemy.canAttack()) {
            enemy.performAttack();
        }
    }

    private updateRangedBehavior(enemy: EnemyEntity, distance: number): void {
        if (distance < 300) {
            // Keep distance and shoot
            const direction = this.player.sprite.x > enemy.sprite.x ? -1 : 1;
            enemy.moveTowards(this.player.sprite.x, this.player.sprite.y, enemy.stats.speed * 0.7);
            
            if (distance > 100 && enemy.canAttack()) {
                enemy.performAttack();
            }
        } else {
            // Move towards player
            const direction = this.player.sprite.x > enemy.sprite.x ? 1 : -1;
            enemy.moveTowards(this.player.sprite.x, this.player.sprite.y, enemy.stats.speed);
        }
    }

    private completeWave(): void {
        this.currentWave++;
        
        // Play level up sound for wave completion
        this.soundManager.playLevelUp();
        this.soundManager.vibrateLong();
        
        // Update HUD
        this.gameHUD.updateDifficultyLevel(this.currentWave);
        
        // Start next wave
        this.enemyManager.nextWave();
        this.waveStartTime = Date.now();
    }

    shutdown() {
        // Clean up sound manager when scene is destroyed
        if (this.soundManager) {
            this.soundManager.destroy();
        }
    }
}