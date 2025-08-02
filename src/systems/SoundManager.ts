import { Scene } from 'phaser';

export interface SoundSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    sfxVolume: number;
    musicVolume: number;
    vibrationEnabled: boolean;
}

export class SoundManager {
    private scene: Scene;
    private sounds: Map<string, Phaser.Sound.BaseSound[]> = new Map();
    private musicTracks: Map<string, Phaser.Sound.BaseSound> = new Map();
    private currentMusic: Phaser.Sound.BaseSound | null = null;
    private settings: SoundSettings;
    private isInitialized: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            sfxVolume: 0.7,
            musicVolume: 0.5,
            vibrationEnabled: true
        };
        this.loadSettings();
    }

    public initialize(): void {
        if (this.isInitialized) return;
        
        this.initializeSounds();
        this.initializeMusic();
        this.updateVolumes();
        this.isInitialized = true;
    }

    private loadSettings(): void {
        try {
            const savedSettings = localStorage.getItem('soundSettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.warn('Failed to load sound settings:', error);
        }
    }

    private saveSettings(): void {
        try {
            localStorage.setItem('soundSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save sound settings:', error);
        }
    }

    private initializeSounds(): void {
        // Explosion sounds for player attacks
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

        // UI sounds
        this.sounds.set('uiClick', [
            this.scene.sound.add('uiClick')
        ]);

        this.sounds.set('uiHover', [
            this.scene.sound.add('uiHover')
        ]);

        // Game state sounds
        this.sounds.set('gameStart', [
            this.scene.sound.add('gameStart')
        ]);

        this.sounds.set('gameOver', [
            this.scene.sound.add('gameOver')
        ]);

        this.sounds.set('levelUp', [
            this.scene.sound.add('levelUp')
        ]);
    }

    private initializeMusic(): void {
        // Background music tracks
        this.musicTracks.set('menu', this.scene.sound.add('music_menu'));
        this.musicTracks.set('gameplay', this.scene.sound.add('music_gameplay'));
        this.musicTracks.set('boss', this.scene.sound.add('music_boss'));
        this.musicTracks.set('victory', this.scene.sound.add('music_victory'));
    }

    private updateVolumes(): void {
        // Update SFX volumes
        this.sounds.forEach((soundArray) => {
            soundArray.forEach((sound) => {
                const volume = this.settings.soundEnabled ? this.settings.sfxVolume : 0;
                sound.setVolume(volume);
            });
        });

        // Update music volume
        if (this.currentMusic) {
            const volume = this.settings.musicEnabled ? this.settings.musicVolume : 0;
            this.currentMusic.setVolume(volume);
        }
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
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('explosion');
        if (sound) {
            sound.play();
        }
    }

    public playLaserShoot(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('laserShoot');
        if (sound) {
            sound.play();
        }
    }

    public playHitHurt(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('hitHurt');
        if (sound) {
            sound.play();
        }
    }

    public playPickupCoin(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('pickupCoin');
        if (sound) {
            sound.play();
        }
    }

    public playPowerUp(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('powerUp');
        if (sound) {
            sound.play();
        }
    }

    public playSynth(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('synth');
        if (sound) {
            sound.play();
        }
    }

    public playUIClick(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('uiClick');
        if (sound) {
            sound.play();
        }
    }

    public playUIHover(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('uiHover');
        if (sound) {
            sound.play();
        }
    }

    public playGameStart(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('gameStart');
        if (sound) {
            sound.play();
        }
    }

    public playGameOver(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('gameOver');
        if (sound) {
            sound.play();
        }
    }

    public playLevelUp(): void {
        if (!this.settings.soundEnabled) return;
        const sound = this.getRandomSound('levelUp');
        if (sound) {
            sound.play();
        }
    }

    // Music control methods
    public playMusic(trackName: string, loop: boolean = true): void {
        if (!this.settings.musicEnabled) return;

        // Stop current music
        this.stopMusic();

        const music = this.musicTracks.get(trackName);
        if (music) {
            music.setLoop(loop);
            music.setVolume(this.settings.musicVolume);
            music.play();
            this.currentMusic = music;
        }
    }

    public stopMusic(): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    public pauseMusic(): void {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    public resumeMusic(): void {
        if (this.currentMusic && this.settings.musicEnabled) {
            this.currentMusic.resume();
        }
    }

    public fadeMusic(duration: number = 1000): void {
        if (this.currentMusic) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: duration,
                ease: 'Power2',
                onComplete: () => {
                    this.stopMusic();
                }
            });
        }
    }

    // Vibration methods
    public vibrate(pattern: number | number[] = 100): void {
        if (!this.settings.vibrationEnabled || !navigator.vibrate) return;
        
        try {
            navigator.vibrate(pattern);
        } catch (error) {
            console.warn('Vibration not supported:', error);
        }
    }

    public vibrateShort(): void {
        this.vibrate(50);
    }

    public vibrateLong(): void {
        this.vibrate(200);
    }

    public vibratePattern(): void {
        this.vibrate([100, 50, 100, 50, 200]);
    }

    // Settings control methods
    public setSFXVolume(volume: number): void {
        this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.saveSettings();
    }

    public setMusicVolume(volume: number): void {
        this.settings.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.saveSettings();
    }

    public toggleSound(): void {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.updateVolumes();
        this.saveSettings();
    }

    public toggleMusic(): void {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        if (!this.settings.musicEnabled) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
        this.updateVolumes();
        this.saveSettings();
    }

    public toggleVibration(): void {
        this.settings.vibrationEnabled = !this.settings.vibrationEnabled;
        this.saveSettings();
    }

    public getSettings(): SoundSettings {
        return { ...this.settings };
    }

    public updateSettings(newSettings: Partial<SoundSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
        this.updateVolumes();
        this.saveSettings();
    }

    // Utility methods
    public isSoundEnabled(): boolean {
        return this.settings.soundEnabled;
    }

    public isMusicEnabled(): boolean {
        return this.settings.musicEnabled;
    }

    public isVibrationEnabled(): boolean {
        return this.settings.vibrationEnabled;
    }

    public getSFXVolume(): number {
        return this.settings.sfxVolume;
    }

    public getMusicVolume(): number {
        return this.settings.musicVolume;
    }

    public isMusicPlaying(): boolean {
        return this.currentMusic ? this.currentMusic.isPlaying : false;
    }

    // Cleanup method
    public destroy(): void {
        this.stopMusic();
        
        this.sounds.forEach((soundArray) => {
            soundArray.forEach((sound) => {
                sound.destroy();
            });
        });
        this.sounds.clear();

        this.musicTracks.forEach((music) => {
            music.destroy();
        });
        this.musicTracks.clear();
    }
} 