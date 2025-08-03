// Game Constants
export const GAME_CONSTANTS = {
  ENEMY_SIZE: 40,
  PLAYER_SIZE: 50,
  T_CELL_SIZE: 56,
  POWER_UP_SIZE: 32,
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  GRAVITY: 800,
  JUMP_FORCE: -400,
  MOVE_SPEED: 200,
  BULLET_SPEED: 400,
  ENEMY_SPAWN_RATE: 2000,
  POWER_UP_SPAWN_RATE: 5000,
  SCORE_PER_ENEMY: 10,
  SCORE_PER_POWER_UP: 5,
  MAX_HEALTH: 100,
  MAX_ENERGY: 100,
  ENERGY_REGEN_RATE: 1,
  HEALTH_REGEN_RATE: 0.5,
};

// Enemy Types Configuration
export const ENEMY_TYPES = {
  virus: {
    emoji: '🦠',
    color: '#e74c3c',
    health: 30,
    damage: 15,
    speed: 1.2,
    score: 10,
  },
  bacteria: {
    emoji: '🦠',
    color: '#9b59b6',
    health: 50,
    damage: 20,
    speed: 0.8,
    score: 15,
  },
  fungi: {
    emoji: '🍄',
    color: '#f39c12',
    health: 80,
    damage: 25,
    speed: 0.6,
    score: 20,
  },
} as const;

// Power-up Types Configuration
export const POWER_UP_TYPES = {
  health: {
    emoji: '❤️',
    color: '#e74c3c',
    value: 30,
    rarity: 'common',
  },
  energy: {
    emoji: '⚡',
    color: '#f39c12',
    value: 25,
    rarity: 'common',
  },
  shield: {
    emoji: '🛡️',
    color: '#3498db',
    value: 0,
    rarity: 'rare',
  },
  speed: {
    emoji: '💨',
    color: '#2ecc71',
    value: 1.5,
    rarity: 'rare',
  },
  damage: {
    emoji: '⚔️',
    color: '#e67e22',
    value: 1.5,
    rarity: 'epic',
  },
  multishot: {
    emoji: '🎯',
    color: '#9b59b6',
    value: 3,
    rarity: 'epic',
  },
  invincible: {
    emoji: '✨',
    color: '#f1c40f',
    value: 0,
    rarity: 'legendary',
  },
  ultimate: {
    emoji: '🌟',
    color: '#e91e63',
    value: 0,
    rarity: 'legendary',
  },
} as const;

// Combat Shapes Configuration
export const COMBAT_SHAPES = {
  line: {
    symbol: '—',
    name: 'Line',
    effect: 'Basic Attack',
    damage: 10,
    energy: 5,
    color: '#e74c3c',
  },
  circle: {
    symbol: '○',
    name: 'Circle',
    effect: 'Shield',
    damage: 0,
    energy: 15,
    color: '#27ae60',
  },
  triangle: {
    symbol: '△',
    name: 'Triangle',
    effect: 'Power Attack',
    damage: 25,
    energy: 20,
    color: '#f39c12',
  },
} as const;

// Body Zones Configuration
export const BODY_ZONES = [
  {
    id: 'heart',
    name: 'Heart',
    emoji: '❤️',
    x: 400,
    y: 300,
    radius: 80,
    color: '#e74c3c',
    gradient: 'radial-gradient(circle, #e74c3c, #c0392b)',
    unlocked: true,
    completed: false,
  },
  {
    id: 'brain',
    name: 'Brain',
    emoji: '🧠',
    x: 200,
    y: 150,
    radius: 60,
    color: '#9b59b6',
    gradient: 'radial-gradient(circle, #9b59b6, #8e44ad)',
    unlocked: false,
    completed: false,
  },
  {
    id: 'lungs',
    name: 'Lungs',
    emoji: '🫁',
    x: 600,
    y: 200,
    radius: 70,
    color: '#3498db',
    gradient: 'radial-gradient(circle, #3498db, #2980b9)',
    unlocked: false,
    completed: false,
  },
  {
    id: 'liver',
    name: 'Liver',
    emoji: '🫀',
    x: 300,
    y: 450,
    radius: 65,
    color: '#f39c12',
    gradient: 'radial-gradient(circle, #f39c12, #e67e22)',
    unlocked: false,
    completed: false,
  },
  {
    id: 'stomach',
    name: 'Stomach',
    emoji: '🫃',
    x: 500,
    y: 400,
    radius: 75,
    color: '#2ecc71',
    gradient: 'radial-gradient(circle, #2ecc71, #27ae60)',
    unlocked: false,
    completed: false,
  },
] as const;

// Sound Effects Configuration
export const SOUND_EFFECTS = {
  shoot: '/assets/sounds/vanta/laserShoot.wav',
  explosion: '/assets/sounds/vanta/explosion.wav',
  pickup: '/assets/sounds/vanta/pickupCoin.wav',
  powerUp: '/assets/sounds/vanta/powerUp.wav',
  hit: '/assets/sounds/vanta/hitHurt.wav',
  sword: '/assets/sounds/joy/sword.mp3',
  adventure: '/assets/sounds/joy/adventure.mp3',
} as const;

// Music Tracks Configuration
export const MUSIC_TRACKS = [
  '/assets/music/CC8a1a.m4a',
  '/assets/music/cCC1a.m4a',
  '/assets/music/nc2.m4a',
  '/assets/music/KR1.m4a',
] as const;

// Achievement Configuration
export const ACHIEVEMENTS = {
  firstBlood: {
    id: 'firstBlood',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    icon: '🩸',
    points: 10,
  },
  sharpshooter: {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Hit 10 enemies in a row without missing',
    icon: '🎯',
    points: 25,
  },
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Survive for 5 minutes',
    icon: '⏰',
    points: 50,
  },
  collector: {
    id: 'collector',
    name: 'Power Collector',
    description: 'Collect 20 power-ups',
    icon: '⚡',
    points: 30,
  },
  zoneMaster: {
    id: 'zoneMaster',
    name: 'Zone Master',
    description: 'Complete all body zones',
    icon: '🏆',
    points: 100,
  },
} as const; 