import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
export const questionsCollection = collection(db, 'questions');

// Question operations
export const createQuestion = async (questionData) => {
    try {
        const docRef = await addDoc(questionsCollection, {
            ...questionData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

export const getQuestions = async (category = null, difficulty = null, limitCount = 10) => {
    try {
        let q = query(questionsCollection);

        if (category) {
            q = query(q, where('category', '==', category));
        }

        if (difficulty) {
            q = query(q, where('difficulty', '==', difficulty));
        }

        q = query(q, limit(limitCount));

        const querySnapshot = await getDocs(q);
        const questions = [];

        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        return questions;
    } catch (error) {
        console.error('Error getting questions:', error);
        throw error;
    }
};

export const getQuestion = async (questionId) => {
    try {
        const docRef = doc(db, 'questions', questionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting question:', error);
        throw error;
    }
};

export const getQuestionsByQuizId = async (quizId) => {
    try {
        const q = query(questionsCollection, where('quizId', '==', quizId));
        const querySnapshot = await getDocs(q);
        const questions = [];

        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        return questions;
    } catch (error) {
        console.error('Error getting questions by quiz ID:', error);
        throw error;
    }
};

// Quiz Result operations
export const saveQuizResult = async (userId, quizId, score, passed, answers) => {
    try {
        const resultsRef = collection(db, 'quiz_results');
        await addDoc(resultsRef, {
            userId,
            quizId,
            score,
            passed,
            answers,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        throw error;
    }
};

export const getUserQuizResults = async (userId) => {
    try {
        const resultsRef = collection(db, 'quiz_results');
        const q = query(resultsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user quiz results:', error);
        return [];
    }
};
