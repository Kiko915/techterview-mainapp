/**
 * Firebase Storage service for handling image uploads
 */

import { storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload with retry logic for handling 503 errors
 * @param {Function} uploadFn - The upload function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Upload result
 */
const uploadWithRetry = async (uploadFn, maxRetries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFn();
    } catch (error) {
      console.log(`Upload attempt ${attempt} failed:`, error.message);
      
      // Check if it's a 503 error or similar service unavailable error
      const is503Error = error.message?.includes('503') || 
                          error.code === 'storage/unknown' ||
                          error.message?.includes('Service Unavailable');
      
      if (is503Error && attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
        continue;
      }
      
      // If it's not a retryable error or we've exceeded max retries, throw
      throw error;
    }
  }
};

/**
 * Upload an image to Firebase Storage with progress tracking and retry logic
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID for organizing files
 * @param {Function} onProgress - Progress callback function (receives percentage)
 * @returns {Promise<Object>} Upload result with URL and path
 */
export const uploadProfileImage = async (file, userId, onProgress = null) => {
  // Validate file size (max 2MB for profile pictures as per storage rules)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 2MB');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF files are allowed');
  }

  try {
    // Log upload attempt
    console.log('🔄 Starting Firebase Storage upload...');
    console.log('User ID:', userId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    console.log('Storage bucket:', storage.app.options.storageBucket);
    
    // Create a reference to the file location
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `profile-pictures/${userId}`);
    
    console.log('Storage reference path:', storageRef.fullPath);
    console.log('Storage reference bucket:', storageRef.bucket);

    // Upload the file with resumable upload for progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress callback
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          // Handle upload errors with detailed logging
          console.error('❌ Firebase Storage upload error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error);
          
          // Provide specific error messages based on error codes
          let userMessage = 'Failed to upload image';
          if (error.code === 'storage/unauthorized') {
            userMessage = 'You do not have permission to upload images';
          } else if (error.code === 'storage/canceled') {
            userMessage = 'Upload was canceled';
          } else if (error.code === 'storage/unknown') {
            userMessage = 'Unknown error occurred. Please try again';
          } else if (error.message && error.message.includes('503')) {
            userMessage = 'Storage service is temporarily unavailable. Please try again in a few moments';
          }
          
          reject(new Error(userMessage + ': ' + error.message));
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              name: fileName,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            reject(new Error('Failed to get download URL: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    console.error('Firebase Storage upload setup error:', error);
    throw error;
  }
};

/**
 * Upload a general image to the public images folder
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback function (receives percentage)
 * @returns {Promise<Object>} Upload result with URL and path
 */
export const uploadImage = async (file, onProgress = null) => {
  // Validate file size (max 5MB for general images as per storage rules)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF files are allowed');
  }

  try {
    // Create a reference to the file location
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);

    // Upload the file with resumable upload for progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress callback
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          // Handle upload errors
          console.error('Firebase Storage upload error:', error);
          reject(new Error('Failed to upload image: ' + error.message));
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              name: fileName,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            reject(new Error('Failed to get download URL: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    console.error('Firebase Storage upload setup error:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imagePath - The full path to the image in storage
 * @returns {Promise<void>}
 */
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log('Image deleted successfully from Firebase Storage');
  } catch (error) {
    console.error('Firebase Storage delete error:', error);
    throw new Error('Failed to delete image: ' + error.message);
  }
};

/**
 * Delete a profile image (helper function)
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
export const deleteProfileImage = async (userId) => {
  const imagePath = `profile-pictures/${userId}`;
  return deleteImage(imagePath);
};

/**
 * Test Firebase Storage configuration
 * @returns {boolean} Whether Firebase Storage is properly configured
 */
export const testFirebaseStorageConfig = () => {
  console.log('=== Firebase Storage Configuration Test ===');
  console.log('Storage instance:', storage);
  console.log('Storage bucket:', storage.app.options.storageBucket);
  
  const isConfigured = !!(storage && storage.app.options.storageBucket);
  
  console.log('Configuration Status:', isConfigured ? '✅ Configured' : '❌ Not configured');
  console.log('==========================================');
  
  return isConfigured;
};