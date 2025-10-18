import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
export const usersCollection = collection(db, 'users');
export const interviewsCollection = collection(db, 'interviews');
export const questionsCollection = collection(db, 'questions');

// User operations
export const createUser = async (userData) => {
  try {
    const processedUserData = { ...userData };
    
    // Store username in lowercase for consistency
    if (userData.username) {
      processedUserData.username = userData.username.toLowerCase();
    }
    
    const docRef = await addDoc(usersCollection, {
      ...processedUserData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByUID = async (uid) => {
  try {
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by UID:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const checkUsernameAvailability = async (username, excludeUID = null) => {
  try {
    console.log('Checking username availability for:', username);
    
    // Get all users and check usernames case-insensitively
    // This handles both old usernames (stored in original case) and new ones (lowercase)
    const querySnapshot = await getDocs(usersCollection);
    
    const inputUsername = username.toLowerCase();
    let conflictFound = false;
    let conflictingUser = null;
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.username) {
        const existingUsername = userData.username.toLowerCase();
        if (existingUsername === inputUsername) {
          // Found a username conflict
          if (!excludeUID || userData.uid !== excludeUID) {
            conflictFound = true;
            conflictingUser = userData;
          }
        }
      }
    });
    
    if (conflictFound) {
      console.log('Username conflict found with:', conflictingUser.username);
      return { available: false };
    }
    
    console.log('Username is available');
    return { available: true };
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

// Function to normalize existing usernames to lowercase (run once for migration)
export const normalizeExistingUsernames = async () => {
  try {
    console.log('Starting username normalization...');
    const querySnapshot = await getDocs(usersCollection);
    let updatedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data();
      
      if (userData.username && userData.username !== userData.username.toLowerCase()) {
        const docRef = doc(db, 'users', docSnapshot.id);
        await updateDoc(docRef, {
          username: userData.username.toLowerCase(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`Updated username: ${userData.username} -> ${userData.username.toLowerCase()}`);
        updatedCount++;
      }
    }
    
    console.log(`Username normalization complete. Updated ${updatedCount} usernames.`);
    return { updated: updatedCount };
  } catch (error) {
    console.error('Error normalizing usernames:', error);
    throw error;
  }
};

export const createInitialUserDocument = async (user) => {
  try {
    // Check if user document already exists
    const existingUser = await getUserByUID(user.uid);
    if (existingUser) {
      console.log('User document already exists, skipping creation');
      return existingUser;
    }
    
    // Create initial user document with minimal data
    const docRef = await addDoc(usersCollection, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      isNewUser: true, // This will trigger the welcome notification
      onboardingCompleted: false,
      profileComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Initial user document created with ID:', docRef.id);
    return { id: docRef.id, uid: user.uid };
  } catch (error) {
    console.error('Error creating initial user document:', error);
    throw error;
  }
};

export const updateUser = async (uid, updates) => {
  try {
    const processedUpdates = { ...updates };
    
    // Store username in lowercase for consistency
    if (updates.username) {
      processedUpdates.username = updates.username.toLowerCase();
    }
    
    // First, try to find existing user document by UID
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If no document found, create a new one
      const docRef = await addDoc(usersCollection, {
        uid,
        ...processedUpdates,
        isNewUser: true, // Mark as new user to trigger welcome notification
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } else {
      // Update existing document
      const userDoc = querySnapshot.docs[0];
      const docRef = doc(db, 'users', userDoc.id);
      await updateDoc(docRef, {
        ...processedUpdates,
        updatedAt: serverTimestamp()
      });
      return userDoc.id;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Interview operations
export const createInterview = async (interviewData) => {
  try {
    const docRef = await addDoc(interviewsCollection, {
      ...interviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
};

export const getInterview = async (interviewId) => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting interview:', error);
    throw error;
  }
};

export const getUserInterviews = async (userId) => {
  try {
    const q = query(
      interviewsCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const interviews = [];
    
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });
    
    return interviews;
  } catch (error) {
    console.error('Error getting user interviews:', error);
    throw error;
  }
};

export const updateInterview = async (interviewId, updates) => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

export const deleteInterview = async (interviewId) => {
  try {
    const docRef = doc(db, 'interviews', interviewId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting interview:', error);
    throw error;
  }
};

// Question operations
export const createQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(questionsCollection, {
      ...questionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const getQuestions = async (category = null, difficulty = null, limitCount = 10) => {
  try {
    let q = query(questionsCollection);
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }
    
    q = query(q, limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    
    return questions;
  } catch (error) {
    console.error('Error getting questions:', error);
    throw error;
  }
};

export const getQuestion = async (questionId) => {
  try {
    const docRef = doc(db, 'questions', questionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting question:', error);
    throw error;
  }
};

// Track Enrollment operations
export const enrollUserInTrack = async (userId, trackId, enrollmentData) => {
  try {
    const enrollmentRef = collection(db, 'enrollments');
    const docRef = await addDoc(enrollmentRef, {
      userId,
      trackId,
      ...enrollmentData,
      enrolledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error enrolling user in track:', error);
    throw error;
  }
};

export const getUserEnrollment = async (userId, trackId) => {
  try {
    const enrollmentRef = collection(db, 'enrollments');
    const q = query(
      enrollmentRef, 
      where('userId', '==', userId),
      where('trackId', '==', trackId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user enrollment:', error);
    throw error;
  }
};

export const updateUserEnrollment = async (enrollmentId, updates) => {
  try {
    const docRef = doc(db, 'enrollments', enrollmentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user enrollment:', error);
    throw error;
  }
};

export const getUserEnrollments = async (userId) => {
  try {
    const enrollmentRef = collection(db, 'enrollments');
    const q = query(
      enrollmentRef, 
      where('userId', '==', userId),
      orderBy('enrolledAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const enrollments = [];
    
    querySnapshot.forEach((doc) => {
      enrollments.push({ id: doc.id, ...doc.data() });
    });
    
    return enrollments;
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    throw error;
  }
};