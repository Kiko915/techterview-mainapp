"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Trophy, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { getUserInterviews } from '@/lib/firestore_modules/interviews';
import { Skeleton } from "@/components/ui/skeleton";

const StatsSection = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSessions: 0,
        avgScore: 0,
        timeSpoken: "0m",
        latestScore: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                const interviews = await getUserInterviews(user.uid);

                // 1. Total Sessions
                const totalSessions = interviews.length;

                // 2. Average Score
                const scoredInterviews = interviews.filter(i => i.feedback?.score);
                const totalScore = scoredInterviews.reduce((acc, curr) => acc + (curr.feedback?.score || 0), 0);
                const avgScore = scoredInterviews.length > 0 ? Math.round(totalScore / scoredInterviews.length) : 0;

                // 3. Time Spoken (Duration)
                const totalDurationSeconds = interviews.reduce((acc, curr) => acc + (curr.duration || 0), 0);
                const hours = Math.floor(totalDurationSeconds / 3600);
                const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
                const timeSpoken = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                // 4. Latest Score (or Streak - let's stick to Latest Score for now as it's more relevant to the data we have)
                // Actually, the UI had "Current Streak". Calculating streak is harder without daily data.
                // Let's replace "Current Streak" with "Latest Score" for now, or keep it as a placeholder if we can't calculate it easily.
                // Or we can calculate a simple streak based on consecutive days with interviews.
                // Let's try to calculate a simple streak.

                // Sort by date descending
                const sortedInterviews = [...interviews].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

                let streak = 0;
                if (sortedInterviews.length > 0) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Check if there's an interview today
                    const lastInterviewDate = new Date(sortedInterviews[0].createdAt?.seconds * 1000);
                    lastInterviewDate.setHours(0, 0, 0, 0);

                    if (lastInterviewDate.getTime() === today.getTime()) {
                        streak = 1;
                    }

                    // This is a very basic streak check. For a real streak, we'd need to check consecutive days.
                    // For now, let's just show "Latest Score" as it's more robust with the current data.
                    // The user asked for "real data", so replacing a fake streak with a real latest score is better.
                }

                const latestScore = sortedInterviews.length > 0 && sortedInterviews[0].feedback?.score
                    ? sortedInterviews[0].feedback.score
                    : 0;

                setStats({
                    totalSessions,
                    avgScore,
                    timeSpoken,
                    latestScore
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    const statItems = [
        {
            title: "Total Sessions",
            value: stats.totalSessions,
            icon: Video,
            description: "Lifetime sessions",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Avg Score",
            value: `${stats.avgScore}%`,
            icon: Trophy,
            description: "Across all modules",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10"
        },
        {
            title: "Time Spoken",
            value: stats.timeSpoken,
            icon: Clock,
            description: "Total practice time",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Latest Score", // Changed from Current Streak
            value: `${stats.latestScore}%`,
            icon: Zap,
            description: "Most recent session",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ];

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-2" />
                            <Skeleton className="h-3 w-[80px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {statItems.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsSection;
