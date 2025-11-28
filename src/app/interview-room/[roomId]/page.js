"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useInterview } from '@/hooks/useInterview';
import InterviewHeader from '../components/InterviewHeader';
import AIVisualizer from '../components/AIVisualizer';
import UserVideo from '../components/UserVideo';
import ControlBar from '../components/ControlBar';
import TranscriptPanel from '../components/TranscriptPanel';

export default function InterviewRoomPage() {
    const params = useParams();
    const { roomId } = params;
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);

    const {
        isClient,
        videoRef,
        isMicOn,
        isCameraOn,
        timeLeft,
        isSpeaking,
        connectionStatus,
        agentStatus,
        transcript,
        toggleMic,
        toggleCamera,
        endCall,
        agentAnalyser,
        userAnalyser
    } = useInterview(roomId);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans selection:bg-blue-100">
            {/* Top Bar */}
            <InterviewHeader
                connectionStatus={connectionStatus}
                timeLeft={timeLeft}
                isTranscriptOpen={isTranscriptOpen}
                setIsTranscriptOpen={setIsTranscriptOpen}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 relative flex flex-col">
                    {/* Left Panel - AI Agent */}
                    <AIVisualizer
                        agentStatus={agentStatus}
                        agentAnalyser={agentAnalyser}
                        userAnalyser={userAnalyser}
                    />

                    {/* Floating User Video */}
                    <UserVideo
                        videoRef={videoRef}
                        isMicOn={isMicOn}
                        isCameraOn={isCameraOn}
                    />

                    {/* Floating Controls */}
                    <ControlBar
                        isMicOn={isMicOn}
                        toggleMic={toggleMic}
                        isCameraOn={isCameraOn}
                        toggleCamera={toggleCamera}
                        endCall={endCall}
                    />
                </div>

                {/* Right Panel - Transcript */}
                <TranscriptPanel
                    isTranscriptOpen={isTranscriptOpen}
                    setIsTranscriptOpen={setIsTranscriptOpen}
                    transcript={transcript}
                />
            </main>
        </div>
    );
}
