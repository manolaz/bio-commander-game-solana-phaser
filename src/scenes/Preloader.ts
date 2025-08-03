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
        // Load basic sprites that exist
        this.load.image('dude', '/assets/dude.png');
        this.load.image('platform', '/assets/platform.png');
        this.load.image('sky', '/assets/sky.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bg', '/assets/bg.png');
        this.load.image('logo', '/assets/logo.png');
        this.load.image('ground', '/assets/platform.png'); // Use platform as ground

        // Load hero sprites - only load if they exist
        this.load.image('hero1', '/assets/hero/T_CELL/SVG_hero/hero1.svg');
        this.load.image('hero2', '/assets/hero/T_CELL/SVG_hero/hero2.svg');
        this.load.image('hero3', '/assets/hero/T_CELL/SVG_hero/hero3.svg');
        this.load.image('hero4', '/assets/hero/T_CELL/SVG_hero/hero4.svg');
        this.load.image('hero5', '/assets/hero/T_CELL/SVG_hero/hero5.svg');

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

        // Create placeholder textures for missing assets
        this.createPlaceholderTextures();
    }

    private createPlaceholderTextures() {
        // Create placeholder textures for enemies
        this.createEnemyTexture('virus1', 0xff0000); // Red virus
        this.createEnemyTexture('virus2', 0xff4444); // Light red virus
        this.createEnemyTexture('bacteria1', 0x00ff00); // Green bacteria
        this.createEnemyTexture('bacteria2', 0x44ff44); // Light green bacteria
        this.createEnemyTexture('bacteria3', 0x00aa00); // Dark green bacteria
        this.createEnemyTexture('fungi1', 0xffff00); // Yellow fungi
        this.createEnemyTexture('fungi2', 0xaaaa00); // Dark yellow fungi

        // Create placeholder textures for weapons
        this.createWeaponTexture('sword', 0xcccccc); // Gray sword
        this.createWeaponTexture('gun', 0x666666); // Dark gray gun
        this.createWeaponTexture('shield', 0x0066ff); // Blue shield
        this.createWeaponTexture('dual_gun', 0x444444); // Dark gray dual gun

        // Create placeholder textures for power-ups
        this.createPowerUpTexture('powerup_health', 0xff0066); // Pink health
        this.createPowerUpTexture('powerup_energy', 0x00ffff); // Cyan energy
        this.createPowerUpTexture('powerup_shield', 0x0066ff); // Blue shield
        this.createPowerUpTexture('health_powerup', 0xff0066); // Pink health
        this.createPowerUpTexture('shield_powerup', 0x0066ff); // Blue shield
        this.createPowerUpTexture('energy_powerup', 0x00ffff); // Cyan energy
        this.createPowerUpTexture('speed_powerup', 0xff6600); // Orange speed

        // Create background textures for zones
        this.createBackgroundTexture('heart_bg', 0x330000); // Dark red heart background
        this.createBackgroundTexture('lungs_bg', 0x003300); // Dark green lungs background
        this.createBackgroundTexture('brain_bg', 0x000033); // Dark blue brain background

        // Create particle texture
        this.createParticleTexture();
    }

    private createEnemyTexture(key: string, color: number) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeCircle(16, 16, 12);
        graphics.generateTexture(key, 32, 32);
        graphics.destroy();
    }

    private createWeaponTexture(key: string, color: number) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillRect(8, 8, 16, 16);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(8, 8, 16, 16);
        graphics.generateTexture(key, 32, 32);
        graphics.destroy();
    }

    private createPowerUpTexture(key: string, color: number) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillCircle(16, 16, 10);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeCircle(16, 16, 10);
        // Add a plus sign
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 10);
        graphics.lineTo(16, 22);
        graphics.moveTo(10, 16);
        graphics.lineTo(22, 16);
        graphics.strokePath();
        graphics.generateTexture(key, 32, 32);
        graphics.destroy();
    }

    private createBackgroundTexture(key: string, color: number) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 0.3);
        graphics.fillRect(0, 0, 800, 600);
        // Add some pattern
        graphics.fillStyle(color, 0.1);
        for (let i = 0; i < 10; i++) {
            graphics.fillCircle(
                Math.random() * 800,
                Math.random() * 600,
                Math.random() * 50 + 20
            );
        }
        graphics.generateTexture(key, 800, 600);
        graphics.destroy();
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