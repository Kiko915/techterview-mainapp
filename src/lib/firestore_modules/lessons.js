import {
    collection,
    addDoc,
    getDocsFromServer,
    query,
    where,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// Lesson Progress operations (for streak tracking)
export const recordLessonCompletion = async (userId, trackId, lessonId, lessonTitle) => {
    try {
        // Check if we already recorded this lesson completion today to avoid duplicate streak entries
        // (Though streak calculation handles duplicates, it's good to keep DB clean)
        // For simplicity, we'll just add it. The streak logic filters by unique dates.

        const progressRef = collection(db, 'lesson_progress');
        await addDoc(progressRef, {
            userId,
            trackId,
            lessonId,
            lessonTitle,
            completedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error recording lesson completion:', error);
        // Don't throw, as this is a background stat tracking operation
    }
};

export const getUserLessonCompletions = async (userId) => {
    try {
        const progressRef = collection(db, 'lesson_progress');
        const q = query(
            progressRef,
            where('userId', '==', userId),
            orderBy('completedAt', 'desc')
        );
        const querySnapshot = await getDocsFromServer(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user lesson completions:', error);
        return [];
    }
};
