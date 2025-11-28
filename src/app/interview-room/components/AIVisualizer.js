import React from 'react';
import AnimationManager from './AnimationManager';

export default function AIVisualizer({
    agentStatus,
    agentAnalyser,
    userAnalyser
}) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 p-8 pb-40">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <AnimationManager
                    agentVoiceAnalyser={agentAnalyser}
                    userVoiceAnalyser={userAnalyser}
                    status={agentStatus}
                    onOrbClick={() => { }}
                />
            </div>
            <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-slate-700 font-playfair">TechBot</h2>
                <p className="text-sm text-slate-500 font-medium">{agentStatus}</p>
            </div>
        </div>
    );
}
