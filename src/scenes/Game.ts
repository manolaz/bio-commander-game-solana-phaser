import { DEFAULT_WIDTH } from '@/components/Game';
import { Umi } from '@metaplex-foundation/umi';
import { Scene } from 'phaser';
import { Player } from '@/entities/Player';
import { EnemyEntity } from '@/entities/Enemy';
import { EnemyManager, Enemy } from '@/systems/EnemyManager';
import { ScoreManager } from '@/systems/ScoreManager';
import { SoundManager } from '@/systems/SoundManager';
import { GameHUD } from '@/systems/GameHUD';
import EventCenter from '@/events/eventCenter';

interface ZoneConfig {
  id: string;
  name: string;
  emoji: string;
  enemies: EnemyConfig[];
  powerUps: PowerUpConfig[];
  background: string;
  difficulty: number;
}

interface EnemyConfig {
  type: 'virus' | 'bacteria' | 'fungi';
  name: string;
  spriteKey: string;
  health: number;
  damage: number;
  speed: number;
  points: number;
  spawnRate: number;
}

interface PowerUpConfig {
  type: string;
  name: string;
  spriteKey: string;
  value: number;
  rarity: string;
  spawnRate: number;
}

export class Game extends Scene {
    private umi!: Umi;
    private player!: Player;
    private enemyManager!: EnemyManager;
    private scoreManager!: ScoreManager;
    private soundManager!: SoundManager;
    private gameHUD!: GameHUD;
    private enemies: Enemy[] = [];
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameStarted: boolean = false;
    private gameOver: boolean = false;
    private currentWave: number = 1;
    private waveStartTime: number = 0;
    private selectedZone: string = 'heart';
    private zoneConfig!: ZoneConfig;

    constructor() {
        super('Game');
    }

    init(args: { umi: Umi; selectedZone?: string }) {
        this.umi = args.umi;
        this.selectedZone = args.selectedZone || 'heart';
        this.zoneConfig = this.getZoneConfig(this.selectedZone);
    }

    private getZoneConfig(zoneId: string): ZoneConfig {
        const zoneConfigs: Record<string, ZoneConfig> = {
            heart: {
                id: 'heart',
                name: 'Heart',
                emoji: '❤️',
                background: 'heart_bg',
                difficulty: 1,
                enemies: [
                    {
                        type: 'virus',
                        name: 'Corona Virus',
                        spriteKey: 'virus1',
                        health: 100,
                        damage: 25,
                        speed: 2,
                        points: 100,
                        spawnRate: 0.3
                    },
                    {
                        type: 'virus',
                        name: 'Flu Virus',
                        spriteKey: 'virus2',
                        health: 75,
                        damage: 15,
                        speed: 3,
                        points: 75,
                        spawnRate: 0.5
                    }
                ],
                powerUps: [
                    {
                        type: 'health',
                        name: 'Heart Health',
                        spriteKey: 'health_powerup',
                        value: 50,
                        rarity: 'common',
                        spawnRate: 0.2
                    },
                    {
                        type: 'shield',
                        name: 'Cardiac Shield',
                        spriteKey: 'shield_powerup',
                        value: 30,
                        rarity: 'rare',
                        spawnRate: 0.1
                    }
                ]
            },
            lungs: {
                id: 'lungs',
                name: 'Lungs',
                emoji: '🫁',
                background: 'lungs_bg',
                difficulty: 2,
                enemies: [
                    {
                        type: 'bacteria',
                        name: 'Pneumonia',
                        spriteKey: 'bacteria1',
                        health: 150,
                        damage: 30,
                        speed: 1,
                        points: 150,
                        spawnRate: 0.4
                    },
                    {
                        type: 'bacteria',
                        name: 'Tuberculosis',
                        spriteKey: 'bacteria2',
                        health: 200,
                        damage: 40,
                        speed: 1,
                        points: 200,
                        spawnRate: 0.2
                    }
                ],
                powerUps: [
                    {
                        type: 'energy',
                        name: 'Oxygen Boost',
                        spriteKey: 'energy_powerup',
                        value: 75,
                        rarity: 'epic',
                        spawnRate: 0.15
                    },
                    {
                        type: 'shield',
                        name: 'Breath Shield',
                        spriteKey: 'shield_powerup',
                        value: 45,
                        rarity: 'rare',
                        spawnRate: 0.1
                    }
                ]
            },
            brain: {
                id: 'brain',
                name: 'Brain',
                emoji: '🧠',
                background: 'brain_bg',
                difficulty: 3,
                enemies: [
                    {
                        type: 'bacteria',
                        name: 'Meningitis',
                        spriteKey: 'bacteria3',
                        health: 300,
                        damage: 50,
                        speed: 2,
                        points: 300,
                        spawnRate: 0.3
                    },
                    {
                        type: 'virus',
                        name: 'Encephalitis',
                        spriteKey: 'virus3',
                        health: 250,
                        damage: 45,
                        speed: 3,
                        points: 250,
                        spawnRate: 0.4
                    }
                ],
                powerUps: [
                    {
                        type: 'speed',
                        name: 'Neural Boost',
                        spriteKey: 'speed_powerup',
                        value: 100,
                        rarity: 'legendary',
                        spawnRate: 0.05
                    },
                    {
                        type: 'shield',
                        name: 'Mind Shield',
                        spriteKey: 'shield_powerup',
                        value: 60,
                        rarity: 'epic',
                        spawnRate: 0.1
                    }
                ]
            }
        };

        return zoneConfigs[zoneId] || zoneConfigs.heart;
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
        
        // Start the first wave immediately
        this.enemyManager.nextWave();
    }

    private setupGame(): void {
        // Create background based on zone
        const backgroundKey = this.zoneConfig.background || 'sky';
        this.add.image(400, 300, backgroundKey);

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 400, 'ground').setScale(0.5, 1).refreshBody();
        this.platforms.create(100, 300, 'ground').setScale(0.5, 1).refreshBody();
        this.platforms.create(700, 300, 'ground').setScale(0.5, 1).refreshBody();

        // Initialize game systems with zone configuration
        this.enemyManager = new EnemyManager();
        this.enemyManager.setZoneConfig(this.zoneConfig);
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
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    private setupUI(): void {
        // Create GameHUD with zone information
        this.gameHUD = new GameHUD({
            scene: this,
            x: 20,
            y: 20,
            width: 760,
            height: 120
        });

        // Initialize HUD with player stats and zone info
        this.gameHUD.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
        this.gameHUD.updateEnergy(this.player.getEnergy(), this.player.getMaxEnergy());
        this.gameHUD.updateScore(0);
        this.gameHUD.updateDifficultyLevel(this.currentWave);
        this.gameHUD.updateShieldStatus(this.player.isShieldActive);
        
        // Add zone display to HUD
        this.gameHUD.updateZoneInfo(this.zoneConfig.name, this.zoneConfig.emoji);

        // Add back to menu button
        this.createBackToMenuButton();
    }

    private createBackToMenuButton(): void {
        const backButton = this.add.text(20, 20, '← Back to Menu', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0, 0);

        backButton.setInteractive();
        backButton.setDepth(1001);

        backButton.on('pointerover', () => {
            backButton.setBackgroundColor('rgba(102, 126, 234, 0.7)');
        });

        backButton.on('pointerout', () => {
            backButton.setBackgroundColor('rgba(0, 0, 0, 0.5)');
        });

        backButton.on('pointerdown', () => {
            // Fade out music
            this.soundManager.fadeMusic(500);
            
            // Return to main menu
            this.time.delayedCall(500, () => {
                this.scene.start('MainMenu', { umi: this.umi });
            });
        });
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
        if (this.player.sprite && this.platforms) {
            this.physics.add.collider(this.player.sprite, this.platforms);
        }

        // Player-Enemy collisions will be set up dynamically when enemies are spawned
    }

    private setupEventListeners(): void {
        // Listen for enemy spawn events
        EventCenter.on('enemySpawned', (data: { type: any }) => {
            this.createEnemy(data.type);
        });

        // Listen for enemy death events
        EventCenter.on('enemyDied', (enemy: Enemy) => {
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

    private createEnemy(enemyType: any): void {
        // Create enemy sprite
        const spawnX = Math.random() * 800;
        const spawnY = 0;
        
        const enemySprite = this.physics.add.sprite(spawnX, spawnY, enemyType.spriteKey);
        
        // Create enemy instance
        const enemy = new Enemy(enemySprite, enemyType);
        
        // Add to enemy manager
        this.enemyManager.addEnemy(enemy);
        
        // Add to local enemies array
        this.enemies.push(enemy);
        
        // Setup collisions
        if (this.player.sprite && enemy.sprite) {
            this.physics.add.collider(this.player.sprite, enemy.sprite, this.handlePlayerEnemyCollision, undefined, this);
        }
        if (enemy.sprite && this.platforms) {
            this.physics.add.collider(enemy.sprite, this.platforms);
        }
        
        // Play roar sound when enemy spawns
        this.soundManager.playRoar();
    }

    private playerAttack(): void {
        const damage = this.player.performBasicAttack();
        if (damage !== null) {
            // Use sword sound for melee attacks
            this.soundManager.playSword();
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

    private handleEnemyDeath(enemy: Enemy): void {
        // Remove enemy from arrays
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        this.enemyManager.removeEnemy(enemy);

        // Destroy enemy sprite
        if (enemy.sprite) {
            enemy.sprite.destroy();
        }

        // Play death sound
        this.soundManager.playExplosion();
        this.soundManager.vibrateShort();

        // Update score
        this.scoreManager.addEnemyKill(enemy.stats.points, 1);
        this.gameHUD.updateScore(this.scoreManager.getCurrentScore());

        // Check if wave is complete
        if (this.enemyManager.isWaveComplete()) {
            this.completeWave();
        }
    }

    private endGame(): void {
        this.gameOver = true;
        
        // Play game over sound and music
        this.soundManager.playGameOver();
        this.soundManager.fadeMusic(1000);
        this.soundManager.vibratePattern();
        
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
        if (this.player.sprite) {
            this.enemyManager.update(time, delta, this.player.sprite);
        }

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

        if (up?.isDown && this.player.sprite?.body?.touching?.down) {
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

    private completeWave(): void {
        this.currentWave++;
        
        // Play adventure sound for wave completion (new adventure awaits!)
        this.soundManager.playAdventure();
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