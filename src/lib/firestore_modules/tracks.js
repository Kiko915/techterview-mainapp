import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
export const tracksCollection = collection(db, 'tracks');

// Track operations
export const getAllTracks = async () => {
    try {
        const q = query(tracksCollection, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting all tracks:', error);
        return [];
    }
};

export const getAllTracksWithModules = async () => {
    try {
        const tracks = await getAllTracks();
        const tracksWithModules = await Promise.all(tracks.map(async (track) => {
            const modulesRef = collection(db, 'tracks', track.id, 'modules');
            const q = query(modulesRef, orderBy('order', 'asc'));
            const modulesSnap = await getDocs(q);
            const modules = modulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { ...track, modules };
        }));
        return tracksWithModules;
    } catch (error) {
        console.error('Error getting tracks with modules:', error);
        return [];
    }
};

export const getTrackById = async (trackId) => {
    try {
        const docRef = doc(db, 'tracks', trackId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting track:', error);
        return null;
    }
};

export const getTrackModules = async (trackId) => {
    try {
        const modulesRef = collection(db, 'tracks', trackId, 'modules');
        const q = query(modulesRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting track modules:', error);
        return [];
    }
};

export const getLessonById = async (trackId, moduleId, lessonId) => {
    try {
        const moduleRef = doc(db, 'tracks', trackId, 'modules', moduleId);
        const moduleSnap = await getDoc(moduleRef);

        if (moduleSnap.exists()) {
            const moduleData = moduleSnap.data();
            const lesson = moduleData.lessons?.find(l => l.id === lessonId);
            return lesson || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting lesson:', error);
        return null;
    }
};
