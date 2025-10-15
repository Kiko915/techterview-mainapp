"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award } from "lucide-react";

export default function AchievementsTab({ achievements }) {
  return (
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
  );
}