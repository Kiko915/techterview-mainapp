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
import { getUserByUID } from "@/lib/firestore";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserByUID(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const userName = userProfile?.displayName || userProfile?.username || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

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
                    <span className="text-sm font-medium">15 day streak</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <Star className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">2,450 XP</span>
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
                <p className="text-2xl font-bold text-gray-900">24</p>
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
                <p className="text-2xl font-bold text-gray-900">8</p>
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
                <p className="text-2xl font-bold text-gray-900">15</p>
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
                <p className="text-2xl font-bold text-gray-900">78%</p>
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
                href="/challenges"
                className="flex items-center justify-start w-full h-10 px-4 py-2 bg-[#354fd2] hover:bg-[#2a3fa8] text-white rounded-md text-sm font-medium transition-colors"
              >
                <Code className="h-4 w-4 mr-2" />
                Start Challenge
              </Link>
              
              <Link 
                href="/mock-interviews"
                className="flex items-center justify-start w-full h-10 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                <Video className="h-4 w-4 mr-2" />
                Mock Interview
              </Link>
              
              <Link 
                href="/ai-mentor"
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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Array Challenge</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <Badge className="bg-green-100 text-green-700">+50 XP</Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Mock Interview</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">85%</Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">AI Session</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <Badge className="bg-gray-100 text-gray-700">Done</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">System Design</p>
                  <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Daily Challenge</p>
                  <p className="text-xs text-gray-500">Available now</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#354fd2] rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">AI Mentor</p>
                  <p className="text-xs text-gray-500">Friday, 10:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}