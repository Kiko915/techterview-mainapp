import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { db } from '../firebase';

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
