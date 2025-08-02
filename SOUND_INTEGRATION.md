# Sound Integration System

## Overview

The Bio Commander game now features a comprehensive sound system that provides immersive audio feedback for all gameplay events. The system includes background music, sound effects, and haptic feedback (vibration) for mobile devices.

## Features

### 🎵 Background Music
- **Menu Music**: Ambient track for the main menu
- **Gameplay Music**: Dynamic background music during gameplay
- **Boss Music**: Intense music for boss encounters
- **Victory Music**: Celebratory music for achievements

### 🔊 Sound Effects
- **Explosion Sounds**: 6 variations for player attacks and enemy deaths
- **Laser Shoot**: 2 variations for ranged attacks
- **Hit/Hurt**: Damage feedback sounds
- **Pickup Coin**: Collectible item sounds
- **Power Up**: Healing and power-up sounds
- **Synth**: Special effects for high combos
- **UI Sounds**: Click and hover feedback
- **Game State Sounds**: Start, game over, level up

### 📱 Haptic Feedback
- **Short Vibration**: Quick feedback for actions
- **Long Vibration**: Extended feedback for important events
- **Pattern Vibration**: Complex patterns for special events

## Architecture

### SoundManager Class
Located in `src/systems/SoundManager.ts`

```typescript
export interface SoundSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    sfxVolume: number;
    musicVolume: number;
    vibrationEnabled: boolean;
}

export class SoundManager {
    // Core functionality
    initialize(): void
    destroy(): void
    
    // Sound effects
    playExplosion(): void
    playLaserShoot(): void
    playHitHurt(): void
    playPickupCoin(): void
    playPowerUp(): void
    playSynth(): void
    playUIClick(): void
    playUIHover(): void
    playGameStart(): void
    playGameOver(): void
    playLevelUp(): void
    
    // Music control
    playMusic(trackName: string, loop?: boolean): void
    stopMusic(): void
    pauseMusic(): void
    resumeMusic(): void
    fadeMusic(duration?: number): void
    
    // Vibration
    vibrate(pattern?: number | number[]): void
    vibrateShort(): void
    vibrateLong(): void
    vibratePattern(): void
    
    // Settings
    setSFXVolume(volume: number): void
    setMusicVolume(volume: number): void
    toggleSound(): void
    toggleMusic(): void
    toggleVibration(): void
    updateSettings(settings: Partial<SoundSettings>): void
}
```

### Integration Points

#### 1. Scene Integration
Each scene initializes its own SoundManager instance:

```typescript
// In scene create() method
this.soundManager = new SoundManager(this);
this.soundManager.initialize();

// Start appropriate music
this.soundManager.playMusic('menu'); // or 'gameplay', 'boss', 'victory'
```

#### 2. Game Events
Sound effects are triggered by game events:

```typescript
// Player attacks
this.soundManager.playExplosion();
this.soundManager.vibrateShort();

// Enemy deaths
this.soundManager.playExplosion();
this.soundManager.vibrateShort();

// Player damage
this.soundManager.playHitHurt();
this.soundManager.vibrateShort();

// Power-ups
this.soundManager.playPowerUp();
this.soundManager.vibrateShort();

// High combos
this.soundManager.playSynth();
```

#### 3. UI Interactions
UI elements provide audio feedback:

```typescript
button.on('pointerover', () => {
    this.soundManager.playUIHover();
});

button.on('pointerdown', () => {
    this.soundManager.playUIClick();
    this.soundManager.vibrateShort();
});
```

## Audio Assets

### Sound Effects (assets/sounds/vanta/)
- `explosion.wav` - Basic explosion sound
- `explosion2.wav` - Explosion variation 1
- `explosion3.wav` - Explosion variation 2
- `explosion4.wav` - Explosion variation 3
- `explosion5.wav` - Explosion variation 4
- `explosion6.wav` - Explosion variation 5
- `laserShoot.wav` - Laser sound
- `laserShoot2.wav` - Laser variation
- `hitHurt.wav` - Damage sound
- `pickupCoin.wav` - Collectible sound
- `powerUp.wav` - Power-up sound
- `synth.wav` - Special effect sound

### Background Music (assets/music/)
- `CC8a1a.m4a` - Menu music
- `cCC1a.m4a` - Gameplay music
- `nc2.m4a` - Boss music
- `KR1.m4a` - Victory music

## Settings Integration

The sound system integrates with the game settings:

### SettingsScreen Integration
```typescript
// Load sound settings
const soundSettings = this.soundManager.getSettings();

// Update settings
this.soundManager.updateSettings({
    soundEnabled: true,
    musicEnabled: true,
    sfxVolume: 0.7,
    musicVolume: 0.5,
    vibrationEnabled: true
});
```

### Persistent Storage
Settings are automatically saved to localStorage:
- `soundSettings` - Complete sound configuration
- Settings persist across game sessions

## Scene-Specific Implementation

### MainMenu Scene
- **Background Music**: Menu track with looping
- **UI Sounds**: Hover and click feedback
- **Transition**: Music fades out before scene change

### Game Scene
- **Background Music**: Gameplay track
- **Combat Sounds**: Explosions, hits, power-ups
- **Event Sounds**: Game start, level up, game over
- **Vibration**: Tactile feedback for all actions

### SettingsScreen Scene
- **UI Sounds**: All button interactions
- **Real-time Updates**: Volume changes apply immediately

### TutorialScreen Scene
- **UI Sounds**: Navigation and interaction feedback
- **No Background Music**: Focus on tutorial content

## Mobile Optimization

### Touch Controls
- Haptic feedback for all touch interactions
- Vibration patterns for different event types
- Optimized audio loading for mobile devices

### Performance
- Audio files are compressed for web delivery
- Lazy loading of audio assets
- Memory management for audio instances

## Testing

### SoundTest Component
A development tool for testing all audio features:

```typescript
<SoundTest soundManager={this.soundManager} />
```

Features:
- Test all sound effects
- Control music playback
- Adjust volume settings
- Test vibration patterns
- Real-time status monitoring

## Future Enhancements

### Planned Features
1. **Spatial Audio**: 3D positional sound effects
2. **Dynamic Music**: Adaptive music based on gameplay intensity
3. **Audio Compression**: Further optimization for mobile
4. **Custom Soundtracks**: User-uploaded music support
5. **Advanced Vibration**: Device-specific haptic patterns

### Technical Improvements
1. **Web Audio API**: Advanced audio processing
2. **Audio Streaming**: Progressive audio loading
3. **Cross-platform Audio**: Unified audio across platforms
4. **Audio Analytics**: Usage tracking and optimization

## Usage Examples

### Basic Sound Playback
```typescript
// Play explosion sound
this.soundManager.playExplosion();

// Play music with looping
this.soundManager.playMusic('gameplay', true);

// Add vibration
this.soundManager.vibrateShort();
```

### Volume Control
```typescript
// Set SFX volume to 50%
this.soundManager.setSFXVolume(0.5);

// Set music volume to 30%
this.soundManager.setMusicVolume(0.3);

// Toggle sound on/off
this.soundManager.toggleSound();
```

### Event-Driven Audio
```typescript
// Listen for game events
EventCenter.on('playerDamaged', (damage: number) => {
    this.soundManager.playHitHurt();
    this.soundManager.vibrateShort();
});

EventCenter.on('enemyKilled', (enemy: EnemyEntity) => {
    this.soundManager.playExplosion();
    this.soundManager.vibrateShort();
});
```

## Configuration

### Audio File Loading
Audio files are loaded in the Preloader scene:

```typescript
// Load sound effects
this.load.audio('explosion', 'explosion.wav');
this.load.audio('laserShoot', 'laserShoot.wav');
// ... more audio files

// Load background music
this.load.audio('music_menu', 'CC8a1a.m4a');
this.load.audio('music_gameplay', 'cCC1a.m4a');
// ... more music tracks
```

### Default Settings
```typescript
const defaultSettings: SoundSettings = {
    soundEnabled: true,
    musicEnabled: true,
    sfxVolume: 0.7,
    musicVolume: 0.5,
    vibrationEnabled: true
};
```

## Troubleshooting

### Common Issues
1. **Audio not playing**: Check browser autoplay policies
2. **Vibration not working**: Verify device support and permissions
3. **Audio lag**: Reduce audio file sizes or use compression
4. **Memory leaks**: Ensure proper cleanup in scene shutdown

### Debug Tools
- SoundTest component for development testing
- Browser console logging for audio events
- Performance monitoring for audio usage

## Conclusion

The sound integration system provides a complete audio experience for the Bio Commander game, enhancing immersion and providing clear feedback for all player actions. The system is designed to be flexible, performant, and easily extensible for future enhancements. 