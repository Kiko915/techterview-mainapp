import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, User } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TranscriptPanel({
    isTranscriptOpen,
    setIsTranscriptOpen,
    transcript
}) {
    const scrollRef = useRef(null);
    const { user } = useAuth();

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript, isTranscriptOpen]);

    return (
        <div
            className={`border-l border-slate-200 bg-white flex flex-col transition-all duration-300 shadow-xl z-50 overflow-hidden ${isTranscriptOpen ? 'w-96 opacity-100' : 'w-0 opacity-0'
                }`}
        >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 min-w-[24rem]">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Transcript
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTranscriptOpen(false)}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 min-w-[24rem]" ref={scrollRef}>
                <div className="space-y-4">
                    {transcript.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className="shrink-0">
                                {msg.role === 'user' ? (
                                    <Avatar className="w-8 h-8 border border-indigo-200 shadow-sm">
                                        <AvatarImage src={user?.photoURL} alt="User" />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                            <User className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-200 shadow-sm bg-blue-50">
                                        <img
                                            src="/assets/techbot/techbot-pfp.png"
                                            alt="TechBot"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`flex-1 p-3 rounded-2xl text-sm shadow-sm border ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-600'
                                : 'bg-white text-slate-700 rounded-tl-none border-slate-200'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
