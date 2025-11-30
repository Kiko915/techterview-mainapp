"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getUserStats } from '@/lib/firestore_modules/stats';
import { getUserInterviews } from '@/lib/firestore_modules/interviews';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Flame, Target, Calendar, TrendingUp, Activity, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Loader2 } from 'lucide-react';

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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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

    // Heatmap Helper
    const renderHeatmap = () => {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const weeks = [];
        let currentDate = new Date(oneYearAgo);

        // Align to Sunday
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());

        while (currentDate <= today) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const count = activityData[dateStr] || 0;
                let colorClass = "bg-slate-100"; // Default (0)
                if (count >= 1) colorClass = "bg-green-200";
                if (count >= 3) colorClass = "bg-green-400";
                if (count >= 5) colorClass = "bg-green-600";
                if (count >= 8) colorClass = "bg-green-800";

                week.push(
                    <div
                        key={dateStr}
                        className={`w-3 h-3 rounded-sm ${colorClass}`}
                        title={`${dateStr}: ${count} activities`}
                    />
                );
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(<div key={currentDate.toISOString()} className="flex flex-col gap-1">{week}</div>);
        }

        return (
            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks}
            </div>
        );
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 font-medium">Total XP</p>
                            <h3 className="text-3xl font-bold mt-1">{stats?.totalXP || 0}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 font-medium">Current Streak</p>
                            <h3 className="text-3xl font-bold mt-1">{stats?.streak || 0} Days</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-medium">Interviews</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.interviewsCompleted || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-medium">Challenges</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.challengesCompleted || 0}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Performance Trend */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Performance Trend</CardTitle>
                        <CardDescription>Your interview scores over the selected period</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Topic Breakdown */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Topic Mastery</CardTitle>
                        <CardDescription>Average score by topic</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#2563eb"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Score Distribution */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChartIcon className="w-5 h-5 text-slate-500" />
                            Score Distribution
                        </CardTitle>
                        <CardDescription>Frequency of your interview scores</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="range" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activity Breakdown */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-slate-500" />
                            Activity Breakdown
                        </CardTitle>
                        <CardDescription>Distribution of your learning activities</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activityBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {activityBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Heatmap */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        Activity Log
                    </CardTitle>
                    <CardDescription>Your daily contribution activity over the last year</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2 mb-2 text-xs text-slate-500 justify-end">
                        <span>Less</span>
                        <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                        <span>More</span>
                    </div>
                    {renderHeatmap()}
                </CardContent>
            </Card>
        </div>
    );
}
