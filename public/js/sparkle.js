/**
 * StellarStudio.SB - Sparkle Background Animation
 * Adapted from Lucilla App's Flutter sparkle background
 */

class SparkleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.sparkles = [];
        this.glowOrbs = [];
        this.shootingStars = [];
        this.particles = [];
        this.animationId = null;
        this.time = 0;

        this.init();
        this.createSparkles();
        this.createGlowOrbs();
        this.createShootingStars();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.handleResize();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create sparkle particles
    createSparkles() {
        const colors = [
            { r: 168, g: 85, b: 247 },   // Purple
            { r: 139, g: 92, b: 246 },   // Purple variant
            { r: 59, g: 130, b: 246 },   // Blue
            { r: 6, g: 182, b: 212 },    // Cyan
            { r: 34, g: 197, b: 94 },    // Green
            { r: 245, g: 158, b: 11 },   // Amber
            { r: 236, g: 72, b: 153 },   // Pink
        ];

        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.sparkles.push({
                x: Math.random(),
                y: Math.random(),
                baseX: Math.random(),
                baseY: Math.random(),
                size: 1 + Math.random() * 2,
                color: color,
                phase: Math.random(),
                speed: 0.5 + Math.random() * 0.5,
                floatSpeed: 0.2 + Math.random() * 0.3,
                floatRadius: 10 + Math.random() * 15
            });
        }
    }

    // Create glowing orbs
    createGlowOrbs() {
        this.glowOrbs = [
            { x: 0.2, y: 0.3, radius: 80, color: { r: 168, g: 85, b: 247 }, phase: 0 },
            { x: 0.8, y: 0.7, radius: 60, color: { r: 34, g: 197, b: 94 }, phase: 0.33 },
            { x: 0.6, y: 0.1, radius: 70, color: { r: 59, g: 130, b: 246 }, phase: 0.66 },
        ];
    }

    // Create shooting stars
    createShootingStars() {
        for (let i = 0; i < 2; i++) {
            this.shootingStars.push(this.generateShootingStar(i === 0));
        }
    }

    generateShootingStar(fromLeft) {
        return {
            fromLeft: fromLeft,
            phase: Math.random(),
            duration: 0.18 + Math.random() * 0.12,
            baseHeight: fromLeft ? 0.15 + Math.random() * 0.25 : 0.55 + Math.random() * 0.3,
            amplitude: 0.02 + Math.random() * 0.05,
            waveFreq: 1 + Math.random() * 1.5,
            trailLength: 22 + Math.random() * 18,
            headRadius: 1.4 + Math.random() * 0.9,
            headColor: fromLeft ? { r: 255, g: 213, b: 79 } : { r: 34, g: 211, b: 238 },
            trailColor: fromLeft ? { r: 255, g: 87, b: 34 } : { r: 59, g: 130, b: 246 }
        };
    }

    // Create floating particles
    createParticles() {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                offset: i / 12,
                y: 0.3
            });
        }
    }

    // Draw a single sparkle
    drawSparkle(sparkle) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Calculate floating position
        const floatX = sparkle.baseX * w +
            sparkle.floatRadius * Math.sin((this.time * sparkle.floatSpeed + sparkle.phase) * Math.PI * 2);
        const floatY = sparkle.baseY * h +
            sparkle.floatRadius * Math.cos((this.time * sparkle.floatSpeed + sparkle.phase) * Math.PI * 2);

        // Calculate twinkle
        const twinklePhase = (this.time * sparkle.speed + sparkle.phase) % 1;
        const twinkle = (Math.sin(twinklePhase * Math.PI * 4) * 0.5 + 0.5);
        const size = sparkle.size * (0.5 + twinkle * 0.8);
        const opacity = 0.3 + twinkle * 0.5;

        // Draw glow
        const gradient = this.ctx.createRadialGradient(floatX, floatY, 0, floatX, floatY, size * 3);
        gradient.addColorStop(0, `rgba(${sparkle.color.r}, ${sparkle.color.g}, ${sparkle.color.b}, ${opacity * 0.4})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(floatX, floatY, size * 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw sparkle
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(${sparkle.color.r}, ${sparkle.color.g}, ${sparkle.color.b}, ${opacity})`;
        this.ctx.arc(floatX, floatY, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw bright center when twinkling
        if (twinkle > 0.7) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * twinkle})`;
            this.ctx.arc(floatX, floatY, size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Draw glowing orbs
    drawGlowOrbs() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.glowOrbs.forEach(orb => {
            const pulse = 0.8 + 0.4 * Math.sin((this.time * 0.5 + orb.phase) * Math.PI * 2);
            const radius = orb.radius * pulse;

            const gradient = this.ctx.createRadialGradient(
                orb.x * w, orb.y * h, 0,
                orb.x * w, orb.y * h, radius
            );
            gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${0.15 * pulse})`);
            gradient.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${0.05 * pulse})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(orb.x * w, orb.y * h, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Draw shooting stars
    drawShootingStars() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.shootingStars.forEach(star => {
            const adjustedProgress = (this.time * 0.3 + star.phase) % 1;
            if (adjustedProgress > star.duration) return;

            const progress = adjustedProgress / star.duration;
            const startX = star.fromLeft ? -60 : w + 60;
            const endX = star.fromLeft ? w + 60 : -60;
            const currentX = startX + (endX - startX) * progress;

            const baseY = h * star.baseHeight;
            const wave = h * star.amplitude * Math.sin(progress * Math.PI * (1.2 + star.waveFreq));
            const currentY = baseY + wave;

            const trailDir = star.fromLeft ? 1 : -1;
            const trailLen = star.trailLength * (0.8 + 0.2 * Math.sin(progress * Math.PI));
            const trailStartX = currentX - trailDir * trailLen;
            const trailStartY = currentY + 2 * Math.sin(progress * Math.PI * 2);

            // Draw trail
            const trailGradient = this.ctx.createLinearGradient(trailStartX, trailStartY, currentX, currentY);
            trailGradient.addColorStop(0, 'transparent');
            trailGradient.addColorStop(0.5, `rgba(255, 255, 255, 0.7)`);
            trailGradient.addColorStop(1, `rgba(${star.trailColor.r}, ${star.trailColor.g}, ${star.trailColor.b}, 0.6)`);

            this.ctx.beginPath();
            this.ctx.strokeStyle = trailGradient;
            this.ctx.lineWidth = 1.8;
            this.ctx.moveTo(trailStartX, trailStartY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();

            // Draw head glow
            const glowGradient = this.ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, star.headRadius * 4);
            glowGradient.addColorStop(0, `rgba(${star.headColor.r}, ${star.headColor.g}, ${star.headColor.b}, 0.4)`);
            glowGradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.fillStyle = glowGradient;
            this.ctx.arc(currentX, currentY, star.headRadius * 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw head
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(${star.headColor.r}, ${star.headColor.g}, ${star.headColor.b}, 0.9)`;
            this.ctx.arc(currentX, currentY, star.headRadius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Draw floating particles
    drawParticles() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.particles.forEach(particle => {
            const progress = (this.time * 0.1 + particle.offset) % 1;
            const x = w * progress;
            const y = h * particle.y + 40 * Math.sin(progress * Math.PI * 4);
            const opacity = Math.sin(progress * Math.PI) * 0.3;

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Main animation loop
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all elements
        this.drawGlowOrbs();
        this.sparkles.forEach(sparkle => this.drawSparkle(sparkle));
        this.drawParticles();
        this.drawShootingStars();

        this.time += 0.016; // ~60fps
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Stop animation
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SparkleBackground('sparkle-canvas');
});
