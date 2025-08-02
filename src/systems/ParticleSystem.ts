import { Scene, GameObjects } from 'phaser';

export interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: number;
    life: number;
    maxLife: number;
    alpha: number;
    scale: number;
}

export class ParticleSystem {
    private scene: Scene;
    private particles: Map<string, Particle> = new Map();
    private particleGraphics: Map<string, GameObjects.Graphics> = new Map();
    private nextId: number = 0;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createParticle(
        x: number,
        y: number,
        vx: number,
        vy: number,
        size: number,
        color: number,
        life: number
    ): string {
        const id = `particle_${this.nextId++}`;
        
        const particle: Particle = {
            id,
            x,
            y,
            vx,
            vy,
            size,
            color,
            life,
            maxLife: life,
            alpha: 1,
            scale: 1
        };

        this.particles.set(id, particle);

        // Create graphics object for the particle
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillCircle(0, 0, size);
        graphics.setPosition(x, y);
        
        this.particleGraphics.set(id, graphics);

        return id;
    }

    createExplosion(x: number, y: number, color: number = 0xffffff, count: number = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const size = 2 + Math.random() * 4;
            const life = 500 + Math.random() * 500;

            this.createParticle(x, y, vx, vy, size, color, life);
        }
    }

    createTrail(x: number, y: number, color: number = 0x667eea) {
        const vx = (Math.random() - 0.5) * 20;
        const vy = (Math.random() - 0.5) * 20;
        const size = 1 + Math.random() * 2;
        const life = 200 + Math.random() * 300;

        this.createParticle(x, y, vx, vy, size, color, life);
    }

    createDamageEffect(x: number, y: number, damage: number) {
        const color = damage > 50 ? 0xff0000 : damage > 20 ? 0xff6600 : 0xffff00;
        const size = Math.min(damage / 10, 8);
        const life = 800;

        this.createParticle(x, y, 0, -50, size, color, life);
    }

    createHealEffect(x: number, y: number) {
        const color = 0x00ff00;
        const size = 4;
        const life = 600;

        this.createParticle(x, y, 0, -30, size, color, life);
    }

    createEnergyEffect(x: number, y: number) {
        const color = 0x00ffff;
        const size = 3;
        const life = 500;

        this.createParticle(x, y, 0, -25, size, color, life);
    }

    createComboEffect(x: number, y: number, combo: number) {
        const color = combo > 10 ? 0xff00ff : combo > 5 ? 0xff8800 : 0xffff00;
        const size = Math.min(combo, 12);
        const life = 1000;

        this.createParticle(x, y, 0, -40, size, color, life);
    }

    update(deltaTime: number) {
        const dt = deltaTime / 1000; // Convert to seconds

        this.particles.forEach((particle, id) => {
            // Update position
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;

            // Apply gravity
            particle.vy += 100 * dt;

            // Update life
            particle.life -= deltaTime;

            // Update alpha and scale based on life
            const lifeRatio = particle.life / particle.maxLife;
            particle.alpha = lifeRatio;
            particle.scale = lifeRatio;

            // Update graphics
            const graphics = this.particleGraphics.get(id);
            if (graphics) {
                graphics.setPosition(particle.x, particle.y);
                graphics.setAlpha(particle.alpha);
                graphics.setScale(particle.scale);
            }

            // Remove dead particles
            if (particle.life <= 0) {
                this.removeParticle(id);
            }
        });
    }

    private removeParticle(id: string) {
        const graphics = this.particleGraphics.get(id);
        if (graphics) {
            graphics.destroy();
            this.particleGraphics.delete(id);
        }
        this.particles.delete(id);
    }

    clear() {
        this.particles.forEach((_, id) => {
            this.removeParticle(id);
        });
    }

    getParticleCount(): number {
        return this.particles.size;
    }

    destroy() {
        this.clear();
    }
} 