"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  PlayCircle,
  Award,
  Calendar,
  Target
} from "lucide-react";

const getProgressPercentage = (completed, total) => {
  return total > 0 ? (completed / total) * 100 : 0;
};

export default function EnrollmentSidebar({ 
  track,
  modules,
  isEnrolled,
  enrollment,
  enrolling,
  onEnrollment,
  onContinueLearning
}) {
  if (!track) return null;

  const completedModulesCount = enrollment?.completedModules?.length || 0;
  const progressPercentage = getProgressPercentage(completedModulesCount, modules.length);

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        {isEnrolled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Enrolled</span>
            </div>
            
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{completedModulesCount}/{modules.length} modules</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <Button 
              className="w-full bg-[#354fd2] hover:bg-[#2a3fa8]" 
              onClick={onContinueLearning}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enroll now to access all modules and track your progress.
              </p>
            </div>
            
            <Button 
              onClick={onEnrollment}
              disabled={enrolling}
              className="w-full bg-[#354fd2] hover:bg-[#2a3fa8]"
            >
              {enrolling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Enroll Now
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Target className="h-4 w-4" />
              <span>Interview preparation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Award className="h-4 w-4" />
              <span>Certificate of completion</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}