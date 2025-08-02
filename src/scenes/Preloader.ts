import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '14px monospace',
                color: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // Update progress bar
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(Math.round(value * 100) + '%');
        });

        // Update file text
        this.load.on('fileprogress', (file: any) => {
            assetText.setText('Loading asset: ' + file.key);
        });

        // Remove progress bar when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // Load game assets
        this.loadAssets();
    }

    private loadAssets() {
        // Load sprites from public/assets
        this.load.image('dude', '/assets/dude.png');
        this.load.image('platform', '/assets/platform.png');
        this.load.image('sky', '/assets/sky.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bg', '/assets/bg.png');
        this.load.image('logo', '/assets/logo.png');

        // Load hero sprites from assets directory
        this.load.image('hero1', '/assets/hero/T_CELL/SVG_hero/hero1.svg');
        this.load.image('hero2', '/assets/hero/T_CELL/SVG_hero/hero2.svg');
        this.load.image('hero3', '/assets/hero/T_CELL/SVG_hero/hero3.svg');
        this.load.image('hero4', '/assets/hero/T_CELL/SVG_hero/hero4.svg');
        this.load.image('hero5', '/assets/hero/T_CELL/SVG_hero/hero5.svg');

        // Load weapon sprites
        this.load.image('sword', '/assets/hero/duel_sword/sword.svg');
        this.load.image('gun', '/assets/hero/dual_gun/gun.svg');
        this.load.image('shield', '/assets/hero/sword_shield/shield.svg');
        this.load.image('dual_gun', '/assets/hero/dual_gun/dual_gun.svg');

        // Load enemy sprites
        this.load.image('virus1', '/assets/ennemy/virus/virus1.svg');
        this.load.image('virus2', '/assets/ennemy/virus/virus2.svg');
        this.load.image('bacteria1', '/assets/ennemy/bacteria/bacteria1.svg');
        this.load.image('bacteria2', '/assets/ennemy/bacteria/bacteria2.svg');
        this.load.image('fungi1', '/assets/ennemy/fungis/fungi1.svg');
        this.load.image('fungi2', '/assets/ennemy/fungis/fungi2.svg');

        // Load power-up sprites
        this.load.image('powerup_health', '/assets/game_objects/health.svg');
        this.load.image('powerup_energy', '/assets/game_objects/energy.svg');
        this.load.image('powerup_shield', '/assets/game_objects/shield.svg');

        // Load music
        this.load.audio('menu_music', '/assets/music/CC8a1a.m4a');
        this.load.audio('game_music', '/assets/music/cCC1a.m4a');
        this.load.audio('boss_music', '/assets/music/KR1.m4a');
        this.load.audio('victory_music', '/assets/music/nc2.m4a');

        // Load sound effects
        this.load.audio('ui_hover', '/assets/sounds/vanta/synth.wav');
        this.load.audio('ui_click', '/assets/sounds/vanta/pickupCoin.wav');
        this.load.audio('attack', '/assets/sounds/vanta/laserShoot.wav');
        this.load.audio('hit_hurt', '/assets/sounds/vanta/hitHurt.wav');
        this.load.audio('explosion', '/assets/sounds/vanta/explosion.wav');
        this.load.audio('powerup', '/assets/sounds/vanta/powerUp.wav');
        this.load.audio('drinking', '/assets/sounds/joy/drinking.mp3');
        this.load.audio('sword_sound', '/assets/sounds/joy/sword.mp3');
        this.load.audio('adventure', '/assets/sounds/joy/adventure.mp3');
        this.load.audio('roar', '/assets/sounds/joy/roar1.m4a');

        // Create particle texture
        this.createParticleTexture();
    }

    private createParticleTexture() {
        // Create a simple particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    create() {
        // Add some delay to show loading screen
        this.time.delayedCall(1000, () => {
            this.scene.start('WalletConnect');
        });
    }
}