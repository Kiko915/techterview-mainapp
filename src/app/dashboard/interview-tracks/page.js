"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Map, 
  Clock, 
  Users, 
  Trophy, 
  BookOpen, 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Server,
  Brain,
  Target,
  ArrowRight,
  Star,
  PlayCircle,
  CheckCircle,
  Lock
} from "lucide-react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Fallback tracks data in case Firestore is empty
const fallbackTracks = [
  {
    id: "frontend-fundamentals",
    title: "Frontend Fundamentals",
    description: "Master the essentials of frontend development with HTML, CSS, JavaScript, and React",
    imageUrl: "/images/tracks/frontend.jpg",
    difficulty: "Beginner",
    duration: "4-6 weeks",
    modules: 12,
    enrolled: 1247,
    rating: 4.8,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    color: "blue",
    isLocked: false,
    completedModules: 0,
    category: "Development"
  },
  {
    id: "backend-development",
    title: "Backend Development", 
    description: "Build robust server-side applications with Node.js, databases, and APIs",
    imageUrl: "/images/tracks/backend.jpg",
    difficulty: "Intermediate",
    duration: "6-8 weeks", 
    modules: 15,
    enrolled: 892,
    rating: 4.7,
    skills: ["Node.js", "Express", "MongoDB", "APIs"],
    color: "green",
    isLocked: false,
    completedModules: 0,
    category: "Development"
  },
  {
    id: "data-structures-algorithms",
    title: "Data Structures & Algorithms",
    description: "Master fundamental CS concepts essential for technical interviews",
    imageUrl: "/images/tracks/dsa.jpg", 
    difficulty: "Intermediate",
    duration: "8-10 weeks",
    modules: 20,
    enrolled: 2156,
    rating: 4.9,
    skills: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    color: "purple",
    isLocked: false,
    completedModules: 0,
    category: "Computer Science"
  },
  {
    id: "system-design",
    title: "System Design", 
    description: "Learn to design scalable systems for senior-level technical interviews",
    imageUrl: "/images/tracks/system-design.jpg",
    difficulty: "Advanced",
    duration: "10-12 weeks",
    modules: 18,
    enrolled: 743,
    rating: 4.6,
    skills: ["Scalability", "Microservices", "Load Balancing", "Caching"],
    color: "red",
    isLocked: true,
    completedModules: 0,
    category: "Architecture"
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description: "Build mobile apps with React Native and Flutter for iOS and Android",
    imageUrl: "/images/tracks/mobile.jpg",
    difficulty: "Intermediate", 
    duration: "7-9 weeks",
    modules: 16,
    enrolled: 634,
    rating: 4.5,
    skills: ["React Native", "Flutter", "iOS", "Android"],
    color: "indigo",
    isLocked: false,
    completedModules: 0,
    category: "Development"
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud",
    description: "Master deployment, CI/CD, Docker, Kubernetes, and cloud platforms", 
    imageUrl: "/images/tracks/devops.jpg",
    difficulty: "Advanced",
    duration: "8-10 weeks",
    modules: 14,
    enrolled: 456,
    rating: 4.4,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    color: "orange",
    isLocked: true,
    completedModules: 0,
    category: "Infrastructure"
  }
];

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800", 
  "Advanced": "bg-red-100 text-red-800"
};

const trackColors = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  indigo: "from-indigo-500 to-indigo-600",
  orange: "from-orange-500 to-orange-600"
};

// Helper functions to map track data
const getSkillsByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend')) {
    return ['HTML', 'CSS', 'JavaScript', 'React'];
  } else if (titleLower.includes('backend')) {
    return ['Node.js', 'Express', 'SQL', 'APIs'];
  } else if (titleLower.includes('ui/ux') || titleLower.includes('design')) {
    return ['Figma', 'Wireframing', 'Prototyping', 'User Research'];
  } else if (titleLower.includes('data') || titleLower.includes('algorithm')) {
    return ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'];
  } else if (titleLower.includes('mobile')) {
    return ['React Native', 'Flutter', 'iOS', 'Android'];
  } else if (titleLower.includes('devops') || titleLower.includes('cloud')) {
    return ['Docker', 'Kubernetes', 'AWS', 'CI/CD'];
  } else {
    return ['Problem Solving', 'Technical Skills', 'Interview Prep', 'Best Practices'];
  }
};

const getColorByTrack = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('frontend')) return 'blue';
  if (titleLower.includes('backend')) return 'green';
  if (titleLower.includes('ui/ux') || titleLower.includes('design')) return 'purple';
  if (titleLower.includes('data') || titleLower.includes('algorithm')) return 'red';
  if (titleLower.includes('mobile')) return 'indigo';
  if (titleLower.includes('devops') || titleLower.includes('cloud')) return 'orange';
  return 'blue'; // default
};

const getCategoryByTrack = (title) => {
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
  } else {
    return 'General';
  }
};

export default function InterviewTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Firestore
        const tracksRef = collection(db, "tracks");
        const querySnapshot = await getDocs(tracksRef);
        
        if (!querySnapshot.empty) {
          const firestoreTracks = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Map Firebase data structure to our component structure
            return {
              id: doc.id,
              title: data.title,
              description: data.description,
              imageUrl: data.image, // Firebase uses 'image' field
              difficulty: data.difficulty,
              duration: `${data.estimatedTime} weeks`, // Convert estimatedTime to duration string
              modules: data.modules || Math.ceil(data.estimatedTime * 1.5), // Calculate modules based on estimated time
              enrolled: data.enrolled || Math.floor(Math.random() * 1000) + 500, // Random enrollment if not provided
              rating: data.rating || (4.3 + Math.random() * 0.6), // Random rating if not provided
              skills: data.skills || getSkillsByTrack(data.title), // Generate skills based on track title
              color: getColorByTrack(data.title),
              isLocked: data.isLocked || false,
              completedModules: data.completedModules || 0,
              category: getCategoryByTrack(data.title),
              createdAt: data.createdAt
            };
          });
          setTracks(firestoreTracks);
        } else {
          // Use fallback data if Firestore is empty
          console.log("No tracks found in Firestore, using fallback data");
          setTracks(fallbackTracks);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        // Use fallback data on error
        setTracks(fallbackTracks);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const categories = ["All", ...new Set(tracks.map(track => track.category))];
  const filteredTracks = selectedCategory === "All" 
    ? tracks 
    : tracks.filter(track => track.category === selectedCategory);

  const getTrackIcon = (category) => {
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

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse w-20"></div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#354fd2] rounded-lg">
            <Map className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Tracks</h1>
            <p className="text-gray-600 mt-1">
              Structured learning paths to master technical interview skills
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{tracks.length} tracks available</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{tracks.reduce((acc, track) => acc + (track.enrolled || 0), 0).toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Industry-aligned curriculum</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category 
              ? "bg-[#354fd2] text-white hover:bg-[#2a3fa8]" 
              : "hover:bg-gray-50"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track) => (
          <Card key={track.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden">
            <div className="relative">
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
                
                {/* Lock indicator */}
                {track.isLocked && (
                  <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Difficulty Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${difficultyColors[track.difficulty]} border-0`}>
                    {track.difficulty}
                  </Badge>
                </div>

                {/* Progress indicator if started */}
                {track.completedModules > 0 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between text-white text-sm mb-1">
                        <span>Progress</span>
                        <span>{track.completedModules}/{track.modules}</span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(track.completedModules, track.modules)}
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Title and Description */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#354fd2] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {track.description}
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1">
                  {track.skills?.slice(0, 3).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {track.skills?.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                      +{track.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{track.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{track.modules} modules</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{typeof track.rating === 'number' ? track.rating.toFixed(1) : track.rating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  asChild 
                  className={`w-full group-hover:bg-[#2a3fa8] transition-colors ${
                    track.isLocked 
                      ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                      : 'bg-[#354fd2] hover:bg-[#2a3fa8]'
                  }`}
                  disabled={track.isLocked}
                >
                  {track.isLocked ? (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Locked
                    </span>
                  ) : track.completedModules > 0 ? (
                    <Link href={`/dashboard/interview-tracks/${track.id}/continue`} className="flex items-center justify-center gap-2 w-full">
                      <PlayCircle className="h-4 w-4" />
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link href={`/dashboard/interview-tracks/${track.id}`} className="flex items-center justify-center gap-2 w-full">
                      Start Track
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTracks.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Map className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === "All" 
              ? "No interview tracks are currently available."
              : `No tracks found in the ${selectedCategory} category.`
            }
          </p>
          {selectedCategory !== "All" && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory("All")}
              className="hover:bg-gray-50"
            >
              View All Tracks
            </Button>
          )}
        </div>
      )}

      {/* Coming Soon Section */}
      <Card className="bg-gradient-to-r from-[#354fd2] to-[#4a5fb8] text-white border-0">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">More Tracks Coming Soon!</h3>
            <p className="text-white/90 max-w-md mx-auto">
              We're continuously adding new interview tracks based on industry trends and student feedback. 
              Stay tuned for specialized tracks in AI/ML, Blockchain, and more!
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-[#354fd2] hover:bg-gray-100"
            >
              Get Notified
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}