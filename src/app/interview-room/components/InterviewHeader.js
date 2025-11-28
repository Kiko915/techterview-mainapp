import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, ChevronRight, AlertCircle } from 'lucide-react';

export default function InterviewHeader({
    connectionStatus,
    timeLeft,
    isTranscriptOpen,
    setIsTranscriptOpen
}) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo/techterview_symbol_colored.png"
                        alt="Techterview Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="font-bold text-lg tracking-tight text-slate-900 font-playfair">Techterview</span>
                </div>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <Badge variant="outline" className={`gap-2 ${connectionStatus === 'Connected'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                        }`} />
                    {connectionStatus}
                </Badge>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className={`font-mono font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {!isTranscriptOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsTranscriptOpen(true)}
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </header>
    );
}
