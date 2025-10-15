/**
 * React hook for Firebase Storage operations
 */

import { useState } from 'react';
import { uploadProfileImage, uploadImage, deleteImage } from '@/lib/firebaseStorage';

export function useFirebaseStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload a profile image
   * @param {File} file - The image file
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Upload result
   */
  const uploadProfilePicture = async (file, userId) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadProfileImage(file, userId, (progress) => {
        setProgress(progress);
      });

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /**
   * Upload a general image
   * @param {File} file - The image file
   * @returns {Promise<Object>} Upload result
   */
  const uploadGeneralImage = async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadImage(file, (progress) => {
        setProgress(progress);
      });

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /**
   * Delete an image
   * @param {string} imagePath - Path to the image in storage
   * @returns {Promise<void>}
   */
  const deleteImageFromStorage = async (imagePath) => {
    setError(null);

    try {
      await deleteImage(imagePath);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploading,
    progress,
    error,
    uploadProfilePicture,
    uploadGeneralImage,
    deleteImageFromStorage,
    reset
  };
}