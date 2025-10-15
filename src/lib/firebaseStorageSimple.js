/**
 * Simple Firebase Storage service - no resumable uploads
 * This version uses basic uploadBytes which is more reliable
 */

import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Simple profile image upload without resumable functionality
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Upload result with URL and path
 */
export const uploadProfileImageSimple = async (file, userId) => {
  console.log('🔄 Starting simple Firebase Storage upload...');
  console.log('User ID:', userId);
  console.log('File details:', { name: file.name, size: file.size, type: file.type });
  
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, `profile-pictures/${userId}`);
    
    console.log('Storage reference:', storageRef);
    console.log('Storage bucket:', storage.app.options.storageBucket);

    // Use simple uploadBytes (not resumable)
    console.log('Attempting simple upload...');
    const snapshot = await uploadBytes(storageRef, file);
    
    console.log('✅ Upload successful:', snapshot);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL obtained:', downloadURL);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      type: file.type
    };
    
  } catch (error) {
    console.error('❌ Firebase Storage simple upload error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Check if it's a 503 service unavailable error
    if (error.message && error.message.includes('503')) {
      throw new Error('Firebase Storage service is temporarily unavailable. The upload might have succeeded despite this error. Please check your profile picture and try again if needed.');
    }
    
    throw error;
  }
};

/**
 * Test Firebase Storage configuration
 * @returns {boolean} Whether Firebase Storage is properly configured
 */
export const testFirebaseStorageConfigSimple = () => {
  console.log('=== Firebase Storage Configuration Test ===');
  console.log('Storage instance:', storage);
  console.log('Storage bucket:', storage.app.options.storageBucket);
  
  const isConfigured = !!(storage && storage.app.options.storageBucket);
  
  console.log('Configuration Status:', isConfigured ? '✅ Configured' : '❌ Not configured');
  console.log('==========================================');
  
  return isConfigured;
};