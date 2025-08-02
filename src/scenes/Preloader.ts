import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(320, 240, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(320, 240, 320, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(320 - 230, 240, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

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
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}