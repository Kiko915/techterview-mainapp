
"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function ChallengeEditor({ code, language, onChange, readOnly = false }) {
    const { theme } = useTheme();

    return (
        <div className="h-full w-full overflow-hidden rounded-md border bg-background">
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={onChange}
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    readOnly: readOnly,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
