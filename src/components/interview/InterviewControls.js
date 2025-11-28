import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const InterviewControls = ({ isMicOn, isCameraOn, onToggleMic, onToggleCamera, onEndCall }) => {
    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg">
            <Button
                variant={isMicOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={onToggleMic}
            >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
                variant={isCameraOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={onToggleCamera}
            >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
                variant="destructive"
                size="icon"
                className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
                onClick={onEndCall}
            >
                <PhoneOff className="w-6 h-6" />
            </Button>
        </div>
    );
};

export default InterviewControls;
