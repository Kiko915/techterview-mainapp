
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, FileQuestion, Code2 } from "lucide-react";

export default function ChallengeList({ challenges, completedIds = [] }) {

    if (!challenges || challenges.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-background p-4 rounded-full border shadow-sm">
                        <FileQuestion className="h-10 w-10 text-primary" />
                        <Code2 className="h-4 w-4 text-primary/40 absolute bottom-2 right-2" />
                    </div>
                </div>
                <div className="max-w-xs space-y-2">
                    <h3 className="text-lg font-semibold font-playfair">No Challenges Found</h3>
                    <p className="text-sm text-muted-foreground">
                        We couldn't find any challenges matching your criteria. Try adjusting your filters.
                    </p>
                </div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
            case 'hard': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => {
                const isCompleted = completedIds.includes(challenge.id);
                return (
                    <Link key={challenge.id} href={`/dashboard/coding-challenge/${challenge.id}`}>
                        <Card className={`h-full transition-all duration-300 cursor-pointer relative overflow-hidden group hover:shadow-md ${isCompleted
                            ? "border-green-500/50 bg-green-500/5 hover:border-green-500 hover:bg-green-500/10"
                            : "hover:border-primary/50"
                            }`}>
                            {isCompleted && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        SOLVED
                                    </div>
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                                        {challenge.difficulty}
                                    </Badge>
                                    <Badge variant="secondary" className="capitalize">
                                        {challenge.category}
                                    </Badge>
                                </div>
                                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors font-playfair pr-16">
                                    {challenge.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {(() => {
                                        if (!challenge.description) return 'Solve this coding challenge.';
                                        // Remove title lines (#) and empty lines to find the first real paragraph
                                        const lines = challenge.description.split('\n')
                                            .map(line => line.trim())
                                            .filter(line => line && !line.startsWith('#'));
                                        return lines[0] || 'Solve this coding challenge.';
                                    })()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
