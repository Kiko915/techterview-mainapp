import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Plus, FileText, Upload, Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';
import ResumeReviewModal from './ResumeReviewModal';
import { addChatMessage, getChatMessages } from '@/lib/firestore';
import { toast } from 'sonner';

const ChatInterface = ({ sessionId, user, initialMessages = [], onTitleUpdate }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState("paste");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, context]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        // Add placeholder for AI response
        setMessages(prev => [...prev, { role: "model", content: "" }]);

        try {
            // Save user message to Firestore
            if (sessionId) {
                await addChatMessage(sessionId, "user", userMessage.content);
            }

            const res = await fetch('/api/ai-mentor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    userId: user.uid,
                    userName: user.displayName || "User",
                    context,
                    sessionId
                }),
            });

            if (!res.ok) throw new Error("Failed to get response");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiResponseText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiResponseText += chunk;

                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'model') {
                        lastMsg.content = aiResponseText;
                    }
                    return newMessages;
                });
            }

            // Save AI message to Firestore
            if (sessionId) {
                await addChatMessage(sessionId, "model", aiResponseText);
            }

            // Trigger title update check (optional, or just let it happen on next load)
            if (updatedMessages.length === 1 && onTitleUpdate) {
                // We could fetch the new title here if we wanted to be precise, 
                // but for now we'll rely on the sidebar refreshing or the user reloading.
                // Or we can just trigger a reload of sessions in the parent component if we had a callback for that.
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
            // Remove the placeholder if failed
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const openModal = (tab) => {
        setModalTab(tab);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ScrollArea className="flex-1 min-h-0 p-4">
                <div className="space-y-4 pb-4 pt-6">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                        >
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                                {msg.role === 'user' ? (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.photoURL} />
                                        <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/assets/techbot/techbot-pfp.png" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-xs text-muted-foreground mb-1 px-1">
                                    {msg.role === 'user' ? "Me" : "TechBot"}
                                </span>
                                <div className={`
                                    rounded-lg p-3 w-full text-sm shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-gray-100 text-foreground'}
                                `}>
                                    <div className={`prose max-w-none text-sm ${msg.role === 'user' ? 'prose-invert text-white' : ''}`}>
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white">
                {context && (
                    <div className="mb-2 p-2 bg-muted/50 rounded text-xs flex justify-between items-center">
                        <span className="truncate max-w-[300px]">Context: {context.substring(0, 50)}...</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => setContext("")}>
                            Remove
                        </Button>
                    </div>
                )}
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => openModal("paste")}>
                                <FileText className="w-4 h-4 mr-2" />
                                Paste Text
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openModal("upload")}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openModal("portfolio")}>
                                <Globe className="w-4 h-4 mr-2" />
                                Portfolio Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ResumeReviewModal
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        defaultTab={modalTab}
                        onContextSet={setContext}
                    />

                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[44px] max-h-[120px] resize-none"
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
