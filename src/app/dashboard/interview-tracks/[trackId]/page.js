"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { enrollUserInTrack, getUserEnrollment, getTrackEnrollmentCount } from "@/lib/firestore";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEnrollment } from "@/contexts/EnrollmentContext";

// Import modular components
import TrackHeader from "./components/TrackHeader";
import TrackStats from "./components/TrackStats";
import TrackModules from "./components/TrackModules";
import EnrollmentSidebar from "./components/EnrollmentSidebar";

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

const getProgressPercentage = (completed, total) => {
  return total > 0 ? (completed / total) * 100 : 0;
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
  }, [params.trackId]);

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
      const newEnrollmentData = {
        completedModules: [],
        completedLessons: [],
        progress: 0,
        lastAccessed: new Date()
      };

      // Save to Firestore
      await enrollUserInTrack(user.uid, params.trackId, newEnrollmentData);

      // Create full enrollment object for local state
      const newEnrollment = {
        userId: user.uid,
        trackId: params.trackId,
        enrolledAt: new Date(),
        ...newEnrollmentData
      };

      setEnrollment(newEnrollment);
      setIsEnrolled(true);

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

  const handleContinueLearning = () => {
    if (!enrollment || !modules.length) return;

    // Find the first module that is NOT completed
    const currentModule = modules.find(module =>
      !enrollment.completedModules?.includes(module.id)
    );

    // If a current (incomplete) module is found, go to its first lesson
    // If all are completed (currentModule is undefined), default to the first module
    const targetModule = currentModule || modules[0];

    if (targetModule && targetModule.lessons && targetModule.lessons.length > 0) {
      const targetLesson = targetModule.lessons[0];
      router.push(`/dashboard/interview-tracks/${params.trackId}/modules/${targetModule.id}/lesson/${targetLesson.id}`);
    } else {
      toast({
        title: "No lessons found",
        description: "Unable to find a lesson to continue.",
        variant: "destructive",
      });
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

      {/* Track Header Component */}
      <TrackHeader track={track} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Track Stats Component */}
          <TrackStats track={track} modulesCount={modules.length} />

          {/* Track Modules Component */}
          <TrackModules
            modules={modules}
            enrollment={enrollment}
            trackId={params.trackId}
            isEnrolled={isEnrolled}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Sidebar Component */}
          <EnrollmentSidebar
            track={track}
            modules={modules}
            isEnrolled={isEnrolled}
            enrollment={enrollment}
            enrolling={enrolling}
            onEnrollment={handleEnrollment}
            onContinueLearning={handleContinueLearning}
          />
        </div>
      </div>
    </div>
  );
}