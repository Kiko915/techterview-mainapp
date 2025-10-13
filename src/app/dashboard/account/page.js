"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Lock,
  Award,
  Edit,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Mail,
  AtSign,
  Flag
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log("Password update:", passwordData);
    // Handle password update logic here
  };

  // Sample achievements data
  const achievements = [
    {
      emoji: "🥇",
      title: "First Login",
      description: "Welcome to TechTerview!",
      earned: true
    },
    {
      emoji: "💻",
      title: "Profile Completed",
      description: "You've filled out your personal info.",
      earned: true
    },
    {
      emoji: "🎯",
      title: "First Mock Interview",
      description: "You've taken your first challenge.",
      earned: true
    },
    {
      emoji: "🔥",
      title: "3-Day Streak",
      description: "You've been active for 3 consecutive days.",
      earned: false
    },
    {
      emoji: "🚀",
      title: "Explorer",
      description: "You tried a coding test for the first time.",
      earned: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('personal')}
                className={`w-full justify-start ${
                  activeTab === 'personal'
                    ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                    : 'hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Personal Information
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('security')}
                className={`w-full justify-start ${
                  activeTab === 'security'
                    ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Lock className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('achievements')}
                className={`w-full justify-start ${
                  activeTab === 'achievements'
                    ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Button>
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/avatars/user.png" alt="Profile" />
                      <AvatarFallback className="text-2xl bg-[#354fd2] text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#354fd2] hover:bg-[#2a3fa8]">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Recommended: Square image, at least 400x400px
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="johndoe@gmail.com" 
                        className="pl-10"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="johndoe17" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="Candidate" 
                        className="pl-10"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Joined Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="10/14/2025" 
                        className="pl-10"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="Philippines" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        defaultValue="588 P. Burgos Street, Liliw, Laguna" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-start">
                  <Button className="bg-[#354fd2] hover:bg-[#2a3fa8]">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
                <Separator />
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 pr-10"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 pr-10"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 pr-10"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="bg-[#354fd2] hover:bg-[#2a3fa8]">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'achievements' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Your milestones and accomplishments on TechTerview
                </CardDescription>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card 
                      key={index} 
                      className={`p-4 ${
                        achievement.earned 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {achievement.title}
                            </h4>
                            {achievement.earned && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                Earned
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}