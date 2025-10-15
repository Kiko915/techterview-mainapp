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
    const docRef = await addDoc(usersCollection, {
      ...userData,
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

export const updateUser = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
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