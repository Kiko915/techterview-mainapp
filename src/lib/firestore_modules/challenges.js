import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

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
