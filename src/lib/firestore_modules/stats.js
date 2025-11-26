import {
    collection,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { db } from '../firebase';

// Dashboard Stats operations
export const getUserStats = async (userId) => {
    try {
        const challengeQuery = query(collection(db, 'challenge_progress'), where('userId', '==', userId));
        const interviewQuery = query(collection(db, 'interviews'), where('userId', '==', userId));
        const quizQuery = query(collection(db, 'quiz_results'), where('userId', '==', userId));

        const [challengeSnap, interviewSnap, quizSnap] = await Promise.all([
            getDocs(challengeQuery),
            getDocs(interviewQuery),
            getDocs(quizQuery)
        ]);

        // Helper to safely get date
        const getDate = (item) => {
            if (!item) return null;
            // Prefer completedAt, fallback to createdAt or updatedAt
            const timestamp = item.completedAt || item.createdAt || item.updatedAt;
            if (!timestamp) return null;

            const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
            // Check if date is valid
            return !isNaN(date.getTime()) ? date : null;
        };

        // Process Data
        const challengeDocs = challengeSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'challenge', date: getDate(d.data()) }));
        const interviewDocs = interviewSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'interview', date: getDate(d.data()) }));
        const quizDocs = quizSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'quiz', date: getDate(d.data()) }));

        // Filter for completed items
        const completedChallenges = challengeDocs.filter(c => c.status === 'completed');
        const passedQuizzes = quizDocs.filter(q => q.passed !== false); // Assume passed if not explicitly false

        // XP Calculation
        // 50 XP per challenge, 100 XP per interview, 20 XP per quiz
        const totalXP = (completedChallenges.length * 50) + (interviewDocs.length * 100) + (passedQuizzes.length * 20);

        // Streak Calculation
        const allActivities = [...completedChallenges, ...interviewDocs, ...passedQuizzes];
        const uniqueDates = new Set(
            allActivities
                .filter(a => a.date && !isNaN(a.date.getTime())) // Ensure valid date
                .map(a => a.date.toISOString().split('T')[0]) // YYYY-MM-DD
        );

        const sortedDates = Array.from(uniqueDates).sort().reverse(); // Newest first

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if streak is active (activity today or yesterday)
        if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
            streak = 1;
            // Simple consecutive check
            for (let i = 0; i < sortedDates.length - 1; i++) {
                const curr = new Date(sortedDates[i]);
                const next = new Date(sortedDates[i + 1]);
                const diffTime = Math.abs(curr - next);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        // Recent Activity (Top 5)
        const recentActivity = [...allActivities]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        return {
            streak,
            totalXP,
            challengesCompleted: completedChallenges.length,
            interviewsCompleted: interviewDocs.length,
            recentActivity
        };

    } catch (error) {
        console.error("Error getting user stats:", error);
        return {
            streak: 0,
            totalXP: 0,
            challengesCompleted: 0,
            interviewsCompleted: 0,
            recentActivity: []
        };
    }
};
