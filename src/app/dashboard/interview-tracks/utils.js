
import {
  BookOpen,
  Code,
  Database,
  Smartphone,
  Globe,
  Server,
  Brain,
  Target
} from "lucide-react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Difficulty color mappings
export const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400",
  "Intermediate": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
  "Advanced": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
};

// Track color gradients
export const trackColors = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  indigo: "from-indigo-500 to-indigo-600",
  orange: "from-orange-500 to-orange-600"
};

// Get skills based on track title
export const getSkillsByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend')) {
    return ['HTML', 'CSS', 'JavaScript', 'React'];
  } else if (titleLower.includes('backend')) {
    return ['Node.js', 'Express', 'MongoDB', 'APIs'];
  } else if (titleLower.includes('ui/ux') || titleLower.includes('design')) {
    return ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping'];
  } else if (titleLower.includes('data') || titleLower.includes('algorithm')) {
    return ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'];
  } else if (titleLower.includes('mobile')) {
    return ['React Native', 'Flutter', 'iOS', 'Android'];
  } else if (titleLower.includes('devops') || titleLower.includes('cloud')) {
    return ['Docker', 'Kubernetes', 'AWS', 'CI/CD'];
  }
  return ['Programming', 'Problem Solving'];
};

// Get color based on track title
export const getColorByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend')) return 'blue';
  if (titleLower.includes('backend')) return 'green';
  if (titleLower.includes('ui/ux') || titleLower.includes('design')) return 'purple';
  if (titleLower.includes('data') || titleLower.includes('algorithm')) return 'red';
  if (titleLower.includes('mobile')) return 'indigo';
  if (titleLower.includes('devops') || titleLower.includes('cloud')) return 'orange';
  return 'blue'; // default
};

// Get category based on track title
export const getCategoryByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('mobile')) {
    return 'Development';
  } else if (titleLower.includes('ui/ux') || titleLower.includes('design')) {
    return 'Design';
  } else if (titleLower.includes('data') || titleLower.includes('algorithm')) {
    return 'Computer Science';
  } else if (titleLower.includes('system') || titleLower.includes('architecture')) {
    return 'Architecture';
  } else if (titleLower.includes('devops') || titleLower.includes('cloud')) {
    return 'Infrastructure';
  }
  return 'General';
};

// Get track icon based on category
export const getTrackIcon = (category, className = "h-5 w-5") => {
  switch (category) {
    case "Development": return <Code className={className} />;
    case "Design": return <Target className={className} />;
    case "Computer Science": return <Brain className={className} />;
    case "Architecture": return <Server className={className} />;
    case "Infrastructure": return <Globe className={className} />;
    case "General": return <BookOpen className={className} />;
    default: return <BookOpen className={className} />;
  }
};

// Calculate progress percentage
export const getProgressPercentage = (completed, total) => {
  return total > 0 ? (completed / total) * 100 : 0;
};

// Get track by ID from Firebase
export const getTrackById = async (trackId) => {
  try {
    const trackRef = doc(db, "tracks", trackId);
    const trackSnap = await getDoc(trackRef);

    if (trackSnap.exists()) {
      const data = trackSnap.data();
      return {
        id: trackSnap.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image,
        difficulty: data.difficulty,
        duration: `${data.estimatedTime} hours`,
        enrolled: data.enrolled || Math.floor(Math.random() * 1000) + 500,
        rating: data.rating || (4.3 + Math.random() * 0.6),
        skills: data.skills || getSkillsByTrack(data.title),
        color: getColorByTrack(data.title),
        category: getCategoryByTrack(data.title),
        createdAt: data.createdAt
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching track:", error);
    throw error;
  }
};

// Get track modules from Firebase subcollection
export const getTrackModules = async (trackId) => {
  try {
    const modulesRef = collection(db, "tracks", trackId, "modules");
    const modulesSnap = await getDocs(modulesRef);

    const modules = [];
    modulesSnap.docs.forEach(doc => {
      const data = doc.data();
      modules.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        lessons: data.lessons || [
          { title: "Introduction", duration: "10 min" },
          { title: "Core Concepts", duration: "20 min" },
          { title: "Practice Questions", duration: "30 min" },
          { title: "Summary & Quiz", duration: "15 min" }
        ],
        order: data.order || 0
      });
    });

    // Sort by order
    return modules.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching track modules:", error);
    throw error;
  }
};

// Get specific lesson by ID
export const getLessonById = async (trackId, moduleId, lessonId) => {
  try {
    const moduleRef = doc(db, "tracks", trackId, "modules", moduleId);
    const moduleSnap = await getDoc(moduleRef);

    if (moduleSnap.exists()) {
      const data = moduleSnap.data();
      const lesson = data.lessons?.find(l => l.id === lessonId);
      return lesson || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    throw error;
  }
};