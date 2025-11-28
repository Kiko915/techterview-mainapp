import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { message, context } = await request.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const systemPrompt = `
            You are a professional technical interviewer conducting a mock interview.
            Role: ${context.targetRole || "Software Engineer"}
            Candidate Resume: ${context.resumeName || "Not provided"}
            
            Your goal is to ask relevant technical and behavioral questions, evaluate the candidate's responses, and provide constructive feedback.
            Keep your responses concise (1-3 sentences) and conversational, as this is a voice interview.
            Do not write code blocks, as they cannot be spoken easily.
            Start by introducing yourself and asking the first question if this is the start.
        `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to conduct the interview." }],
                }
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
