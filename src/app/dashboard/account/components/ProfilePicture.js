"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

export default function ProfilePicture({ user, getUserInitials }) {
  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <Avatar className="w-32 h-32">
          <AvatarImage src={user?.photoURL} alt="Profile" />
          <AvatarFallback className="text-2xl bg-[#354fd2] text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex gap-2">
          <Button size="sm" className="bg-[#354fd2] hover:bg-[#2a3fa8]">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Recommended: Square image, at least 400x400px
        </p>
      </div>
    </div>
  );
}