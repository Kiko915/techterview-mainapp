"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Code, 
  Video, 
  Bot, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Trophy
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { getUserByUID } from "@/lib/firestore";

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
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
        <p className="text-gray-600">
          Ready to level up your interview skills? Here's your progress overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Challenges Completed
            </CardTitle>
            <Code className="h-4 w-4 text-[#354fd2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-green-600 mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mock Interviews
            </CardTitle>
            <Video className="h-4 w-4 text-[#354fd2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-green-600 mt-1">
              +3 this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Study Streak
            </CardTitle>
            <Trophy className="h-4 w-4 text-[#354fd2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <p className="text-xs text-gray-600 mt-1">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#354fd2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">78%</div>
            <p className="text-xs text-green-600 mt-1">
              +5% this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Activities</CardTitle>
            <CardDescription>Your latest progress and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-[#354fd2] rounded-full">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Completed "Array Manipulation" challenge
                </p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                +50 XP
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-600 rounded-full">
                <Video className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Mock Interview with AI completed
                </p>
                <p className="text-xs text-gray-600">Yesterday</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Score: 85%
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-600 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  AI Mentor session: "System Design Basics"
                </p>
                <p className="text-xs text-gray-600">2 days ago</p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Jump into your practice sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start h-12 bg-[#354fd2] hover:bg-[#2a3fa8] text-white">
              <Code className="h-5 w-5 mr-3" />
              Start Coding Challenge
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-[#354fd2] text-[#354fd2] hover:bg-[#354fd2] hover:text-white"
            >
              <Video className="h-5 w-5 mr-3" />
              Schedule Mock Interview
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            >
              <Bot className="h-5 w-5 mr-3" />
              Chat with AI Mentor
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <Target className="h-5 w-5 mr-3" />
              Continue Learning Path
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
          <CardDescription>Your scheduled sessions and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">System Design Interview</p>
                <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Daily Challenge</p>
                <p className="text-xs text-gray-600">Available now</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">AI Mentor Session</p>
                <p className="text-xs text-gray-600">Friday, 10:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}