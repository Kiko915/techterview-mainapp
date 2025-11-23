
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { code, challengeId, output, success } = await request.json();

        // TODO: Integrate with Google Gemini or OpenAI API here.
        // For now, return a mock response to unblock frontend development.

        let feedback = "";
        if (success) {
            feedback = "Great job! Your solution is correct. You used efficient logic. Consider adding comments to explain your thought process.";
        } else {
            feedback = "It looks like your code has some issues. Check the error message in the output. Make sure you are handling edge cases correctly.";
        }

        return NextResponse.json({ feedback });

    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
