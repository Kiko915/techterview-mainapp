import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const deepgram = createClient(process.env.MOCK_INTERVIEWER_AGENT);

        let projectId = process.env.DEEPGRAM_PROJECT_ID;

        if (!projectId) {
            // Attempt to fetch project ID from the API key
            const { result: projects, error: projectsError } = await deepgram.manage.getProjects();
            if (projectsError) {
                console.error("Failed to fetch projects:", projectsError);
                return NextResponse.json({ error: "Deepgram Project ID missing and failed to fetch" }, { status: 500 });
            }
            if (projects?.projects?.[0]) {
                projectId = projects.projects[0].project_id;
                console.log("Fetched Project ID:", projectId);
            } else {
                return NextResponse.json({ error: "No Deepgram projects found" }, { status: 500 });
            }
        }

        let newKey;
        try {
            const { result, error } = await deepgram.manage.createProjectKey(
                projectId,
                {
                    comment: "Ephemeral key for interview session",
                    scopes: ["usage:write"],
                    tags: ["interview_session"],
                    time_to_live_in_seconds: 60 * 60, // 1 hour
                }
            );

            if (error) {
                throw new Error(error.message || "Failed to create key");
            }
            newKey = result.key;
        } catch (keyError) {
            console.warn("Could not create ephemeral key (likely insufficient permissions). Falling back to master key.");
            console.warn("WARNING: Exposing master key to client. Use only for development.");
            newKey = process.env.MOCK_INTERVIEWER_AGENT;
        }

        return NextResponse.json({
            key: newKey,
            geminiKey: process.env.GEMINI_API_KEY
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
