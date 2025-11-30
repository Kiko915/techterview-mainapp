"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, Code, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from '@/lib/useAuth';
import { getUserEnrollment, updateUserEnrollment, getUserChallengeProgress, recordLessonCompletion } from '@/lib/firestore';
import { createInterview, getInterviewsForLesson } from '@/lib/firestore_modules/interviews';
import { useEnrollment } from "@/contexts/EnrollmentContext";
import QuizComponent from './components/QuizComponent';
import CodeBlock from './components/CodeBlock';
import { getLessonById, getTrackById, getTrackModules } from '@/lib/firestore_modules/tracks';

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const { trackId, moduleId, lessonId } = params;
    const { user } = useAuth();
    const { updateEnrollment } = useEnrollment();

    const [lesson, setLesson] = useState(null);
    const [track, setTrack] = useState(null);
    const [modules, setModules] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [challengeProgress, setChallengeProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonInterviews, setLessonInterviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch basic data
                const [lessonData, trackData, modulesData] = await Promise.all([
                    getLessonById(trackId, moduleId, lessonId),
                    getTrackById(trackId),
                    getTrackModules(trackId)
                ]);

                if (!lessonData) {
                    toast.error("Lesson not found");
                    router.push(`/dashboard/interview-tracks/${trackId}`);
                    return;
                }

                setLesson(lessonData);
                setTrack(trackData);
                setModules(modulesData);

                // Fetch enrollment if user is logged in
                if (user) {
                    const enrollmentData = await getUserEnrollment(user.uid, trackId);
                    setEnrollment(enrollmentData);

                    // Check for challenge progress if this lesson has a challenge
                    if (lessonData.challengeId) {
                        const progress = await getUserChallengeProgress(user.uid, lessonData.challengeId);
                        setChallengeProgress(progress);
                    }

                    // Fetch interviews if this is an interview lesson
                    if (lessonData.type === 'interview') {
                        const interviews = await getInterviewsForLesson(user.uid, lessonId);
                        setLessonInterviews(interviews);
                    }
                }

            } catch (error) {
                console.error("Error loading lesson:", error);
                toast.error("Failed to load lesson");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [trackId, moduleId, lessonId, router, user]);

    const handleCompleteLesson = async (nextLesson) => {
        if (!user || !enrollment) {
            if (nextLesson) {
                router.push(`/dashboard/interview-tracks/${trackId}/modules/${nextLesson.moduleId}/lesson/${nextLesson.id}`);
            } else {
                router.push(`/dashboard/interview-tracks/${trackId}`);
            }
            return;
        }

        try {
            const currentModule = modules.find(m => m.id === moduleId);
            const isLastLesson = currentModule.lessons[currentModule.lessons.length - 1].id === lessonId;

            // Prepare updates
            let updates = {};
            let updatedCompletedModules = enrollment.completedModules || [];
            let updatedCompletedLessons = enrollment.completedLessons || [];

            // Mark lesson as completed if not already
            if (!updatedCompletedLessons.includes(lessonId)) {
                updatedCompletedLessons = [...updatedCompletedLessons, lessonId];
                updates.completedLessons = updatedCompletedLessons;
                updates.lastAccessed = new Date();

                // Record lesson completion for streak/stats
                await recordLessonCompletion(user.uid, trackId, lessonId, lesson.title);
            }

            // Mark module as completed if this is the last lesson
            if (isLastLesson && !updatedCompletedModules.includes(moduleId)) {
                updatedCompletedModules = [...updatedCompletedModules, moduleId];
                updates.completedModules = updatedCompletedModules;
                updates.progress = (updatedCompletedModules.length / modules.length) * 100;
            }

            // CHECK FOR TRACK COMPLETION
            if (!nextLesson) {
                // Get all lesson IDs from all modules
                const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));

                // Check if all lessons are in the updatedCompletedLessons array
                const missingLessons = allLessonIds.filter(id => !updatedCompletedLessons.includes(id));

                if (missingLessons.length > 0) {
                    toast.error(`You have ${missingLessons.length} incomplete lesson(s). Please complete all lessons, challenges, and assessments to finish the track.`);

                    // Still save the current lesson completion
                    if (Object.keys(updates).length > 0) {
                        await updateUserEnrollment(enrollment.id, updates);

                        const newEnrollmentData = {
                            ...enrollment,
                            ...updates
                        };
                        setEnrollment(newEnrollmentData);
                        updateEnrollment(trackId, true, newEnrollmentData);
                    }
                    return; // Stop here, do not mark track as complete
                }
            }

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                await updateUserEnrollment(enrollment.id, updates);

                const newEnrollmentData = {
                    ...enrollment,
                    ...updates
                };

                // Update local state
                setEnrollment(newEnrollmentData);

                // Update context to reflect in sidebar
                updateEnrollment(trackId, true, newEnrollmentData);

                if (updates.completedModules) {
                    toast.success("Module Completed!");
                } else {
                    toast.success("Lesson Completed!");
                }
            }

            // Navigate
            if (nextLesson) {
                router.push(`/dashboard/interview-tracks/${trackId}/modules/${nextLesson.moduleId}/lesson/${nextLesson.id}`);
            } else {
                toast.success("Track Completed!");
                router.push(`/dashboard/interview-tracks/${trackId}`);
            }

        } catch (error) {
            console.error("Error completing lesson:", error);
            // Navigate anyway
            if (nextLesson) {
                router.push(`/dashboard/interview-tracks/${trackId}/modules/${nextLesson.moduleId}/lesson/${nextLesson.id}`);
            } else {
                router.push(`/dashboard/interview-tracks/${trackId}`);
            }
        }
    };

    // Calculate Previous and Next Lesson logic
    const getNavigation = () => {
        if (!modules.length) return { prev: null, next: null };

        let currentModuleIndex = modules.findIndex(m => m.id === moduleId);
        if (currentModuleIndex === -1) return { prev: null, next: null };

        const currentModule = modules[currentModuleIndex];
        const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);

        let prev = null;
        let next = null;

        // Previous Lesson
        if (currentLessonIndex > 0) {
            const prevLesson = currentModule.lessons[currentLessonIndex - 1];
            prev = {
                id: prevLesson.id,
                moduleId: moduleId,
                title: prevLesson.title
            };
        } else if (currentModuleIndex > 0) {
            // Go to last lesson of previous module
            const prevModule = modules[currentModuleIndex - 1];
            if (prevModule.lessons.length > 0) {
                const prevLesson = prevModule.lessons[prevModule.lessons.length - 1];
                prev = {
                    id: prevLesson.id,
                    moduleId: prevModule.id,
                    title: prevLesson.title
                };
            }
        }

        // Next Lesson
        if (currentLessonIndex < currentModule.lessons.length - 1) {
            const nextLesson = currentModule.lessons[currentLessonIndex + 1];
            next = {
                id: nextLesson.id,
                moduleId: moduleId,
                title: nextLesson.title
            };
        } else if (currentModuleIndex < modules.length - 1) {
            // Go to first lesson of next module
            const nextModule = modules[currentModuleIndex + 1];
            if (nextModule.lessons.length > 0) {
                const nextLesson = nextModule.lessons[0];
                next = {
                    id: nextLesson.id,
                    moduleId: nextModule.id,
                    title: nextLesson.title
                };
            }
        }

        return { prev, next };
    };

    const { prev, next } = getNavigation();

    const handleStartInterview = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const interviewData = {
                userId: user.uid,
                trackId: trackId,
                moduleId: moduleId,
                lessonId: lessonId,
                targetRole: lesson.interviewConfig?.targetRole || "Software Engineer",
                questionType: lesson.interviewConfig?.questionType || "Technical",
                focusAreas: lesson.interviewConfig?.focusAreas || "",
                status: 'active',
                type: 'track_interview' // Mark this as a track interview
            };

            const interviewId = await createInterview(interviewData);
            router.push(`/interview-room/${interviewId}`);
        } catch (error) {
            console.error("Error starting interview:", error);
            toast.error("Failed to start interview");
            setLoading(false);
        }
    };

    // Calculate best score
    const bestScore = lessonInterviews.reduce((max, interview) => {
        const score = interview.feedback?.score || 0;
        return score > max ? score : max;
    }, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!lesson || !track) return null;

    return (
        <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-8">
            {/* Lesson Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>Module: {modules.find(m => m.id === moduleId)?.title}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{lesson.title}</h1>

                {lesson.challengeId && (
                    <div className="flex flex-col gap-2">
                        {challengeProgress?.status === 'completed' ? (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Challenge Completed!</span>
                            </div>
                        ) : (
                            <Link href={`/dashboard/coding-challenge/${lesson.challengeId}`}>
                                <Button className="gap-2 bg-[#354fd2] hover:bg-[#2a3fca] text-white w-full md:w-auto">
                                    <Code className="h-4 w-4" />
                                    Start Coding Challenge
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="mb-16">
                {lesson.type === 'quiz' ? (
                    <QuizComponent
                        quizId={lesson.id}
                        onComplete={() => handleCompleteLesson(next)}
                        isCompleted={enrollment?.completedLessons?.includes(lesson.id)}
                    />
                ) : lesson.type === 'interview' ? (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-slate-50 text-center space-y-6">
                        <div className="relative w-32 h-32">
                            <div className={`absolute inset-0 rounded-full animate-pulse ${enrollment?.completedLessons?.includes(lesson.id) ? 'bg-green-100' : 'bg-blue-100'}`}></div>
                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <img
                                    src="/assets/techbot/techbot-pfp.png"
                                    alt="TechBot"
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <h3 className="text-xl font-semibold">Mock Interview Session</h3>
                            <p className="text-muted-foreground">
                                Test your knowledge with a live AI interview.
                                You need a score of <span className="font-bold text-primary">50% or higher</span> to pass this lesson.
                            </p>
                        </div>

                        {/* Score Display */}
                        {lessonInterviews.length > 0 && (
                            <div className="w-full max-w-xs bg-white p-4 rounded-lg border shadow-sm">
                                <div className="text-sm text-muted-foreground mb-1">Best Score</div>
                                <div className={`text-3xl font-bold ${bestScore >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
                                    {bestScore}%
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {bestScore >= 50 ? 'Passed' : 'Not Passed Yet'}
                                </div>
                            </div>
                        )}

                        {enrollment?.completedLessons?.includes(lesson.id) ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-full font-medium">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Interview Passed
                                </div>
                                <Button
                                    onClick={handleStartInterview}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    Practice Again
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleStartInterview}
                                    size="lg"
                                    className={`gap-2 text-white min-w-[200px] ${bestScore > 0 && bestScore < 50 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#354fd2] hover:bg-[#2a3fca]'}`}
                                >
                                    {bestScore > 0 && bestScore < 50 ? 'Retake Interview' : 'Start Interview'}
                                </Button>
                                {bestScore > 0 && bestScore < 50 && (
                                    <p className="text-sm text-amber-600 font-medium">
                                        Don't worry! You can retake the interview as many times as needed.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                img: ({ node, ...props }) => (
                                    <img
                                        {...props}
                                        className="rounded-lg border shadow-sm w-full h-auto my-4"
                                        alt={props.alt || "Lesson image"}
                                    />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-4 rounded-lg border">
                                        <table {...props} className="w-full text-sm text-left" />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => (
                                    <thead {...props} className="bg-muted text-muted-foreground uppercase" />
                                ),
                                th: ({ node, ...props }) => (
                                    <th {...props} className="px-6 py-3 font-medium" />
                                ),
                                td: ({ node, ...props }) => (
                                    <td {...props} className="px-6 py-4 border-t" />
                                ),
                                code: ({ node, inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock
                                            language={match[1]}
                                            value={String(children).replace(/\n$/, '')}
                                            {...props}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </article>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-8 border-t mt-8">
                {prev ? (
                    <Link href={`/dashboard/interview-tracks/${trackId}/modules/${prev.moduleId}/lesson/${prev.id}`}>
                        <Button variant="outline" className="gap-2 h-auto py-4 px-6">
                            <ChevronLeft className="h-4 w-4" />
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground mb-1">Previous Lesson</div>
                                <div className="font-medium max-w-[150px] md:max-w-[200px] truncate">{prev.title}</div>
                            </div>
                        </Button>
                    </Link>
                ) : (
                    <div />
                )}

                {next ? (
                    <Button
                        onClick={() => handleCompleteLesson(next)}
                        className="gap-2 h-auto py-4 px-6 bg-[#354fd2] hover:bg-[#2a3fca] text-white"
                        disabled={lesson.type === 'interview' && !enrollment?.completedLessons?.includes(lesson.id)}
                    >
                        <div className="text-right">
                            <div className="text-xs text-white/80 mb-1">Next Lesson</div>
                            <div className="font-medium max-w-[150px] md:max-w-[200px] truncate">{next.title}</div>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleCompleteLesson(null)}
                        disabled={
                            (lesson.challengeId && challengeProgress?.status !== 'completed') ||
                            (lesson.type === 'interview' && !enrollment?.completedLessons?.includes(lesson.id))
                        }
                        className={`gap-2 h-auto py-4 px-6 text-white ${(lesson.challengeId && challengeProgress?.status !== 'completed') ||
                            (lesson.type === 'interview' && !enrollment?.completedLessons?.includes(lesson.id))
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {lesson.challengeId && challengeProgress?.status !== 'completed' ? (
                            <span>Complete Challenge First</span>
                        ) : lesson.type === 'interview' && !enrollment?.completedLessons?.includes(lesson.id) ? (
                            <span>Pass Interview First</span>
                        ) : (
                            <span>Complete Track</span>
                        )}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
