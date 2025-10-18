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

// Difficulty color mappings
export const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800", 
  "Advanced": "bg-red-100 text-red-800"
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
export const getTrackIcon = (category) => {
  switch (category) {
    case "Development": return <Code className="h-5 w-5" />;
    case "Design": return <Target className="h-5 w-5" />;
    case "Computer Science": return <Brain className="h-5 w-5" />;
    case "Architecture": return <Server className="h-5 w-5" />;
    case "Infrastructure": return <Globe className="h-5 w-5" />;
    case "General": return <BookOpen className="h-5 w-5" />;
    default: return <BookOpen className="h-5 w-5" />;
  }
};

// Calculate progress percentage
export const getProgressPercentage = (completed, total) => {
  return total > 0 ? (completed / total) * 100 : 0;
};