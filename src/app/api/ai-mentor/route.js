import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getUserStats, updateChatSession, getAllTracksWithModules, getAllChallenges, getUserQuizResults } from "@/lib/firestore";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { messages, userId, userName, context, sessionId } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        // Fetch user stats for context
        let userStats = null;
        let tracks = [];
        let challenges = [];
        let quizResults = [];

        if (userId) {
            [userStats, tracks, challenges, quizResults] = await Promise.all([
                getUserStats(userId),
                getAllTracksWithModules(),
                getAllChallenges(),
                getUserQuizResults(userId)
            ]);
        }

        // Format data for prompt
        const tracksContext = tracks.map(t => {
            const modulesStr = t.modules ? t.modules.map(m => `  - Module: ${m.title} (${m.description || 'No description'})`).join('\n') : '  - No modules';
            return `- Track: ${t.title}\n  Description: ${t.description}\n  Modules:\n${modulesStr}`;
        }).join('\n\n');
        const challengesContext = challenges.map(c => `- ${c.title} (${c.difficulty})`).join('\n');
        const quizContext = quizResults.map(q => `- Quiz ${q.quizId}: Score ${q.score}, Passed: ${q.passed}`).join('\n');

        // Construct System Prompt
        let systemPrompt = `You are an AI Mentor for a platform called "Techterview". 
    Your goal is to help users prepare for technical interviews, review their progress, and provide career advice.
    
    User Context:
    - Name: ${userName}
    ${userStats ? `
    - Total XP: ${userStats.totalXP}
    - Streak: ${userStats.streak} days
    - Challenges Completed: ${userStats.challengesCompleted}
    - Interviews Completed: ${userStats.interviewsCompleted}
    - Recent Activity: ${userStats.recentActivity.map(a => `${a.type} on ${a.date}`).join(", ")}
    ` : "User stats not available."}

    Platform Content:
    Available Learning Tracks:
    ${tracksContext}

    Available Coding Challenges:
    ${challengesContext}

    User Quiz Performance:
    ${quizContext.length > 0 ? quizContext : "No quizzes taken yet."}
    
    ${context ? `Additional Context (Resume/CV/Portfolio): \n${context}` : ""}
    
    Guidelines:
    - Be encouraging, professional, and helpful.
    - If the user asks about their progress, refer to the stats provided.
    - If the user provides a resume or portfolio, analyze it for strengths, weaknesses, and improvements.
    - Use the platform content to suggest next steps (e.g. "You should try the [Challenge Name] challenge").
    - Do NOT give the direct solution to challenges, but provide hints and guidance.
    - Keep responses concise and actionable.
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to act as your AI Mentor. How can I help you today?" }],
                },
                ...messages.slice(0, -1).map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastMessage);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }

                    // Auto-rename logic (after streaming is complete)
                    if (messages.length === 1 && sessionId) {
                        try {
                            const titlePrompt = `Generate a very short, concise title (max 5 words) for a conversation that starts with this message: "${lastMessage}". Do not use quotes.`;
                            const titleResult = await model.generateContent(titlePrompt);
                            const newTitle = titleResult.response.text().trim();
                            await updateChatSession(sessionId, { title: newTitle });
                        } catch (titleError) {
                            console.error("Error generating title:", titleError);
                        }
                    }

                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new NextResponse(stream);

    } catch (error) {
        console.error("Error in AI Mentor API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
