"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadProfileImageSimple, testFirebaseStorageConfigSimple } from "@/lib/firebaseStorageSimple";
import { updateUser } from "@/lib/firestore";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

export default function ImageUploadDialog({ 
  open, 
  onOpenChange, 
  userId, 
  currentImageUrl,
  onUploadSuccess 
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        toast.error('File size must be less than 2MB');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        toast.error('Only JPEG, PNG, WebP, and GIF files are allowed');
      } else {
        toast.error('Invalid file selected');
      }
      return;
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif']
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast.error('Please select a file first');
      return;
    }

    // Test configuration before upload
    if (!testFirebaseStorageConfigSimple()) {
      toast.error('Firebase Storage is not properly configured');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let uploadResult;
      
      console.log('🔄 Starting profile image upload...');
      
      // Simulate progress for simple upload
      setUploadProgress(25);
      
      // Upload to Firebase Storage (simple version - more reliable)
      uploadResult = await uploadProfileImageSimple(selectedFile, userId);
      
      setUploadProgress(90);
      
      // Update user profile in Firebase with new image URL
      await updateUser(userId, {
        photoURL: uploadResult.url,
        photoPath: uploadResult.path // Store path for potential deletion later
      });
      
      // Ensure progress shows 100%
      setUploadProgress(100);
      
      toast.success('Profile image updated successfully!');
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(uploadResult.url);
      }
      
      // Close dialog and reset state
      handleClose();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploading(false);
    onOpenChange(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload Profile Image
          </DialogTitle>
          <DialogDescription>
            Choose an image file to upload. Maximum file size is 2MB.
            Supported formats: JPEG, PNG, WebP, GIF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-[#354fd2] bg-[#354fd2]/5' 
                  : 'border-gray-300 hover:border-[#354fd2] hover:bg-gray-50'
                }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg font-medium text-[#354fd2]">
                  Drop the image here...
                </p>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Max file size: 2MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Preview */}
              <div className="relative rounded-lg border border-gray-200 overflow-hidden">
                <div className="aspect-square w-full max-w-[200px] mx-auto">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{selectedFile.name}</span>
                <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          )}

          {/* Warning for existing image */}
          {currentImageUrl && selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                This will replace your current profile image.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-[#354fd2] hover:bg-[#2a3fa8]"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}