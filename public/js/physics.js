/**
 * StellarStudio.SB - Physics & Antigravity Effects
 * Inspired by Google Antigravity / Mr.doob
 */

document.addEventListener('DOMContentLoaded', () => {
    initDraggableCards();
    initMagneticLogo();
    initBouncySocials();
    initGravityToggle();
});

// ============================================
// Draggable Skill Cards with Physics
// ============================================
function initDraggableCards() {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
        let isDragging = false;
        let startX, startY;
        let velX = 0, velY = 0;
        let currentX = 0, currentY = 0;
        let lastX = 0, lastY = 0;
        let animationId = null;

        // Store original position
        const originalTransform = card.style.transform;

        // Make card draggable
        card.style.cursor = 'grab';
        card.style.userSelect = 'none';
        card.style.transition = 'box-shadow 0.3s ease';

        const onMouseDown = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

            isDragging = true;
            card.style.cursor = 'grabbing';
            card.style.zIndex = '100';
            card.style.boxShadow = '0 20px 60px rgba(6, 182, 212, 0.4)';

            // Stop any existing animation
            card.style.animation = 'none';
            if (animationId) cancelAnimationFrame(animationId);

            startX = e.clientX || e.touches?.[0]?.clientX;
            startY = e.clientY || e.touches?.[0]?.clientY;
            lastX = startX;
            lastY = startY;

            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const clientX = e.clientX || e.touches?.[0]?.clientX;
            const clientY = e.clientY || e.touches?.[0]?.clientY;

            // Calculate velocity for throw effect
            velX = clientX - lastX;
            velY = clientY - lastY;
            lastX = clientX;
            lastY = clientY;

            currentX += velX;
            currentY += velY;

            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${velX * 0.5}deg)`;
        };

        const onMouseUp = () => {
            if (!isDragging) return;

            isDragging = false;
            card.style.cursor = 'grab';
            card.style.zIndex = '';
            card.style.boxShadow = '';

            // Apply throw physics
            applyThrowPhysics(card, velX, velY, currentX, currentY, () => {
                // Reset position after settling
                currentX = 0;
                currentY = 0;
            });
        };

        // Mouse events
        card.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Touch events
        card.addEventListener('touchstart', onMouseDown, { passive: false });
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    });
}

function applyThrowPhysics(element, velX, velY, startX, startY, onComplete) {
    let x = startX;
    let y = startY;
    let vx = velX * 2;
    let vy = velY * 2;
    const friction = 0.95;
    const bounce = 0.7;

    function animate() {
        // Apply velocity
        x += vx;
        y += vy;

        // Apply friction
        vx *= friction;
        vy *= friction;

        // Bounce off boundaries (viewport)
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        // Simple boundary check
        if (Math.abs(x) > 200) {
            vx *= -bounce;
            x = Math.sign(x) * 200;
        }
        if (Math.abs(y) > 150) {
            vy *= -bounce;
            y = Math.sign(y) * 150;
        }

        // Apply transform with rotation based on velocity
        const rotation = vx * 0.3;
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

        // Continue animation if still moving
        if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
            requestAnimationFrame(animate);
        } else {
            // Settle back to original position
            element.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = 'translate(0, 0) rotate(0deg)';

            setTimeout(() => {
                element.style.transition = '';
                element.style.animation = 'gentle-float 6s ease-in-out infinite';
                if (onComplete) onComplete();
            }, 800);
        }
    }

    requestAnimationFrame(animate);
}

// ============================================
// Magnetic Logo Effect
// ============================================
function initMagneticLogo() {
    const logo = document.querySelector('.logo-container');
    const heroContent = document.querySelector('.hero-content');

    if (!logo || !heroContent) return;

    let mouseX = 0, mouseY = 0;
    let logoX = 0, logoY = 0;

    heroContent.addEventListener('mousemove', (e) => {
        const rect = logo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from logo center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Only apply effect within 300px radius
        if (distance < 300) {
            const strength = (300 - distance) / 300;
            mouseX = distX * strength * 0.15;
            mouseY = distY * strength * 0.15;
        } else {
            mouseX = 0;
            mouseY = 0;
        }
    });

    heroContent.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });

    // Smooth animation loop
    function animateLogo() {
        // Ease towards target
        logoX += (mouseX - logoX) * 0.1;
        logoY += (mouseY - logoY) * 0.1;

        logo.style.transform = `translate(${logoX}px, ${logoY}px)`;

        requestAnimationFrame(animateLogo);
    }

    animateLogo();
}

// ============================================
// Bouncy Social Icons
// ============================================
function initBouncySocials() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach((link, index) => {
        // Add staggered float animation
        link.style.animation = `social-float 3s ease-in-out infinite`;
        link.style.animationDelay = `${index * 0.2}s`;

        // Bounce on hover
        link.addEventListener('mouseenter', () => {
            link.style.animation = 'none';
            link.style.transform = 'scale(1.3) translateY(-10px)';
            link.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1) translateY(0)';
            setTimeout(() => {
                link.style.transition = '';
                link.style.animation = `social-float 3s ease-in-out infinite`;
                link.style.animationDelay = `${index * 0.2}s`;
            }, 300);
        });

        // Click ripple effect
        link.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(6, 182, 212, 0.4);
                transform: scale(0);
                animation: ripple-expand 0.6s ease-out;
                pointer-events: none;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            `;
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            link.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add keyframes for social float
    if (!document.querySelector('#social-float-keyframes')) {
        const style = document.createElement('style');
        style.id = 'social-float-keyframes';
        style.textContent = `
            @keyframes social-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            @keyframes ripple-expand {
                to { transform: scale(2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// Gravity Toggle (Easter Egg)
// ============================================
function initGravityToggle() {
    let gravityMode = false;
    let keySequence = '';

    // Listen for "float" keyword
    document.addEventListener('keydown', (e) => {
        keySequence += e.key.toLowerCase();
        keySequence = keySequence.slice(-5); // Keep last 5 chars

        if (keySequence === 'float') {
            toggleGravity();
            keySequence = '';
        }
    });

    function toggleGravity() {
        gravityMode = !gravityMode;
        const cards = document.querySelectorAll('.skill-card');

        if (gravityMode) {
            // Zero-G mode - cards drift randomly
            showNotification('Zero-G Mode Activated!');

            cards.forEach((card, i) => {
                card.style.animation = 'none';
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 50;
                const randomRotate = (Math.random() - 0.5) * 20;

                card.style.transition = 'transform 2s ease-out';
                card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
            });
        } else {
            // Reset
            showNotification('Gravity Restored');

            cards.forEach(card => {
                card.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.transform = 'translate(0, 0) rotate(0deg)';

                setTimeout(() => {
                    card.style.transition = '';
                    card.style.animation = 'gentle-float 6s ease-in-out infinite';
                }, 1000);
            });
        }
    }
}

function showNotification(message) {
    const existing = document.querySelector('.physics-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'physics-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(6, 182, 212, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        z-index: 10000;
        animation: notification-pop 0.5s ease-out;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'notification-fade 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);

    // Add keyframes if not exists
    if (!document.querySelector('#notification-keyframes')) {
        const style = document.createElement('style');
        style.id = 'notification-keyframes';
        style.textContent = `
            @keyframes notification-pop {
                0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
                100% { transform: translateX(-50%) scale(1); opacity: 1; }
            }
            @keyframes notification-fade {
                to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// Parallax Tilt on Cards (Bonus)
// ============================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.skill-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
