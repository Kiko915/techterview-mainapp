
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ChallengeEditor from "../components/ChallengeEditor";
import OutputPanel from "../components/OutputPanel";
import SubmissionResultModal from "../components/SubmissionResultModal";
import { Button } from "@/components/ui/button";
import { Play, Send, ArrowLeft, Sparkles, RotateCcw, CheckCircle2, Cloud, ChevronRight, Code } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { executeCode } from "@/lib/piston-client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

import { useAuth } from "@/lib/useAuth";
import { saveChallengeProgress, getUserChallengeProgress } from "@/lib/firestore";

export default function ChallengeIDE() {
    const { user } = useAuth();
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState("success"); // 'success' | 'error'

    // Helper to get storage key
    const getStorageKey = (uId, cId, lang) => `code-autosave-${uId}-${cId}-${lang}`;

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!user) return;

            try {
                const docRef = doc(db, "challenges", challengeId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setChallenge(data);

                    // Set initial language
                    const defaultLang = data.languageRestriction?.[0] || "javascript";
                    setLanguage(defaultLang);

                    // 1. Try to get code from Firestore (Source of Truth)
                    const progress = await getUserChallengeProgress(user.uid, challengeId);

                    let initialCode = "";
                    if (progress?.code) {
                        initialCode = progress.code;
                    } else {
                        // 2. Fallback to LocalStorage (User-scoped)
                        const savedCode = localStorage.getItem(getStorageKey(user.uid, challengeId, defaultLang));
                        // 3. Fallback to Starter Code
                        initialCode = savedCode || data.starterCode?.[defaultLang] || "";
                    }

                    setCode(initialCode);

                    // Set feedback if exists
                    if (progress?.feedback) {
                        setAiFeedback(progress.feedback);
                    }
                } else {
                    toast.error("Challenge not found", {
                        description: "The requested challenge could not be retrieved.",
                        className: "bg-red-500/10 border-red-500/20 text-red-500"
                    });
                }
            } catch (error) {
                console.error("Error fetching challenge:", error);
                toast.error("Failed to load challenge", {
                    description: "Please check your connection and try again.",
                    className: "bg-red-500/10 border-red-500/20 text-red-500"
                });
            }
        };

        if (challengeId && user) {
            fetchChallenge();
        }
    }, [challengeId, user]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        // Clear execution state to prevent stale data
        setOutput(null);
        setError(null);
        setAiFeedback(null);
        setSubmissionStatus("success"); // Reset to default

        if (!user) return;

        // Check for saved code in localStorage (User-scoped)
        const savedCode = localStorage.getItem(getStorageKey(user.uid, challengeId, newLang));
        setCode(savedCode || challenge.starterCode?.[newLang] || "");
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setIsSaving(true);
        if (user) {
            localStorage.setItem(getStorageKey(user.uid, challengeId, language), newCode);
        }
        // Simulate a brief delay to show the "Saving..." state, then revert to "Saved"
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleReset = () => {
        if (!challenge || !user) return;
        const starter = challenge.starterCode?.[language] || "";
        setCode(starter);
        localStorage.removeItem(getStorageKey(user.uid, challengeId, language));
        toast.info("Code reset to starter template");
    };

    const handleRun = async () => {
        if (!challenge) return;

        setIsRunning(true);
        setOutput(null);
        setError(null);
        setAiFeedback(null);

        try {
            const testHarness = challenge.testHarness?.[language] || "";
            const result = await executeCode(language, code, testHarness);

            if (result.stderr) {
                setError(result.stderr);
            } else {
                setOutput(result.stdout || result.output);
            }

            // Check if tests passed (simple check for "All tests passed!" string in output)
            if (result.stdout && result.stdout.includes("All tests passed!")) {
                toast.success("Tests Passed!", {
                    description: "Great job! Your solution is correct.",
                    className: "bg-green-500/10 border-green-500/20 text-green-500"
                });
            } else if (result.stderr) {
                toast.error("Execution Error", {
                    description: "There was an error running your code.",
                    className: "bg-red-500/10 border-red-500/20 text-red-500"
                });
            } else {
                toast.error("Tests Failed", {
                    description: "Your solution didn't pass all test cases.",
                    className: "bg-red-500/10 border-red-500/20 text-red-500"
                });
            }

        } catch (err) {
            console.error("Execution failed:", err);
            setError(err.message || "Failed to execute code");
            toast.error("Execution Failed", {
                description: "An unexpected error occurred while running your code.",
                className: "bg-red-500/10 border-red-500/20 text-red-500"
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!output && !error) {
            toast.warning("Run Code First", {
                description: "Please execute your solution before submitting.",
                className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/ai-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    challengeId: challenge.id,
                    output: output || error,
                    success: output && output.includes("All tests passed!")
                })
            });

            const data = await response.json();
            if (data.feedback) {
                setAiFeedback(data.feedback);

                // Determine status based on success flag sent to API
                const isSuccess = output && output.includes("All tests passed!");
                setSubmissionStatus(isSuccess ? "success" : "error");
                setShowModal(true);

                if (isSuccess) {
                    toast.success("Challenge Completed!");
                    // Save progress if user is logged in
                    if (user) {
                        await saveChallengeProgress(user.uid, challenge.id, 'completed', code, data.feedback);
                    }
                } else {
                    toast.error("Submission Failed");
                }
            } else {
                throw new Error("No feedback received");
            }
        } catch (err) {
            console.error("Submission failed:", err);
            toast.error("Submission Failed", {
                description: "Could not retrieve AI feedback at this time.",
                className: "bg-red-500/10 border-red-500/20 text-red-500"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!challenge) {
        return <div className="flex items-center justify-center h-screen">Loading IDE...</div>;
    }

    // Language Icons
    const LanguageIcons = {
        javascript: (props) => (
            <Image
                src="/assets/js.png"
                alt="JavaScript"
                width={20}
                height={20}
                className={props.className}
            />
        ),
        python: (props) => (
            <Image
                src="/assets/python.png"
                alt="Python"
                width={20}
                height={20}
                className={props.className}
            />
        )
    };

    const isRunRequired = !output && !error;

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col overflow-hidden bg-background">
                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Link href="/dashboard/coding-challenge" className="hover:text-foreground transition-colors flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Challenges
                            </Link>
                            <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
                            <span className="font-medium text-foreground flex items-center gap-2">
                                <Code className="h-4 w-4 text-primary" />
                                {challenge.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        {challenge.languageRestriction && challenge.languageRestriction.length > 1 && (
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-[140px] h-9 bg-background">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {challenge.languageRestriction.map((lang) => (
                                        <SelectItem key={lang} value={lang} className="capitalize">
                                            <div className="flex items-center gap-2">
                                                {LanguageIcons[lang] && LanguageIcons[lang]({ className: "w-4 h-4" })}
                                                {lang}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        <div className="h-6 w-px bg-border mx-2" />

                        {/* Save Status */}
                        <div className="flex items-center gap-2 mr-2 text-xs text-muted-foreground min-w-[80px] justify-end">
                            {isSaving ? (
                                <>
                                    <Cloud className="h-3 w-3 animate-pulse text-primary" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    <span>Saved</span>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReset}
                                        disabled={isRunning}
                                        className="h-9 w-9 p-0"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset Code</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className="h-9 gap-2 min-w-[80px]"
                                    >
                                        <Play className="h-4 w-4 fill-current" />
                                        Run
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Execute your code (Ctrl+Enter)</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span> {/* Wrapper needed for disabled button tooltip */}
                                        <Button
                                            size="sm"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || isRunning || isRunRequired}
                                            className={`h-9 gap-2 min-w-[100px] transition-all duration-300 ${isRunRequired
                                                ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                                                : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                                                }`}
                                        >
                                            <Send className="h-4 w-4" />
                                            Submit
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isRunRequired
                                        ? "Run your code first to verify it works"
                                        : "Submit your solution for AI review"}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden w-full h-full relative">
                    <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-none border-none">
                        {/* Left Panel: Description */}
                        <ResizablePanel defaultSize={30} minSize={20} className="bg-card/30 h-full">
                            <div className="h-full overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-md my-4 !bg-[#1e1e1e] border border-border/50 shadow-sm"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary`} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground border-b pb-2" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />,
                                        p: ({ node, ...props }) => <p className="leading-7 mb-4 text-muted-foreground" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground" {...props} />,
                                        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground bg-muted/20 py-2 pr-2 rounded-r" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                    }}
                                >
                                    {challenge.description}
                                </ReactMarkdown>

                                {aiFeedback && (
                                    <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h3 className="text-lg font-semibold text-blue-500 mb-2 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            AI Feedback
                                        </h3>
                                        <p className="text-sm leading-relaxed">{aiFeedback}</p>
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Right Panel: Editor & Output */}
                        <ResizablePanel defaultSize={70} className="h-full">
                            <ResizablePanelGroup direction="vertical" className="h-full w-full">
                                {/* Top: Editor */}
                                <ResizablePanel defaultSize={70} minSize={30} className="h-full">
                                    <div className="h-full w-full overflow-hidden">
                                        <ChallengeEditor
                                            code={code}
                                            language={language}
                                            onChange={handleCodeChange}
                                        />
                                    </div>
                                </ResizablePanel>

                                <ResizableHandle withHandle />

                                {/* Bottom: Output */}
                                <ResizablePanel defaultSize={30} minSize={10} className="bg-muted/30 h-full">
                                    <div className="h-full w-full overflow-hidden">
                                        <OutputPanel
                                            output={output}
                                            error={error}
                                            isLoading={isRunning}
                                        />
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>

                </div >

                <SubmissionResultModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    status={submissionStatus}
                    feedback={aiFeedback}
                    onRetry={handleSubmit}
                />
            </div >
        </TooltipProvider>
    );
}
