"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  ArrowLeft,
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle,
  PlayCircle,
  Lock,
  Calendar,
  Target,
  Award
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { enrollUserInTrack, getUserEnrollment, getTrackEnrollmentCount } from "@/lib/firestore";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEnrollment } from "@/contexts/EnrollmentContext";
// TEMPORARILY DISABLED: Complex imports that might cause loops
// import { 
//   getTrackById, 
//   getTrackModules,
//   difficultyColors, 
//   trackColors, 
//   getTrackIcon,
//   getProgressPercentage 
// } from "../utils";

// Simple fallback functions to prevent loops
const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800", 
  "Advanced": "bg-red-100 text-red-800"
};

const getProgressPercentage = (completed, total) => {
  return total > 0 ? (completed / total) * 100 : 0;
};

// Helper functions for data fetching
const getSkillsByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend')) {
    return ['HTML', 'CSS', 'JavaScript', 'React'];
  } else if (titleLower.includes('backend')) {
    return ['Node.js', 'Express', 'MongoDB', 'APIs'];
  } else if (titleLower.includes('ui/ux') || titleLower.includes('design')) {
    return ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping'];
  }
  return ['Programming', 'Problem Solving'];
};

const getCategoryByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend') || titleLower.includes('backend')) {
    return 'Development';
  } else if (titleLower.includes('ui/ux') || titleLower.includes('design')) {
    return 'Design';
  }
  return 'General';
};

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateEnrollment, triggerRefresh } = useEnrollment();
  
  const [track, setTrack] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      if (!params.trackId) return;
      
      try {
        setLoading(true);
        
        // Fetch track details from Firebase
        const trackRef = doc(db, "tracks", params.trackId);
        const trackSnap = await getDoc(trackRef);
        
        if (trackSnap.exists()) {
          const data = trackSnap.data();
          
          // Get the real enrollment count from enrollments collection
          const realEnrollmentCount = await getTrackEnrollmentCount(params.trackId);
          
          // Transform Firebase data to component format
          const trackData = {
            id: trackSnap.id,
            title: data.title,
            description: data.description,
            imageUrl: data.image,
            difficulty: data.difficulty,
            duration: `${data.estimatedTime} hours`,
            enrolled: realEnrollmentCount, // Use real enrollment count
            skills: data.skills || getSkillsByTrack(data.title),
            category: getCategoryByTrack(data.title),
            createdAt: data.createdAt
          };
          
          setTrack(trackData);
          
          // Fetch modules from subcollection
          const modulesRef = collection(db, "tracks", params.trackId, "modules");
          const modulesSnap = await getDocs(modulesRef);
          
          const modulesData = [];
          modulesSnap.docs.forEach(doc => {
            const moduleData = doc.data();
            modulesData.push({
              id: doc.id,
              title: moduleData.title || `Module ${modulesData.length + 1}`,
              description: moduleData.description || "Learn the fundamentals",
              duration: moduleData.duration || "2-3 hours",
              lessons: moduleData.lessons || [
                { title: "Introduction", duration: "10 min" },
                { title: "Core Concepts", duration: "20 min" },
                { title: "Practice Questions", duration: "30 min" },
                { title: "Summary & Quiz", duration: "15 min" }
              ],
              order: moduleData.order || 0
            });
          });
          
          // Sort modules by order
          modulesData.sort((a, b) => a.order - b.order);
          setModules(modulesData);
          
        } else {
          console.error("Track not found");
          setTrack(null);
        }
        
      } catch (error) {
        console.error("Error fetching track data:", error);
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [params.trackId]); // FIXED: Minimal dependencies to prevent infinite loops

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && params.trackId) {
        try {
          const userEnrollment = await getUserEnrollment(user.uid, params.trackId);
          setIsEnrolled(!!userEnrollment);
          setEnrollment(userEnrollment);
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
    };

    checkEnrollment();
  }, [user, params.trackId]);

  // Function to refresh enrollment status (can be called from child components)
  const refreshEnrollmentStatus = async () => {
    if (user && params.trackId) {
      try {
        const userEnrollment = await getUserEnrollment(user.uid, params.trackId);
        setIsEnrolled(!!userEnrollment);
        setEnrollment(userEnrollment);
      } catch (error) {
        console.error("Error refreshing enrollment:", error);
      }
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this track.",
        variant: "destructive",
      });
      return;
    }

    try {
      setEnrolling(true);
      
      // Create enrollment in Firebase
      const enrollmentData = {
        trackTitle: track.title,
        enrolledAt: new Date(),
        progress: 0,
        completedModules: [],
        currentModule: modules[0]?.id || null
      };
      
      await enrollUserInTrack(user.uid, params.trackId, enrollmentData);
      
      // Update local state immediately
      setIsEnrolled(true);
      const newEnrollment = {
        ...enrollmentData,
        userId: user.uid,
        trackId: params.trackId
      };
      setEnrollment(newEnrollment);

      // Get the updated enrollment count from Firebase and update track data
      const updatedEnrollmentCount = await getTrackEnrollmentCount(params.trackId);
      setTrack(prevTrack => ({
        ...prevTrack,
        enrolled: updatedEnrollmentCount
      }));

      // Update enrollment context to sync with TrackCard components
      updateEnrollment(params.trackId, true, newEnrollment);
      
      // Trigger refresh for all components
      triggerRefresh();
      
      toast({
        title: "Successfully Enrolled!",
        description: `You've been enrolled in ${track.title}. Start learning now!`,
      });
      
    } catch (error) {
      console.error("Error enrolling user:", error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling you in this track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
        
        {/* Banner Skeleton */}
        <div className="aspect-[3/1] bg-gray-200 rounded-lg animate-pulse"></div>
        
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Track Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The track you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard/interview-tracks")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tracks
        </Button>
      </div>
    );
  }

  const completedModulesCount = enrollment?.completedModules?.length || 0;
  const progressPercentage = getProgressPercentage(completedModulesCount, modules.length);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.push("/dashboard/interview-tracks")}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Interview Tracks
      </Button>

      {/* Track Image */}
      <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-lg">
        {track.imageUrl ? (
          <Image
            src={track.imageUrl}
            alt={track.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <BookOpen className="h-24 w-24 text-white/80" />
          </div>
        )}
      </div>

      {/* Track Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={`${difficultyColors[track.difficulty]} border-0`}>
            {track.difficulty}
          </Badge>
          <Badge className="bg-[#354fd2]/10 text-[#354fd2] border-0">
            {track.category}
          </Badge>
        </div>
        
        <h1 className="text-4xl font-playfair font-bold text-gray-900 dark:text-white">
          {track.title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl leading-relaxed">
          {track.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Track Stats */}
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
                    {modules.length}
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

          {/* Modules */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
              
              <Accordion type="single" collapsible className="w-full">
                {modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          enrollment?.completedModules?.includes(module.id)
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                            : enrollment?.currentModule === module.id
                            ? 'bg-[#354fd2] text-white'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {enrollment?.completedModules?.includes(module.id) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{module.title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-11 space-y-3">
                        {module.description && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-[#354fd2]">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {module.description}
                            </p>
                          </div>
                        )}
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <PlayCircle className="h-4 w-4 text-[#354fd2]" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{lesson.title}</div>
                                {lesson.duration && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {lesson.duration}
                                  </div>
                                )}
                              </div>
                              {lesson.isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-600 dark:text-gray-400 text-sm italic">
                            Lessons will be available soon
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
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
                  
                  <Button className="w-full bg-[#354fd2] hover:bg-[#2a3fa8]" onClick={() => {
                    // You can navigate to the first incomplete module or just stay on this page
                    const firstIncompleteModule = modules.find(module => 
                      !enrollment?.completedModules?.includes(module.id)
                    );
                    if (firstIncompleteModule) {
                      // For now, we'll just show a toast about starting the first module
                      toast({
                        title: "Ready to Learn!",
                        description: `Starting with: ${firstIncompleteModule.title}`,
                      });
                    }
                  }}>
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
                    onClick={handleEnrollment}
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
        </div>
      </div>
    </div>
  );
}