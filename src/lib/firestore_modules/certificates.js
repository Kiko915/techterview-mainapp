import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export const certificatesCollection = collection(db, 'certificates');

export const createCertificate = async (userId, trackId, trackTitle, userName) => {
    try {
        // Check if certificate already exists
        const q = query(
            certificatesCollection,
            where('userId', '==', userId),
            where('trackId', '==', trackId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }

        // Create new certificate
        const newCertificateRef = doc(certificatesCollection);
        const certificateData = {
            userId,
            trackId,
            trackTitle,
            userName,
            issuedAt: serverTimestamp(),
            verificationUrl: `${window.location.origin}/verify/${newCertificateRef.id}`
        };

        await setDoc(newCertificateRef, certificateData);
        return { id: newCertificateRef.id, ...certificateData };
    } catch (error) {
        console.error('Error creating certificate:', error);
        throw error;
    }
};

export const getCertificate = async (certificateId) => {
    try {
        const docRef = doc(db, 'certificates', certificateId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting certificate:', error);
        return null;
    }
};

export const getUserCertificates = async (userId) => {
    try {
        const q = query(
            certificatesCollection,
            where('userId', '==', userId),
            orderBy('issuedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user certificates:', error);
        return [];
    }
};
