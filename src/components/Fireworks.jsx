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

        class Particle {
            constructor(x, y, hue) {
                this.x = x;
                this.y = y;
                this.hue = hue;
                // Explosion velocity
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;

                this.gravity = 0.05;
                this.friction = 0.95;
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.01;
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
                ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const createExplosion = (x, y) => {
            const hue = Math.random() * 360;
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(x, y, hue));
            }
        };

        // Randomly launch fireworks
        const intervalId = setInterval(() => {
            const x = Math.random() * width;
            const y = Math.random() * (height * 0.6); // Top 60% of screen
            createExplosion(x, y);
        }, 800);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            // Composite operation to create trail effect? maybe simple clear is better for performance

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

        // Instant explosion on mount
        createExplosion(width / 2, height / 3);

        return () => {
            clearInterval(intervalId);
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
