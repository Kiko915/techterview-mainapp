import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const saveAnalysis = async (userId, analysis) => {
    try {
        const analysisRef = collection(db, 'users', userId, 'progress_analysis');
        await addDoc(analysisRef, {
            content: analysis,
            createdAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error saving analysis:", error);
        throw error;
    }
};

export const getLatestAnalysis = async (userId) => {
    try {
        const analysisRef = collection(db, 'users', userId, 'progress_analysis');
        const q = query(analysisRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().content;
        }
        return null;
    } catch (error) {
        console.error("Error fetching analysis:", error);
        return null;
    }
};
