"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";

export default function TrackStats({ track, modulesCount }) {
  if (!track) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Track Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="h-6 w-6 text-[#354fd2] mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {track.duration}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duration
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpen className="h-6 w-6 text-[#354fd2] mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {modulesCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Modules
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="h-6 w-6 text-[#354fd2] mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {track.enrolled?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Enrolled
            </div>
          </div>
        </div>
        
        {/* Skills */}
        {track.skills && track.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Skills You'll Learn
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-[#354fd2]/10 text-[#354fd2] hover:bg-[#354fd2]/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}