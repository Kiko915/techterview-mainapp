import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
    try {
        const { interviewId } = await request.json();

        if (!interviewId) {
            return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
        }

        // 1. Fetch Interview Data using Client SDK
        const interviewRef = doc(db, 'interviews', interviewId);
        const interviewDoc = await getDoc(interviewRef);

        if (!interviewDoc.exists()) {
            return NextResponse.json({ error: "Interview not found" }, { status: 404 });
        }

        const interviewData = interviewDoc.data();

        // 2. Prepare Transcript for Analysis
        const transcript = interviewData.transcript || [];
        if (transcript.length === 0) {
            return NextResponse.json({ error: "No transcript available for analysis" }, { status: 400 });
        }

        const transcriptText = transcript.map(msg => `${msg.role}: ${msg.text}`).join('\n');

        // 3. Generate Feedback with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            Analyze the following technical interview transcript for a ${interviewData.targetRole} position.
            
            Transcript:
            ${transcriptText}

            Provide a detailed evaluation in JSON format with the following structure:
            {
                "score": number (0-100),
                "summary": "A concise executive summary of the candidate's performance (2-3 sentences).",
                "strengths": ["List of 3-5 key strengths demonstrated"],
                "improvements": ["List of 3-5 specific areas for improvement"]
            }
            
            Focus on technical accuracy, communication clarity, and problem-solving approach.
            Do not include markdown formatting, just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const feedback = JSON.parse(jsonString);

        // 4. Save Feedback to Firestore
        await updateDoc(interviewRef, {
            feedback: feedback,
            updatedAt: new Date()
        });

        return NextResponse.json({ feedback });

    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
