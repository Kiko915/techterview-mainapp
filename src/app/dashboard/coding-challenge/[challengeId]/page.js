
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ChallengeEditor from "../components/ChallengeEditor";
import OutputPanel from "../components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Play, Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { executeCode } from "@/lib/piston-client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChallengeIDE() {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const docRef = doc(db, "challenges", challengeId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setChallenge(data);

                    // Set initial language and code
                    const defaultLang = data.languageRestriction?.[0] || "javascript";
                    setLanguage(defaultLang);
                    setCode(data.starterCode?.[defaultLang] || "");
                } else {
                    toast.error("Challenge not found");
                }
            } catch (error) {
                console.error("Error fetching challenge:", error);
                toast.error("Failed to load challenge");
            }
        };

        if (challengeId) {
            fetchChallenge();
        }
    }, [challengeId]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        // Reset code to starter code for the new language
        setCode(challenge.starterCode?.[newLang] || "");
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
                toast.success("Tests Passed!");
            } else if (result.stderr) {
                toast.error("Execution Error");
            } else {
                toast.warning("Tests Failed");
            }

        } catch (err) {
            console.error("Execution failed:", err);
            setError(err.message || "Failed to execute code");
            toast.error("Failed to execute code");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!output && !error) {
            toast.error("Please run your code first!");
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
                toast.success("Feedback Received!");
            } else {
                throw new Error("No feedback received");
            }
        } catch (err) {
            console.error("Submission failed:", err);
            toast.error("Failed to get AI feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!challenge) {
        return <div className="flex items-center justify-center h-screen">Loading IDE...</div>;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/coding-challenge">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="font-semibold font-playfair text-lg">{challenge.title}</h1>

                    {/* Language Selector for Universal Challenges */}
                    {challenge.languageRestriction && challenge.languageRestriction.length > 1 && (
                        <Select value={language} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[140px] h-8 ml-4">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {challenge.languageRestriction.map((lang) => (
                                    <SelectItem key={lang} value={lang} className="capitalize">
                                        {lang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="gap-2"
                    >
                        <Play className="h-4 w-4" />
                        Run
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isRunning}
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Send className="h-4 w-4" />
                        Submit
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    {/* Left Panel: Description */}
                    <ResizablePanel defaultSize={30} minSize={20}>
                        <div className="h-full overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {challenge.description}
                            </ReactMarkdown>

                            {aiFeedback && (
                                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-500 mb-2 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        AI Feedback
                                    </h3>
                                    <p className="text-sm">{aiFeedback}</p>
                                </div>
                            )}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Right Panel: Editor & Output */}
                    <ResizablePanel defaultSize={70}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Top: Editor */}
                            <ResizablePanel defaultSize={70} minSize={30}>
                                <ChallengeEditor
                                    code={code}
                                    language={language}
                                    onChange={(value) => setCode(value)}
                                />
                            </ResizablePanel>

                            <ResizableHandle />

                            {/* Bottom: Output */}
                            <ResizablePanel defaultSize={30} minSize={10}>
                                <OutputPanel
                                    output={output}
                                    error={error}
                                    isLoading={isRunning}
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
