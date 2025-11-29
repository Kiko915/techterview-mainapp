import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useAuth } from '@/lib/useAuth';
import { getInterview, updateInterview } from '@/lib/firestore_modules/interviews';

export function useInterview(roomId) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [stream, setStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    const [agentStatus, setAgentStatus] = useState("Initializing...");
    const [transcript, setTranscript] = useState([
        { role: 'agent', text: "Hello! I'm your technical interviewer. Are you ready to get started?" },
    ]);
    const [isValidSession, setIsValidSession] = useState(false);

    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const recorderContextRef = useRef(null);
    const playerContextRef = useRef(null);
    const processorRef = useRef(null);
    const sourceRef = useRef(null);
    const nextStartTimeRef = useRef(0);
    const transcriptRef = useRef(transcript);
    const startTimeRef = useRef(null);

    // Analyser Refs
    const agentAnalyserRef = useRef(null);
    const userAnalyserRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Update transcript ref whenever transcript changes
    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    // Session Validation
    useEffect(() => {
        if (!isClient || authLoading || !roomId) return;

        const validateSession = async () => {
            try {
                const interview = await getInterview(roomId);
                if (!interview) {
                    toast.error("Interview not found.");
                    router.push('/dashboard/mock-interviews');
                    return;
                }

                if (interview.status === 'completed') {
                    toast.error("This interview session has ended.");
                    router.push('/dashboard/mock-interviews');
                    return;
                }

                if (interview.userId !== user?.uid) {
                    toast.error("Unauthorized access.");
                    router.push('/dashboard/mock-interviews');
                    return;
                }

                setIsValidSession(true);
                startTimeRef.current = Date.now(); // Start tracking time
            } catch (error) {
                console.error("Session validation error:", error);
                toast.error("Failed to validate session.");
                router.push('/dashboard/mock-interviews');
            }
        };

        validateSession();
    }, [isClient, authLoading, roomId, user, router]);

    // Handle Refresh/Unload - End Session
    useEffect(() => {
        const handleUnload = () => {
            const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
            updateInterview(roomId, {
                status: 'completed',
                transcript: transcriptRef.current,
                duration: duration
            }).catch(console.error);
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [roomId]);

    // Timer Logic
    useEffect(() => {
        if (!isClient || !isValidSession) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endCall();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isClient, isValidSession]);

    // Initialize Media and Voice Agent
    useEffect(() => {
        if (!isClient || authLoading || !isValidSession) return;

        const init = async () => {
            try {
                // 1. Get User Media
                const context = JSON.parse(localStorage.getItem('interviewContext') || '{}');
                const constraints = {
                    video: context.selectedVideoId ? { deviceId: { exact: context.selectedVideoId } } : true,
                    audio: {
                        deviceId: context.selectedAudioId ? { exact: context.selectedAudioId } : undefined,
                        sampleRate: 16000,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                    }
                };
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

                // 2. Fetch Keys
                const response = await fetch('/api/deepgram');
                const data = await response.json();

                if (!data.key || !data.geminiKey) {
                    throw new Error("Failed to retrieve API keys");
                }

                // 3. Connect to Deepgram Voice Agent
                const socket = new WebSocket("wss://agent.deepgram.com/v1/agent/converse", [
                    "token",
                    data.key,
                ]);
                socketRef.current = socket;
                socket.binaryType = 'arraybuffer';

                socket.onopen = () => {
                    console.log("Deepgram Agent Connected");
                    setConnectionStatus("Connected");
                    setAgentStatus("Listening");

                    // Send Configuration
                    const context = JSON.parse(localStorage.getItem('interviewContext') || '{}');
                    const role = context.targetRole || "Software Engineer";
                    const userName = user?.displayName || "Candidate";

                    const settings = {
                        type: "Settings",
                        audio: {
                            input: { encoding: "linear16", sample_rate: 16000 },
                            output: { encoding: "linear16", sample_rate: 24000, container: "none" },
                        },
                        agent: {
                            listen: {
                                provider: { type: "deepgram", model: "nova-2" }
                            },
                            think: {
                                provider: { type: "google" },
                                prompt: context.isCustom
                                    ? `You are a professional interviewer conducting a customized mock interview.
                                    Target Role: ${context.targetRole}
                                    Candidate Name: ${userName}
                                    Focus Areas: ${context.focusAreas || "General"}
                                    Question Type: ${context.questionType}
                                    
                                    Goal: Assess the candidate based on the specified parameters.
                                    
                                    Guidelines:
                                    - Ask questions relevant to the ${context.questionType} type and ${context.focusAreas ? `specifically focusing on: ${context.focusAreas}` : "general requirements"}.
                                    - Start by introducing yourself and asking ${userName} to introduce themselves.
                                    - Listen carefully and provide constructive feedback or follow-up questions.
                                    - Keep responses concise (under 3 sentences).
                                    - Be professional and encouraging.`
                                    : role === "Behavioral"
                                        ? `You are a professional HR interviewer conducting a behavioral interview. 
                                    The candidate's name is ${userName}.
                                    Your goal is to assess the candidate's soft skills, culture fit, and communication abilities.
                                    
                                    Guidelines:
                                    - Ask one clear, relevant behavioral question at a time (e.g., "Tell me about a time...", "How do you handle...").
                                    - Start with a brief introduction and ask ${userName} to introduce themselves.
                                    - Listen carefully to their response.
                                    - Follow up on their stories to dig deeper into their actions and results (STAR method).
                                    - Keep your responses concise and professional (under 3 sentences usually).
                                    - DO NOT ask technical coding questions. Focus on teamwork, conflict resolution, leadership, and adaptability.
                                    - Be encouraging and conversational.`
                                        : `You are a professional technical interviewer conducting a mock interview for a ${role} position. 
                                    The candidate's name is ${userName}.
                                    Your goal is to assess the candidate's technical skills, problem-solving abilities, and communication.
                                    
                                    Guidelines:
                                    - Ask one clear, relevant technical question at a time.
                                    - Start with a brief introduction and ask ${userName} to introduce themselves.
                                    - Listen carefully to their response.
                                    - If the answer is correct, acknowledge it and move to a slightly harder question.
                                    - If the answer is incorrect or vague, ask a follow-up clarifying question or provide a gentle hint.
                                    - Keep your responses concise and professional (under 3 sentences usually).
                                    - Do not write code, just discuss it.
                                    - Be encouraging but objective.`,
                                endpoint: {
                                    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse",
                                    headers: { "x-goog-api-key": data.geminiKey }
                                }
                            },
                            speak: {
                                provider: { type: "deepgram", model: "aura-2-amalthea-en" }
                            },
                            greeting: context.isCustom
                                ? `Hello ${userName}! I'm ready to conduct your customized interview for the ${context.targetRole} role. Shall we begin?`
                                : role === "Behavioral"
                                    ? `Hello ${userName}! I'm your interviewer for this behavioral session. I'm looking forward to learning more about your experiences. Are you ready to begin?`
                                    : `Hello ${userName}! I'm your technical interviewer for the ${role} position. Are you ready to get started?`,
                        }
                    };
                    socket.send(JSON.stringify(settings));

                    // Start Audio Streaming
                    startAudioStreaming(mediaStream, socket);
                };

                socket.onmessage = async (event) => {
                    if (typeof event.data === 'string') {
                        const message = JSON.parse(event.data);
                        handleControlMessage(message);
                    } else {
                        // Binary audio data
                        handleAudioData(event.data);
                    }
                };

                socket.onclose = (event) => {
                    console.log("Deepgram Agent Disconnected", event.code, event.reason);
                    setConnectionStatus(`Disconnected (${event.code}: ${event.reason || 'Unknown'})`);
                };

                socket.onerror = (error) => {
                    console.error("Deepgram Agent Error:", error);
                    setConnectionStatus("Error");
                };

            } catch (error) {
                console.error("Initialization Error:", error);
                toast.error("Failed to initialize interview: " + error.message);
                setConnectionStatus("Failed");
            }
        };

        init();

        return () => {
            cleanup();
        };
    }, [isClient, authLoading, user, isValidSession]);

    const startAudioStreaming = (mediaStream, socket) => {
        recorderContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

        // Create User Analyser
        userAnalyserRef.current = recorderContextRef.current.createAnalyser();
        userAnalyserRef.current.fftSize = 2048;
        userAnalyserRef.current.smoothingTimeConstant = 0.96;

        sourceRef.current = recorderContextRef.current.createMediaStreamSource(mediaStream);
        processorRef.current = recorderContextRef.current.createScriptProcessor(4096, 1, 1);

        sourceRef.current.connect(userAnalyserRef.current); // Connect to analyser
        sourceRef.current.connect(processorRef.current);
        processorRef.current.connect(recorderContextRef.current.destination);

        processorRef.current.onaudioprocess = (e) => {
            if (socket.readyState === WebSocket.OPEN) {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = convertFloat32ToInt16(inputData);
                socket.send(pcmData);
            }
        };
    };

    const convertFloat32ToInt16 = (buffer) => {
        let l = buffer.length;
        let buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, Math.max(-1, buffer[l])) * 0x7FFF;
        }
        return buf.buffer;
    };

    const handleControlMessage = (message) => {
        switch (message.type) {
            case 'UserStartedSpeaking':
                setAgentStatus("Listening...");
                setIsSpeaking(false);
                break;
            case 'AgentStartedSpeaking':
                setAgentStatus("Speaking...");
                setIsSpeaking(true);
                break;
            case 'AgentStoppedSpeaking':
                setAgentStatus("Listening...");
                setIsSpeaking(false);
                break;
            case 'ConversationText':
                if (message.role === 'user') {
                    setTranscript(prev => [...prev, { role: 'user', text: message.content }]);
                } else if (message.role === 'assistant') {
                    setTranscript(prev => [...prev, { role: 'agent', text: message.content }]);
                }
                break;
            default:
                break;
        }
    };

    const handleAudioData = async (data) => {
        try {
            if (!playerContextRef.current) {
                playerContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });

                // Create Agent Analyser
                agentAnalyserRef.current = playerContextRef.current.createAnalyser();
                agentAnalyserRef.current.fftSize = 2048;
                agentAnalyserRef.current.smoothingTimeConstant = 0.96;
            }
            const playerContext = playerContextRef.current;

            if (playerContext.state === 'suspended') {
                await playerContext.resume();
            }

            // Convert raw Int16 PCM to Float32
            const int16Data = new Int16Array(data);
            const float32Data = new Float32Array(int16Data.length);
            for (let i = 0; i < int16Data.length; i++) {
                float32Data[i] = int16Data[i] / 0x8000;
            }

            // Create AudioBuffer
            const audioBuffer = playerContext.createBuffer(1, float32Data.length, 24000);
            audioBuffer.copyToChannel(float32Data, 0);

            // Schedule Playback
            const source = playerContext.createBufferSource();
            source.buffer = audioBuffer;

            // Connect to Analyser AND Destination
            if (agentAnalyserRef.current) {
                source.connect(agentAnalyserRef.current);
                agentAnalyserRef.current.connect(playerContext.destination);
            } else {
                source.connect(playerContext.destination);
            }

            // Ensure we don't schedule in the past
            const currentTime = playerContext.currentTime;
            if (nextStartTimeRef.current < currentTime) {
                nextStartTimeRef.current = currentTime;
            }

            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;

        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const cleanup = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (recorderContextRef.current && recorderContextRef.current.state !== 'closed') {
            recorderContextRef.current.close();
        }
        if (playerContextRef.current && playerContextRef.current.state !== 'closed') {
            playerContextRef.current.close();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    const endCall = async () => {
        cleanup();
        try {
            const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
            await updateInterview(roomId, {
                status: 'completed',
                transcript: transcriptRef.current,
                duration: duration
            });
        } catch (error) {
            console.error("Error ending interview:", error);
        }
        router.push(`/dashboard/interview/${roomId}/feedback`);
    };

    return {
        isClient,
        stream,
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
        agentAnalyser: agentAnalyserRef.current,
        userAnalyser: userAnalyserRef.current
    };
}
