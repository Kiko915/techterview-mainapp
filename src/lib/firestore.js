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
  serverTimestamp,
  increment
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

export const getQuestionsByQuizId = async (quizId) => {
  try {
    const q = query(questionsCollection, where('quizId', '==', quizId));
    const querySnapshot = await getDocs(q);
    const questions = [];

    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    return questions;
  } catch (error) {
    console.error('Error getting questions by quiz ID:', error);
    throw error;
  }
};

// Track Enrollment operations
export const enrollUserInTrack = async (userId, trackId, enrollmentData) => {
  try {
    // First, check if user is already enrolled to prevent duplicate enrollments
    const existingEnrollment = await getUserEnrollment(userId, trackId);
    if (existingEnrollment) {
      console.log('User is already enrolled in this track');
      return existingEnrollment.id;
    }

    // Create enrollment record
    const enrollmentRef = collection(db, 'enrollments');
    const docRef = await addDoc(enrollmentRef, {
      userId,
      trackId,
      ...enrollmentData,
      enrolledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Increment the enrollment count in the tracks document
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      enrolled: increment(1),
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

// Get total enrollment count for a track
export const getTrackEnrollmentCount = async (trackId) => {
  try {
    const enrollmentRef = collection(db, 'enrollments');
    const q = query(enrollmentRef, where('trackId', '==', trackId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting track enrollment count:', error);
    throw error;
  }
};

// Challenge Progress operations
export const saveChallengeProgress = async (userId, challengeId, status, code, feedback = null) => {
  try {
    const progressRef = collection(db, 'challenge_progress');
    // Check if progress already exists
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('challengeId', '==', challengeId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing progress
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, 'challenge_progress', docId);
      const updateData = {
        status,
        code,
        updatedAt: serverTimestamp(),
        // Only update completedAt if it's the first time completing
        ...(status === 'completed' && !querySnapshot.docs[0].data().completedAt ? { completedAt: serverTimestamp() } : {})
      };
      if (feedback) {
        updateData.feedback = feedback;
      }
      await updateDoc(docRef, updateData);
    } else {
      // Create new progress
      const newData = {
        userId,
        challengeId,
        status,
        code,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(status === 'completed' ? { completedAt: serverTimestamp() } : {})
      };
      if (feedback) {
        newData.feedback = feedback;
      }
      await addDoc(progressRef, newData);
    }
  } catch (error) {
    console.error('Error saving challenge progress:', error);
    throw error;
  }
};

export const getUserChallengeProgress = async (userId, challengeId) => {
  try {
    const q = query(
      collection(db, 'challenge_progress'),
      where('userId', '==', userId),
      where('challengeId', '==', challengeId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user challenge progress:', error);
    return null;
  }
};

export const getUserCompletedChallenges = async (userId) => {
  try {
    const progressRef = collection(db, 'challenge_progress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    const querySnapshot = await getDocs(q);
    const completedIds = [];

    querySnapshot.forEach((doc) => {
      completedIds.push(doc.data().challengeId);
    });

    return completedIds;
  } catch (error) {
    console.error('Error getting completed challenges:', error);
    throw error;
  }
};

// Quiz Result operations
export const saveQuizResult = async (userId, quizId, score, passed, answers) => {
  try {
    const resultsRef = collection(db, 'quiz_results');
    await addDoc(resultsRef, {
      userId,
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// Challenge operations
export const getAllChallenges = async () => {
  try {
    const challengesRef = collection(db, 'challenges');
    const snapshot = await getDocs(challengesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all challenges:', error);
    return [];
  }
};

// Learning Progress operations
export const getNextLessonForUser = async (userId) => {
  try {
    // 1. Get user's enrollments
    const enrollments = await getUserEnrollments(userId);

    if (!enrollments || enrollments.length === 0) return null;

    // 2. Sort by lastAccessed to get the most recent one
    enrollments.sort((a, b) => {
      const dateA = a.lastAccessed?.toDate ? a.lastAccessed.toDate() : new Date(a.lastAccessed || 0);
      const dateB = b.lastAccessed?.toDate ? b.lastAccessed.toDate() : new Date(b.lastAccessed || 0);
      return dateB - dateA;
    });

    const activeEnrollment = enrollments[0];
    const trackId = activeEnrollment.trackId;

    // 3. Fetch track details
    const trackRef = doc(db, 'tracks', trackId);
    const trackSnap = await getDoc(trackRef);

    if (!trackSnap.exists()) return null;
    const trackData = trackSnap.data();

    // 4. Fetch modules
    const modulesRef = collection(db, 'tracks', trackId, 'modules');
    const modulesSnap = await getDocs(modulesRef);
    const modules = modulesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Sort modules
    modules.sort((a, b) => (a.order || 0) - (b.order || 0));

    // 5. Find first uncompleted lesson
    const completedLessons = activeEnrollment.completedLessons || [];

    for (const module of modules) {
      if (!module.lessons) continue;

      for (const lesson of module.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return {
            trackId,
            trackTitle: trackData.title,
            moduleId: module.id,
            lessonId: lesson.id,
            title: lesson.title,
            duration: lesson.duration
          };
        }
      }
    }

    // If all lessons completed
    return null;

  } catch (error) {
    console.error('Error getting next lesson:', error);
    return null;
  }
};

// Dashboard Stats operations
export const getUserStats = async (userId) => {
  try {
    const challengeQuery = query(collection(db, 'challenge_progress'), where('userId', '==', userId));
    const interviewQuery = query(collection(db, 'interviews'), where('userId', '==', userId));
    const quizQuery = query(collection(db, 'quiz_results'), where('userId', '==', userId));

    const [challengeSnap, interviewSnap, quizSnap] = await Promise.all([
      getDocs(challengeQuery),
      getDocs(interviewQuery),
      getDocs(quizQuery)
    ]);

    // Helper to safely get date
    const getDate = (item) => {
      if (!item) return null;
      // Prefer completedAt, fallback to createdAt or updatedAt
      const timestamp = item.completedAt || item.createdAt || item.updatedAt;
      if (!timestamp) return null;

      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      // Check if date is valid
      return !isNaN(date.getTime()) ? date : null;
    };

    // Process Data
    const challengeDocs = challengeSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'challenge', date: getDate(d.data()) }));
    const interviewDocs = interviewSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'interview', date: getDate(d.data()) }));
    const quizDocs = quizSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'quiz', date: getDate(d.data()) }));

    // Filter for completed items
    const completedChallenges = challengeDocs.filter(c => c.status === 'completed');
    const passedQuizzes = quizDocs.filter(q => q.passed !== false); // Assume passed if not explicitly false

    // XP Calculation
    // 50 XP per challenge, 100 XP per interview, 20 XP per quiz
    const totalXP = (completedChallenges.length * 50) + (interviewDocs.length * 100) + (passedQuizzes.length * 20);

    // Streak Calculation
    const allActivities = [...completedChallenges, ...interviewDocs, ...passedQuizzes];
    const uniqueDates = new Set(
      allActivities
        .filter(a => a.date && !isNaN(a.date.getTime())) // Ensure valid date
        .map(a => a.date.toISOString().split('T')[0]) // YYYY-MM-DD
    );

    const sortedDates = Array.from(uniqueDates).sort().reverse(); // Newest first

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if streak is active (activity today or yesterday)
    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      streak = 1;
      // Simple consecutive check
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const curr = new Date(sortedDates[i]);
        const next = new Date(sortedDates[i + 1]);
        const diffTime = Math.abs(curr - next);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Recent Activity (Top 5)
    const recentActivity = [...allActivities]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    return {
      streak,
      totalXP,
      challengesCompleted: completedChallenges.length,
      interviewsCompleted: interviewDocs.length,
      recentActivity
    };

  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      streak: 0,
      totalXP: 0,
      challengesCompleted: 0,
      interviewsCompleted: 0,
      recentActivity: []
    };
  }
};