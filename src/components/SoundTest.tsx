import React, { useState, useEffect } from 'react';
import { SoundManager, SoundSettings } from '../systems/SoundManager';

interface SoundTestProps {
    soundManager: SoundManager;
}

export const SoundTest: React.FC<SoundTestProps> = ({ soundManager }) => {
    const [settings, setSettings] = useState<SoundSettings>(soundManager.getSettings());
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Update settings when soundManager changes
        setSettings(soundManager.getSettings());
    }, [soundManager]);

    const handleSettingChange = (key: keyof SoundSettings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        soundManager.updateSettings(newSettings);
        setSettings(newSettings);
    };

    const playSound = (soundMethod: () => void) => {
        soundMethod();
        soundManager.vibrateShort();
    };

    const playMusic = (trackName: string) => {
        soundManager.playMusic(trackName);
        soundManager.vibrateShort();
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    padding: '10px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                🔊 Sound Test
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            minWidth: '300px',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Sound Test Panel</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Settings Section */}
            <div style={{ marginBottom: '20px' }}>
                <h4>Settings</h4>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.soundEnabled}
                            onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                        />
                        Sound Effects
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.musicEnabled}
                            onChange={(e) => handleSettingChange('musicEnabled', e.target.checked)}
                        />
                        Background Music
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.vibrationEnabled}
                            onChange={(e) => handleSettingChange('vibrationEnabled', e.target.checked)}
                        />
                        Vibration
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>
                        SFX Volume: {Math.round(settings.sfxVolume * 100)}%
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.sfxVolume}
                            onChange={(e) => handleSettingChange('sfxVolume', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Music Volume: {Math.round(settings.musicVolume * 100)}%
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.musicVolume}
                            onChange={(e) => handleSettingChange('musicVolume', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
            </div>

            {/* Sound Effects Section */}
            <div style={{ marginBottom: '20px' }}>
                <h4>Sound Effects</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button onClick={() => playSound(() => soundManager.playExplosion())}>
                        Explosion
                    </button>
                    <button onClick={() => playSound(() => soundManager.playLaserShoot())}>
                        Laser Shoot
                    </button>
                    <button onClick={() => playSound(() => soundManager.playHitHurt())}>
                        Hit/Hurt
                    </button>
                    <button onClick={() => playSound(() => soundManager.playPickupCoin())}>
                        Pickup Coin
                    </button>
                    <button onClick={() => playSound(() => soundManager.playPowerUp())}>
                        Power Up
                    </button>
                    <button onClick={() => playSound(() => soundManager.playSynth())}>
                        Synth
                    </button>
                    <button onClick={() => playSound(() => soundManager.playUIClick())}>
                        UI Click
                    </button>
                    <button onClick={() => playSound(() => soundManager.playUIHover())}>
                        UI Hover
                    </button>
                    <button onClick={() => playSound(() => soundManager.playGameStart())}>
                        Game Start
                    </button>
                    <button onClick={() => playSound(() => soundManager.playGameOver())}>
                        Game Over
                    </button>
                    <button onClick={() => playSound(() => soundManager.playLevelUp())}>
                        Level Up
                    </button>
                </div>
            </div>

            {/* Music Section */}
            <div style={{ marginBottom: '20px' }}>
                <h4>Background Music</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button onClick={() => playMusic('menu')}>
                        Menu Music
                    </button>
                    <button onClick={() => playMusic('gameplay')}>
                        Gameplay Music
                    </button>
                    <button onClick={() => playMusic('boss')}>
                        Boss Music
                    </button>
                    <button onClick={() => playMusic('victory')}>
                        Victory Music
                    </button>
                    <button onClick={() => soundManager.stopMusic()}>
                        Stop Music
                    </button>
                    <button onClick={() => soundManager.fadeMusic()}>
                        Fade Music
                    </button>
                </div>
            </div>

            {/* Vibration Section */}
            <div style={{ marginBottom: '20px' }}>
                <h4>Vibration</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button onClick={() => soundManager.vibrateShort()}>
                        Short Vibration
                    </button>
                    <button onClick={() => soundManager.vibrateLong()}>
                        Long Vibration
                    </button>
                    <button onClick={() => soundManager.vibratePattern()}>
                        Pattern Vibration
                    </button>
                </div>
            </div>

            {/* Status Section */}
            <div>
                <h4>Status</h4>
                <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <div>Sound Enabled: {settings.soundEnabled ? 'Yes' : 'No'}</div>
                    <div>Music Enabled: {settings.musicEnabled ? 'Yes' : 'No'}</div>
                    <div>Vibration Enabled: {settings.vibrationEnabled ? 'Yes' : 'No'}</div>
                    <div>Music Playing: {soundManager.isMusicPlaying() ? 'Yes' : 'No'}</div>
                    <div>SFX Volume: {Math.round(settings.sfxVolume * 100)}%</div>
                    <div>Music Volume: {Math.round(settings.musicVolume * 100)}%</div>
                </div>
            </div>
        </div>
    );
}; 