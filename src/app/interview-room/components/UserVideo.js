import React from 'react';
import { User, MicOff, VideoOff } from 'lucide-react';

export default function UserVideo({ videoRef, isMicOn, isCameraOn }) {
    return (
        <div className="absolute bottom-24 right-8 w-64 aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xl ring-1 ring-black/5 group z-40">
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                />
                {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                )}

                {/* Status Indicators */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                    {!isMicOn && (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                            <MicOff className="w-3 h-3 text-white" />
                        </div>
                    )}
                    {!isCameraOn && (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                            <VideoOff className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/* Name Tag */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-xs font-medium text-white shadow-sm">
                    You
                </div>
            </div>
        </div>
    );
}
