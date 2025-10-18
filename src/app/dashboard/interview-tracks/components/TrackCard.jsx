"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Users, 
  BookOpen, 
  ArrowRight,
  PlayCircle,
  Lock,
  Star,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { getUserEnrollment, getTrackEnrollmentCount } from "@/lib/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { 
  difficultyColors, 
  trackColors, 
  getTrackIcon, 
  getProgressPercentage 
} from "../utils";

export default function TrackCard({ 
  track, 
  isRecommended = false, 
  className = "",
  onEnrollmentChange // New prop to handle enrollment updates
}) {
  const { user } = useAuth();
  const { getEnrollmentStatus, updateEnrollment, refreshTrigger } = useEnrollment();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualModulesCount, setActualModulesCount] = useState(track.modules || 0);
  const [enrollmentCount, setEnrollmentCount] = useState(track.enrolled || 0);

  // Fetch actual modules count from Firebase
  useEffect(() => {
    const fetchModulesCount = async () => {
      if (track.id) {
        try {
          const modulesRef = collection(db, "tracks", track.id, "modules");
          const modulesSnap = await getDocs(modulesRef);
          setActualModulesCount(modulesSnap.docs.length);
        } catch (error) {
          console.error("Error fetching modules count:", error);
          // Fall back to track.modules if Firebase fetch fails
          setActualModulesCount(track.modules || 0);
        }
      }
    };

    fetchModulesCount();
  }, [track.id, track.modules]);

  // Fetch actual enrollment count from Firebase
  useEffect(() => {
    const fetchEnrollmentCount = async () => {
      if (track.id) {
        try {
          const count = await getTrackEnrollmentCount(track.id);
          setEnrollmentCount(count);
        } catch (error) {
          console.error("Error fetching enrollment count:", error);
          // Fall back to track.enrolled if Firebase fetch fails
          setEnrollmentCount(track.enrolled || 0);
        }
      }
    };

    fetchEnrollmentCount();
  }, [track.id, track.enrolled]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && track.id) {
        try {
          // First check context for cached enrollment
          const cachedEnrollment = getEnrollmentStatus(track.id);
          if (cachedEnrollment.isEnrolled && cachedEnrollment.data) {
            setIsEnrolled(true);
            setEnrollment(cachedEnrollment.data);
            setLoading(false);
            return;
          }

          // If not in context, fetch from Firebase
          const userEnrollment = await getUserEnrollment(user.uid, track.id);
          const enrolledStatus = !!userEnrollment;
          setIsEnrolled(enrolledStatus);
          setEnrollment(userEnrollment);
          
          // Update context with fresh data
          updateEnrollment(track.id, enrolledStatus, userEnrollment);
          
          // Notify parent component of enrollment status if callback provided
          if (onEnrollmentChange) {
            onEnrollmentChange(track.id, enrolledStatus, userEnrollment);
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
      setLoading(false);
    };

    checkEnrollment();
  }, [user, track.id, onEnrollmentChange, getEnrollmentStatus, updateEnrollment, refreshTrigger]);

  // Use enrollment data if available, otherwise fall back to track data
  const completedModules = enrollment?.completedModules?.length || 0;
  const totalModules = actualModulesCount;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden ${
      isRecommended 
        ? "border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50" 
        : ""
    } ${className}`}>
      {/* Track Image */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {track.imageUrl ? (
          <Image
            src={track.imageUrl}
            alt={track.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to gradient background if image fails
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${trackColors[track.color] || trackColors.blue} flex items-center justify-center`}>
            {getTrackIcon(track.category)}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-emerald-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </div>
        )}

        {/* Difficulty Badge */}
        <div className={`absolute top-3 ${isRecommended ? 'right-3' : 'left-3'}`}>
          <Badge className={`${difficultyColors[track.difficulty]} border-0`}>
            {track.difficulty}
          </Badge>
        </div>

        {/* Lock indicator */}
        {track.isLocked && (
          <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full">
            <Lock className="h-4 w-4 text-white" />
          </div>
        )}

        {/* Progress indicator if started */}
        {completedModules > 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/50 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between text-white text-sm mb-1">
                <span>Progress</span>
                <span>{completedModules}/{totalModules}</span>
              </div>
              <Progress 
                value={getProgressPercentage(completedModules, totalModules)}
                className="h-2"
              />
            </div>
          </div>
        )}  
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Description */}
          <div>
            <h3 className={`font-bold text-lg mb-2 transition-colors ${
              isRecommended 
                ? "text-gray-900 dark:text-white group-hover:text-emerald-600" 
                : "text-gray-900 group-hover:text-[#354fd2]"
            }`}>
              {track.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {track.description}
            </p>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1">
            {track.skills?.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                {skill}
              </Badge>
            ))}
            {track.skills?.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                +{track.skills.length - 3} more
              </Badge>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{track.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{actualModulesCount} modules</span>
            </div>
            {enrollmentCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{enrollmentCount?.toLocaleString()} enrolled</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            asChild 
            className={`w-full transition-colors ${
              track.isLocked 
                ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                : isEnrolled
                  ? completedModules > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                  : isRecommended
                    ? 'bg-emerald-600 hover:bg-emerald-700 group-hover:bg-emerald-700'
                    : 'bg-[#354fd2] hover:bg-[#2a3fa8] group-hover:bg-[#2a3fa8]'
            }`}
            disabled={track.isLocked || loading}
          >
            {track.isLocked ? (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Locked
              </span>
            ) : loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </span>
            ) : isEnrolled ? (
              completedModules > 0 ? (
                <Link href={`/dashboard/interview-tracks/${track.id}`} className="flex items-center justify-center gap-2 w-full">
                  <PlayCircle className="h-4 w-4" />
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link href={`/dashboard/interview-tracks/${track.id}`} className="flex items-center justify-center gap-2 w-full">
                  <CheckCircle className="h-4 w-4" />
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )
            ) : (
              <Link href={`/dashboard/interview-tracks/${track.id}`} className="flex items-center justify-center gap-2 w-full">
                View Track
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}