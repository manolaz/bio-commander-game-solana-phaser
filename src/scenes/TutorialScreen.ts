import { Scene, GameObjects } from 'phaser';

interface TutorialStep {
    title: string;
    description: string;
    icon: string;
    tips: string[];
}

export class TutorialScreen extends Scene {
    private background!: GameObjects.Graphics;
    private header!: GameObjects.Container;
    private content!: GameObjects.Container;
    private navigation!: GameObjects.Container;
    private currentStep: number = 0;
    private tutorialSteps: TutorialStep[] = [];

    constructor() {
        super('TutorialScreen');
    }

    create() {
        this.initializeTutorialSteps();
        this.createBackground();
        this.createHeader();
        this.createContent();
        this.createNavigation();
        this.showCurrentStep();
    }

    private initializeTutorialSteps() {
        this.tutorialSteps = [
            {
                title: 'Welcome to Bio Commander',
                description: 'You are a T-cell defending the microscopic realm against invading pathogens.',
                icon: '🧬',
                tips: [
                    'Your mission is to protect the body from viruses and bacteria',
                    'Use shape recognition to attack enemies effectively',
                    'Manage your health and energy carefully'
                ]
            },
            {
                title: 'Movement & Control',
                description: 'Control your T-cell by dragging it around the screen.',
                icon: '🎮',
                tips: [
                    'Drag your finger to move the T-cell',
                    'Stay away from enemies to avoid damage',
                    'Position yourself strategically for attacks'
                ]
            },
            {
                title: 'Shape Recognition',
                description: 'Draw shapes to perform different attacks against enemies.',
                icon: '✏️',
                tips: [
                    'Draw a circle for area damage',
                    'Draw a triangle for piercing attacks',
                    'Draw a square for shield activation',
                    'Draw a star for ultimate power'
                ]
            },
            {
                title: 'Enemy Types',
                description: 'Different enemies require different strategies.',
                icon: '🦠',
                tips: [
                    'Viruses are fast but weak',
                    'Bacteria are slow but tough',
                    'Some enemies have special abilities',
                    'Watch for enemy attack patterns'
                ]
            },
            {
                title: 'Power-ups & Resources',
                description: 'Collect power-ups to enhance your abilities.',
                icon: '⚡',
                tips: [
                    'Health packs restore your health',
                    'Energy orbs replenish your energy',
                    'Shield power-ups provide temporary protection',
                    'Use power-ups strategically'
                ]
            },
            {
                title: 'Advanced Strategies',
                description: 'Master these techniques to become an elite bio-commander.',
                icon: '🎯',
                tips: [
                    'Chain attacks for combo bonuses',
                    'Use the environment to your advantage',
                    'Learn enemy spawn patterns',
                    'Practice shape drawing for accuracy'
                ]
            }
        ];
    }

    private createBackground() {
        // Main background
        this.background = this.add.graphics();
        this.background.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a);
        this.background.fillRect(0, 0, 800, 600);

        // Gradient layer
        const gradient = this.add.graphics();
        gradient.fillStyle(0x667eea, 0.05);
        gradient.fillEllipse(400, 60, 400, 200);
    }

    private createHeader() {
        this.header = this.add.container(0, 0);

        // Back button
        const backButton = this.add.graphics();
        backButton.fillStyle(0xffffff, 0.1);
        backButton.fillRoundedRect(20, 60, 40, 40, 20);
        backButton.setInteractive(new Phaser.Geom.Rectangle(20, 60, 40, 40), Phaser.Geom.Rectangle.Contains);
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const backText = this.add.text(40, 80, '←', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Title
        const title = this.add.text(400, 80, 'Tutorial', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Progress indicator
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x667eea, 0.2);
        progressBg.fillRoundedRect(700, 70, 80, 20, 10);

        const progressText = this.add.text(740, 80, '1 / 6', {
            fontSize: '12px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.header.add([backButton, backText, title, progressBg, progressText]);
    }

    private createContent() {
        this.content = this.add.container(0, 120);
    }

    private createNavigation() {
        this.navigation = this.add.container(0, 520);

        // Previous button
        const prevButton = this.add.graphics();
        prevButton.fillStyle(0xffffff, 0.1);
        prevButton.fillRoundedRect(100, 0, 100, 40, 20);
        prevButton.setInteractive(new Phaser.Geom.Rectangle(100, 0, 100, 40), Phaser.Geom.Rectangle.Contains);
        prevButton.on('pointerdown', () => this.previousStep());

        const prevText = this.add.text(150, 20, 'Previous', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Step indicators
        const stepIndicators = this.add.container(350, 20);
        for (let i = 0; i < this.tutorialSteps.length; i++) {
            const indicator = this.add.graphics();
            indicator.fillStyle(0xffffff, 0.2);
            indicator.fillCircle(i * 15, 0, 4);
            stepIndicators.add(indicator);
        }

        // Next button
        const nextButton = this.add.graphics();
        nextButton.fillStyle(0x667eea);
        nextButton.fillRoundedRect(600, 0, 100, 40, 20);
        nextButton.setInteractive(new Phaser.Geom.Rectangle(600, 0, 100, 40), Phaser.Geom.Rectangle.Contains);
        nextButton.on('pointerdown', () => this.nextStep());

        const nextText = this.add.text(650, 20, 'Next', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.navigation.add([prevButton, prevText, stepIndicators, nextButton, nextText]);
    }

    private showCurrentStep() {
        // Clear previous content
        this.content.removeAll();

        const step = this.tutorialSteps[this.currentStep];

        // Step icon
        const icon = this.add.text(400, 50, step.icon, {
            fontSize: '64px'
        }).setOrigin(0.5);

        // Step title
        const title = this.add.text(400, 130, step.title, {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);

        // Step description
        const description = this.add.text(400, 170, step.description, {
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            align: 'center'
        }).setOrigin(0.5);

        // Tips section
        const tipsTitle = this.add.text(400, 220, 'Key Points:', {
            fontSize: '18px',
            color: '#f39c12',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);

        // Tips list
        const tipsContainer = this.add.container(400, 260);
        step.tips.forEach((tip, index) => {
            const tipText = this.add.text(0, index * 25, `• ${tip}`, {
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                align: 'left'
            }).setOrigin(0, 0);
            tipsContainer.add(tipText);
        });

        // Demo placeholder
        const demoBg = this.add.graphics();
        demoBg.fillStyle(0xffffff, 0.05);
        demoBg.fillRoundedRect(200, 380, 400, 120, 12);
        demoBg.lineStyle(1, 0xffffff, 0.1);
        demoBg.strokeRoundedRect(200, 380, 400, 120, 12);

        const demoTitle = this.add.text(400, 400, 'Interactive Demo', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);

        const demoText = this.add.text(400, 430, 'Demo coming soon...', {
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic',
            align: 'center'
        }).setOrigin(0.5);

        this.content.add([icon, title, description, tipsTitle, tipsContainer, demoBg, demoTitle, demoText]);

        // Update navigation
        this.updateNavigation();
    }

    private updateNavigation() {
        // Update step indicators
        const stepIndicators = this.navigation.getByName('stepIndicators') || this.navigation.list[2];
        if (stepIndicators && (stepIndicators as Phaser.GameObjects.Container).list) {
            (stepIndicators as Phaser.GameObjects.Container).list.forEach((indicator, index) => {
                const graphics = indicator as Phaser.GameObjects.Graphics;
                graphics.clear();
                if (index === this.currentStep) {
                    graphics.fillStyle(0x667eea);
                } else {
                    graphics.fillStyle(0xffffff, 0.2);
                }
                graphics.fillCircle(index * 15, 0, 4);
            });
        }

        // Update button states
        const prevButton = this.navigation.list[0] as GameObjects.Graphics;
        const nextButton = this.navigation.list[4] as GameObjects.Graphics;
        const prevText = this.navigation.list[1] as GameObjects.Text;
        const nextText = this.navigation.list[5] as GameObjects.Text;

        // Previous button
        prevButton.clear();
        if (this.currentStep === 0) {
            prevButton.fillStyle(0xffffff, 0.05);
            prevText.setColor('rgba(255, 255, 255, 0.4)');
        } else {
            prevButton.fillStyle(0xffffff, 0.1);
            prevText.setColor('#ffffff');
        }
        prevButton.fillRoundedRect(100, 0, 100, 40, 20);

        // Next button
        nextButton.clear();
        nextButton.fillStyle(0x667eea);
        nextButton.fillRoundedRect(600, 0, 100, 40, 20);

        // Update next button text
        if (this.currentStep === this.tutorialSteps.length - 1) {
            nextText.setText('Finish');
        } else {
            nextText.setText('Next');
        }
    }

    private nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.showCurrentStep();
        } else {
            // Finish tutorial
            this.scene.start('MainMenu');
        }
    }

    private previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showCurrentStep();
        }
    }
} 