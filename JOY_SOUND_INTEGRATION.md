# Joy Sound Effects Integration

This document explains how the sound effects from the `assets/sounds/joy` folder are integrated and used throughout the Bio Commander game.

## Available Joy Sound Effects

The following sound effects are available in the `assets/sounds/joy` folder:

- **`adventure.mp3`** - Adventure/exploration theme sound
- **`drinking.mp3`** - Drinking/healing sound effect
- **`roar1.m4a`** - Enemy roar sound effect (variant 1)
- **`roar2.m4a`** - Enemy roar sound effect (variant 2)
- **`sword.mp3`** - Sword swing sound effect
- **`SWORDS.m4a`** - Multiple sword sounds effect

## Integration Points

### 1. Sound Loading (Preloader.ts)

All joy sound effects are loaded in the `Preloader` scene:

```typescript
// Load sound effects from joy folder
this.load.setPath('assets/sounds/joy');
this.load.audio('adventure', 'adventure.mp3');
this.load.audio('drinking', 'drinking.mp3');
this.load.audio('roar1', 'roar1.m4a');
this.load.audio('roar2', 'roar2.m4a');
this.load.audio('sword', 'sword.mp3');
this.load.audio('swords', 'SWORDS.m4a');
```

### 2. Sound Manager Integration (SoundManager.ts)

The `SoundManager` class has been enhanced with new methods for playing joy sound effects:

#### New Sound Categories:
- **`adventure`** - Single sound for adventure moments
- **`drinking`** - Single sound for healing/potion pickup
- **`roar`** - Array of two roar sounds (roar1, roar2) for variety
- **`sword`** - Array of two sword sounds (sword, swords) for melee combat

#### New Public Methods:
```typescript
public playAdventure(): void    // Plays adventure.mp3
public playDrinking(): void     // Plays drinking.mp3
public playRoar(): void         // Randomly plays roar1 or roar2
public playSword(): void        // Randomly plays sword or swords
```

### 3. Game Integration Points

#### A. Melee Combat (Game.ts - playerAttack)
- **Sound**: `playSword()`
- **Trigger**: When player performs basic melee attack
- **Effect**: Provides satisfying sword swing sound for melee combat

#### B. Enemy Spawning (Game.ts - spawnEnemy)
- **Sound**: `playRoar()`
- **Trigger**: When new enemies spawn
- **Effect**: Creates tension and alerts player to new threats

#### C. Wave Completion (Game.ts - completeWave)
- **Sound**: `playAdventure()`
- **Trigger**: When player completes a wave
- **Effect**: Celebrates progress and builds anticipation for next wave

#### D. Player Healing (Player.ts - heal)
- **Sound**: `playDrinking()`
- **Trigger**: When player heals or uses healing items
- **Effect**: Provides feedback for healing actions

## Usage Guidelines

### When to Use Each Sound:

1. **`adventure.mp3`**
   - Wave completion
   - Entering new areas
   - Achievement unlocked
   - Major milestone reached

2. **`drinking.mp3`**
   - Player healing
   - Potion pickup
   - Health restoration
   - Any consumable item use

3. **`roar1.m4a` / `roar2.m4a`**
   - Enemy spawning
   - Boss appearance
   - Aggressive enemy behavior
   - Warning sounds

4. **`sword.mp3` / `SWORDS.m4a`**
   - Melee attacks
   - Sword swings
   - Close combat
   - Physical weapon use

### Volume and Mixing:

- All joy sounds respect the global SFX volume setting
- Sounds are automatically disabled when sound is turned off
- Random selection between variants (roar1/roar2, sword/swords) adds variety
- Vibration feedback is paired with appropriate sounds

## Technical Implementation

### Random Sound Selection:
```typescript
private getRandomSound(soundType: string): Phaser.Sound.BaseSound | null {
    const soundArray = this.sounds.get(soundType);
    if (!soundArray || soundArray.length === 0) {
        console.warn(`No sounds found for type: ${soundType}`);
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * soundArray.length);
    return soundArray[randomIndex];
}
```

### Sound Categories:
- **Single sounds**: `adventure`, `drinking` - Always play the same sound
- **Variants**: `roar`, `sword` - Randomly select from available variants

### Error Handling:
- Graceful fallback if sounds fail to load
- Console warnings for missing sound types
- No crashes if sound files are missing

## Future Enhancements

Potential improvements for the joy sound system:

1. **Contextual Volume**: Different volume levels for different sound types
2. **Spatial Audio**: 3D positioning for enemy roars based on distance
3. **Combo Sounds**: Special sounds for successful attack combinations
4. **Environmental Sounds**: Adventure sounds for different game zones
5. **Dynamic Mixing**: Automatic volume adjustment based on game intensity

## Testing

To test the joy sound integration:

1. Start the game and verify all sounds load without errors
2. Perform melee attacks to hear sword sounds
3. Complete a wave to hear adventure sound
4. Heal the player to hear drinking sound
5. Spawn enemies to hear roar sounds
6. Test with sound disabled to ensure no errors occur

## File Structure

```
assets/sounds/joy/
├── adventure.mp3    # Adventure theme
├── drinking.mp3     # Healing sound
├── roar1.m4a        # Enemy roar variant 1
├── roar2.m4a        # Enemy roar variant 2
├── sword.mp3        # Sword swing
└── SWORDS.m4a       # Multiple sword sounds
```

The joy sound effects enhance the game's audio experience by providing thematic and contextual feedback that matches the biological/medical theme of the Bio Commander game. 