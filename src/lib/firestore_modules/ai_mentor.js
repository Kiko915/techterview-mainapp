import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// AI Mentor Chat Functions

export const createChatSession = async (userId, title = "New Chat") => {
    try {
        const sessionRef = await addDoc(collection(db, "chat_sessions"), {
            userId,
            title,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return sessionRef.id;
    } catch (error) {
        console.error("Error creating chat session:", error);
        throw error;
    }
};

export const getUserChatSessions = async (userId) => {
    try {
        const q = query(
            collection(db, "chat_sessions"),
            where("userId", "==", userId),
            orderBy("updatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting chat sessions:", error);
        return [];
    }
};

export const addChatMessage = async (sessionId, role, content) => {
    try {
        await addDoc(collection(db, "chat_sessions", sessionId, "messages"), {
            role,
            content,
            createdAt: serverTimestamp()
        });

        // Update session timestamp
        const sessionRef = doc(db, "chat_sessions", sessionId);
        await updateDoc(sessionRef, {
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding chat message:", error);
        throw error;
    }
};

export const getChatMessages = async (sessionId) => {
    try {
        const q = query(
            collection(db, "chat_sessions", sessionId, "messages"),
            orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting chat messages:", error);
        return [];
    }
};

export const updateChatSession = async (sessionId, updates) => {
    try {
        const sessionRef = doc(db, "chat_sessions", sessionId);
        await updateDoc(sessionRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating chat session:", error);
        throw error;
    }
};

export const deleteChatSession = async (sessionId) => {
    try {
        const sessionRef = doc(db, "chat_sessions", sessionId);
        await deleteDoc(sessionRef);
    } catch (error) {
        console.error("Error deleting chat session:", error);
        throw error;
    }
};
