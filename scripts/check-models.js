const fs = require('fs');
const path = require('path');

// Try to read .env.local manually
function getEnvValue(key) {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts[0].trim() === key) {
                    return parts[1].trim();
                }
            }
        }
    } catch (e) {
        console.error("Error reading .env.local:", e);
    }
    return process.env[key];
}

async function listModels() {
    const apiKey = getEnvValue("GEMINI_API_KEY");

    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY not found in .env.local");
        return;
    }

    console.log("Using API Key:", apiKey.substring(0, 5) + "...");

    try {
        console.log("Fetching available models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ First 5 Available Models:");
            const modelNames = data.models.map(m => m.name.replace('models/', ''));

            modelNames.slice(0, 5).forEach(name => console.log(`- ${name}`));
        } else {
            console.error("❌ Failed to list models:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
