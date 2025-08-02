import { Scene, GameObjects } from 'phaser';

export class PauseOverlay {
    private scene: Scene;
    private overlay!: GameObjects.Graphics;
    private container!: GameObjects.Container;
    private isVisible: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
        this.createOverlay();
    }

    private createOverlay() {
        // Create overlay background
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        this.overlay.fillRect(0, 0, 800, 600);

        // Create container for pause content
        this.container = this.scene.add.container(400, 300);

        // Pause icon background
        const iconBg = this.scene.add.graphics();
        iconBg.fillStyle(0x3498db, 0.1);
        iconBg.fillCircle(0, -50, 40);

        // Pause icon
        const pauseIcon = this.scene.add.text(0, -50, '⏸️', {
            fontSize: '48px'
        }).setOrigin(0.5);

        // Title
        const title = this.scene.add.text(0, 0, 'Game Paused', {
            fontSize: '24px',
            color: '#2c3e50',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Subtitle
        const subtitle = this.scene.add.text(0, 30, 'Tap the pause button to resume', {
            fontSize: '16px',
            color: '#7f8c8d'
        }).setOrigin(0.5);

        // Add elements to container
        this.container.add([iconBg, pauseIcon, title, subtitle]);

        // Initially hide the overlay
        this.hide();
    }

    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.overlay.setVisible(true);
            this.container.setVisible(true);

            // Add fade in animation
            this.scene.tweens.add({
                targets: [this.overlay, this.container],
                alpha: { from: 0, to: 1 },
                duration: 200,
                ease: 'Power2'
            });

            // Pause the game scene
            this.scene.scene.pause();
        }
    }

    hide() {
        if (this.isVisible) {
            this.isVisible = false;

            // Add fade out animation
            this.scene.tweens.add({
                targets: [this.overlay, this.container],
                alpha: { from: 1, to: 0 },
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.overlay.setVisible(false);
                    this.container.setVisible(false);
                    // Resume the game scene
                    this.scene.scene.resume();
                }
            });
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    isPaused(): boolean {
        return this.isVisible;
    }

    destroy() {
        this.overlay.destroy();
        this.container.destroy();
    }
} 