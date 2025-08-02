import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  A simple progress bar. This is the outline of the progress bar.
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

        //  Update the progress bar as files are loaded
        this.load.on('progress', (progress: number) => {
            percentText.setText(Math.round(progress * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * progress, 30);
        });

        //  Update the progress bar as files are loaded
        this.load.on('fileprogress', (file: any) => {
            assetText.setText('Loading asset: ' + file.key);
        });

        //  Remove the progress bar when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        this.load.image('sky', 'sky.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'star.png');
        
        // Load the SVG hero images for T_CELL
        this.load.image('hero1', 'hero/T_CELL/SVG_hero/hero1.svg');
        this.load.image('hero2', 'hero/T_CELL/SVG_hero/hero2.svg');
        this.load.image('hero3', 'hero/T_CELL/SVG_hero/hero3.svg');
        this.load.image('hero4', 'hero/T_CELL/SVG_hero/hero4.svg');
        this.load.image('hero5', 'hero/T_CELL/SVG_hero/hero5.svg');
        
        // Load the spritesheet for the player (keeping as fallback)
        this.load.spritesheet('dude', 'dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });

        // Load sound effects from vanta folder
        this.load.setPath('assets/sounds/vanta');
        this.load.audio('explosion', 'explosion.wav');
        this.load.audio('explosion2', 'explosion2.wav');
        this.load.audio('explosion3', 'explosion3.wav');
        this.load.audio('explosion4', 'explosion4.wav');
        this.load.audio('explosion5', 'explosion5.wav');
        this.load.audio('explosion6', 'explosion6.wav');
        this.load.audio('laserShoot', 'laserShoot.wav');
        this.load.audio('laserShoot2', 'laserShoot2.wav');
        this.load.audio('hitHurt', 'hitHurt.wav');
        this.load.audio('pickupCoin', 'pickupCoin.wav');
        this.load.audio('powerUp', 'powerUp.wav');
        this.load.audio('synth', 'synth.wav');

        // Load sound effects from joy folder
        this.load.setPath('assets/sounds/joy');
        this.load.audio('adventure', 'adventure.mp3');
        this.load.audio('drinking', 'drinking.mp3');
        this.load.audio('roar1', 'roar1.m4a');
        this.load.audio('roar2', 'roar2.m4a');
        this.load.audio('sword', 'sword.mp3');
        this.load.audio('swords', 'SWORDS.m4a');

        // Load additional sound effects (using existing files as placeholders)
        this.load.audio('uiClick', '../vanta/pickupCoin.wav'); // Using pickup sound for UI clicks
        this.load.audio('uiHover', '../vanta/powerUp.wav'); // Using powerup sound for UI hover
        this.load.audio('gameStart', '../vanta/explosion.wav'); // Using explosion for game start
        this.load.audio('gameOver', '../vanta/hitHurt.wav'); // Using hit sound for game over
        this.load.audio('levelUp', '../vanta/synth.wav'); // Using synth for level up

        // Load background music tracks
        this.load.setPath('assets/music');
        this.load.audio('music_menu', 'CC8a1a.m4a');
        this.load.audio('music_gameplay', 'cCC1a.m4a');
        this.load.audio('music_boss', 'nc2.m4a');
        this.load.audio('music_victory', 'KR1.m4a');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}