// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Specialized Google Sign-In for login (existing users only)
export const signInWithGoogleExistingOnly = async () => {
  const { getUserByEmail } = await import('./firestore');
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in our Firestore database
    const existingUser = await getUserByEmail(user.email);
    
    if (!existingUser) {
      // User doesn't exist in our system, sign them out and throw error
      await signOut(auth);
      throw new Error('No account found with this Google account. Please sign up first.');
    }
    
    return result;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    }
    throw error;
  }
};

// Specialized Google Sign-In for signup (can create new users)
export const signUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-up was cancelled.');
    }
    throw error;
  }
};

export default app;