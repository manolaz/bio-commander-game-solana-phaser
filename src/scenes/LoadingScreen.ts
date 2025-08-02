import { Scene, GameObjects, Tweens } from 'phaser';

export class LoadingScreen extends Scene {
    private background!: GameObjects.Graphics;
    private logo!: GameObjects.Text;
    private logoText!: GameObjects.Text;
    private logoSubtext!: GameObjects.Text;
    private loadingCircle!: GameObjects.Graphics;
    private loadingText!: GameObjects.Text;
    private progressBar!: GameObjects.Graphics;
    private progressBarBg!: GameObjects.Graphics;
    private particles: GameObjects.Graphics[] = [];
    private tips: GameObjects.Text[] = [];

    constructor() {
        super('LoadingScreen');
    }

    create() {
        this.createBackground();
        this.createParticles();
        this.createLogo();
        this.createLoadingIndicator();
        this.createProgressBar();
        this.createTips();
        this.startAnimations();
    }

    private createBackground() {
        // Main background
        this.background = this.add.graphics();
        this.background.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a);
        this.background.fillRect(0, 0, 800, 600);

        // Gradient layers
        const gradient1 = this.add.graphics();
        gradient1.fillStyle(0x667eea, 0.1);
        gradient1.fillEllipse(400, 120, 400, 200);

        const gradient2 = this.add.graphics();
        gradient2.fillStyle(0x9b59b6, 0.1);
        gradient2.fillEllipse(400, 480, 300, 150);
    }

    private createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xffffff, 0.3);
            particle.fillCircle(0, 0, 2);
            
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            particle.setPosition(x, y);
            
            this.particles.push(particle);
        }
    }

    private createLogo() {
        // Logo icon
        this.logo = this.add.text(400, 200, '🧬', {
            fontSize: '80px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Logo text
        this.logoText = this.add.text(400, 280, 'BIO COMMANDER', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#667eea',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Logo subtext
        this.logoSubtext = this.add.text(400, 310, 'Defend the Microscopic Realm', {
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)'
        }).setOrigin(0.5);
    }

    private createLoadingIndicator() {
        // Loading circle
        this.loadingCircle = this.add.graphics();
        this.loadingCircle.lineStyle(3, 0x667eea, 0.3);
        this.loadingCircle.strokeCircle(0, 0, 30);
        this.loadingCircle.lineStyle(3, 0x667eea, 1);
        this.loadingCircle.strokeCircle(0, 0, 30);
        this.loadingCircle.setPosition(400, 380);

        // Loading inner circle
        const innerCircle = this.add.graphics();
        innerCircle.fillStyle(0x667eea);
        innerCircle.fillCircle(0, 0, 10);
        innerCircle.setPosition(400, 380);

        // Loading text
        this.loadingText = this.add.text(400, 420, 'Initializing Bio-Defense Systems', {
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)'
        }).setOrigin(0.5);
    }

    private createProgressBar() {
        // Progress bar background
        this.progressBarBg = this.add.graphics();
        this.progressBarBg.fillStyle(0xffffff, 0.1);
        this.progressBarBg.fillRoundedRect(300, 450, 200, 4, 2);

        // Progress bar
        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0x667eea);
        this.progressBar.fillRoundedRect(300, 450, 0, 4, 2);
    }

    private createTips() {
        const tipTexts = [
            '💡 Tip: Draw shapes to attack enemies',
            '🛡️ Collect power-ups for special abilities',
            '⚡ Manage your energy wisely'
        ];

        tipTexts.forEach((tip, index) => {
            const tipText = this.add.text(400, 480 + (index * 20), tip, {
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)'
            }).setOrigin(0.5);
            this.tips.push(tipText);
        });
    }

    private startAnimations() {
        // Fade in animation
        this.tweens.add({
            targets: [this.logo, this.logoText, this.logoSubtext, this.loadingCircle, this.loadingText, this.progressBarBg],
            alpha: { from: 0, to: 1 },
            duration: 800,
            ease: 'Power2'
        });

        // Scale animation for logo
        this.tweens.add({
            targets: [this.logo, this.logoText, this.logoSubtext],
            scale: { from: 0.8, to: 1 },
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Rotating loading circle
        this.tweens.add({
            targets: this.loadingCircle,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsing logo
        this.tweens.add({
            targets: this.logo,
            scale: { from: 1, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Floating particles
        this.particles.forEach((particle, index) => {
            this.tweens.add({
                targets: particle,
                y: particle.y - 20,
                alpha: { from: 0.3, to: 0 },
                duration: 2000 + Math.random() * 1000,
                delay: index * 100,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Progress bar animation
        this.tweens.add({
            targets: this.progressBar,
            scaleX: { from: 0, to: 1 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Complete loading after 2.5 seconds
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: [this.logo, this.logoText, this.logoSubtext, this.loadingCircle, this.loadingText, this.progressBarBg, this.progressBar, ...this.tips, ...this.particles],
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            this.scene.start('MainMenu');
                        }
                    });
                });
            }
        });
    }
} 