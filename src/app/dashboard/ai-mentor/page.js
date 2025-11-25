"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getUserChatSessions, createChatSession, getChatMessages, deleteChatSession } from '@/lib/firestore';
import ChatInterface from './components/ChatInterface';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AIMentorPage() {
    const { user, loading: authLoading } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const router = useRouter();

    // Fetch sessions on load
    useEffect(() => {
        if (user) {
            loadSessions();
        }
    }, [user]);

    // Fetch messages when session changes
    useEffect(() => {
        if (selectedSessionId) {
            loadMessages(selectedSessionId);
        } else {
            setMessages([]);
        }
    }, [selectedSessionId]);

    const loadSessions = async () => {
        if (!user) return;
        const userSessions = await getUserChatSessions(user.uid);
        setSessions(userSessions);

        // Select most recent if available and none selected
        if (userSessions.length > 0 && !selectedSessionId) {
            setSelectedSessionId(userSessions[0].id);
        }
    };

    const loadMessages = async (sessionId) => {
        setLoadingMessages(true);
        try {
            const msgs = await getChatMessages(sessionId);
            setMessages(msgs);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleNewChat = async () => {
        if (!user) return;
        try {
            const newSessionId = await createChatSession(user.uid, "New Conversation");
            await loadSessions();
            setSelectedSessionId(newSessionId);
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };

    const confirmDeleteSession = (e, sessionId) => {
        e.stopPropagation();
        setSessionToDelete(sessionId);
        setDeleteModalOpen(true);
    };

    const handleDeleteSession = async () => {
        if (!sessionToDelete) return;

        try {
            await deleteChatSession(sessionToDelete);
            setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
            if (selectedSessionId === sessionToDelete) {
                setSelectedSessionId(null);
            }
            setDeleteModalOpen(false);
            setSessionToDelete(null);
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="flex h-full overflow-hidden">
            {/* Main Chat Area - Left Side */}
            <div className="flex-1 flex flex-col border-r bg-background">
                {selectedSessionId ? (
                    loadingMessages ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <ChatInterface
                            key={selectedSessionId} // Force remount on session change
                            sessionId={selectedSessionId}
                            user={user}
                            initialMessages={messages}
                            onTitleUpdate={(newTitle) => {
                                setSessions(prev => prev.map(s =>
                                    s.id === selectedSessionId ? { ...s, title: newTitle } : s
                                ));
                            }}
                        />
                    )
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold mb-2">AI Mentor</h2>
                        <p className="mb-6 max-w-md">
                            Select a conversation from the sidebar or start a new one to get personalized mentorship and resume reviews.
                        </p>
                        <Button onClick={handleNewChat}>
                            <Plus className="w-4 h-4 mr-2" />
                            Start New Chat
                        </Button>
                    </div>
                )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="w-80 bg-white flex flex-col border-l">
                <div className="p-4 border-b flex items-center justify-between bg-white/50 backdrop-blur">
                    <h2 className="font-semibold">History</h2>
                    <Button variant="ghost" size="icon" onClick={handleNewChat} title="New Chat">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {sessions.length === 0 ? (
                        <div className="text-center p-4 text-sm text-muted-foreground">
                            No previous chats.
                        </div>
                    ) : (
                        sessions.map((session, index) => (
                            <div
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`
                  w-full text-left p-3 rounded-lg text-sm transition-all duration-200
                  flex flex-col gap-1 relative group cursor-pointer animate-in slide-in-from-right-4 fade-in
                  ${selectedSessionId === session.id
                                        ? 'bg-primary/10 text-primary hover:bg-primary/15 translate-x-1'
                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:translate-x-1'}
                `}
                            >
                                <span className="font-medium truncate">{session.title}</span>
                                <span className="text-xs opacity-70">
                                    {session.updatedAt?.seconds
                                        ? formatDistanceToNow(new Date(session.updatedAt.seconds * 1000), { addSuffix: true })
                                        : 'Just now'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive transition-opacity"
                                    onClick={(e) => confirmDeleteSession(e, session.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Conversation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this conversation? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSession}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
