import React, { useEffect, useRef } from 'react';

export default function Fireworks() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        let particles = [];
        let rockets = []; // Add rockets for "launch" effect

        class Particle {
            constructor(x, y, hue) {
                this.x = x;
                this.y = y;
                this.hue = hue;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.gravity = 0.05;
                this.friction = 0.96; // Slightly more friction
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.01;
                this.brightness = Math.random() * 20 + 50; // 50-70% lightness
            }

            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                // Vibrance on light background: darker colors work better
                // HSL: Hue, Saturation 100%, Lightness 50% (standard vivid)
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const createExplosion = (x, y) => {
            const hue = Math.random() * 360;
            // HUGE explosion
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(x, y, hue));
            }
            // Add some "sparkles" (lighter particles)
            for (let i = 0; i < 50; i++) {
                const p = new Particle(x, y, hue);
                p.vx *= 1.5;
                p.vy *= 1.5;
                particles.push(p);
            }
        };

        const intervalId = setInterval(() => {
            const x = Math.random() * width;
            const y = Math.random() * (height * 0.5) + (height * 0.1);
            createExplosion(x, y);
        }, 800); // Constant barrage

        const animate = () => {
            // Use clearRect for sharp frames, no trails to avoid "muddy" look on white
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            });
            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        // Initial bang
        createExplosion(width / 2, height / 2);

        return () => {
            clearInterval(intervalId);
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-10"
        />
        /* Z-index 10 to be above snow but below text/modals if needed. 
           Removed mix-blend-screen!! That was the issue on light bg. */
    );
}
