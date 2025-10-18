"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800", 
  "Advanced": "bg-red-100 text-red-800"
};

export default function TrackHeader({ track }) {
  if (!track) return null;

  return (
    <div className="space-y-6">
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
    </div>
  );
}