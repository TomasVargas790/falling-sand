import { FPS } from '../config/constants.js';

/**
 * GameLoop module - manages the main animation loop
 */
export class GameLoop {
    constructor(gameState, physics, renderer) {
        this.gameState = gameState;
        this.physics = physics;
        this.renderer = renderer;
        this.isRunning = false;
        this.animationId = null;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    loop() {
        if (!this.isRunning) return;
        
        // Update physics
        this.physics.update();
        
        // Render frame
        this.renderer.render();
        
        // Schedule next frame based on gravity-adjusted FPS
        const gravity = this.gameState.getOption('gravity');
        const frameDelay = 1000 / Math.abs(FPS * gravity);
        
        setTimeout(() => {
            this.animationId = requestAnimationFrame(() => this.loop());
        }, frameDelay);
    }
    
    reset() {
        this.gameState.reset();
    }
}