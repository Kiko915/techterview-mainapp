"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mic, Video, VideoOff, MicOff, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/useAuth';
import { createInterview } from '@/lib/firestore_modules/interviews';

const InterviewLobbyPage = () => {
    const router = useRouter();
    const [hasPermissions, setHasPermissions] = useState(false);
    const [stream, setStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const videoRef = useRef(null);

    // Device Selection State
    const [audioDevices, setAudioDevices] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedAudioId, setSelectedAudioId] = useState("");
    const [selectedVideoId, setSelectedVideoId] = useState("");
    const [audioLevel, setAudioLevel] = useState(0);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stream]);

    // Enumerate Devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices.filter(device => device.kind === 'audioinput');
                const videoInputs = devices.filter(device => device.kind === 'videoinput');
                setAudioDevices(audioInputs);
                setVideoDevices(videoInputs);

                // Set defaults if not already set
                if (audioInputs.length > 0 && !selectedAudioId) setSelectedAudioId(audioInputs[0].deviceId);
                if (videoInputs.length > 0 && !selectedVideoId) setSelectedVideoId(videoInputs[0].deviceId);
            } catch (error) {
                console.error("Error enumerating devices:", error);
            }
        };

        if (hasPermissions) {
            getDevices();
        }
    }, [hasPermissions]);

    // Audio Level Analysis
    useEffect(() => {
        if (!stream || !isMicOn) {
            setAudioLevel(0);
            return;
        }

        const analyzeAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const audioContext = audioContextRef.current;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(average); // 0-255
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();
        };

        analyzeAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stream, isMicOn]);

    const requestPermissions = async () => {
        try {
            const constraints = {
                video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
                audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setHasPermissions(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            toast.success("Permissions granted successfully!");
        } catch (error) {
            console.error("Error accessing media devices:", error);
            toast.error("Failed to access camera/microphone. Please check permissions.");
        }
    };

    // Re-request stream when device changes
    useEffect(() => {
        if (hasPermissions && (selectedAudioId || selectedVideoId)) {
            requestPermissions();
        }
    }, [selectedAudioId, selectedVideoId]);

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setResumeFile(file);
                toast.success("Resume uploaded successfully!");
            } else {
                toast.error("Please upload a PDF or DOCX file.");
            }
        }
    };

    const { user } = useAuth();

    const startInterview = async () => {
        if (!hasPermissions) {
            toast.error("Please enable permissions first.");
            return;
        }

        if (!user) {
            toast.error("You must be logged in to start an interview.");
            return;
        }

        try {
            // Save context for the interview room
            const existingContext = JSON.parse(localStorage.getItem('interviewContext') || '{}');
            const interviewContext = {
                ...existingContext,
                resumeName: resumeFile ? resumeFile.name : existingContext.resumeName,
                targetRole: existingContext.targetRole || "Software Engineer",
                selectedAudioId,
                selectedVideoId
            };
            localStorage.setItem('interviewContext', JSON.stringify(interviewContext));

            // Create Interview in Firestore
            const interviewId = await createInterview({
                userId: user.uid,
                targetRole: interviewContext.targetRole,
                status: 'active',
                resumeName: interviewContext.resumeName
            });

            router.push(`/interview-room/${interviewId}`);
        } catch (error) {
            console.error("Error creating interview:", error);
            toast.error("Failed to start interview. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold font-playfair mb-2">Interview Lobby</h1>
            <p className="text-muted-foreground mb-8">Check your setup before joining the interview.</p>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Media Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Camera & Microphone</CardTitle>
                        <CardDescription>Ensure you are visible and audible.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                            {hasPermissions ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <VideoOff className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Camera permission needed</p>
                                </div>
                            )}
                            {!isCameraOn && hasPermissions && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                    <VideoOff className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Mic Level Indicator */}
                        {hasPermissions && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Mic Level</span>
                                    <span>{Math.round((audioLevel / 255) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-100"
                                        style={{ width: `${(audioLevel / 255) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={toggleMic} disabled={!hasPermissions}>
                                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            </Button>
                            <Button variant={isCameraOn ? "outline" : "destructive"} size="icon" onClick={toggleCamera} disabled={!hasPermissions}>
                                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                            </Button>
                        </div>

                        {/* Device Selection */}
                        {hasPermissions && (
                            <div className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <Label>Microphone</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={selectedAudioId}
                                        onChange={(e) => setSelectedAudioId(e.target.value)}
                                    >
                                        {audioDevices.map(device => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Camera</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={selectedVideoId}
                                        onChange={(e) => setSelectedVideoId(e.target.value)}
                                    >
                                        {videoDevices.map(device => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {!hasPermissions && (
                            <Button className="w-full" onClick={requestPermissions}>
                                Enable Camera & Microphone
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Setup & Instructions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personalize Interview</CardTitle>
                            <CardDescription>Upload your resume for a tailored experience.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="resume">Resume (PDF/DOCX)</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="resume" type="file" accept=".pdf,.docx" onChange={handleResumeUpload} />
                                    {resumeFile && <CheckCircle className="w-5 h-5 text-green-500" />}
                                </div>
                                {resumeFile && <p className="text-sm text-muted-foreground">Uploaded: {resumeFile.name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <p>Find a quiet place with good lighting.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <p>Speak clearly and at a normal pace.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <p>The interview will last approximately 10 minutes.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                <p>Ensure you have a stable internet connection.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={startInterview} disabled={!hasPermissions}>
                                Join Interview
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InterviewLobbyPage;
