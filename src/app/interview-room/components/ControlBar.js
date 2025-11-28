import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

export default function ControlBar({
    isMicOn,
    toggleMic,
    isCameraOn,
    toggleCamera,
    endCall
}) {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl z-50">
            <Button
                variant={isMicOn ? "secondary" : "destructive"}
                size="icon"
                className={`w-12 h-12 rounded-full transition-all duration-300 shadow-sm ${isMicOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : ''
                    }`}
                onClick={toggleMic}
            >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
                variant={isCameraOn ? "secondary" : "destructive"}
                size="icon"
                className={`w-12 h-12 rounded-full transition-all duration-300 shadow-sm ${isCameraOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : ''
                    }`}
                onClick={toggleCamera}
            >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <div className="w-px h-8 bg-slate-200 mx-2" />

            <Button
                variant="destructive"
                className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium gap-2 shadow-lg shadow-red-500/20"
                onClick={endCall}
            >
                <PhoneOff className="w-5 h-5" />
                <span>End Interview</span>
            </Button>
        </div>
    );
}
