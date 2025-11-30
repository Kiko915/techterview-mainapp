"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getUserStats } from '@/lib/firestore_modules/stats';
import { getUserInterviews } from '@/lib/firestore_modules/interviews';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2 } from 'lucide-react';

// Import Modular Components
import OverviewCards from './components/OverviewCards';
import PerformanceChart from './components/PerformanceChart';
import TopicRadarChart from './components/TopicRadarChart';
import ScoreDistributionChart from './components/ScoreDistributionChart';
import ActivityPieChart from './components/ActivityPieChart';
import ActivityHeatmap from './components/ActivityHeatmap';
import AIProgressAnalysis from './components/AIProgressAnalysis';

export default function ProgressPage() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [timeRange, setTimeRange] = useState("all"); // all, 7d, 30d, 6m

    // Processed Data States
    const [performanceData, setPerformanceData] = useState([]);
    const [topicData, setTopicData] = useState([]);
    const [activityData, setActivityData] = useState({});
    const [scoreDistribution, setScoreDistribution] = useState([]);
    const [activityBreakdown, setActivityBreakdown] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [userStats, userInterviews] = await Promise.all([
                    getUserStats(user.uid),
                    getUserInterviews(user.uid)
                ]);

                setStats(userStats);
                setInterviews(userInterviews);
            } catch (error) {
                console.error("Error fetching progress data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) fetchData();
    }, [user, authLoading]);

    // Recalculate data when interviews or timeRange changes
    useEffect(() => {
        if (!stats || !interviews) return;

        const now = new Date();
        const filterDate = new Date();

        if (timeRange === "7d") filterDate.setDate(now.getDate() - 7);
        if (timeRange === "30d") filterDate.setDate(now.getDate() - 30);
        if (timeRange === "6m") filterDate.setMonth(now.getMonth() - 6);
        if (timeRange === "all") filterDate.setFullYear(1970); // Effectively all time

        const filteredInterviews = interviews.filter(i => {
            const date = new Date(i.createdAt.seconds * 1000);
            return date >= filterDate;
        });

        // 1. Performance Trend
        const trend = filteredInterviews
            .filter(i => i.feedback?.score)
            .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
            .map(i => ({
                date: new Date(i.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: i.feedback.score,
                role: i.targetRole
            }));
        setPerformanceData(trend);

        // 2. Topic Breakdown
        const topics = {};
        filteredInterviews.forEach(i => {
            if (i.feedback?.score) {
                const role = i.targetRole || "General";
                if (!topics[role]) topics[role] = { total: 0, count: 0 };
                topics[role].total += i.feedback.score;
                topics[role].count += 1;
            }
        });
        const topicRadar = Object.keys(topics).map(role => ({
            subject: role,
            A: Math.round(topics[role].total / topics[role].count),
            fullMark: 100
        }));
        setTopicData(topicRadar);

        // 3. Score Distribution
        const distribution = [
            { range: '0-20', count: 0 },
            { range: '21-40', count: 0 },
            { range: '41-60', count: 0 },
            { range: '61-80', count: 0 },
            { range: '81-100', count: 0 },
        ];
        filteredInterviews.forEach(i => {
            const score = i.feedback?.score || 0;
            if (score <= 20) distribution[0].count++;
            else if (score <= 40) distribution[1].count++;
            else if (score <= 60) distribution[2].count++;
            else if (score <= 80) distribution[3].count++;
            else distribution[4].count++;
        });
        setScoreDistribution(distribution);

        // 4. Activity Breakdown (Pie Chart)
        const breakdown = [
            { name: 'Interviews', value: stats.interviewsCompleted || 0 },
            { name: 'Challenges', value: stats.challengesCompleted || 0 },
            { name: 'Lessons', value: stats.lessonsCompleted || 0 },
        ].filter(item => item.value > 0);
        setActivityBreakdown(breakdown);


        // 5. Activity Heatmap (Always All Time for context)
        const activityMap = {};
        interviews.forEach(i => {
            const date = new Date(i.createdAt.seconds * 1000).toISOString().split('T')[0];
            activityMap[date] = (activityMap[date] || 0) + 1;
        });
        if (stats.recentActivity) {
            stats.recentActivity.forEach(a => {
                if (a.date) {
                    const date = new Date(a.date).toISOString().split('T')[0];
                    activityMap[date] = (activityMap[date] || 0) + 1;
                }
            });
        }
        setActivityData(activityMap);

    }, [stats, interviews, timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-playfair flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        My Progress
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Track your growth, consistency, and skill mastery over time.
                    </p>
                </div>
                <div className="w-full md:w-[200px]">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="6m">Last 6 Months</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Overview Cards */}
            <OverviewCards stats={stats} />

            {/* AI Analysis */}
            <AIProgressAnalysis user={user} stats={stats} performanceData={performanceData} topicData={topicData} />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Performance Trend */}
                <PerformanceChart data={performanceData} />

                {/* Topic Breakdown */}
                <TopicRadarChart data={topicData} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Score Distribution */}
                <ScoreDistributionChart data={scoreDistribution} />

                {/* Activity Breakdown */}
                <ActivityPieChart data={activityBreakdown} />
            </div>

            {/* Activity Heatmap */}
            <ActivityHeatmap data={activityData} />
        </div>
    );
}
