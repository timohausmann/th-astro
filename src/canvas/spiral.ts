import type { CanvasEffect } from "../types/canvas";

interface Ring {
    x: number;
    y: number;
    scale: number;
    angle: number;
}

interface SpawnPoint {
    x: number;
    y: number;
    rings: Ring[];
    angle: number;
    radius: number;
}

export class SpiralEffect implements CanvasEffect {
    private ctx: CanvasRenderingContext2D | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private spawns: SpawnPoint[] = [];
    private animationFrameId: number = 0;
    private lastTime: number = 0;

    // Configuration
    private readonly maxRings = 32;
    private readonly ringGrowthRate = 10;
    private size: number = 0;
    private width: number = 0;
    private height: number = 0;
    private maxRingSize: number = 0;
    private pixelRatio: number = 1;
    private ringColor: string = "0, 64, 255";
    private ringOpacity: number = 0.05;

    private updateDimensions(width: number, height: number) {
        if (!this.canvas) return;

        // Get device pixel ratio
        this.pixelRatio = window.devicePixelRatio || 1;
        this.width = width;
        this.height = height;
        this.size = Math.min(width, height);
        this.maxRingSize = this.size * 0.95;

        // Set actual size (scaled to pixel density)
        this.canvas.width = Math.round(width * this.pixelRatio);
        this.canvas.height = Math.round(height * this.pixelRatio);

        // Reset transformation matrix and apply scale
        this.ctx?.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx?.scale(this.pixelRatio, this.pixelRatio);

        // Reinitialize spawn points with new dimensions
        this.initializeSpawnPoints();
    }

    private initializeSpawnPoints() {
        if (!this.canvas) return;

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Initialize spawn points
        const spawnCount = 2;
        this.spawns = Array(spawnCount)
            .fill(0)
            .map((_, i) => ({
                x: 0,
                y: 0,
                rings: [],
                angle: -Math.PI / 2 + (Math.PI * 2 * i) / spawnCount,
                radius: this.size * 0.5,
            }));

        // Initialize rings for each spawn point
        this.spawns.forEach((spawn) => {
            for (let i = 0; i < this.maxRings; i++) {
                spawn.angle += Math.PI / this.maxRings;
                spawn.x = centerX + Math.cos(spawn.angle) * spawn.radius;
                spawn.y = centerY + Math.sin(spawn.angle) * spawn.radius;
                spawn.rings.push({
                    x: spawn.x,
                    y: spawn.y,
                    scale: (i / this.maxRings) * this.maxRingSize,
                    angle: spawn.angle,
                });
            }
        });
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        if (!this.ctx) return;

        // Initial size setup
        const rect = canvas.getBoundingClientRect();
        this.updateDimensions(rect.width, rect.height);

        this.lastTime = performance.now();
        this.loop(0);
    }

    resize(width: number, height: number) {
        if (!this.canvas) return;

        const widthDiff = Math.abs(width - this.width);
        const heightDiff = Math.abs(height - this.height);

        // Only act when dimensions changed
        // Have a 20px height tolerance for iOS Safari
        if (widthDiff !== 0 || heightDiff > 20) {
            this.updateDimensions(width, height);
        }
    }

    loop(currentTime: number) {
        if (!this.ctx || !this.canvas) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw rings
        this.spawns.forEach((spawn) => {
            spawn.rings.forEach((ring) => {
                // Update scale
                ring.scale += this.ringGrowthRate * deltaTime;

                // Draw ring
                this.ctx!.beginPath();
                this.ctx!.arc(
                    ring.x,
                    ring.y,
                    Math.max(0, ring.scale),
                    0,
                    Math.PI * 2
                );
                this.ctx!.strokeStyle = `rgba(${this.ringColor}, ${
                    Math.sin((ring.scale / this.maxRingSize) * Math.PI) *
                    this.ringOpacity
                })`;
                this.ctx!.lineWidth = 2;
                this.ctx!.stroke();

                // Reset ring if it reaches max size
                if (ring.scale >= this.maxRingSize) {
                    ring.scale = 0;
                    spawn.angle += Math.PI / this.maxRings;
                    const centerX = this.width / 2;
                    const centerY = this.height / 2;
                    ring.x = centerX + Math.cos(spawn.angle) * spawn.radius;
                    ring.y = centerY + Math.sin(spawn.angle) * spawn.radius;
                }

                // Ensure scale never goes negative
                ring.scale = Math.max(1, ring.scale);
            });
        });

        this.animationFrameId = requestAnimationFrame((time) =>
            this.loop(time)
        );
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.ctx = null;
        this.canvas = null;
    }
}
