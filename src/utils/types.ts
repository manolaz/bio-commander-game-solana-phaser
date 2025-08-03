// Game Types and Interfaces

// Wave Configuration
export interface Wave {
  id: string;
  number: number;
  enemies: Enemy[];
  duration: number;
  isActive: boolean;
  isCompleted: boolean;
}

// Enemy Interface
export interface Enemy {
  id: string;
  type: 'virus' | 'bacteria' | 'fungi';
  name: string;
  emoji: string;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  powerLevel: 1 | 2 | 3;
  position: { x: number; y: number };
  isAlive: boolean;
  isAttacking: boolean;
  animatedX?: any;
  animatedY?: any;
}

// Power-up Interface
export interface PowerUp {
  id: string;
  type: 'health' | 'energy' | 'shield' | 'speed' | 'damage' | 'multishot' | 'invincible' | 'ultimate';
  name: string;
  emoji: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  position: { x: number; y: number };
  isCollected: boolean;
  isActive: boolean;
  duration?: number;
  animatedX?: any;
  animatedY?: any;
}

// Particle Interface
export interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  velocity: { x: number; y: number };
}

// Game Settings Interface
export interface GameSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  particleEffects: boolean;
  musicVolume: number;
  soundVolume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  autoSave: boolean;
  tutorialEnabled: boolean;
  accessibilityMode: boolean;
  colorBlindMode: boolean;
  motionReduction: boolean;
}

// Player Interface
export interface Player {
  id: string;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  score: number;
  level: number;
  experience: number;
  experienceToNext: number;
  position: { x: number; y: number };
  isShielded: boolean;
  isInvincible: boolean;
  powerUps: PowerUp[];
  achievements: Achievement[];
}

// Achievement Interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

// Combat Shape Interface
export interface CombatShape {
  type: 'line' | 'circle' | 'triangle';
  symbol: string;
  name: string;
  effect: string;
  damage: number;
  energy: number;
  color: string;
}

// Body Zone Interface
export interface BodyZone {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  gradient: string;
  enemies: Enemy[];
  powerUps: PowerUp[];
  unlocked: boolean;
  completed: boolean;
}

// Game State Interface
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentWave: number;
  totalWaves: number;
  player: Player;
  enemies: Enemy[];
  powerUps: PowerUp[];
  particles: Particle[];
  score: number;
  timeElapsed: number;
  currentZone: string;
}

// Animation Interface
export interface Animation {
  id: string;
  type: 'fade' | 'scale' | 'rotate' | 'slide' | 'bounce';
  duration: number;
  delay: number;
  easing: string;
  isActive: boolean;
}

// Sound Effect Interface
export interface SoundEffect {
  id: string;
  name: string;
  file: string;
  volume: number;
  loop: boolean;
  isPlaying: boolean;
}

// Music Track Interface
export interface MusicTrack {
  id: string;
  name: string;
  file: string;
  volume: number;
  isPlaying: boolean;
  duration: number;
}

// UI Component Interface
export interface UIComponent {
  id: string;
  type: 'button' | 'slider' | 'toggle' | 'modal' | 'tooltip';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  isEnabled: boolean;
  style: any;
}

// Event Interface
export interface GameEvent {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  updateTime: number;
  totalTime: number;
}

// Save Data Interface
export interface SaveData {
  player: Player;
  gameState: GameState;
  settings: GameSettings;
  achievements: Achievement[];
  timestamp: Date;
  version: string;
} 