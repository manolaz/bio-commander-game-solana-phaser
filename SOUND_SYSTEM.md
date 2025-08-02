# Sound System Implementation

## Overview

The game now includes a comprehensive sound system that uses audio files from the `assets/sounds/vanta` folder. The system supports random variations of the same action type and provides different sound effects for various game events.

## Sound Files Used

The following sound files are loaded from `assets/sounds/vanta/`:

- **explosion.wav** - Player attack effects (as requested)
- **explosion2.wav** - Player attack effects
- **explosion3.wav** - Player attack effects
- **explosion4.wav** - Player attack effects
- **explosion5.wav** - Player attack effects
- **explosion6.wav** - Player attack effects
- **laserShoot.wav** - Ranged attack effects
- **laserShoot2.wav** - Ranged attack effects
- **hitHurt.wav** - Damage/hurt effects
- **pickupCoin.wav** - Collectible pickup effects
- **powerUp.wav** - Power-up and healing effects
- **synth.wav** - Special effects (high combos)

## Sound Manager Features

### Random Sound Selection
- Each action type can have multiple sound files
- The system randomly selects from available sounds for the same action
- This prevents sound repetition and adds variety

### Volume Control
- Individual volume control for SFX and music
- Mute/unmute functionality
- Volume persistence across game sessions

### Sound Categories

1. **Explosion Sounds** (explosion*.wav)
   - Used for player attacks
   - Used for enemy deaths
   - 6 different variations for variety

2. **Laser Shoot Sounds** (laserShoot*.wav)
   - Used for ranged attacks
   - 2 different variations

3. **Hit/Hurt Sounds** (hitHurt.wav)
   - Used when player takes damage
   - Used when enemies are hit

4. **Pickup Sounds** (pickupCoin.wav)
   - Used for collectible items
   - Used for coin pickups

5. **Power-Up Sounds** (powerUp.wav)
   - Used for healing
   - Used for energy restoration
   - Used for shield activation

6. **Synth Sounds** (synth.wav)
   - Used for high combo achievements (5+ hits)
   - Used for special effects

## Implementation Details

### SoundManager Class
Located in `src/systems/SoundManager.ts`

Key methods:
- `playExplosion()` - Plays random explosion sound
- `playLaserShoot()` - Plays random laser shoot sound
- `playHitHurt()` - Plays hit/hurt sound
- `playPickupCoin()` - Plays pickup sound
- `playPowerUp()` - Plays power-up sound
- `playSynth()` - Plays synth sound
- `setSFXVolume(volume)` - Sets SFX volume (0-1)
- `toggleMute()` - Toggles mute state

### Integration Points

1. **Player Attacks** (`src/scenes/Game.ts`)
   - Basic attacks trigger explosion sounds
   - Special attacks trigger explosion sounds

2. **Player Damage** (`src/entities/Player.ts`)
   - Taking damage triggers hit/hurt sounds

3. **Enemy Deaths** (`src/scenes/Game.ts`)
   - Enemy deaths trigger explosion sounds

4. **Ranged Attacks** (`src/scenes/Game.ts`)
   - Enemy ranged attacks trigger laser shoot sounds

5. **Healing & Power-ups** (`src/entities/Player.ts`)
   - Healing triggers power-up sounds
   - Energy restoration triggers power-up sounds
   - Shield activation triggers power-up sounds

6. **High Combos** (`src/scenes/Game.ts`)
   - Combos of 5+ hits trigger synth sounds

## Usage Examples

### Basic Sound Playback
```typescript
// In a game scene
this.soundManager.playExplosion();
this.soundManager.playLaserShoot();
this.soundManager.playHitHurt();
```

### Volume Control
```typescript
// Set SFX volume to 50%
this.soundManager.setSFXVolume(0.5);

// Toggle mute
this.soundManager.toggleMute();
```

### Conditional Sound Playback
```typescript
// Play synth sound for high combos
if (comboData.count >= 5) {
    this.soundManager.playSynth();
}
```

## Testing

A `SoundTest` component is available in `src/components/SoundTest.tsx` for testing all sound effects during development.

## Future Enhancements

1. **Background Music** - Add support for background music tracks
2. **Spatial Audio** - Implement 3D positional audio
3. **Sound Categories** - Add more granular volume controls per sound type
4. **Audio Compression** - Optimize audio files for web delivery
5. **Mobile Audio** - Add mobile-specific audio handling

## File Structure

```
src/
├── systems/
│   └── SoundManager.ts          # Main sound management system
├── components/
│   ├── SoundControl.tsx         # UI controls for sound settings
│   └── SoundTest.tsx           # Development testing component
└── scenes/
    └── Preloader.ts            # Audio file loading
```

## Configuration

Sound files are loaded in the Preloader scene:
```typescript
// Load sound effects from vanta folder
this.load.setPath('assets/sounds/vanta');
this.load.audio('explosion', 'explosion.wav');
// ... more audio files
```

The SoundManager is initialized in the main Game scene and passed to entities that need sound functionality. 