import { Scene } from 'phaser';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: 'combat' | 'exploration' | 'survival' | 'collection' | 'special';
    icon: string;
    points: number;
    isUnlocked: boolean;
    unlockDate?: number;
    progress: number;
    maxProgress: number;
    rewards: AchievementReward[];
    secret?: boolean;
}

export interface AchievementReward {
    type: 'experience' | 'skill_points' | 'weapon' | 'special_move' | 'cosmetic' | 'title';
    value: string | number;
    description: string;
}

export interface AchievementEvent {
    type: string;
    value?: number;
    data?: any;
}

export class AchievementSystem {
    private achievements: Map<string, Achievement> = new Map();
    private scene: Scene;
    private totalPoints: number = 0;
    private unlockedCount: number = 0;
    private eventListeners: Map<string, (event: AchievementEvent) => void> = new Map();
    private notificationQueue: Achievement[] = [];
    private isShowingNotification: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
        this.initializeAchievements();
        this.setupEventListeners();
    }

    private initializeAchievements(): void {
        // Combat Achievements
        this.addAchievement({
            id: 'first_blood',
            name: 'First Blood',
            description: 'Defeat your first enemy',
            category: 'combat',
            icon: '⚔️',
            points: 10,
            isUnlocked: false,
            progress: 0,
            maxProgress: 1,
            rewards: [
                { type: 'experience', value: 50, description: '+50 Experience' }
            ]
        });

        this.addAchievement({
            id: 'combo_master',
            name: 'Combo Master',
            description: 'Perform a 10-hit combo',
            category: 'combat',
            icon: '🔥',
            points: 25,
            isUnlocked: false,
            progress: 0,
            maxProgress: 10,
            rewards: [
                { type: 'skill_points', value: 2, description: '+2 Skill Points' }
            ]
        });

        this.addAchievement({
            id: 'weapon_master',
            name: 'Weapon Master',
            description: 'Use all weapon types in a single battle',
            category: 'combat',
            icon: '🗡️',
            points: 30,
            isUnlocked: false,
            progress: 0,
            maxProgress: 4,
            rewards: [
                { type: 'weapon', value: 'legendary_sword', description: 'Legendary Sword Unlocked' }
            ]
        });

        this.addAchievement({
            id: 'boss_slayer',
            name: 'Boss Slayer',
            description: 'Defeat a boss without taking damage',
            category: 'combat',
            icon: '👑',
            points: 50,
            isUnlocked: false,
            progress: 0,
            maxProgress: 1,
            rewards: [
                { type: 'title', value: 'Boss Slayer', description: 'Title: Boss Slayer' },
                { type: 'experience', value: 200, description: '+200 Experience' }
            ]
        });

        // Survival Achievements
        this.addAchievement({
            id: 'survivor',
            name: 'Survivor',
            description: 'Survive for 5 minutes in a single battle',
            category: 'survival',
            icon: '⏰',
            points: 20,
            isUnlocked: false,
            progress: 0,
            maxProgress: 300, // 5 minutes in seconds
            rewards: [
                { type: 'skill_points', value: 1, description: '+1 Skill Point' }
            ]
        });

        this.addAchievement({
            id: 'wave_master',
            name: 'Wave Master',
            description: 'Complete 10 waves in a single session',
            category: 'survival',
            icon: '🌊',
            points: 40,
            isUnlocked: false,
            progress: 0,
            maxProgress: 10,
            rewards: [
                { type: 'special_move', value: 'ultimate_burst', description: 'Ultimate Burst Unlocked' }
            ]
        });

        this.addAchievement({
            id: 'perfect_run',
            name: 'Perfect Run',
            description: 'Complete a wave without taking any damage',
            category: 'survival',
            icon: '✨',
            points: 35,
            isUnlocked: false,
            progress: 0,
            maxProgress: 1,
            rewards: [
                { type: 'cosmetic', value: 'golden_aura', description: 'Golden Aura Effect' }
            ]
        });

        // Collection Achievements
        this.addAchievement({
            id: 'collector',
            name: 'Collector',
            description: 'Collect 50 power-ups',
            category: 'collection',
            icon: '📦',
            points: 15,
            isUnlocked: false,
            progress: 0,
            maxProgress: 50,
            rewards: [
                { type: 'experience', value: 100, description: '+100 Experience' }
            ]
        });

        this.addAchievement({
            id: 'power_hungry',
            name: 'Power Hungry',
            description: 'Collect 10 power-ups in a single wave',
            category: 'collection',
            icon: '⚡',
            points: 25,
            isUnlocked: false,
            progress: 0,
            maxProgress: 10,
            rewards: [
                { type: 'skill_points', value: 1, description: '+1 Skill Point' }
            ]
        });

        // Exploration Achievements
        this.addAchievement({
            id: 'explorer',
            name: 'Explorer',
            description: 'Visit all areas of the battlefield',
            category: 'exploration',
            icon: '🗺️',
            points: 20,
            isUnlocked: false,
            progress: 0,
            maxProgress: 4,
            rewards: [
                { type: 'cosmetic', value: 'explorer_badge', description: 'Explorer Badge' }
            ]
        });

        // Special Achievements
        this.addAchievement({
            id: 'shape_master',
            name: 'Shape Master',
            description: 'Successfully draw all shape types',
            category: 'special',
            icon: '🔷',
            points: 30,
            isUnlocked: false,
            progress: 0,
            maxProgress: 5, // circle, triangle, square, star, line
            rewards: [
                { type: 'special_move', value: 'shape_fusion', description: 'Shape Fusion Ability' }
            ]
        });

        this.addAchievement({
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Defeat 20 enemies in under 2 minutes',
            category: 'special',
            icon: '💨',
            points: 45,
            isUnlocked: false,
            progress: 0,
            maxProgress: 20,
            rewards: [
                { type: 'title', value: 'Speed Demon', description: 'Title: Speed Demon' },
                { type: 'cosmetic', value: 'speed_trail', description: 'Speed Trail Effect' }
            ]
        });

        // Secret Achievements
        this.addAchievement({
            id: 'secret_warrior',
            name: '???',
            description: 'Discover this achievement by playing',
            category: 'special',
            icon: '❓',
            points: 100,
            isUnlocked: false,
            progress: 0,
            maxProgress: 1,
            rewards: [
                { type: 'title', value: 'Secret Warrior', description: 'Title: Secret Warrior' },
                { type: 'weapon', value: 'mystery_weapon', description: 'Mystery Weapon' }
            ],
            secret: true
        });
    }

    private addAchievement(achievement: Achievement): void {
        this.achievements.set(achievement.id, achievement);
    }

    private setupEventListeners(): void {
        // Combat events
        this.eventListeners.set('enemy_defeated', (event) => {
            this.updateAchievement('first_blood', 1);
            this.updateAchievement('speed_demon', 1);
        });

        this.eventListeners.set('combo_performed', (event) => {
            if (event.value) {
                this.updateAchievement('combo_master', event.value);
            }
        });

        this.eventListeners.set('weapon_used', (event) => {
            this.updateAchievement('weapon_master', 1);
        });

        this.eventListeners.set('boss_defeated', (event) => {
            if (event.data && event.data.noDamage) {
                this.updateAchievement('boss_slayer', 1);
            }
        });

        // Survival events
        this.eventListeners.set('time_survived', (event) => {
            if (event.value) {
                this.updateAchievement('survivor', event.value);
            }
        });

        this.eventListeners.set('wave_completed', (event) => {
            this.updateAchievement('wave_master', 1);
            if (event.data && event.data.noDamage) {
                this.updateAchievement('perfect_run', 1);
            }
        });

        // Collection events
        this.eventListeners.set('powerup_collected', (event) => {
            this.updateAchievement('collector', 1);
            this.updateAchievement('power_hungry', 1);
        });

        // Exploration events
        this.eventListeners.set('area_visited', (event) => {
            this.updateAchievement('explorer', 1);
        });

        // Special events
        this.eventListeners.set('shape_drawn', (event) => {
            this.updateAchievement('shape_master', 1);
        });

        // Secret achievement trigger
        this.eventListeners.set('secret_trigger', (event) => {
            this.updateAchievement('secret_warrior', 1);
        });
    }

    public handleEvent(eventType: string, event: AchievementEvent): void {
        const listener = this.eventListeners.get(eventType);
        if (listener) {
            listener(event);
        }
    }

    private updateAchievement(achievementId: string, progress: number): void {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.isUnlocked) return;

        achievement.progress += progress;

        if (achievement.progress >= achievement.maxProgress) {
            this.unlockAchievement(achievementId);
        }
    }

    private unlockAchievement(achievementId: string): void {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.isUnlocked) return;

        achievement.isUnlocked = true;
        achievement.unlockDate = Date.now();
        this.unlockedCount++;
        this.totalPoints += achievement.points;

        // Add to notification queue
        this.notificationQueue.push(achievement);

        // Show notification if not already showing
        if (!this.isShowingNotification) {
            this.showNextNotification();
        }

        // Grant rewards
        this.grantRewards(achievement);

        console.log(`Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
    }

    private grantRewards(achievement: Achievement): void {
        achievement.rewards.forEach(reward => {
            switch (reward.type) {
                case 'experience':
                    this.scene.events.emit('grantExperience', { amount: reward.value as number });
                    break;
                case 'skill_points':
                    this.scene.events.emit('grantSkillPoints', { amount: reward.value as number });
                    break;
                case 'weapon':
                    this.scene.events.emit('unlockWeapon', { weaponId: reward.value as string });
                    break;
                case 'special_move':
                    this.scene.events.emit('unlockSpecialMove', { moveId: reward.value as string });
                    break;
                case 'title':
                    this.scene.events.emit('unlockTitle', { title: reward.value as string });
                    break;
                case 'cosmetic':
                    this.scene.events.emit('unlockCosmetic', { cosmeticId: reward.value as string });
                    break;
            }
        });
    }

    private showNextNotification(): void {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const achievement = this.notificationQueue.shift()!;
        this.showAchievementNotification(achievement);
    }

    private showAchievementNotification(achievement: Achievement): void {
        // Create notification container
        const notification = this.scene.add.container(400, 100);
        notification.setDepth(1000);

        // Background
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRoundedRect(-200, -30, 400, 60, 10);
        background.lineStyle(2, 0xffff00, 1);
        background.strokeRoundedRect(-200, -30, 400, 60, 10);
        notification.add(background);

        // Icon
        const icon = this.scene.add.text(-180, 0, achievement.icon, {
            fontSize: '24px'
        }).setOrigin(0.5);
        notification.add(icon);

        // Text
        const title = this.scene.add.text(-140, -10, achievement.name, {
            fontSize: '16px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        notification.add(title);

        const description = this.scene.add.text(-140, 10, achievement.description, {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        notification.add(description);

        // Points
        const points = this.scene.add.text(180, 0, `+${achievement.points}`, {
            fontSize: '14px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        notification.add(points);

        // Animation
        notification.setScale(0);
        this.scene.tweens.add({
            targets: notification,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Hold for 3 seconds
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: notification,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 200,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            notification.destroy();
                            this.showNextNotification();
                        }
                    });
                });
            }
        });

        // Play sound
        this.scene.sound.play('achievement_unlock', { volume: 0.5 });
    }

    public getAchievements(): Achievement[] {
        return Array.from(this.achievements.values());
    }

    public getUnlockedAchievements(): Achievement[] {
        return this.getAchievements().filter(a => a.isUnlocked);
    }

    public getLockedAchievements(): Achievement[] {
        return this.getAchievements().filter(a => !a.isUnlocked && !a.secret);
    }

    public getSecretAchievements(): Achievement[] {
        return this.getAchievements().filter(a => a.secret);
    }

    public getAchievementById(id: string): Achievement | undefined {
        return this.achievements.get(id);
    }

    public getTotalPoints(): number {
        return this.totalPoints;
    }

    public getUnlockedCount(): number {
        return this.unlockedCount;
    }

    public getTotalCount(): number {
        return this.achievements.size;
    }

    public getCompletionPercentage(): number {
        return (this.unlockedCount / this.achievements.size) * 100;
    }

    public getAchievementsByCategory(category: string): Achievement[] {
        return this.getAchievements().filter(a => a.category === category);
    }

    public getRecentAchievements(count: number = 5): Achievement[] {
        return this.getUnlockedAchievements()
            .filter(a => a.unlockDate)
            .sort((a, b) => (b.unlockDate || 0) - (a.unlockDate || 0))
            .slice(0, count);
    }

    public resetProgress(): void {
        this.achievements.forEach(achievement => {
            achievement.isUnlocked = false;
            achievement.progress = 0;
            delete achievement.unlockDate;
        });
        this.totalPoints = 0;
        this.unlockedCount = 0;
    }

    public saveProgress(): any {
        const progress: any = {
            totalPoints: this.totalPoints,
            unlockedCount: this.unlockedCount,
            achievements: {}
        };

        this.achievements.forEach((achievement, id) => {
            progress.achievements[id] = {
                isUnlocked: achievement.isUnlocked,
                progress: achievement.progress,
                unlockDate: achievement.unlockDate
            };
        });

        return progress;
    }

    public loadProgress(progress: any): void {
        if (!progress) return;

        this.totalPoints = progress.totalPoints || 0;
        this.unlockedCount = progress.unlockedCount || 0;

        if (progress.achievements) {
            Object.keys(progress.achievements).forEach(id => {
                const achievement = this.achievements.get(id);
                if (achievement) {
                    const saved = progress.achievements[id];
                    achievement.isUnlocked = saved.isUnlocked || false;
                    achievement.progress = saved.progress || 0;
                    achievement.unlockDate = saved.unlockDate;
                }
            });
        }
    }
} 