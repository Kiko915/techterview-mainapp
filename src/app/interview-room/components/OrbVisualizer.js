import React, { useRef, useEffect } from "react";

const PULSE_PERIOD_SECONDS = 3;
const PULSE_SIZE_MULTIPLIER = 1.02;
const AVERAGE_ROTATION_PERIOD_SECONDS = 6;
const ROCKING_SWING_FRACTION = 18;
const ROCKING_PERIOD_SECONDS = 6;
const SLEEP_SPEED_MULTIPLIER = 0.5;
const DEFLATE_TRANSITION_TIME_MS = 1000;
const DEFLATE_PULL = 1.3;
const INFLATE_TRANSITION_TIME_MS = 300;
const FOCUS_TRANSITION_TIME_MS = 700;
const RELAX_TRANSITION_TIME_MS = 1000;
const CHATTER_SIZE_MULTIPLIER = 1.15;
const CHATTER_WINDOW_SIZE = 3;
const FOCUS_SPEED_MULTIPLIER = 5;
const FOCUS_SIZE_MULTIPLIER = 0.5;

const VoiceBotStatus = {
    LISTENING: "Listening...",
    THINKING: "Thinking...",
    SLEEPING: "Sleeping",
    SPEAKING: "Speaking...",
    NONE: "None"
};

const pi = (n) => Math.PI * n;

const coordsFrom = ({ x, y }, distance, angle) => ({
    x: x + distance * Math.cos(angle),
    y: y + distance * Math.sin(angle),
});

const bezier = (ctx, cp1, cp2, end) => {
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
};

const lerp = (start, stop, amt) => amt * (stop - start) + start;

const easeInOutQuad = (x) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

const getCenter = (ctx) => {
    const { width, height } = ctx.canvas.getBoundingClientRect();
    return {
        x: width / 2,
        y: height / 2,
    };
};

const crescent = (ctx, offset, radius, deflation, strokeStyle) => {
    const bezierDistance = radius * (4 / 3) * Math.tan(pi(1 / 8));
    const trueCenter = getCenter(ctx);
    const center = {
        x: trueCenter.x * (1 + offset.x),
        y: trueCenter.y * (1 + offset.y),
    };
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();

    const arcStart = deflation.angle + pi(1 / 2);
    const arcEnd = deflation.angle + pi(3 / 2);
    ctx.arc(center.x, center.y, radius, arcStart, arcEnd, false);

    const start = coordsFrom(center, radius, arcEnd);
    const midpointPull = radius * deflation.depth * DEFLATE_PULL;
    const mid = coordsFrom(
        center,
        radius - midpointPull,
        lerp(deflation.angle, pi(3) - deflation.angle, deflation.depth),
    );
    const end = coordsFrom(center, radius, arcStart);

    const bez1 = {
        cp1: coordsFrom(start, bezierDistance, arcEnd + pi(1 / 2)),
        cp2: coordsFrom(mid, bezierDistance, deflation.angle + pi(3 / 2)),
    };
    const bez2 = {
        cp1: coordsFrom(mid, bezierDistance, deflation.angle + pi(1 / 2)),
        cp2: coordsFrom(end, bezierDistance, arcStart + pi(3 / 2)),
    };

    bezier(ctx, bez1.cp1, bez1.cp2, mid);
    bezier(ctx, bez2.cp1, bez2.cp2, end);
    ctx.stroke();
};

const makeGradient = (ctx, offset, angle, parts) => {
    const center = getCenter(ctx);
    const x1 = center.x * (1 - Math.cos(angle) + offset.x);
    const y1 = center.y * (1 - Math.sin(angle) + offset.y);
    const x2 = center.x * (1 + Math.cos(angle) + offset.x);
    const y2 = center.y * (1 + Math.sin(angle) + offset.y);
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    parts.forEach(({ pct, color }) => {
        g.addColorStop(pct, color);
    });
    return g;
};

const Color = {
    springGreen: "#13ef93cc",
    springGreenLight: "#b8f8d2cc",
    eucalyptus: "#027a48cc",
    rose: "#f185becc",
    lavender: "#ba80f5cc", // Typo fix: was lavendar in original? No, it was lavender. Wait, syntax error in my thought.
    chryslerBlue: "#3a00d3cc",
    azure: "#149afbcc",
    transparent: "transparent",
};
// Fix object syntax
const Colors = {
    springGreen: "#13ef93cc",
    springGreenLight: "#b8f8d2cc",
    eucalyptus: "#027a48cc",
    rose: "#f185becc",
    lavender: "#ba80f5cc",
    chryslerBlue: "#3a00d3cc",
    azure: "#149afbcc",
    transparent: "transparent",
};


const lines = [
    {
        segments: [
            { pct: 0.42, color: Colors.transparent },
            { pct: 0.61, color: Colors.rose },
        ],
        startAngle: 3.52,
        speedMultiplier: 1.21,
        centerOffset: { x: 0.01, y: -0.01 },
        radiusOffset: 0.02,
        width: 3.38,
    },
    {
        segments: [
            { pct: 0.28, color: Colors.springGreen },
            { pct: 0.62, color: Colors.rose },
        ],
        startAngle: 1.59,
        speedMultiplier: 0.64,
        centerOffset: { x: -0.03, y: -0.01 },
        radiusOffset: 0.05,
        width: 2.39,
    },
    {
        segments: [
            { pct: 0.31, color: Colors.eucalyptus },
            { pct: 0.66, color: Colors.chryslerBlue },
        ],
        startAngle: 2.86,
        speedMultiplier: 0.94,
        centerOffset: { x: 0.02, y: 0.02 },
        radiusOffset: -0.06,
        width: 2.64,
    },
    {
        segments: [
            { pct: 0.16, color: Colors.chryslerBlue },
            { pct: 0.62, color: Colors.eucalyptus },
            { pct: 0.75, color: Colors.lavender },
        ],
        startAngle: 0.65,
        speedMultiplier: 1.23,
        centerOffset: { x: 0.01, y: 0.0 },
        radiusOffset: -0.01,
        width: 2.32,
    },
    {
        segments: [
            { pct: 0.02, color: Colors.springGreen },
            { pct: 0.8, color: Colors.azure },
        ],
        startAngle: 6.19,
        speedMultiplier: 1.18,
        centerOffset: { x: -0.04, y: 0.02 },
        radiusOffset: 0.01,
        width: 3.98,
    },
    {
        segments: [
            { pct: 0.2, color: Colors.transparent },
            { pct: 0.47, color: Colors.transparent },
            { pct: 0.81, color: Colors.springGreenLight },
        ],
        startAngle: 0.49,
        speedMultiplier: 0.51,
        centerOffset: { x: 0.04, y: -0.01 },
        radiusOffset: -0.04,
        width: 1.19,
    },
];
const LINE_COUNT = lines.length;

const radiusOscillation = (shape) =>
    1 +
    (PULSE_SIZE_MULTIPLIER - 1) *
    Math.sin((shape.current.time * pi(1)) / PULSE_PERIOD_SECONDS / 1000) *
    lerp(1, 0, shape.current.deflation) *
    lerp(1, 0.33, shape.current.focus);

const rollingAverage = (noise, start) => {
    const noiseWindow = noise.slice(start, start + CHATTER_WINDOW_SIZE);
    return noiseWindow.reduce((a, b) => a + b) / noiseWindow.length;
};

const speechSimulation = (shape, start) =>
    lerp(1, CHATTER_SIZE_MULTIPLIER, rollingAverage(shape.current.agentNoise, start));

const listeningSimulation = (shape, start) =>
    lerp(1, 1 / CHATTER_SIZE_MULTIPLIER, rollingAverage(shape.current.userNoise, start));

const draw = (ctx, shape, last, now) => {
    shape.current.time +=
        (now - last) *
        lerp(1, FOCUS_SPEED_MULTIPLIER, shape.current.focus) *
        lerp(1, SLEEP_SPEED_MULTIPLIER, shape.current.deflation);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.filter = "saturate(150%)";

    const center = getCenter(ctx);
    const maxRadius = Math.min(center.x, center.y);

    lines.forEach((line, i) => {
        ctx.lineWidth = line.width;
        ctx.shadowColor = line.segments[0].color;
        ctx.shadowBlur = line.width * 1.1;
        const radius =
            maxRadius *
            0.8 *
            speechSimulation(shape, i) *
            listeningSimulation(shape, i) *
            radiusOscillation(shape);
        const gradient = makeGradient(
            ctx,
            line.centerOffset,
            line.startAngle +
            ((shape.current.time * pi(1)) / 1000 / AVERAGE_ROTATION_PERIOD_SECONDS) *
            line.speedMultiplier,
            line.segments,
        );
        crescent(
            ctx,
            line.centerOffset,
            (radius + line.radiusOffset * radius) *
            lerp(1, FOCUS_SIZE_MULTIPLIER, easeInOutQuad(shape.current.focus)),
            {
                depth: easeInOutQuad(shape.current.deflation),
                angle:
                    pi(3 / 2) +
                    pi(
                        Math.sin(
                            (shape.current.time * pi(1)) /
                            (ROCKING_PERIOD_SECONDS * SLEEP_SPEED_MULTIPLIER) /
                            1000,
                        ) / ROCKING_SWING_FRACTION,
                    ),
            },
            gradient,
        );
    });

    requestAnimationFrame((t) => {
        draw(ctx, shape, now, t);
    });
};

const deflationDepth = (orbState) => {
    switch (orbState) {
        case VoiceBotStatus.LISTENING:
            return 0;
        case VoiceBotStatus.THINKING:
            return 0;
        case VoiceBotStatus.NONE:
        case VoiceBotStatus.SLEEPING:
            return 1;
        case VoiceBotStatus.SPEAKING:
            return 0;
        default:
            return 0;
    }
};

const focusIntensity = (orbState) => {
    switch (orbState) {
        case VoiceBotStatus.LISTENING:
            return 0;
        case VoiceBotStatus.THINKING:
            return 1;
        case VoiceBotStatus.SLEEPING:
            return 0;
        case VoiceBotStatus.SPEAKING:
            return 0;
        default:
            return 0;
    }
};

const transition = (generation, orbState, shape, last, now = last) => {
    if (shape.current.generation > generation) return;

    const depth = deflationDepth(orbState);
    if (depth < shape.current.deflation) {
        const step = (now - last) / INFLATE_TRANSITION_TIME_MS;
        shape.current.deflation = Math.max(depth, shape.current.deflation - step);
    } else {
        const step = (now - last) / DEFLATE_TRANSITION_TIME_MS;
        shape.current.deflation = Math.min(depth, shape.current.deflation + step);
    }

    const focus = focusIntensity(orbState);
    if (focus < shape.current.focus) {
        const step = (now - last) / RELAX_TRANSITION_TIME_MS;
        shape.current.focus = Math.max(focus, shape.current.focus - step);
    } else {
        const step = (now - last) / FOCUS_TRANSITION_TIME_MS;
        shape.current.focus = Math.min(focus, shape.current.focus + step);
    }

    if (shape.current.deflation !== depth || shape.current.focus !== focus) {
        requestAnimationFrame((ts) => {
            transition(generation, orbState, shape, now, ts);
        });
    }
};

export default function OrbVisualizer({ width = 0, height = 0, agentVolume = 0, userVolume = 0, status }) {
    const canvas = useRef(null);
    const shape = useRef({
        generation: 0,
        time: 0,
        deflation: deflationDepth(status),
        focus: focusIntensity(status),
        agentNoise: Array(LINE_COUNT + CHATTER_WINDOW_SIZE).fill(agentVolume),
        userNoise: Array(LINE_COUNT + CHATTER_WINDOW_SIZE).fill(
            status === VoiceBotStatus.SLEEPING ? 0 : userVolume,
        ),
    });

    useEffect(() => {
        if (canvas.current) {
            const context = canvas.current.getContext("2d");
            if (context) {
                const now = performance.now();
                requestAnimationFrame((t) => {
                    draw(context, shape, now, t);
                });
            }
        }
    }, []);

    useEffect(() => {
        shape.current.generation += 1;
        requestAnimationFrame((t) => {
            transition(shape.current.generation, status, shape, t);
        });
    }, [status]);

    useEffect(() => {
        shape.current.agentNoise.shift();
        shape.current.agentNoise.push(agentVolume);
    }, [agentVolume]);

    useEffect(() => {
        if (status === VoiceBotStatus.SLEEPING) return;
        shape.current.userNoise.shift();
        shape.current.userNoise.push(userVolume);
    }, [userVolume, status]);

    return <canvas ref={canvas} width={width} height={height} />;
}
