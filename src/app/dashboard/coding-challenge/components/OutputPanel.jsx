
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function OutputPanel({ output, error, isLoading }) {
    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white font-mono text-sm rounded-md overflow-hidden border">
            <div className="px-4 py-2 bg-[#2d2d2d] border-b border-[#404040] font-medium text-gray-300 flex items-center justify-between">
                <span>Console Output</span>
                {isLoading && <span className="text-xs text-yellow-400 animate-pulse">Running...</span>}
            </div>
            <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                    <div className="text-gray-500 italic">Executing code...</div>
                ) : error ? (
                    <div className="text-red-400 whitespace-pre-wrap">{error}</div>
                ) : output ? (
                    <div className="whitespace-pre-wrap">{output}</div>
                ) : (
                    <div className="text-gray-500 italic">Run your code to see output here.</div>
                )}
            </ScrollArea>
        </div>
    );
}
