import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
    try {
        const { code, challengeId, output, success } = await request.json();

        // Check for API Key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing. Using mock response.");
            return NextResponse.json({
                feedback: success
                    ? "Great job! Your solution is correct. (Note: Add GEMINI_API_KEY to .env for real AI feedback)"
                    : "Tests failed. Check your logic. (Note: Add GEMINI_API_KEY to .env for real AI feedback)"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the specific model requested by the user
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
        You are an expert coding tutor. Analyze the following student code submission for a coding challenge.
        
        Context:
        - Challenge ID: ${challengeId}
        - Status: ${success ? "Passed all tests" : "Failed tests"}
        - Execution Output: ${output}
        
        Student Code:
        \`\`\`
        ${code}
        \`\`\`
        
        Task:
        Provide concise, encouraging, and constructive feedback. 
        - If passed: Praise specific good practices used in the code (efficiency, readability, etc.).
        - If failed: Explain why it likely failed based on the output and code, and give a hint (do not give the full solution).
        - Keep it under 3 sentences.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text();

        return NextResponse.json({ feedback });

    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
