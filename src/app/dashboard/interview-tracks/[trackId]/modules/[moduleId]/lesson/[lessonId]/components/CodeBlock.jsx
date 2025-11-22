"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodeBlock({ language, value }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                <span className="text-xs font-medium text-gray-400 uppercase">{language || "text"}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white hover:bg-[#404040]"
                    onClick={handleCopy}
                    title="Copy code"
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
            </div>
            <div className="text-sm [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-4">
                <SyntaxHighlighter
                    language={language || "text"}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    customStyle={{ margin: 0, padding: 0, background: "transparent" }}
                    wrapLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
