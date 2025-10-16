/**
 * Cloud Functions for TechTerview - Welcome Notification System
 * 
 * This function automatically creates welcome notifications for new users
 * when they sign up through Firebase Authentication.
 */

const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();


/**
 * Firestore trigger to listen for new user documents
 * This will trigger when a user document is created or updated in the 'users' collection
 */
exports.onUserDocumentCreated = onDocumentWritten('users/{userId}', async (event) => {
  const change = event.data;
  const userId = event.params.userId;
  const after = change.after;
  const before = change.before;
  
  // Only process if document exists after the change
  if (!after.exists) {
    logger.info(`User ${userId} document deleted, skipping`);
    return null;
  }
  
  const userData = after.data();
  
  // Only create welcome notification for new users who haven't received one yet
  if (!userData.isNewUser || userData.welcomeNotificationSent) {
    logger.info(`User ${userId} - isNewUser: ${userData.isNewUser}, welcomeNotificationSent: ${userData.welcomeNotificationSent}, skipping welcome notification`);
    return null;
  }
  
  try {
    logger.info(`Creating welcome notification for new user: ${userId}`);
    
    // Get user's display name or fallback to email
    const userName = userData.displayName || userData.email?.split('@')[0] || 'there';
    
    // Create the welcome notification document
    // Use the actual Firebase Auth UID from the user document, not the document ID
    const actualUserId = userData.uid || userId; // Fallback to document ID if uid not present
    const notificationData = {
      userId: actualUserId,
      title: "Welcome to TechTerview! 🎉",
      message: `Hey ${userName}, we're excited to have you here! Start your journey by exploring your learning path.`,
      type: "welcome",
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Save notification to Firestore
    const notificationRef = await db.collection('notifications').add(notificationData);
    
    logger.info(`Welcome notification created with ID: ${notificationRef.id} for user: ${userId}`);
    
    // Update user document to remove isNewUser flag
    await after.ref.update({
      isNewUser: false,
      welcomeNotificationSent: true
    });
    
    return null;
    
  } catch (error) {
    logger.error('Error creating welcome notification:', error);
    return null;
  }
});

/**
 * Cloud Function to create notifications (for future use)
 * This can be called from your app to send custom notifications
 */
exports.createNotification = onCall(async (request) => {
  const data = request.data;
  const { userId, title, message, type = 'info' } = data;
  
  try {
    if (!userId || !title || !message) {
      throw new Error('Missing required fields: userId, title, message');
    }
    
    const notificationData = {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const notificationRef = await db.collection('notifications').add(notificationData);
    
    logger.info(`Notification created with ID: ${notificationRef.id} for user: ${userId}`);
    
    return { success: true, notificationId: notificationRef.id };
    
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
});

/**
 * Cloud Function to mark notification as read
 */
exports.markNotificationAsRead = onCall(async (request) => {
  const data = request.data;
  const { notificationId, userId } = data;
  
  try {
    if (!notificationId || !userId) {
      throw new Error('Missing required fields: notificationId, userId');
    }
    
    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();
    
    if (!notificationDoc.exists) {
      throw new Error('Notification not found');
    }
    
    const notificationData = notificationDoc.data();
    if (notificationData.userId !== userId) {
      throw new Error('You can only mark your own notifications as read');
    }
    
    await notificationRef.update({
      isRead: true,
      readAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    logger.info(`Notification ${notificationId} marked as read by user: ${userId}`);
    
    return { success: true };
    
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
});
