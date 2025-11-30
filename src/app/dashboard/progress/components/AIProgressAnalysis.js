import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { saveAnalysis, getLatestAnalysis } from '@/lib/firestore_modules/analysis';

export default function AIProgressAnalysis({ user, stats, performanceData, topicData }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const fetchSavedAnalysis = async () => {
            if (user?.uid) {
                const saved = await getLatestAnalysis(user.uid);
                if (saved) {
                    setAnalysis(saved);
                    setIsExpanded(false); // Default to collapsed if content exists
                }
            }
        };
        fetchSavedAnalysis();
    }, [user]);

    const generateAnalysis = async () => {
        setLoading(true);
        setIsExpanded(true);
        try {
            const response = await fetch('/api/progress/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stats, performanceData, topicData }),
            });
            const data = await response.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
                if (user?.uid) {
                    await saveAnalysis(user.uid, data.analysis);
                }
            }
        } catch (error) {
            console.error("Error generating analysis:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 transition-all duration-300">
            <CardHeader className="cursor-pointer" onClick={toggleExpand}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
                            <Image
                                src="/assets/techbot/techbot-pfp.png"
                                alt="TechBot"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <CardTitle className="text-indigo-900 flex items-center gap-2">
                                TechBot Analysis
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
                            </CardTitle>
                            <CardDescription className="text-indigo-600">AI-powered insights on your progress</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!analysis && !loading && (
                            <Button
                                onClick={generateAnalysis}
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate
                            </Button>
                        )}
                        {loading && (
                            <Button disabled size="sm" className="bg-indigo-600 text-white">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="animate-in slide-in-from-top-2 duration-300">
                    {analysis ? (
                        <div className="prose prose-indigo max-w-none">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateAnalysis}
                                    disabled={loading}
                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                >
                                    <Sparkles className="w-3 h-3 mr-2" />
                                    Refresh Analysis
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            Click "Generate" to get personalized feedback from TechBot.
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
