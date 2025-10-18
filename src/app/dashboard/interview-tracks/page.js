"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Clock, 
  Users, 
  BookOpen, 
  Target
} from "lucide-react";
import { useTrackData, useUserProfile, useRecommendations } from "./hooks/useTrackData";
import TrackCard from "./components/TrackCard";
import RecommendedTrack from "./components/RecommendedTrack";

export default function InterviewTracksPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Use custom hooks for data management
  const { tracks, loading } = useTrackData();
  const { userProfile } = useUserProfile();
  const { recommendedTrack } = useRecommendations(userProfile, tracks);

  // Filter out the recommended track from other tracks
  const categories = ["All", ...new Set(tracks.map(track => track.category))];
  const filteredTracks = selectedCategory === "All" 
    ? tracks 
    : tracks.filter(track => track.category === selectedCategory);

  const otherTracks = filteredTracks.filter(track => 
    !recommendedTrack || track.id !== recommendedTrack.id
  );

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
        <div>
          <h1 className="text-4xl font-playfair font-bold text-gray-900 dark:text-white mb-2">Interview Tracks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Structured learning paths to master technical interview skills
          </p>
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

      {/* Recommended Track Section */}
      <RecommendedTrack 
        track={recommendedTrack} 
        userSkill={userProfile?.skill || userProfile?.skillArea} 
      />

      {/* Other Tracks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {recommendedTrack && (userProfile?.skill || userProfile?.skillArea) 
              ? "Other Tracks you might like" 
              : "Available Tracks"
            }
          </h3>
          
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
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>

        {/* Empty State */}
        {otherTracks.length === 0 && !loading && (
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
      </div>

      {/* Coming Soon Section */}
      <Card className="bg-gradient-to-r from-[#354fd2] to-[#4a5fb8] text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">More Tracks Coming Soon!</h3>
            <p className="text-white/90 text-sm">
              We're continuously adding new interview tracks based on industry trends and student feedback.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}