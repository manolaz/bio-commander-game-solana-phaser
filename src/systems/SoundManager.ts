export class SoundManager {
    private scene: Phaser.Scene;
    private sounds: Map<string, Phaser.Sound.BaseSound[]> = new Map();
    private musicVolume: number = 0.5;
    private sfxVolume: number = 0.7;
    private isMuted: boolean = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.initializeSounds();
    }

    private initializeSounds(): void {
        // Explosion sounds for player attacks (as requested)
        this.sounds.set('explosion', [
            this.scene.sound.add('explosion'),
            this.scene.sound.add('explosion2'),
            this.scene.sound.add('explosion3'),
            this.scene.sound.add('explosion4'),
            this.scene.sound.add('explosion5'),
            this.scene.sound.add('explosion6')
        ]);

        // Laser shoot sounds for ranged attacks
        this.sounds.set('laserShoot', [
            this.scene.sound.add('laserShoot'),
            this.scene.sound.add('laserShoot2')
        ]);

        // Hit/hurt sounds for damage
        this.sounds.set('hitHurt', [
            this.scene.sound.add('hitHurt')
        ]);

        // Pickup sounds for collectibles
        this.sounds.set('pickupCoin', [
            this.scene.sound.add('pickupCoin')
        ]);

        // Power-up sounds
        this.sounds.set('powerUp', [
            this.scene.sound.add('powerUp')
        ]);

        // Synth sounds for special effects
        this.sounds.set('synth', [
            this.scene.sound.add('synth')
        ]);

        // Set initial volumes
        this.updateVolumes();
    }

    private updateVolumes(): void {
        this.sounds.forEach((soundArray) => {
            soundArray.forEach((sound) => {
                sound.setVolume(this.isMuted ? 0 : this.sfxVolume);
            });
        });
    }

    private getRandomSound(soundType: string): Phaser.Sound.BaseSound | null {
        const soundArray = this.sounds.get(soundType);
        if (!soundArray || soundArray.length === 0) {
            console.warn(`No sounds found for type: ${soundType}`);
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * soundArray.length);
        return soundArray[randomIndex];
    }

    // Public methods for playing different sound effects
    public playExplosion(): void {
        const sound = this.getRandomSound('explosion');
        if (sound) {
            sound.play();
        }
    }

    public playLaserShoot(): void {
        const sound = this.getRandomSound('laserShoot');
        if (sound) {
            sound.play();
        }
    }

    public playHitHurt(): void {
        const sound = this.getRandomSound('hitHurt');
        if (sound) {
            sound.play();
        }
    }

    public playPickupCoin(): void {
        const sound = this.getRandomSound('pickupCoin');
        if (sound) {
            sound.play();
        }
    }

    public playPowerUp(): void {
        const sound = this.getRandomSound('powerUp');
        if (sound) {
            sound.play();
        }
    }

    public playSynth(): void {
        const sound = this.getRandomSound('synth');
        if (sound) {
            sound.play();
        }
    }

    // Volume control methods
    public setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }

    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        // Note: Music volume would be applied to background music if implemented
    }

    public toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.updateVolumes();
    }

    public isSoundMuted(): boolean {
        return this.isMuted;
    }

    public getSFXVolume(): number {
        return this.sfxVolume;
    }

    public getMusicVolume(): number {
        return this.musicVolume;
    }

    // Cleanup method
    public destroy(): void {
        this.sounds.forEach((soundArray) => {
            soundArray.forEach((sound) => {
                sound.destroy();
            });
        });
        this.sounds.clear();
    }
} 