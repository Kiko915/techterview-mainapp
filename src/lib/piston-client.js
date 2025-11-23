
export const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export const LANGUAGE_VERSIONS = {
    javascript: '18.15.0',
    python: '3.10.0',
};

export async function executeCode(language, code, testHarness) {
    if (!LANGUAGE_VERSIONS[language]) {
        throw new Error(`Unsupported language: ${language}`);
    }

    // Combine user code with test harness
    // For JS, we append the test harness.
    // For Python, we append the test harness.
    // The test harness is responsible for importing/calling the user's code.
    const fullCode = `${code}\n\n${testHarness}`;

    try {
        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: language,
                version: LANGUAGE_VERSIONS[language],
                files: [
                    {
                        content: fullCode,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (data.run) {
            return {
                stdout: data.run.stdout,
                stderr: data.run.stderr,
                output: data.run.output,
                code: data.run.code,
                signal: data.run.signal,
            };
        } else {
            throw new Error('Invalid response from Piston API');
        }
    } catch (error) {
        console.error('Piston execution error:', error);
        throw error;
    }
}
