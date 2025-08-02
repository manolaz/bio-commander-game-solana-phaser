export interface GameHUDConfig {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export class GameHUD {
    private scene: Phaser.Scene;
    private container!: Phaser.GameObjects.Container;
    private background!: Phaser.GameObjects.Graphics;
    private healthBar!: Phaser.GameObjects.Graphics;
    private energyBar!: Phaser.GameObjects.Graphics;
    private healthText!: Phaser.GameObjects.Text;
    private energyText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private shieldIndicator!: Phaser.GameObjects.Text;
    private difficultyIndicator!: Phaser.GameObjects.Text;
    private timeIndicator!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    
    private currentHealth: number = 100;
    private maxHealth: number = 100;
    private currentEnergy: number = 100;
    private maxEnergy: number = 100;
    private currentScore: number = 0;
    private currentCombo: number = 0;
    private isShielded: boolean = false;
    private difficultyLevel: number = 1;
    private gameTime: number = 0;
    private healthBarColor: number = 0xe74c3c;
    private energyBarColor: number = 0x3498db;

    constructor(config: GameHUDConfig) {
        this.scene = config.scene;
        this.x = config.x || 20;
        this.y = config.y || 60;
        this.width = config.width || 760;
        this.height = config.height || 120;
        
        this.createHUD();
    }

    private createHUD(): void {
        // Create container for all HUD elements
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(1000);

        // Create background
        this.createBackground();
        
        // Create health bar
        this.createHealthBar();
        
        // Create energy bar
        this.createEnergyBar();
        
        // Create text elements
        this.createTextElements();
        
        // Create status indicators
        this.createStatusIndicators();
    }

    private createBackground(): void {
        this.background = this.scene.add.graphics();
        this.background.fillStyle(0x0f0f23, 0.95);
        this.background.lineStyle(1, 0x667eea, 0.2);
        this.background.fillRoundedRect(0, 0, this.width, this.height, 24);
        this.background.strokeRoundedRect(0, 0, this.width, this.height, 24);
        this.container.add(this.background);
    }

    private createHealthBar(): void {
        this.healthBar = this.scene.add.graphics();
        this.container.add(this.healthBar);
    }

    private createEnergyBar(): void {
        this.energyBar = this.scene.add.graphics();
        this.container.add(this.energyBar);
    }

    private createTextElements(): void {
        // Health text
        this.healthText = this.scene.add.text(20, 20, 'Health: 100/100', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.container.add(this.healthText);

        // Energy text
        this.energyText = this.scene.add.text(20, 50, 'Energy: 100/100', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.container.add(this.energyText);

        // Score text
        this.scoreText = this.scene.add.text(this.width / 2, 20, 'Score: 0', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#f39c12',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.scoreText.setOrigin(0.5, 0);
        this.container.add(this.scoreText);

        // Combo text
        this.comboText = this.scene.add.text(this.width / 2, 50, 'Combo: 0x', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#e74c3c',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.comboText.setOrigin(0.5, 0);
        this.container.add(this.comboText);
    }

    private createStatusIndicators(): void {
        // Shield indicator
        this.shieldIndicator = this.scene.add.text(20, 80, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#27ae60',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.container.add(this.shieldIndicator);

        // Difficulty indicator
        this.difficultyIndicator = this.scene.add.text(this.width - 20, 20, 'Level 1', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#e67e22',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.difficultyIndicator.setOrigin(1, 0);
        this.container.add(this.difficultyIndicator);

        // Time indicator
        this.timeIndicator = this.scene.add.text(this.width - 20, 50, '00:00', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#9b59b6',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timeIndicator.setOrigin(1, 0);
        this.container.add(this.timeIndicator);
    }

    private updateHealthBar(): void {
        this.healthBar.clear();
        
        const barX = 20;
        const barY = 40;
        const barWidth = 200;
        const barHeight = 20;
        
        // Background
        this.healthBar.fillStyle(0xffffff, 0.1);
        this.healthBar.lineStyle(1, 0xffffff, 0.1);
        this.healthBar.fillRoundedRect(barX, barY, barWidth, barHeight, 12);
        this.healthBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 12);
        
        // Health fill
        const healthPercentage = this.currentHealth / this.maxHealth;
        const healthWidth = barWidth * healthPercentage;
        
        this.healthBar.fillStyle(this.healthBarColor, 1);
        this.healthBar.fillRoundedRect(barX, barY, healthWidth, barHeight, 12);
    }

    private updateEnergyBar(): void {
        this.energyBar.clear();
        
        const barX = 20;
        const barY = 70;
        const barWidth = 200;
        const barHeight = 20;
        
        // Background
        this.energyBar.fillStyle(0xffffff, 0.1);
        this.energyBar.lineStyle(1, 0xffffff, 0.1);
        this.energyBar.fillRoundedRect(barX, barY, barWidth, barHeight, 12);
        this.energyBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 12);
        
        // Energy fill
        const energyPercentage = this.currentEnergy / this.maxEnergy;
        const energyWidth = barWidth * energyPercentage;
        
        this.energyBar.fillStyle(this.energyBarColor, 1);
        this.energyBar.fillRoundedRect(barX, barY, energyWidth, barHeight, 12);
    }

    public updateHealth(health: number, maxHealth: number): void {
        this.currentHealth = health;
        this.maxHealth = maxHealth;
        this.healthText.setText(`Health: ${health}/${maxHealth}`);
        this.updateHealthBar();
    }

    public updateEnergy(energy: number, maxEnergy: number): void {
        this.currentEnergy = energy;
        this.maxEnergy = maxEnergy;
        this.energyText.setText(`Energy: ${energy}/${maxEnergy}`);
        this.updateEnergyBar();
    }

    public updateScore(score: number): void {
        this.currentScore = score;
        this.scoreText.setText(`Score: ${score}`);
    }

    public updateCombo(combo: number): void {
        this.currentCombo = combo;
        this.comboText.setText(`Combo: ${combo}x`);
    }

    public updateShieldStatus(isShielded: boolean): void {
        this.isShielded = isShielded;
        if (isShielded) {
            this.shieldIndicator.setText('🛡️ SHIELDED');
            this.shieldIndicator.setColor('#27ae60');
        } else {
            this.shieldIndicator.setText('');
        }
    }

    public updateDifficultyLevel(level: number): void {
        this.difficultyLevel = level;
        this.difficultyIndicator.setText(`Level ${level}`);
    }

    public updateGameTime(time: number): void {
        this.gameTime = time;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.timeIndicator.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    public updateHealthBarColor(color: string): void {
        // Convert hex color string to number
        this.healthBarColor = parseInt(color.replace('#', ''), 16);
        this.updateHealthBar();
    }

    public updateEnergyBarColor(color: string): void {
        // Convert hex color string to number
        this.energyBarColor = parseInt(color.replace('#', ''), 16);
        this.updateEnergyBar();
    }

    public update(delta: number): void {
        // Update game time
        this.gameTime += delta / 1000;
        this.updateGameTime(this.gameTime);
    }

    public setVisible(visible: boolean): void {
        this.container.setVisible(visible);
    }

    public destroy(): void {
        this.container.destroy();
    }
} 