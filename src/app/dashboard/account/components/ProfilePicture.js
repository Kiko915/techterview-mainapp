"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/firestore";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import ImageUploadDialog from "./ImageUploadDialog";

export default function ProfilePicture({ user, getUserInitials, userProfile, onImageUpdate }) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemoveImage = async () => {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (!user.photoURL && !userProfile?.photoURL) {
      toast.error("No image to remove");
      return;
    }

    setRemoving(true);
    try {
      await updateUser(user.uid, {
        photoURL: null,
        photoPublicId: null
      });
      
      toast.success("Profile image removed successfully!");
      
      if (onImageUpdate) {
        onImageUpdate(null);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  const handleUploadSuccess = (newImageUrl) => {
    if (onImageUpdate) {
      onImageUpdate(newImageUrl);
    }
  };

  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <Avatar className="w-32 h-32">
          <AvatarImage src={userProfile?.photoURL || user?.photoURL} alt="Profile" />
          <AvatarFallback className="text-2xl bg-[#354fd2] text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-[#354fd2] hover:bg-[#2a3fa8]"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRemoveImage}
            disabled={removing || (!user?.photoURL && !userProfile?.photoURL)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {removing ? "Removing..." : "Remove"}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Recommended: Square image, at least 400x400px, max 10MB
        </p>
      </div>

      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        userId={user?.uid}
        currentImageUrl={userProfile?.photoURL || user?.photoURL}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
