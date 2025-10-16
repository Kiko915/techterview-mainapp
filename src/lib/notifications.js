import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  addDoc 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get notifications for a specific user
 * @param {string} userId - The user's UID
 * @param {boolean} unreadOnly - If true, only returns unread notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export const getUserNotifications = async (userId, unreadOnly = false) => {
  try {
    let q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (unreadOnly) {
      q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp to Date
      });
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Get real-time notifications for a specific user
 * @param {string} userId - The user's UID
 * @param {Function} callback - Callback function to handle notification updates
 * @param {boolean} unreadOnly - If true, only returns unread notifications
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserNotifications = (userId, callback, unreadOnly = false) => {
  let q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  if (unreadOnly) {
    q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });

    callback(notifications);
  }, (error) => {
    console.error('Error in notification subscription:', error);
  });
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification document ID
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
      readAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark multiple notifications as read
 * @param {Array<string>} notificationIds - Array of notification document IDs
 * @returns {Promise<void>}
 */
export const markMultipleNotificationsAsRead = async (notificationIds) => {
  try {
    const promises = notificationIds.map(id => 
      updateDoc(doc(db, 'notifications', id), {
        isRead: true,
        readAt: serverTimestamp()
      })
    );
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error marking multiple notifications as read:', error);
    throw error;
  }
};

/**
 * Get the count of unread notifications for a user
 * @param {string} userId - The user's UID
 * @returns {Promise<number>} Count of unread notifications
 */
export const getUnreadNotificationCount = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};

/**
 * Create a manual notification (for testing purposes)
 * Note: In production, notifications should primarily be created via Cloud Functions
 * @param {string} userId - The user's UID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (e.g., 'info', 'success', 'warning', 'error')
 * @returns {Promise<void>}
 */
export const createNotification = async (userId, title, message, type = 'info') => {
  try {
    const notificationData = {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'notifications'), notificationData);
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};