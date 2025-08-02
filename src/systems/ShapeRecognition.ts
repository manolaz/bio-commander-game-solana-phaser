import { Scene, GameObjects } from 'phaser';

export interface ShapePoint {
    x: number;
    y: number;
    timestamp: number;
}

export interface RecognizedShape {
    type: 'circle' | 'triangle' | 'square' | 'star' | 'line' | 'unknown';
    confidence: number;
    points: ShapePoint[];
    bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        width: number;
        height: number;
    };
}

export class ShapeRecognition {
    private scene: Scene;
    private drawingGraphics!: GameObjects.Graphics;
    private currentPoints: ShapePoint[] = [];
    private isDrawing: boolean = false;
    private minPoints: number = 10;
    private maxDrawTime: number = 3000; // 3 seconds
    private drawStartTime: number = 0;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setupDrawing();
    }

    private setupDrawing() {
        this.drawingGraphics = this.scene.add.graphics();
        this.drawingGraphics.setDepth(1000); // Ensure it's on top
    }

    startDrawing(x: number, y: number) {
        this.isDrawing = true;
        this.currentPoints = [];
        this.drawStartTime = Date.now();
        
        // Add first point
        this.addPoint(x, y);
        
        // Start drawing line
        this.drawingGraphics.clear();
        this.drawingGraphics.lineStyle(3, 0x667eea, 1);
        this.drawingGraphics.beginPath();
        this.drawingGraphics.moveTo(x, y);
    }

    continueDrawing(x: number, y: number) {
        if (!this.isDrawing) return;

        // Check if drawing time exceeded
        if (Date.now() - this.drawStartTime > this.maxDrawTime) {
            this.cancelDrawing();
            return;
        }

        this.addPoint(x, y);
        
        // Continue drawing line
        this.drawingGraphics.lineTo(x, y);
        this.drawingGraphics.strokePath();
    }

    endDrawing(): RecognizedShape | null {
        if (!this.isDrawing || this.currentPoints.length < this.minPoints) {
            this.cancelDrawing();
            return null;
        }

        this.isDrawing = false;
        
        // Recognize the shape
        const shape = this.recognizeShape();
        
        // Clear drawing
        this.drawingGraphics.clear();
        
        return shape;
    }

    cancelDrawing() {
        this.isDrawing = false;
        this.currentPoints = [];
        this.drawingGraphics.clear();
    }

    private addPoint(x: number, y: number) {
        this.currentPoints.push({
            x,
            y,
            timestamp: Date.now()
        });
    }

    private recognizeShape(): RecognizedShape {
        const bounds = this.calculateBounds();
        const normalizedPoints = this.normalizePoints(bounds);
        
        // Calculate shape characteristics
        const perimeter = this.calculatePerimeter();
        const area = this.calculateArea();
        const aspectRatio = bounds.width / bounds.height;
        const circularity = this.calculateCircularity(perimeter, area);
        const cornerCount = this.countCorners(normalizedPoints);
        
        // Recognize shape based on characteristics
        let shapeType: RecognizedShape['type'] = 'unknown';
        let confidence = 0;

        // Circle detection
        if (circularity > 0.8 && aspectRatio > 0.7 && aspectRatio < 1.3) {
            shapeType = 'circle';
            confidence = Math.min(circularity * 1.2, 1.0);
        }
        // Triangle detection
        else if (cornerCount >= 3 && cornerCount <= 4 && circularity < 0.6) {
            shapeType = 'triangle';
            confidence = 0.8;
        }
        // Square detection
        else if (cornerCount >= 4 && cornerCount <= 6 && aspectRatio > 0.7 && aspectRatio < 1.3) {
            shapeType = 'square';
            confidence = 0.8;
        }
        // Star detection (complex shape with many corners)
        else if (cornerCount >= 5 && cornerCount <= 10) {
            shapeType = 'star';
            confidence = 0.7;
        }
        // Line detection
        else if (aspectRatio > 3 || aspectRatio < 0.33) {
            shapeType = 'line';
            confidence = 0.9;
        }

        return {
            type: shapeType,
            confidence,
            points: [...this.currentPoints],
            bounds
        };
    }

    private calculateBounds() {
        if (this.currentPoints.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
        }

        let minX = this.currentPoints[0].x;
        let minY = this.currentPoints[0].y;
        let maxX = this.currentPoints[0].x;
        let maxY = this.currentPoints[0].y;

        this.currentPoints.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });

        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    private normalizePoints(bounds: RecognizedShape['bounds']) {
        if (bounds.width === 0 || bounds.height === 0) return this.currentPoints;

        return this.currentPoints.map(point => ({
            x: (point.x - bounds.minX) / bounds.width,
            y: (point.y - bounds.minY) / bounds.height,
            timestamp: point.timestamp
        }));
    }

    private calculatePerimeter(): number {
        let perimeter = 0;
        for (let i = 1; i < this.currentPoints.length; i++) {
            const dx = this.currentPoints[i].x - this.currentPoints[i - 1].x;
            const dy = this.currentPoints[i].y - this.currentPoints[i - 1].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        return perimeter;
    }

    private calculateArea(): number {
        // Shoelace formula for polygon area
        let area = 0;
        for (let i = 0; i < this.currentPoints.length; i++) {
            const j = (i + 1) % this.currentPoints.length;
            area += this.currentPoints[i].x * this.currentPoints[j].y;
            area -= this.currentPoints[j].x * this.currentPoints[i].y;
        }
        return Math.abs(area) / 2;
    }

    private calculateCircularity(perimeter: number, area: number): number {
        if (area === 0) return 0;
        const idealPerimeter = 2 * Math.sqrt(Math.PI * area);
        return idealPerimeter / perimeter;
    }

    private countCorners(normalizedPoints: ShapePoint[]): number {
        if (normalizedPoints.length < 3) return 0;

        let corners = 0;
        const threshold = 0.1; // Minimum angle change to be considered a corner

        for (let i = 1; i < normalizedPoints.length - 1; i++) {
            const prev = normalizedPoints[i - 1];
            const curr = normalizedPoints[i];
            const next = normalizedPoints[i + 1];

            const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
            const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
            
            let angleDiff = Math.abs(angle2 - angle1);
            if (angleDiff > Math.PI) {
                angleDiff = 2 * Math.PI - angleDiff;
            }

            if (angleDiff > threshold) {
                corners++;
            }
        }

        return corners;
    }

    isDrawing(): boolean {
        return this.isDrawing;
    }

    getCurrentPoints(): ShapePoint[] {
        return [...this.currentPoints];
    }

    clear() {
        this.cancelDrawing();
    }

    destroy() {
        this.drawingGraphics.destroy();
    }
} 