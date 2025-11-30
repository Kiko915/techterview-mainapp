import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { stats, performanceData, topicData } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are TechBot, a friendly and encouraging AI career coach.
            Analyze the following user progress data and provide a summary of their performance.
            
            User Stats:
            - Total XP: ${stats?.totalXP || 0}
            - Streak: ${stats?.streak || 0} days
            - Interviews Completed: ${stats?.interviewsCompleted || 0}
            - Challenges Completed: ${stats?.challengesCompleted || 0}

            Performance Trend (Recent Scores):
            ${JSON.stringify(performanceData.slice(-5))}

            Topic Mastery:
            ${JSON.stringify(topicData)}

            Please provide:
            1. **Overall Summary**: A brief, encouraging summary of their progress.
            2. **Strengths**: What are they doing well? (e.g., high scores in specific topics, consistency).
            3. **Areas for Improvement**: Where can they improve? (e.g., low scores, topics with few attempts).
            4. **Actionable Tips**: 3 specific tips to help them grow.

            Keep the tone professional yet motivating. Use markdown formatting.
            Keep it concise (under 200 words).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ analysis: text });
    } catch (error) {
        console.error("Error generating progress analysis:", error);
        return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }
}
