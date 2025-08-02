import { Scene, GameObjects } from 'phaser';
import { ShapeRecognition, RecognizedShape } from './ShapeRecognition';

export interface TouchZone {
    x: number;
    y: number;
    width: number;
    height: number;
    callback: (x: number, y: number) => void;
}

export interface TouchGesture {
    type: 'tap' | 'doubleTap' | 'longPress' | 'swipe' | 'pinch' | 'draw';
    data: any;
}

export class TouchControls {
    private scene: Scene;
    private shapeRecognition: ShapeRecognition;
    private touchZones: TouchZone[] = [];
    private activeTouches: Map<number, { x: number; y: number; startTime: number; startX: number; startY: number }> = new Map();
    private lastTapTime: number = 0;
    private doubleTapDelay: number = 300;
    private longPressDelay: number = 500;
    private swipeThreshold: number = 50;
    private isEnabled: boolean = true;

    constructor(scene: Scene) {
        this.scene = scene;
        this.shapeRecognition = new ShapeRecognition(scene);
        this.setupTouchEvents();
    }

    private setupTouchEvents() {
        // Touch start
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.isEnabled) return;
            
            const touchId = pointer.id;
            this.activeTouches.set(touchId, {
                x: pointer.x,
                y: pointer.y,
                startTime: Date.now(),
                startX: pointer.x,
                startY: pointer.y
            });

            // Check touch zones
            this.checkTouchZones(pointer.x, pointer.y);

            // Start shape drawing if not in a touch zone
            if (!this.isInTouchZone(pointer.x, pointer.y)) {
                this.shapeRecognition.startDrawing(pointer.x, pointer.y);
            }
        });

        // Touch move
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isEnabled) return;
            
            const touch = this.activeTouches.get(pointer.id);
            if (touch) {
                touch.x = pointer.x;
                touch.y = pointer.y;

                // Continue shape drawing
                if (this.shapeRecognition.isDrawing()) {
                    this.shapeRecognition.continueDrawing(pointer.x, pointer.y);
                }
            }
        });

        // Touch end
        this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!this.isEnabled) return;
            
            const touch = this.activeTouches.get(pointer.id);
            if (touch) {
                const duration = Date.now() - touch.startTime;
                const distance = Math.sqrt(
                    Math.pow(pointer.x - touch.startX, 2) + 
                    Math.pow(pointer.y - touch.startY, 2)
                );

                // Handle different gesture types
                if (this.shapeRecognition.isDrawing()) {
                    const shape = this.shapeRecognition.endDrawing();
                    if (shape) {
                        this.handleShapeGesture(shape);
                    }
                } else if (distance < this.swipeThreshold) {
                    // Tap gesture
                    if (duration < this.longPressDelay) {
                        this.handleTapGesture(pointer.x, pointer.y, duration);
                    } else {
                        this.handleLongPressGesture(pointer.x, pointer.y);
                    }
                } else {
                    // Swipe gesture
                    this.handleSwipeGesture(touch.startX, touch.startY, pointer.x, pointer.y, duration);
                }

                this.activeTouches.delete(pointer.id);
            }
        });

        // Handle touch cancel
        this.scene.input.on('pointerout', (pointer: Phaser.Input.Pointer) => {
            if (!this.isEnabled) return;
            
            this.activeTouches.delete(pointer.id);
            if (this.shapeRecognition.isDrawing()) {
                this.shapeRecognition.cancelDrawing();
            }
        });
    }

    private checkTouchZones(x: number, y: number) {
        for (const zone of this.touchZones) {
            if (x >= zone.x && x <= zone.x + zone.width &&
                y >= zone.y && y <= zone.y + zone.height) {
                zone.callback(x, y);
                break;
            }
        }
    }

    private isInTouchZone(x: number, y: number): boolean {
        return this.touchZones.some(zone => 
            x >= zone.x && x <= zone.x + zone.width &&
            y >= zone.y && y <= zone.y + zone.height
        );
    }

    private handleTapGesture(x: number, y: number, duration: number) {
        const now = Date.now();
        const timeSinceLastTap = now - this.lastTapTime;
        
        if (timeSinceLastTap < this.doubleTapDelay) {
            // Double tap
            this.emitGesture({
                type: 'doubleTap',
                data: { x, y, duration }
            });
            this.lastTapTime = 0; // Reset to prevent triple tap
        } else {
            // Single tap
            this.emitGesture({
                type: 'tap',
                data: { x, y, duration }
            });
            this.lastTapTime = now;
        }
    }

    private handleLongPressGesture(x: number, y: number) {
        this.emitGesture({
            type: 'longPress',
            data: { x, y }
        });
    }

    private handleSwipeGesture(startX: number, startY: number, endX: number, endY: number, duration: number) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        // Determine swipe direction
        let direction = 'unknown';
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'down' : 'up';
        }

        this.emitGesture({
            type: 'swipe',
            data: {
                startX, startY, endX, endY,
                deltaX, deltaY, distance, angle, direction, duration
            }
        });
    }

    private handleShapeGesture(shape: RecognizedShape) {
        this.emitGesture({
            type: 'draw',
            data: shape
        });
    }

    private emitGesture(gesture: TouchGesture) {
        // Emit custom event for gesture handling
        this.scene.events.emit('touchGesture', gesture);
    }

    addTouchZone(zone: TouchZone) {
        this.touchZones.push(zone);
    }

    removeTouchZone(x: number, y: number, width: number, height: number) {
        this.touchZones = this.touchZones.filter(zone => 
            !(zone.x === x && zone.y === y && zone.width === width && zone.height === height)
        );
    }

    clearTouchZones() {
        this.touchZones = [];
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
        this.activeTouches.clear();
        this.shapeRecognition.clear();
    }

    isTouchEnabled(): boolean {
        return this.isEnabled;
    }

    getActiveTouchCount(): number {
        return this.activeTouches.size;
    }

    getShapeRecognition(): ShapeRecognition {
        return this.shapeRecognition;
    }

    // Utility methods for common touch zones
    addButtonZone(x: number, y: number, width: number, height: number, callback: () => void) {
        this.addTouchZone({
            x, y, width, height,
            callback: () => callback()
        });
    }

    addJoystickZone(x: number, y: number, radius: number, callback: (angle: number, distance: number) => void) {
        this.addTouchZone({
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2,
            callback: (touchX: number, touchY: number) => {
                const deltaX = touchX - x;
                const deltaY = touchY - y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angle = Math.atan2(deltaY, deltaX);
                
                // Normalize distance to 0-1 range
                const normalizedDistance = Math.min(distance / radius, 1);
                
                callback(angle, normalizedDistance);
            }
        });
    }

    destroy() {
        this.shapeRecognition.destroy();
        this.activeTouches.clear();
        this.touchZones = [];
    }
} 