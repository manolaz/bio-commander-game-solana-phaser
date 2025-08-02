import { CombatSystem, CombatStats } from './CombatSystem';

export interface Weapon {
    id: string;
    name: string;
    damage: number;
    range: number;
    attackSpeed: number;
    energyCost: number;
    specialEffect?: string;
    spriteKey: string;
}

export interface SpecialMove {
    id: string;
    name: string;
    damage: number;
    energyCost: number;
    cooldown: number;
    lastUsed: number;
    description: string;
    effect: 'area' | 'single' | 'buff' | 'debuff';
}

export interface ComboChain {
    sequence: string[];
    damage: number;
    energyReward: number;
    specialEffect?: string;
}

export class AdvancedCombatSystem extends CombatSystem {
    private weapons: Map<string, Weapon> = new Map();
    private currentWeapon: string = 'sword';
    private specialMoves: Map<string, SpecialMove> = new Map();
    private comboChains: ComboChain[] = [];
    private currentComboSequence: string[] = [];
    private lastAttackType: string = '';
    private comboWindow: number = 1500; // 1.5 seconds to continue combo
    private experience: number = 0;
    private level: number = 1;
    private skillPoints: number = 0;

    constructor(initialStats: Partial<CombatStats> = {}) {
        super(initialStats);
        this.initializeWeapons();
        this.initializeSpecialMoves();
        this.initializeComboChains();
    }

    private initializeWeapons(): void {
        this.weapons.set('sword', {
            id: 'sword',
            name: 'Plasma Sword',
            damage: 25,
            range: 60,
            attackSpeed: 1.0,
            energyCost: 5,
            spriteKey: 'sword'
        });

        this.weapons.set('gun', {
            id: 'gun',
            name: 'Laser Gun',
            damage: 15,
            range: 200,
            attackSpeed: 0.8,
            energyCost: 8,
            specialEffect: 'piercing',
            spriteKey: 'gun'
        });

        this.weapons.set('shield', {
            id: 'shield',
            name: 'Energy Shield',
            damage: 10,
            range: 40,
            attackSpeed: 1.2,
            energyCost: 3,
            specialEffect: 'defensive',
            spriteKey: 'shield'
        });

        this.weapons.set('dual_gun', {
            id: 'dual_gun',
            name: 'Dual Laser Pistols',
            damage: 20,
            range: 150,
            attackSpeed: 0.6,
            energyCost: 12,
            specialEffect: 'rapid_fire',
            spriteKey: 'dual_gun'
        });
    }

    private initializeSpecialMoves(): void {
        this.specialMoves.set('plasma_burst', {
            id: 'plasma_burst',
            name: 'Plasma Burst',
            damage: 50,
            energyCost: 30,
            cooldown: 5000,
            lastUsed: 0,
            description: 'Explosive area attack',
            effect: 'area'
        });

        this.specialMoves.set('time_slow', {
            id: 'time_slow',
            name: 'Time Slow',
            damage: 0,
            energyCost: 25,
            cooldown: 8000,
            lastUsed: 0,
            description: 'Slow down enemies temporarily',
            effect: 'debuff'
        });

        this.specialMoves.set('healing_wave', {
            id: 'healing_wave',
            name: 'Healing Wave',
            damage: -30, // Negative damage = healing
            energyCost: 20,
            cooldown: 10000,
            lastUsed: 0,
            description: 'Restore health and energy',
            effect: 'buff'
        });

        this.specialMoves.set('chain_lightning', {
            id: 'chain_lightning',
            name: 'Chain Lightning',
            damage: 40,
            energyCost: 35,
            cooldown: 6000,
            lastUsed: 0,
            description: 'Lightning that chains between enemies',
            effect: 'area'
        });
    }

    private initializeComboChains(): void {
        this.comboChains = [
            {
                sequence: ['basic', 'basic', 'special'],
                damage: 80,
                energyReward: 15,
                specialEffect: 'stun'
            },
            {
                sequence: ['special', 'basic', 'basic', 'special'],
                damage: 120,
                energyReward: 25,
                specialEffect: 'burn'
            },
            {
                sequence: ['basic', 'basic', 'basic', 'basic', 'special'],
                damage: 150,
                energyReward: 35,
                specialEffect: 'critical_hit'
            }
        ];
    }

    public switchWeapon(weaponId: string): boolean {
        if (this.weapons.has(weaponId)) {
            this.currentWeapon = weaponId;
            return true;
        }
        return false;
    }

    public getCurrentWeapon(): Weapon {
        return this.weapons.get(this.currentWeapon)!;
    }

    public getAvailableWeapons(): Weapon[] {
        return Array.from(this.weapons.values());
    }

    public performWeaponAttack(): number {
        const weapon = this.getCurrentWeapon();
        const stats = this.getStats();
        
        if (stats.energy < weapon.energyCost) {
            return 0; // Not enough energy
        }

        // Consume energy
        this.restoreEnergy(-weapon.energyCost);
        
        // Calculate damage with weapon stats
        const baseDamage = weapon.damage;
        const damage = this.calculateDamage(baseDamage);
        
        // Update combo
        this.updateAdvancedCombo('basic');
        
        return damage;
    }

    public performSpecialMove(moveId: string): number | null {
        const move = this.specialMoves.get(moveId);
        if (!move) return null;

        const currentTime = Date.now();
        if (currentTime - move.lastUsed < move.cooldown) {
            return null; // Still on cooldown
        }

        const stats = this.getStats();
        if (stats.energy < move.energyCost) {
            return null; // Not enough energy
        }

        // Consume energy and set cooldown
        this.restoreEnergy(-move.energyCost);
        move.lastUsed = currentTime;

        // Update combo
        this.updateAdvancedCombo('special');

        return move.damage;
    }

    private updateAdvancedCombo(attackType: string): void {
        const currentTime = Date.now();
        
        if (currentTime - this.getComboData().lastHitTime < this.comboWindow) {
            this.currentComboSequence.push(attackType);
        } else {
            this.currentComboSequence = [attackType];
        }

        // Check for combo chain completion
        this.checkComboChain();
    }

    private checkComboChain(): void {
        for (const combo of this.comboChains) {
            if (this.isComboMatch(combo.sequence)) {
                this.executeComboChain(combo);
                break;
            }
        }
    }

    private isComboMatch(sequence: string[]): boolean {
        if (this.currentComboSequence.length < sequence.length) {
            return false;
        }

        const recentSequence = this.currentComboSequence.slice(-sequence.length);
        return JSON.stringify(recentSequence) === JSON.stringify(sequence);
    }

    private executeComboChain(combo: ComboChain): void {
        // Reward energy
        this.restoreEnergy(combo.energyReward);
        
        // Apply special effect
        if (combo.specialEffect) {
            this.applySpecialEffect(combo.specialEffect);
        }

        // Clear combo sequence
        this.currentComboSequence = [];
    }

    private applySpecialEffect(effect: string): void {
        // This would be implemented based on the game's needs
        console.log(`Applied special effect: ${effect}`);
    }

    public getAvailableSpecialMoves(): SpecialMove[] {
        const currentTime = Date.now();
        return Array.from(this.specialMoves.values()).filter(move => 
            currentTime - move.lastUsed >= move.cooldown
        );
    }

    public getCurrentComboSequence(): string[] {
        return [...this.currentComboSequence];
    }

    public getComboProgress(): number {
        return this.currentComboSequence.length;
    }

    public addExperience(amount: number): void {
        this.experience += amount;
        this.checkLevelUp();
    }

    private checkLevelUp(): void {
        const experienceNeeded = this.level * 100; // Simple leveling formula
        if (this.experience >= experienceNeeded) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.level++;
        this.skillPoints += 2;
        this.experience = 0;
        
        // Increase stats
        const stats = this.getStats();
        stats.maxHealth += 10;
        stats.maxEnergy += 5;
        stats.attackPower += 2;
        stats.defense += 1;
        
        // Restore health and energy on level up
        stats.health = stats.maxHealth;
        stats.energy = stats.maxEnergy;
    }

    public getLevel(): number {
        return this.level;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getSkillPoints(): number {
        return this.skillPoints;
    }

    public spendSkillPoint(stat: keyof CombatStats): boolean {
        if (this.skillPoints <= 0) return false;

        const stats = this.getStats();
        switch (stat) {
            case 'maxHealth':
                stats.maxHealth += 20;
                stats.health = stats.maxHealth; // Restore health
                break;
            case 'maxEnergy':
                stats.maxEnergy += 10;
                stats.energy = stats.maxEnergy; // Restore energy
                break;
            case 'attackPower':
                stats.attackPower += 5;
                break;
            case 'defense':
                stats.defense += 2;
                break;
            default:
                return false;
        }

        this.skillPoints--;
        return true;
    }

    public resetCombo(): void {
        super.resetCombo();
        this.currentComboSequence = [];
    }
} 