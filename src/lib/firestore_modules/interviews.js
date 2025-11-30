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
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
export const interviewsCollection = collection(db, 'interviews');

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

export const getInterviewsForLesson = async (userId, lessonId) => {
    try {
        const q = query(
            interviewsCollection,
            where('userId', '==', userId),
            where('lessonId', '==', lessonId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting lesson interviews:', error);
        return [];
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
