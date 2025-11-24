"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Code,
  Video,
  Bot,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Trophy,
  Flame,
  Star,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Zap
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import {
  getUserByUID,
  getUserStats,
  getUserEnrollments,
  getNextLessonForUser,
  getAllChallenges,
  getUserCompletedChallenges
} from "@/lib/firestore";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import DashboardSkeleton from "./components/DashboardSkeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    streak: 0,
    totalXP: 0,
    challengesCompleted: 0,
    interviewsCompleted: 0,
    recentActivity: []
  });
  const [upcoming, setUpcoming] = useState({
    nextLesson: null,
    dailyChallenge: null,
    recommendedTopic: null
  });
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const [profile, userStats, userEnrollments, nextLesson, allChallenges, completedIds] = await Promise.all([
            getUserByUID(user.uid),
            getUserStats(user.uid),
            getUserEnrollments(user.uid),
            getNextLessonForUser(user.uid),
            getAllChallenges(),
            getUserCompletedChallenges(user.uid)
          ]);

          setUserProfile(profile);
          if (userStats) setStats(userStats);
          if (userEnrollments) setEnrollments(userEnrollments);

          // Setup Upcoming Data
          const uncompletedChallenges = allChallenges.filter(c => !completedIds.includes(c.id));
          const randomChallenge = uncompletedChallenges.length > 0
            ? uncompletedChallenges[Math.floor(Math.random() * uncompletedChallenges.length)]
            : null;

          const interviewTopics = ["System Design", "Behavioral", "Algorithms", "Frontend Architecture", "Database Design"];
          const randomTopic = interviewTopics[Math.floor(Math.random() * interviewTopics.length)];

          setUpcoming({
            nextLesson,
            dailyChallenge: randomChallenge,
            recommendedTopic: randomTopic
          });

        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const userName = userProfile?.displayName || userProfile?.username || user?.email?.split('@')[0] || 'User';
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

  const overallProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrollments.length)
    : 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      {/* Greeting Card */}
      <div className="p-6">
        <Card className="bg-gradient-to-r from-[#354fd2] to-[#4a5fb8] text-white border-0 shadow-lg rounded-2xl overflow-hidden relative">
          {/* DottedGlowBackground Effect */}
          <DottedGlowBackground
            className="pointer-events-none opacity-25"
            opacity={1}
            gap={15}
            radius={2}
            color="rgba(255, 255, 255, 0.3)"
            glowColor="rgba(173, 216, 230, 0.8)"
            backgroundOpacity={0}
            speedMin={0.1}
            speedMax={0.6}
            speedScale={0.3}
          />

          {/* Background Logo */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-8 hidden md:block z-20">
            <Image
              src="/logo/techterview_symbol_colored.png"
              alt="TechTerview Background"
              width={180}
              height={180}
              className="object-contain filter brightness-200"
            />
          </div>

          <CardContent className="p-8 relative z-30">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-medium">{greeting},</p>
                <h1 className="text-3xl font-bold">{userName}!</h1>
                <p className="text-white/90 text-base mt-3 max-w-md">
                  Ready to ace your next technical interview? Let's get started.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <Flame className="h-4 w-4 text-orange-300" />
                    <span className="text-sm font-medium">{stats.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <Star className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{stats.totalXP.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#354fd2] rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.challengesCompleted}</p>
                <p className="text-sm text-gray-600">Challenges</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#354fd2] rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsCompleted}</p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#354fd2] rounded-lg">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#354fd2] rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/dashboard/coding-challenge"
                className="flex items-center justify-start w-full h-10 px-4 py-2 bg-[#354fd2] hover:bg-[#2a3fa8] text-white rounded-md text-sm font-medium transition-colors"
              >
                <Code className="h-4 w-4 mr-2" />
                Start Challenge
              </Link>

              <Link
                href="/dashboard/mock-interviews"
                className="flex items-center justify-start w-full h-10 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                <Video className="h-4 w-4 mr-2" />
                Mock Interview
              </Link>

              <Link
                href="/dashboard/ai-mentor"
                className="flex items-center justify-start w-full h-10 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Mentor
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-[#354fd2] rounded-lg">
                      {activity.type === 'challenge' ? <Code className="h-4 w-4 text-white" /> :
                        activity.type === 'interview' ? <Video className="h-4 w-4 text-white" /> :
                          <Bot className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {activity.type === 'challenge' ? 'Coding Challenge' :
                          activity.type === 'interview' ? 'Mock Interview' : 'Quiz Completed'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <Badge className={`
                      ${activity.type === 'challenge' ? 'bg-green-100 text-green-700' :
                        activity.type === 'interview' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                    `}>
                      {activity.type === 'challenge' ? '+50 XP' :
                        activity.type === 'interview' ? '+100 XP' : '+20 XP'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Next Lesson */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {upcoming.nextLesson ? 'Continue Learning' : 'Start a Track'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {upcoming.nextLesson
                      ? `${upcoming.nextLesson.trackTitle}: ${upcoming.nextLesson.title}`
                      : 'Enroll in a track to get started'}
                  </p>
                </div>
                {upcoming.nextLesson && (
                  <Link href={`/dashboard/interview-tracks/${upcoming.nextLesson.trackId}/modules/${upcoming.nextLesson.moduleId}/lesson/${upcoming.nextLesson.lessonId}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Daily Challenge */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Daily Challenge</p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {upcoming.dailyChallenge ? upcoming.dailyChallenge.title : 'All caught up!'}
                  </p>
                </div>
                {upcoming.dailyChallenge && (
                  <Link href={`/dashboard/coding-challenge/${upcoming.dailyChallenge.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Recommended Practice */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Recommended Practice</p>
                  <p className="text-xs text-gray-500">
                    {upcoming.recommendedTopic ? `${upcoming.recommendedTopic} Interview` : 'Mock Interview'}
                  </p>
                </div>
                <Link href="/dashboard/mock-interviews">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}