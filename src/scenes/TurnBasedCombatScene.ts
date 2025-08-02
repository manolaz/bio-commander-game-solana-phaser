import { Scene } from 'phaser';
import { Player } from '@/entities/Player';
import { EnemyEntity } from '@/entities/Enemy';

export interface CombatAction {
    id: string;
    name: string;
    damage: number;
    energyCost: number;
    actionPoints: number;
    description: string;
    type: 'attack' | 'defend' | 'special' | 'item';
    target: 'enemy' | 'self' | 'both';
}

export interface CombatState {
    playerHealth: number;
    playerEnergy: number;
    playerActionPoints: number;
    enemyHealth: number;
    enemyEnergy: number;
    enemyActionPoints: number;
    turn: 'player' | 'enemy';
    round: number;
}

export class TurnBasedCombatScene extends Scene {
    private player!: Player;
    private enemy!: EnemyEntity;
    private combatState!: CombatState;
    private actionButtons: Phaser.GameObjects.Container[] = [];
    private uiContainer!: Phaser.GameObjects.Container;
    private background!: Phaser.GameObjects.Graphics;
    private playerSprite!: Phaser.GameObjects.Sprite;
    private enemySprite!: Phaser.GameObjects.Sprite;
    private healthBars!: Phaser.GameObjects.Graphics;
    private actionPointsDisplay!: Phaser.GameObjects.Text;
    private turnIndicator!: Phaser.GameObjects.Text;
    private combatLog!: Phaser.GameObjects.Text;
    private enemyType: string = 'virus';
    private zone: string = 'heart';
    private isBoss: boolean = false;
    private onComplete?: (victory: boolean) => void;

    // Combat actions
    private playerActions: CombatAction[] = [
        {
            id: 'basic_attack',
            name: 'Basic Attack',
            damage: 25,
            energyCost: 0,
            actionPoints: 1,
            description: 'Standard attack',
            type: 'attack',
            target: 'enemy'
        },
        {
            id: 'special_attack',
            name: 'Special Attack',
            damage: 40,
            energyCost: 20,
            actionPoints: 2,
            description: 'Powerful special move',
            type: 'special',
            target: 'enemy'
        },
        {
            id: 'defend',
            name: 'Defend',
            damage: 0,
            energyCost: 0,
            actionPoints: 1,
            description: 'Reduce incoming damage',
            type: 'defend',
            target: 'self'
        },
        {
            id: 'heal',
            name: 'Heal',
            damage: -30,
            energyCost: 15,
            actionPoints: 2,
            description: 'Restore health',
            type: 'special',
            target: 'self'
        }
    ];

    private enemyActions: CombatAction[] = [
        {
            id: 'enemy_attack',
            name: 'Attack',
            damage: 20,
            energyCost: 0,
            actionPoints: 1,
            description: 'Basic enemy attack',
            type: 'attack',
            target: 'enemy'
        },
        {
            id: 'enemy_special',
            name: 'Special Move',
            damage: 35,
            energyCost: 15,
            actionPoints: 2,
            description: 'Enemy special attack',
            type: 'special',
            target: 'enemy'
        }
    ];

    constructor() {
        super('TurnBasedCombatScene');
    }

    init(data: { enemyType: string; zone: string; isBoss?: boolean; onComplete?: (victory: boolean) => void }) {
        this.enemyType = data.enemyType;
        this.zone = data.zone;
        this.isBoss = data.isBoss || false;
        this.onComplete = data.onComplete;
    }

    create() {
        this.setupCombatScene();
        this.setupCombatants();
        this.setupUI();
        this.setupCombatState();
        this.setupActionButtons();
        this.setupEventListeners();
        this.startCombat();
    }

    private setupCombatScene(): void {
        // Create background
        this.background = this.add.graphics();
        this.background.fillStyle(0x1a1a2e, 1);
        this.background.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Add combat arena background
        this.createCombatArena();
    }

    private createCombatArena(): void {
        const arena = this.add.graphics();
        
        // Create arena circle
        arena.lineStyle(4, 0x4a90e2, 0.8);
        arena.strokeCircle(this.cameras.main.width / 2, this.cameras.main.height / 2, 200);
        
        // Add arena glow
        arena.lineStyle(2, 0x4a90e2, 0.3);
        arena.strokeCircle(this.cameras.main.width / 2, this.cameras.main.height / 2, 220);
    }

    private setupCombatants(): void {
        // Setup player sprite
        this.playerSprite = this.add.sprite(200, 300, 'hero1');
        this.playerSprite.setScale(1.2);
        this.playerSprite.setDepth(2);

        // Setup enemy sprite
        this.enemySprite = this.add.sprite(600, 300, 'dude');
        this.enemySprite.setScale(1.2);
        this.enemySprite.setDepth(2);

        // Set enemy color based on type
        switch (this.enemyType) {
            case 'virus':
                this.enemySprite.setTint(0xff0000);
                break;
            case 'bacteria':
                this.enemySprite.setTint(0x00ff00);
                break;
            case 'fungi':
                this.enemySprite.setTint(0xff8800);
                break;
            case 'boss':
                this.enemySprite.setTint(0x8e44ad);
                this.enemySprite.setScale(1.5);
                break;
        }

        // Add combat animations
        this.setupCombatAnimations();
    }

    private setupCombatAnimations(): void {
        // Player attack animation
        this.tweens.add({
            targets: this.playerSprite,
            x: 250,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });

        // Enemy attack animation
        this.tweens.add({
            targets: this.enemySprite,
            x: 550,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }

    private setupCombatState(): void {
        this.combatState = {
            playerHealth: 100,
            playerEnergy: 100,
            playerActionPoints: 3,
            enemyHealth: this.isBoss ? 200 : 100,
            enemyEnergy: 100,
            enemyActionPoints: 2,
            turn: 'player',
            round: 1
        };
    }

    private setupUI(): void {
        this.uiContainer = this.add.container(0, 0);

        // Health bars
        this.healthBars = this.add.graphics();
        this.uiContainer.add(this.healthBars);

        // Action points display
        this.actionPointsDisplay = this.add.text(20, 20, 'Action Points: 3', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.uiContainer.add(this.actionPointsDisplay);

        // Turn indicator
        this.turnIndicator = this.add.text(this.cameras.main.width / 2, 50, 'YOUR TURN', {
            fontSize: '24px',
            color: '#4a90e2',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.uiContainer.add(this.turnIndicator);

        // Combat log
        this.combatLog = this.add.text(20, this.cameras.main.height - 120, '', {
            fontSize: '14px',
            color: '#cccccc',
            wordWrap: { width: this.cameras.main.width - 40 }
        });
        this.uiContainer.add(this.combatLog);

        this.uiContainer.setDepth(10);
    }

    private setupActionButtons(): void {
        const buttonY = this.cameras.main.height - 80;
        const buttonSpacing = 150;

        this.playerActions.forEach((action, index) => {
            const button = this.createActionButton(
                action,
                50 + (index * buttonSpacing),
                buttonY
            );
            this.actionButtons.push(button);
        });
    }

    private createActionButton(action: CombatAction, x: number, y: number): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x2c3e50, 0.8);
        buttonBg.fillRoundedRect(0, 0, 140, 60, 8);
        buttonBg.lineStyle(2, 0x4a90e2, 0.8);
        buttonBg.strokeRoundedRect(0, 0, 140, 60, 8);
        container.add(buttonBg);

        // Action name
        const nameText = this.add.text(70, 15, action.name, {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(nameText);

        // Action points cost
        const apText = this.add.text(70, 35, `AP: ${action.actionPoints}`, {
            fontSize: '10px',
            color: '#4a90e2'
        }).setOrigin(0.5);
        container.add(apText);

        // Energy cost
        if (action.energyCost > 0) {
            const energyText = this.add.text(70, 45, `EP: ${action.energyCost}`, {
                fontSize: '10px',
                color: '#f39c12'
            }).setOrigin(0.5);
            container.add(energyText);
        }

        // Make button interactive
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, 140, 60), Phaser.Geom.Rectangle.Contains);
        
        buttonBg.on('pointerdown', () => {
            this.executeAction(action);
        });

        buttonBg.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x34495e, 0.9);
            buttonBg.fillRoundedRect(0, 0, 140, 60, 8);
            buttonBg.lineStyle(2, 0x4a90e2, 1);
            buttonBg.strokeRoundedRect(0, 0, 140, 60, 8);
        });

        buttonBg.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x2c3e50, 0.8);
            buttonBg.fillRoundedRect(0, 0, 140, 60, 8);
            buttonBg.lineStyle(2, 0x4a90e2, 0.8);
            buttonBg.strokeRoundedRect(0, 0, 140, 60, 8);
        });

        return container;
    }

    private setupEventListeners(): void {
        // Handle escape key to exit combat
        this.input.keyboard.on('keydown-ESC', () => {
            this.exitCombat(false);
        });
    }

    private startCombat(): void {
        this.updateUI();
        this.logMessage('Combat started!');
        this.logMessage(`Fighting ${this.enemyType} in ${this.zone} zone`);
    }

    private executeAction(action: CombatAction): void {
        if (this.combatState.turn !== 'player') return;
        if (this.combatState.playerActionPoints < action.actionPoints) {
            this.logMessage('Not enough action points!');
            return;
        }
        if (this.combatState.playerEnergy < action.energyCost) {
            this.logMessage('Not enough energy!');
            return;
        }

        // Execute player action
        this.executePlayerAction(action);
        
        // Check if enemy is defeated
        if (this.combatState.enemyHealth <= 0) {
            this.endCombat(true);
            return;
        }

        // Switch to enemy turn
        this.combatState.turn = 'enemy';
        this.updateUI();
        this.logMessage('Enemy turn...');

        // Enemy AI turn
        this.time.delayedCall(1000, () => {
            this.executeEnemyTurn();
        });
    }

    private executePlayerAction(action: CombatAction): void {
        // Consume resources
        this.combatState.playerActionPoints -= action.actionPoints;
        this.combatState.playerEnergy -= action.energyCost;

        // Apply action effects
        switch (action.target) {
            case 'enemy':
                this.combatState.enemyHealth = Math.max(0, this.combatState.enemyHealth - action.damage);
                this.logMessage(`Player uses ${action.name} for ${action.damage} damage!`);
                this.showDamageEffect(this.enemySprite, action.damage);
                break;
            case 'self':
                if (action.damage < 0) {
                    // Healing
                    this.combatState.playerHealth = Math.min(100, this.combatState.playerHealth - action.damage);
                    this.logMessage(`Player heals for ${-action.damage} health!`);
                    this.showHealEffect(this.playerSprite, -action.damage);
                } else {
                    // Defending
                    this.logMessage('Player defends!');
                    this.showDefendEffect(this.playerSprite);
                }
                break;
        }

        // Play action animation
        this.playActionAnimation(action);
    }

    private executeEnemyTurn(): void {
        // Simple AI: choose random action
        const availableActions = this.enemyActions.filter(action => 
            this.combatState.enemyActionPoints >= action.actionPoints &&
            this.combatState.enemyEnergy >= action.energyCost
        );

        if (availableActions.length === 0) {
            this.logMessage('Enemy passes turn');
        } else {
            const action = availableActions[Math.floor(Math.random() * availableActions.length)];
            
            // Consume resources
            this.combatState.enemyActionPoints -= action.actionPoints;
            this.combatState.enemyEnergy -= action.energyCost;

            // Apply damage to player
            this.combatState.playerHealth = Math.max(0, this.combatState.playerHealth - action.damage);
            this.logMessage(`Enemy uses ${action.name} for ${action.damage} damage!`);
            this.showDamageEffect(this.playerSprite, action.damage);
            this.playActionAnimation(action);
        }

        // Check if player is defeated
        if (this.combatState.playerHealth <= 0) {
            this.endCombat(false);
            return;
        }

        // Switch back to player turn
        this.combatState.turn = 'player';
        this.combatState.round++;
        this.combatState.playerActionPoints = 3;
        this.combatState.enemyActionPoints = 2;
        
        this.updateUI();
        this.logMessage('Your turn!');
    }

    private playActionAnimation(action: CombatAction): void {
        if (action.target === 'enemy') {
            // Player attacks enemy
            this.tweens.add({
                targets: this.playerSprite,
                x: 250,
                duration: 200,
                yoyo: true,
                ease: 'Power2'
            });
        } else {
            // Enemy attacks player
            this.tweens.add({
                targets: this.enemySprite,
                x: 550,
                duration: 200,
                yoyo: true,
                ease: 'Power2'
            });
        }
    }

    private showDamageEffect(target: Phaser.GameObjects.Sprite, damage: number): void {
        // Create damage text
        const damageText = this.add.text(target.x, target.y - 50, `-${damage}`, {
            fontSize: '20px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate damage text
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });

        // Flash target red
        target.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            target.clearTint();
        });
    }

    private showHealEffect(target: Phaser.GameObjects.Sprite, heal: number): void {
        // Create heal text
        const healText = this.add.text(target.x, target.y - 50, `+${heal}`, {
            fontSize: '20px',
            color: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate heal text
        this.tweens.add({
            targets: healText,
            y: healText.y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                healText.destroy();
            }
        });

        // Flash target green
        target.setTint(0x00ff00);
        this.time.delayedCall(200, () => {
            target.clearTint();
        });
    }

    private showDefendEffect(target: Phaser.GameObjects.Sprite): void {
        // Create shield effect
        const shield = this.add.graphics();
        shield.lineStyle(3, 0x3498db, 0.8);
        shield.strokeCircle(target.x, target.y, 40);

        this.tweens.add({
            targets: shield,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                shield.destroy();
            }
        });
    }

    private updateUI(): void {
        // Update health bars
        this.updateHealthBars();

        // Update action points display
        this.actionPointsDisplay.setText(`Action Points: ${this.combatState.playerActionPoints}`);

        // Update turn indicator
        this.turnIndicator.setText(this.combatState.turn === 'player' ? 'YOUR TURN' : 'ENEMY TURN');
        this.turnIndicator.setColor(this.combatState.turn === 'player' ? '#4a90e2' : '#e74c3c');

        // Update action buttons
        this.updateActionButtons();
    }

    private updateHealthBars(): void {
        this.healthBars.clear();

        // Player health bar
        const playerBarX = 20;
        const playerBarY = 60;
        const barWidth = 200;
        const barHeight = 20;

        // Player health background
        this.healthBars.fillStyle(0x2c3e50, 0.8);
        this.healthBars.fillRoundedRect(playerBarX, playerBarY, barWidth, barHeight, 5);

        // Player health fill
        const playerHealthPercent = this.combatState.playerHealth / 100;
        this.healthBars.fillStyle(0x27ae60, 1);
        this.healthBars.fillRoundedRect(playerBarX, playerBarY, barWidth * playerHealthPercent, barHeight, 5);

        // Player health border
        this.healthBars.lineStyle(2, 0xffffff, 0.8);
        this.healthBars.strokeRoundedRect(playerBarX, playerBarY, barWidth, barHeight, 5);

        // Player health text
        this.add.text(playerBarX + barWidth / 2, playerBarY + barHeight / 2, `Player: ${this.combatState.playerHealth}`, {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Enemy health bar
        const enemyBarX = this.cameras.main.width - 220;
        const enemyBarY = 60;

        // Enemy health background
        this.healthBars.fillStyle(0x2c3e50, 0.8);
        this.healthBars.fillRoundedRect(enemyBarX, enemyBarY, barWidth, barHeight, 5);

        // Enemy health fill
        const enemyMaxHealth = this.isBoss ? 200 : 100;
        const enemyHealthPercent = this.combatState.enemyHealth / enemyMaxHealth;
        this.healthBars.fillStyle(0xe74c3c, 1);
        this.healthBars.fillRoundedRect(enemyBarX, enemyBarY, barWidth * enemyHealthPercent, barHeight, 5);

        // Enemy health border
        this.healthBars.lineStyle(2, 0xffffff, 0.8);
        this.healthBars.strokeRoundedRect(enemyBarX, enemyBarY, barWidth, barHeight, 5);

        // Enemy health text
        this.add.text(enemyBarX + barWidth / 2, enemyBarY + barHeight / 2, `Enemy: ${this.combatState.enemyHealth}`, {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    private updateActionButtons(): void {
        this.actionButtons.forEach((button, index) => {
            const action = this.playerActions[index];
            const canUse = this.combatState.playerActionPoints >= action.actionPoints &&
                          this.combatState.playerEnergy >= action.energyCost;

            button.setAlpha(canUse ? 1 : 0.5);
        });
    }

    private logMessage(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        this.combatLog.setText(this.combatLog.text + logEntry);
        
        // Scroll to bottom
        this.combatLog.setY(this.cameras.main.height - 120 - (this.combatLog.text.split('\n').length - 1) * 16);
    }

    private endCombat(victory: boolean): void {
        if (victory) {
            this.logMessage('VICTORY! Enemy defeated!');
            this.showVictoryEffect();
        } else {
            this.logMessage('DEFEAT! You have been defeated!');
            this.showDefeatEffect();
        }

        // Wait a moment then exit
        this.time.delayedCall(2000, () => {
            this.exitCombat(victory);
        });
    }

    private showVictoryEffect(): void {
        const victoryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'VICTORY!', {
            fontSize: '48px',
            color: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: victoryText,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
    }

    private showDefeatEffect(): void {
        const defeatText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'DEFEAT!', {
            fontSize: '48px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: defeatText,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
    }

    private exitCombat(victory: boolean): void {
        if (this.onComplete) {
            this.onComplete(victory);
        }
        this.scene.stop();
    }

    update(time: number, delta: number) {
        // Combat scene doesn't need continuous updates
    }
} 