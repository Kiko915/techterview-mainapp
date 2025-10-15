"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Version } from "@/components/ui/version";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Mail,
  FileText,
  Shield,
  Info,
  ExternalLink,
  Palette,
  BellRing,
  ScrollText
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [interviewReminders, setInterviewReminders] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-playfair">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your preferences and account settings</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#354fd2]" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how TechTerview looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Currently using Light mode. Dark mode and system theme support coming soon.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Light Theme Option */}
                  <div 
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === "light" 
                        ? "border-[#354fd2] bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Sun className={`h-5 w-5 ${theme === "light" ? "text-[#354fd2]" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${theme === "light" ? "text-[#354fd2]" : "text-gray-900"}`}>
                          Light
                        </p>
                        <p className="text-sm text-gray-600">
                          Clean and bright
                        </p>
                      </div>
                    </div>
                    {theme === "light" && (
                      <div className="absolute top-2 right-2">
                        <div className="h-2 w-2 rounded-full bg-[#354fd2]"></div>
                      </div>
                    )}
                  </div>

                  {/* Dark Theme Option */}
                  <div 
                    className="relative rounded-lg border-2 p-4 border-gray-200 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Moon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-400">
                            Dark
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          Easy on the eyes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* System Theme Option */}
                  <div 
                    className="relative rounded-lg border-2 p-4 border-gray-200 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Monitor className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-400">
                            System
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          Match device
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Theme Notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        More Themes Coming Soon
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Dark mode and system theme options will be available in future updates. We're working on bringing you a personalized viewing experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-[#354fd2]" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive updates and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Interview Reminders */}
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="interview-reminders" className="text-base font-medium">
                      Interview Reminders
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get notified before your scheduled mock interviews
                  </p>
                </div>
                <Switch
                  id="interview-reminders"
                  checked={interviewReminders}
                  onCheckedChange={setInterviewReminders}
                  disabled
                />
              </div>

              <Separator />

              {/* Email Updates */}
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email-updates" className="text-base font-medium">
                      Email Updates
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Receive progress updates and platform news via email
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                  disabled
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Notification Settings Coming Soon
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Notification preferences will be available in future updates. We're working on bringing you personalized alerts and reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-[#354fd2]" />
              About
            </CardTitle>
            <CardDescription>
              App information, legal documents, and version details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Legal Links */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Legal & Privacy</h4>
                  <div className="space-y-3">
                    <Link 
                      href="/terms" 
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Terms of Use</p>
                          <p className="text-sm text-gray-600">Read our terms and conditions</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                    
                    <Link 
                      href="/privacy" 
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Privacy Policy</p>
                          <p className="text-sm text-gray-600">How we handle your data</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  </div>
                </div>

                <Separator />

                {/* App Version */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">App Information</h4>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#354fd2] rounded-lg">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">App Version</p>
                        <p className="text-sm text-gray-600">Current release information</p>
                      </div>
                    </div>
                    <Version className="text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Built with ❤️ by the TechTerview team
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    © 2024 TechTerview. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}