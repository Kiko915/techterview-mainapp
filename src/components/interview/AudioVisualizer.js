import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isSpeaking }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width;
        let height = canvas.height;

        // Resize canvas to match container
        const resize = () => {
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (isSpeaking) {
                // Draw waveform animation
                ctx.beginPath();
                ctx.moveTo(0, height / 2);

                for (let i = 0; i < width; i++) {
                    const amplitude = 30;
                    const frequency = 0.05;
                    const y = height / 2 + Math.sin(i * frequency + Date.now() * 0.01) * amplitude * Math.random();
                    ctx.lineTo(i, y);
                }

                ctx.strokeStyle = '#3b82f6'; // Blue-500
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Draw flat line
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.strokeStyle = '#9ca3af'; // Gray-400
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isSpeaking]);

    return (
        <div className="w-full h-32 bg-black/5 rounded-lg overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default AudioVisualizer;
