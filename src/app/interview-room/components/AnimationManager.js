import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import OrbVisualizer from "./OrbVisualizer";

const useSize = (target) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!target?.current) return;
        const { width, height } = target.current.getBoundingClientRect();
        setSize({ width, height });
    }, [target]);

    useEffect(() => {
        if (!target?.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        resizeObserver.observe(target.current);
        return () => resizeObserver.disconnect();
    }, [target]);

    return size;
};

const normalizeVolume = (analyser, dataArray, fftSize) => {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    // Normalize to 0-1 range roughly
    return Math.min(1, average / 128);
};

export default function AnimationManager({
    agentVoiceAnalyser,
    userVoiceAnalyser,
    status,
    onOrbClick,
}) {
    const canvasContainer = useRef(null);
    const size = useSize(canvasContainer);

    const [agentVolume, setAgentVolume] = useState(0);
    const [userVolume, setUserVolume] = useState(0);

    // Map status string to OrbVisualizer constants
    const getOrbStatus = (statusString) => {
        switch (statusString) {
            case "Listening...":
                return "Listening..."; // Matches VoiceBotStatus.LISTENING
            case "Speaking...":
                return "Speaking..."; // Matches VoiceBotStatus.SPEAKING
            case "Thinking...":
                return "Thinking..."; // Matches VoiceBotStatus.THINKING
            case "Connected":
            case "Initializing...":
            case "Connecting...":
                return "Sleeping"; // Matches VoiceBotStatus.SLEEPING
            default:
                return "Sleeping";
        }
    };

    const orbStatus = getOrbStatus(status);

    useEffect(() => {
        if (!agentVoiceAnalyser) return;
        const dataArrayAgent = new Uint8Array(agentVoiceAnalyser.frequencyBinCount);
        let animationFrameId;

        const getVolume = () => {
            setAgentVolume(normalizeVolume(agentVoiceAnalyser, dataArrayAgent));
            animationFrameId = requestAnimationFrame(getVolume);
        };
        getVolume();

        return () => cancelAnimationFrame(animationFrameId);
    }, [agentVoiceAnalyser]);

    useEffect(() => {
        if (!userVoiceAnalyser) return;
        const dataArray = new Uint8Array(userVoiceAnalyser.frequencyBinCount);
        let animationFrameId;

        const getVolume = () => {
            setUserVolume(normalizeVolume(userVoiceAnalyser, dataArray));
            animationFrameId = requestAnimationFrame(getVolume);
        };
        getVolume();

        return () => cancelAnimationFrame(animationFrameId);
    }, [userVoiceAnalyser]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <button
                ref={canvasContainer}
                onClick={onOrbClick}
                className="orb-animation w-full h-full flex items-center justify-center focus:outline-none"
                style={{ minHeight: '300px' }}
            >
                {canvasContainer.current && (
                    <OrbVisualizer
                        width={size.width}
                        height={size.height}
                        agentVolume={agentVolume}
                        userVolume={userVolume}
                        status={orbStatus}
                    />
                )}
            </button>
        </div>
    );
}
