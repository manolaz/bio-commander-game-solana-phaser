import { Scene } from 'phaser';
import { Player } from '@/entities/Player';
import { TurnBasedCombatScene } from '@/scenes/TurnBasedCombatScene';

export interface HexTile {
    x: number;
    y: number;
    type: 'empty' | 'encounter' | 'powerup' | 'checkpoint' | 'boss';
    discovered: boolean;
    cleared: boolean;
    enemyType?: string;
    powerUpType?: string;
}

export interface WorldMapConfig {
    width: number;
    height: number;
    hexSize: number;
    encounterChance: number;
    powerUpChance: number;
}

export class WorldMapScene extends Scene {
    private player!: Player;
    private hexTiles: HexTile[][] = [];
    private playerTile: { x: number; y: number } = { x: 0, y: 0 };
    private hexSize: number = 40;
    private mapWidth: number = 15;
    private mapHeight: number = 10;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey!: Phaser.Input.Keyboard.Key;
    private mapGraphics!: Phaser.GameObjects.Graphics;
    private playerSprite!: Phaser.GameObjects.Sprite;
    private uiContainer!: Phaser.GameObjects.Container;
    private encounterChance: number = 0.3;
    private powerUpChance: number = 0.15;
    private currentZone: string = 'heart';
    private playerHealth: number = 100;
    private playerEnergy: number = 100;
    private discoveredTiles: number = 0;
    private totalTiles: number = 0;

    constructor() {
        super('WorldMapScene');
    }

    init(data: { zone: string }) {
        this.currentZone = data.zone || 'heart';
    }

    create() {
        this.setupWorldMap();
        this.setupPlayer();
        this.setupInput();
        this.setupUI();
        this.generateHexGrid();
        this.setupCamera();
        this.setupEventListeners();
    }

    private setupWorldMap(): void {
        // Create background with honeycomb pattern
        this.add.graphics()
            .fillStyle(0x2c3e50, 1)
            .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Add honeycomb background pattern
        this.createHoneycombBackground();

        this.mapGraphics = this.add.graphics();
        this.mapGraphics.setDepth(1);
    }

    private createHoneycombBackground(): void {
        const graphics = this.add.graphics();
        graphics.setDepth(0);
        
        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const x = col * this.hexSize * 1.5;
                const y = row * this.hexSize * 1.3 + (col % 2) * this.hexSize * 0.65;
                
                this.drawHexagon(graphics, x, y, this.hexSize, 0x34495e, 0.3);
            }
        }
    }

    private generateHexGrid(): void {
        this.hexTiles = [];
        this.totalTiles = this.mapWidth * this.mapHeight;
        
        for (let row = 0; row < this.mapHeight; row++) {
            this.hexTiles[row] = [];
            for (let col = 0; col < this.mapWidth; col++) {
                const tile: HexTile = {
                    x: col,
                    y: row,
                    type: 'empty',
                    discovered: false,
                    cleared: false
                };

                // Determine tile type based on position and random chance
                if (col === 0 && row === 0) {
                    tile.type = 'checkpoint';
                    tile.discovered = true;
                    this.discoveredTiles++;
                } else if (col === this.mapWidth - 1 && row === this.mapHeight - 1) {
                    tile.type = 'boss';
                } else if (Math.random() < this.encounterChance) {
                    tile.type = 'encounter';
                    tile.enemyType = this.getRandomEnemyType();
                } else if (Math.random() < this.powerUpChance) {
                    tile.type = 'powerup';
                    tile.powerUpType = this.getRandomPowerUpType();
                }

                this.hexTiles[row][col] = tile;
            }
        }

        this.renderHexGrid();
    }

    private getRandomEnemyType(): string {
        const enemyTypes = ['virus', 'bacteria', 'fungi'];
        return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    }

    private getRandomPowerUpType(): string {
        const powerUpTypes = ['health', 'energy', 'shield', 'speed_boost', 'damage_boost'];
        return powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    }

    private renderHexGrid(): void {
        this.mapGraphics.clear();

        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const tile = this.hexTiles[row][col];
                const x = col * this.hexSize * 1.5;
                const y = row * this.hexSize * 1.3 + (col % 2) * this.hexSize * 0.65;

                let color = 0x34495e;
                let alpha = 0.5;

                if (tile.discovered) {
                    switch (tile.type) {
                        case 'encounter':
                            color = 0xe74c3c;
                            alpha = 0.8;
                            break;
                        case 'powerup':
                            color = 0x27ae60;
                            alpha = 0.8;
                            break;
                        case 'checkpoint':
                            color = 0x3498db;
                            alpha = 1;
                            break;
                        case 'boss':
                            color = 0x8e44ad;
                            alpha = 1;
                            break;
                        case 'empty':
                            color = 0x95a5a6;
                            alpha = 0.6;
                            break;
                    }
                }

                this.drawHexagon(this.mapGraphics, x, y, this.hexSize, color, alpha);

                // Add tile indicators
                if (tile.discovered) {
                    this.addTileIndicator(x, y, tile);
                }
            }
        }
    }

    private drawHexagon(graphics: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
        graphics.fillStyle(color, alpha);
        graphics.lineStyle(2, 0xffffff, 0.3);

        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            points.push({
                x: x + size * Math.cos(angle),
                y: y + size * Math.sin(angle)
            });
        }

        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fill();
        graphics.stroke();
    }

    private addTileIndicator(x: number, y: number, tile: HexTile): void {
        let emoji = '';
        let color = 0xffffff;

        switch (tile.type) {
            case 'encounter':
                emoji = '🦠';
                color = 0xe74c3c;
                break;
            case 'powerup':
                emoji = '⚡';
                color = 0x27ae60;
                break;
            case 'checkpoint':
                emoji = '🏥';
                color = 0x3498db;
                break;
            case 'boss':
                emoji = '👹';
                color = 0x8e44ad;
                break;
        }

        if (emoji) {
            const text = this.add.text(x, y, emoji, {
                fontSize: '20px'
            }).setOrigin(0.5);
            text.setDepth(2);
        }
    }

    private setupPlayer(): void {
        // Create player sprite (TCell)
        this.playerSprite = this.add.sprite(0, 0, 'hero1');
        this.playerSprite.setScale(0.8);
        this.playerSprite.setDepth(3);

        // Position player at starting tile
        this.updatePlayerPosition();

        // Add player glow effect
        const glow = this.add.graphics();
        glow.setDepth(2);
        this.add.tween({
            targets: glow,
            alpha: { from: 0.3, to: 0.8 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    private updatePlayerPosition(): void {
        const x = this.playerTile.x * this.hexSize * 1.5;
        const y = this.playerTile.y * this.hexSize * 1.3 + (this.playerTile.x % 2) * this.hexSize * 0.65;
        
        this.tweens.add({
            targets: this.playerSprite,
            x: x,
            y: y,
            duration: 300,
            ease: 'Power2'
        });
    }

    private setupInput(): void {
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    private setupUI(): void {
        this.uiContainer = this.add.container(10, 10);

        // Zone title
        const zoneTitle = this.add.text(0, 0, `${this.getZoneEmoji()} ${this.currentZone.toUpperCase()} ZONE`, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.uiContainer.add(zoneTitle);

        // Player stats
        const statsText = this.add.text(0, 40, 'Health: 100% | Energy: 100%', {
            fontSize: '16px',
            color: '#ffffff'
        });
        this.uiContainer.add(statsText);

        // Exploration progress
        const progressText = this.add.text(0, 70, 'Exploration: 0%', {
            fontSize: '16px',
            color: '#ffffff'
        });
        this.uiContainer.add(progressText);

        // Instructions
        const instructions = this.add.text(0, 100, 'Arrow Keys: Move | Space: Interact', {
            fontSize: '14px',
            color: '#cccccc'
        });
        this.uiContainer.add(instructions);

        this.uiContainer.setDepth(10);
    }

    private getZoneEmoji(): string {
        const zoneEmojis: Record<string, string> = {
            'heart': '❤️',
            'lungs': '🫁',
            'brain': '🧠',
            'liver': '🫀',
            'stomach': '🫃',
            'kidneys': '🫁'
        };
        return zoneEmojis[this.currentZone] || '🏥';
    }

    private setupCamera(): void {
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.hexSize * 1.5, this.mapHeight * this.hexSize * 1.3);
        this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);
    }

    private setupEventListeners(): void {
        // Handle tile interaction
        this.spaceKey.on('down', () => {
            this.interactWithCurrentTile();
        });
    }

    private interactWithCurrentTile(): void {
        const currentTile = this.hexTiles[this.playerTile.y][this.playerTile.x];
        
        if (!currentTile.discovered) {
            this.discoverTile(currentTile);
        } else {
            this.handleTileInteraction(currentTile);
        }
    }

    private discoverTile(tile: HexTile): void {
        tile.discovered = true;
        this.discoveredTiles++;
        
        // Show discovery animation
        this.showDiscoveryEffect(tile);
        
        // Update UI
        this.updateUI();
        
        // Re-render grid
        this.renderHexGrid();
    }

    private showDiscoveryEffect(tile: HexTile): void {
        const x = tile.x * this.hexSize * 1.5;
        const y = tile.y * this.hexSize * 1.3 + (tile.x % 2) * this.hexSize * 0.65;
        
        // Create discovery effect using graphics
        const discoveryEffect = this.add.graphics();
        discoveryEffect.fillStyle(0xffff00, 0.8);
        discoveryEffect.fillCircle(x, y, this.hexSize);
        
        // Animate the discovery effect
        this.tweens.add({
            targets: discoveryEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                discoveryEffect.destroy();
            }
        });
    }

    private handleTileInteraction(tile: HexTile): void {
        switch (tile.type) {
            case 'encounter':
                this.startCombat(tile);
                break;
            case 'powerup':
                this.collectPowerUp(tile);
                break;
            case 'checkpoint':
                this.restoreAtCheckpoint();
                break;
            case 'boss':
                this.startBossBattle(tile);
                break;
        }
    }

    private startCombat(tile: HexTile): void {
        if (tile.cleared) return;
        
        this.scene.pause();
        this.scene.launch('TurnBasedCombatScene', {
            enemyType: tile.enemyType || 'virus',
            zone: this.currentZone,
            onComplete: (victory: boolean) => {
                this.scene.resume();
                if (victory) {
                    tile.cleared = true;
                    this.showVictoryEffect(tile);
                } else {
                    this.handleDefeat();
                }
            }
        });
    }

    private startBossBattle(tile: HexTile): void {
        this.scene.pause();
        this.scene.launch('TurnBasedCombatScene', {
            enemyType: 'boss',
            zone: this.currentZone,
            isBoss: true,
            onComplete: (victory: boolean) => {
                this.scene.resume();
                if (victory) {
                    this.completeZone();
                } else {
                    this.handleDefeat();
                }
            }
        });
    }

    private collectPowerUp(tile: HexTile): void {
        if (tile.cleared) return;
        
        const powerUpType = tile.powerUpType || 'health';
        let effect = '';
        
        switch (powerUpType) {
            case 'health':
                this.playerHealth = Math.min(100, this.playerHealth + 30);
                effect = 'Health +30';
                break;
            case 'energy':
                this.playerEnergy = Math.min(100, this.playerEnergy + 40);
                effect = 'Energy +40';
                break;
            case 'shield':
                effect = 'Shield activated';
                break;
            case 'speed_boost':
                effect = 'Speed boost';
                break;
            case 'damage_boost':
                effect = 'Damage boost';
                break;
        }
        
        tile.cleared = true;
        this.showPowerUpEffect(tile, effect);
        this.updateUI();
    }

    private showPowerUpEffect(tile: HexTile, effect: string): void {
        const x = tile.x * this.hexSize * 1.5;
        const y = tile.y * this.hexSize * 1.3 + (tile.x % 2) * this.hexSize * 0.65;
        
        // Show effect text
        const effectText = this.add.text(x, y - 30, effect, {
            fontSize: '16px',
            color: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: effectText,
            y: y - 60,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                effectText.destroy();
            }
        });
    }

    private showVictoryEffect(tile: HexTile): void {
        const x = tile.x * this.hexSize * 1.5;
        const y = tile.y * this.hexSize * 1.3 + (tile.x % 2) * this.hexSize * 0.65;
        
        const victoryText = this.add.text(x, y - 30, 'VICTORY!', {
            fontSize: '18px',
            color: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: victoryText,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                victoryText.destroy();
            }
        });
    }

    private restoreAtCheckpoint(): void {
        this.playerHealth = 100;
        this.playerEnergy = 100;
        
        const checkpointText = this.add.text(
            this.playerSprite.x, 
            this.playerSprite.y - 30, 
            'FULLY RESTORED!', {
            fontSize: '16px',
            color: '#3498db',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: checkpointText,
            y: checkpointText.y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                checkpointText.destroy();
            }
        });
        
        this.updateUI();
    }

    private handleDefeat(): void {
        this.playerHealth = Math.max(0, this.playerHealth - 20);
        
        if (this.playerHealth <= 0) {
            this.gameOver();
        } else {
            this.updateUI();
        }
    }

    private gameOver(): void {
        this.scene.pause();
        this.scene.launch('GameOverScene', {
            score: this.discoveredTiles,
            zone: this.currentZone,
            reason: 'defeated'
        });
    }

    private completeZone(): void {
        this.scene.pause();
        this.scene.launch('ZoneCompleteScene', {
            zone: this.currentZone,
            discoveredTiles: this.discoveredTiles,
            totalTiles: this.totalTiles
        });
    }

    private updateUI(): void {
        const statsText = this.uiContainer.getAt(1) as Phaser.GameObjects.Text;
        const progressText = this.uiContainer.getAt(2) as Phaser.GameObjects.Text;
        
        if (statsText && progressText) {
            statsText.setText(`Health: ${this.playerHealth}% | Energy: ${this.playerEnergy}%`);
            progressText.setText(`Exploration: ${Math.round((this.discoveredTiles / this.totalTiles) * 100)}%`);
        }
    }

    private canMoveTo(newX: number, newY: number): boolean {
        return newX >= 0 && newX < this.mapWidth && 
               newY >= 0 && newY < this.mapHeight;
    }

    private movePlayer(direction: 'up' | 'down' | 'left' | 'right'): void {
        let newX = this.playerTile.x;
        let newY = this.playerTile.y;
        
        // Hexagonal movement system
        const isEvenRow = this.playerTile.y % 2 === 0;
        
        switch (direction) {
            case 'up':
                newY = Math.max(0, newY - 1);
                break;
            case 'down':
                newY = Math.min(this.mapHeight - 1, newY + 1);
                break;
            case 'left':
                newX = Math.max(0, newX - 1);
                break;
            case 'right':
                newX = Math.min(this.mapWidth - 1, newX + 1);
                break;
        }
        
        if (this.canMoveTo(newX, newY)) {
            this.playerTile.x = newX;
            this.playerTile.y = newY;
            this.updatePlayerPosition();
            
            // Discover adjacent tiles
            this.discoverAdjacentTiles();
        }
    }

    private discoverAdjacentTiles(): void {
        const directions = [
            { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: 1, y: 1 }
        ];
        
        directions.forEach(dir => {
            const newX = this.playerTile.x + dir.x;
            const newY = this.playerTile.y + dir.y;
            
            if (this.canMoveTo(newX, newY)) {
                const tile = this.hexTiles[newY][newX];
                if (!tile.discovered) {
                    tile.discovered = true;
                    this.discoveredTiles++;
                }
            }
        });
        
        this.renderHexGrid();
        this.updateUI();
    }

    update(time: number, delta: number) {
        // Handle player movement
        if (this.cursors.left.isDown) {
            this.movePlayer('left');
        } else if (this.cursors.right.isDown) {
            this.movePlayer('right');
        } else if (this.cursors.up.isDown) {
            this.movePlayer('up');
        } else if (this.cursors.down.isDown) {
            this.movePlayer('down');
        }
    }
} 