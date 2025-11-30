"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getInterview } from '@/lib/firestore_modules/interviews';
import { getUserEnrollment, updateUserEnrollment, recordLessonCompletion } from '@/lib/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function InterviewFeedbackPage({ params }) {
    const { interviewId } = use(params);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [interview, setInterview] = useState(null);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchInterview = async () => {
            try {
                const data = await getInterview(interviewId);
                if (!data) {
                    toast.error("Interview not found");
                    router.push('/dashboard/mock-interviews');
                    return;
                }
                if (data.userId !== user.uid) {
                    toast.error("Unauthorized");
                    router.push('/dashboard/mock-interviews');
                    return;
                }
                setInterview(data);

                // Check if feedback already exists
                if (data.feedback) {
                    setFeedback(data.feedback);
                    setLoading(false);
                } else {
                    // Generate feedback if not present
                    generateFeedback(data);
                }
            } catch (error) {
                console.error("Error fetching interview:", error);
                toast.error("Failed to load interview data");
                setLoading(false);
            }
        };

        fetchInterview();
    }, [interviewId, user, authLoading, router]);

    const handleTrackProgress = async (interviewData, feedbackData) => {
        if (interviewData.type !== 'track_interview' || feedbackData.score < 50) return;

        try {
            const { userId, trackId, moduleId, lessonId } = interviewData;

            // 1. Record Lesson Completion
            await recordLessonCompletion(userId, trackId, lessonId, `Interview: ${interviewData.targetRole}`);

            // 2. Update Enrollment
            const enrollment = await getUserEnrollment(userId, trackId);
            if (!enrollment) return;

            let updates = {};
            let updatedCompletedLessons = enrollment.completedLessons || [];

            if (!updatedCompletedLessons.includes(lessonId)) {
                updatedCompletedLessons = [...updatedCompletedLessons, lessonId];
                updates.completedLessons = updatedCompletedLessons;
                updates.lastAccessed = new Date();

                await updateUserEnrollment(enrollment.id, updates);
                toast.success("Lesson Completed! You passed the interview.");
            }

        } catch (error) {
            console.error("Error updating track progress:", error);
            toast.error("Failed to update track progress");
        }
    };

    const generateFeedback = async (interviewData) => {
        setGenerating(true);
        try {
            const response = await fetch('/api/interview/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviewId: interviewData.id }),
            });

            if (!response.ok) throw new Error("Failed to generate feedback");

            const data = await response.json();
            setFeedback(data.feedback);

            // Update local state to reflect new feedback
            setInterview(prev => ({ ...prev, feedback: data.feedback }));

            // Handle Track Progress
            await handleTrackProgress(interviewData, data.feedback);

        } catch (error) {
            console.error("Error generating feedback:", error);
            toast.error("Failed to generate feedback. Please try again.");
        } finally {
            setGenerating(false);
            setLoading(false);
        }
    };

    const [loadingStep, setLoadingStep] = useState(0);
    const loadingSteps = [
        "Analyzing interview transcript...",
        "Identifying key strengths...",
        "Pinpointing areas for improvement...",
        "Calculating overall score...",
        "Finalizing personalized feedback..."
    ];

    useEffect(() => {
        if (loading || generating) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
            }, 3000); // Change step every 3 seconds
            return () => clearInterval(interval);
        }
    }, [loading, generating]);

    if (loading || generating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-8 max-w-md w-full">
                    <div className="relative w-32 h-32 mx-auto">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        {/* Spinning Ring */}
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        {/* Inner Pulse */}
                        <div className="absolute inset-4 bg-blue-50 rounded-full animate-pulse flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-blue-600 animate-bounce" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 font-playfair animate-fade-in">
                            {loadingSteps[loadingStep]}
                        </h2>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-sm">
                            Our AI is reviewing your responses to provide detailed insights.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900">Feedback Unavailable</h2>
                    <p className="text-slate-500 mb-4">We couldn't generate feedback for this interview.</p>
                    <Button onClick={() => router.push('/dashboard/mock-interviews')}>
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        {interview?.type === 'track_interview' ? (
                            <Button
                                variant="ghost"
                                className="mb-2 pl-0 hover:bg-transparent hover:text-blue-600"
                                onClick={() => router.push(`/dashboard/interview-tracks/${interview.trackId}/modules/${interview.moduleId}/lesson/${interview.lessonId}`)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Lesson
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                className="mb-2 pl-0 hover:bg-transparent hover:text-blue-600"
                                onClick={() => router.push('/dashboard/mock-interviews')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        )}

                        <h1 className="text-3xl font-bold text-slate-900 font-playfair">Interview Analysis</h1>
                        <p className="text-slate-500">
                            {interview?.targetRole} • {new Date(interview?.createdAt?.seconds * 1000).toLocaleDateString()}
                        </p>

                        {/* Pass/Fail Message for Track Interviews */}
                        {interview?.type === 'track_interview' && (
                            <div className={`mt-4 p-4 rounded-lg border ${feedback.score >= 50 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    {feedback.score >= 50 ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6" />
                                            Congratulations! You passed this lesson.
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-6 h-6" />
                                            You didn't pass. Retake the interview to complete the lesson.
                                        </>
                                    )}
                                </div>
                                <p className="mt-1 ml-8 text-sm opacity-90">
                                    {feedback.score >= 50
                                        ? "Great job! You can now proceed to the next lesson."
                                        : "Don't worry, you can try again as many times as you need. Review the feedback below to improve."}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-500">Overall Score</p>
                            <p className="text-4xl font-bold text-blue-600">{feedback.score}/100</p>
                        </div>
                        <div className="w-24 h-24 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="80%"
                                    outerRadius="100%"
                                    barSize={10}
                                    data={[{ name: 'score', value: feedback.score, fill: '#2563eb' }]}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar
                                        background
                                        clockWise
                                        dataKey="value"
                                        cornerRadius={10}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-600">{feedback.score}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Executive Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-700 leading-relaxed">
                            {feedback.summary}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="border-green-200 bg-green-50/30 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="w-5 h-5" />
                                Key Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {feedback.strengths?.map((strength, index) => (
                                    <li key={index} className="flex gap-3 text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Improvements */}
                    <Card className="border-amber-200 bg-amber-50/30 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                <AlertCircle className="w-5 h-5" />
                                Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {feedback.improvements?.map((improvement, index) => (
                                    <li key={index} className="flex gap-3 text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        {improvement}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
