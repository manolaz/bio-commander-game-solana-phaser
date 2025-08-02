export interface CombatStats {
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    attackPower: number;
    defense: number;
}

export interface ComboData {
    count: number;
    multiplier: number;
    lastHitTime: number;
    maxCombo: number;
}

export class CombatSystem {
    private playerStats: CombatStats;
    private comboData: ComboData;
    private readonly COMBO_TIMEOUT = 2000; // 2 seconds
    private readonly BASE_COMBO_MULTIPLIER = 1.2;

    constructor(initialStats: Partial<CombatStats> = {}) {
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            attackPower: 20,
            defense: 10,
            ...initialStats
        };

        this.comboData = {
            count: 0,
            multiplier: 1,
            lastHitTime: 0,
            maxCombo: 0
        };
    }

    // Player attack methods
    public performBasicAttack(): number {
        const damage = this.calculateDamage(this.playerStats.attackPower);
        this.updateCombo();
        return damage;
    }

    public performSpecialAttack(energyCost: number = 25): number | null {
        if (this.playerStats.energy < energyCost) {
            return null; // Not enough energy
        }

        this.playerStats.energy -= energyCost;
        const damage = this.calculateDamage(this.playerStats.attackPower * 2);
        this.updateCombo();
        return damage;
    }

    // Damage calculation
    private calculateDamage(baseDamage: number): number {
        const comboBonus = this.comboData.multiplier;
        const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation
        return Math.floor(baseDamage * comboBonus * randomVariation);
    }

    // Combo system
    private updateCombo(): void {
        const currentTime = Date.now();
        
        if (currentTime - this.comboData.lastHitTime < this.COMBO_TIMEOUT) {
            this.comboData.count++;
            this.comboData.multiplier = 1 + (this.comboData.count - 1) * this.BASE_COMBO_MULTIPLIER;
        } else {
            this.comboData.count = 1;
            this.comboData.multiplier = 1;
        }

        this.comboData.lastHitTime = currentTime;
        
        if (this.comboData.count > this.comboData.maxCombo) {
            this.comboData.maxCombo = this.comboData.count;
        }
    }

    // Health and energy management
    public takeDamage(damage: number): boolean {
        const actualDamage = Math.max(1, damage - this.playerStats.defense);
        this.playerStats.health = Math.max(0, this.playerStats.health - actualDamage);
        return this.playerStats.health > 0; // Returns true if still alive
    }

    public heal(amount: number): void {
        this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + amount);
    }

    public restoreEnergy(amount: number): void {
        this.playerStats.energy = Math.min(this.playerStats.maxEnergy, this.playerStats.energy + amount);
    }

    public regenerateEnergy(amount: number): void {
        this.restoreEnergy(amount);
    }

    // Getters
    public getStats(): CombatStats {
        return { ...this.playerStats };
    }

    public getComboData(): ComboData {
        return { ...this.comboData };
    }

    public getHealthPercentage(): number {
        return (this.playerStats.health / this.playerStats.maxHealth) * 100;
    }

    public getEnergyPercentage(): number {
        return (this.playerStats.energy / this.playerStats.maxEnergy) * 100;
    }

    public isAlive(): boolean {
        return this.playerStats.health > 0;
    }

    // Reset combo
    public resetCombo(): void {
        this.comboData.count = 0;
        this.comboData.multiplier = 1;
    }

    // Check if combo is still active
    public isComboActive(): boolean {
        return Date.now() - this.comboData.lastHitTime < this.COMBO_TIMEOUT;
    }
} 