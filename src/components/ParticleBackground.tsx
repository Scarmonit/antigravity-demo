import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

interface ParticleBackgroundProps {
    theme: 'dark' | 'light';
}

// Performance constants - avoid magic numbers and pre-calculate squared thresholds
const PARTICLE_CONFIG = {
    COUNT: 50,
    SIZE_MIN: 1,
    SIZE_MAX: 4,
    VELOCITY_FACTOR: 0.5,
    MOUSE_RADIUS_SQUARED: 10000, // 100^2
    CONNECTION_DIST_SQUARED: 22500, // 150^2
    CONNECTION_DIST: 150,
    OPACITY_BASE: 0.3,
    OPACITY_VARIANCE: 0.3,
} as const;

const THEME_COLORS = {
    dark: '255, 255, 255',
    light: '80, 99, 211',
} as const;

const ParticleBackground: React.FC<ParticleBackgroundProps> = React.memo(({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | undefined>(undefined);
    const themeRef = useRef(theme);

    // Update theme ref without re-initializing animation
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles only once (not on theme change)
        if (particlesRef.current.length === 0) {
            particlesRef.current = Array.from({ length: PARTICLE_CONFIG.COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_FACTOR,
                vy: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_FACTOR,
                size: Math.random() * (PARTICLE_CONFIG.SIZE_MAX - PARTICLE_CONFIG.SIZE_MIN) + PARTICLE_CONFIG.SIZE_MIN,
            }));
        }

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const particleCount = particles.length;
            const currentTheme = themeRef.current;
            const colorRGB = THEME_COLORS[currentTheme];

            // Draw particles with optimized indexed loop
            for (let i = 0; i < particleCount; i++) {
                const particle = particles[i];

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Mouse interaction - use squared distance to avoid Math.sqrt
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distSquared = dx * dx + dy * dy;

                if (distSquared < PARTICLE_CONFIG.MOUSE_RADIUS_SQUARED) {
                    particle.x -= dx * 0.01;
                    particle.y -= dy * 0.01;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRGB}, ${PARTICLE_CONFIG.OPACITY_BASE + Math.random() * PARTICLE_CONFIG.OPACITY_VARIANCE})`;
                ctx.fill();
            }

            // Draw connections - optimized indexed loop (no slice/forEach)
            for (let i = 0; i < particleCount; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSquared = dx * dx + dy * dy;

                    // Only calculate sqrt if within threshold (lazy evaluation)
                    if (distSquared < PARTICLE_CONFIG.CONNECTION_DIST_SQUARED) {
                        const distance = Math.sqrt(distSquared);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${colorRGB}, ${0.1 * (1 - distance / PARTICLE_CONFIG.CONNECTION_DIST)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.4,
            }}
        />
    );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
