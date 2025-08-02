export interface ScoreData {
    currentScore: number;
    highScore: number;
    waveBonus: number;
    comboBonus: number;
    survivalBonus: number;
    totalScore: number;
}

export interface HighScoreEntry {
    score: number;
    date: string;
    wave: number;
    combo: number;
}

export class ScoreManager {
    private currentScore: number = 0;
    private highScore: number = 0;
    private waveBonus: number = 0;
    private comboBonus: number = 0;
    private survivalBonus: number = 0;
    private startTime: number = 0;
    private lastSurvivalBonus: number = 0;
    private readonly SURVIVAL_BONUS_INTERVAL = 10000; // 10 seconds
    private readonly SURVIVAL_BONUS_AMOUNT = 50;
    private readonly WAVE_BONUS_MULTIPLIER = 100;
    private readonly COMBO_BONUS_MULTIPLIER = 10;

    constructor() {
        this.loadHighScore();
    }

    public startGame(): void {
        this.currentScore = 0;
        this.waveBonus = 0;
        this.comboBonus = 0;
        this.survivalBonus = 0;
        this.startTime = Date.now();
        this.lastSurvivalBonus = 0;
    }

    public addEnemyKill(points: number, combo: number = 1): void {
        const basePoints = points;
        const comboMultiplier = 1 + (combo - 1) * 0.2; // 20% bonus per combo level
        const totalPoints = Math.floor(basePoints * comboMultiplier);
        
        this.currentScore += totalPoints;
        this.comboBonus += totalPoints - basePoints;
    }

    public addWaveBonus(waveNumber: number): void {
        const bonus = waveNumber * this.WAVE_BONUS_MULTIPLIER;
        this.waveBonus += bonus;
        this.currentScore += bonus;
    }

    public updateSurvivalBonus(): void {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.startTime;
        const bonusIntervals = Math.floor(timeElapsed / this.SURVIVAL_BONUS_INTERVAL);
        
        if (bonusIntervals > this.lastSurvivalBonus) {
            const newBonus = (bonusIntervals - this.lastSurvivalBonus) * this.SURVIVAL_BONUS_AMOUNT;
            this.survivalBonus += newBonus;
            this.currentScore += newBonus;
            this.lastSurvivalBonus = bonusIntervals;
        }
    }

    public addComboBonus(comboCount: number): void {
        const bonus = comboCount * this.COMBO_BONUS_MULTIPLIER;
        this.comboBonus += bonus;
        this.currentScore += bonus;
    }

    public addSpecialAbilityBonus(points: number): void {
        this.currentScore += points;
    }

    public endGame(): ScoreData {
        this.updateSurvivalBonus();
        
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }

        return this.getScoreData();
    }

    public getScoreData(): ScoreData {
        return {
            currentScore: this.currentScore,
            highScore: this.highScore,
            waveBonus: this.waveBonus,
            comboBonus: this.comboBonus,
            survivalBonus: this.survivalBonus,
            totalScore: this.currentScore
        };
    }

    public getCurrentScore(): number {
        return this.currentScore;
    }

    public getHighScore(): number {
        return this.highScore;
    }

    public getSurvivalTime(): number {
        return Date.now() - this.startTime;
    }

    public getSurvivalTimeFormatted(): string {
        const time = this.getSurvivalTime();
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    private loadHighScore(): void {
        try {
            const saved = localStorage.getItem('bioCommanderHighScore');
            if (saved) {
                this.highScore = parseInt(saved, 10);
            }
        } catch (error) {
            console.warn('Could not load high score:', error);
        }
    }

    private saveHighScore(): void {
        try {
            localStorage.setItem('bioCommanderHighScore', this.highScore.toString());
        } catch (error) {
            console.warn('Could not save high score:', error);
        }
    }

    public resetScores(): void {
        this.currentScore = 0;
        this.highScore = 0;
        this.waveBonus = 0;
        this.comboBonus = 0;
        this.survivalBonus = 0;
        this.saveHighScore();
    }

    // Format score with commas for display
    public formatScore(score: number): string {
        return score.toLocaleString();
    }

    // Get score breakdown for display
    public getScoreBreakdown(): {
        baseScore: number;
        waveBonus: number;
        comboBonus: number;
        survivalBonus: number;
        total: number;
    } {
        const baseScore = this.currentScore - this.waveBonus - this.comboBonus - this.survivalBonus;
        return {
            baseScore: Math.max(0, baseScore),
            waveBonus: this.waveBonus,
            comboBonus: this.comboBonus,
            survivalBonus: this.survivalBonus,
            total: this.currentScore
        };
    }
} 