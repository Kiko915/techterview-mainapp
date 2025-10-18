"use client";

import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";
import TrackCard from "./TrackCard";

export default function RecommendedTrack({ track, userSkill }) {
  if (!track || !userSkill) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommended for You
        </h3>
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
          <TrendingUp className="h-3 w-3 mr-1" />
          {userSkill}
        </Badge>
      </div>
      
      <div className="max-w-md">
        <TrackCard track={track} isRecommended={true} />
      </div>
    </div>
  );
}