import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { text } = await request.json();
        const deepgram = createClient(process.env.MOCK_INTERVIEWER_AGENT);

        const response = await deepgram.speak.request(
            { text },
            {
                model: "aura-asteria-en",
                encoding: "linear16",
                container: "wav",
            }
        );

        const stream = await response.getStream();
        const headers = new Headers();
        headers.set("Content-Type", "audio/wav");

        if (stream) {
            return new NextResponse(stream, { headers });
        } else {
            return NextResponse.json({ error: "Error generating audio" }, { status: 500 });
        }
    } catch (error) {
        console.error("TTS Error:", error);
        return NextResponse.json({ error: "TTS Failed" }, { status: 500 });
    }
}
