import {
    collection,
    getDocs,
    query,
    orderBy
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
