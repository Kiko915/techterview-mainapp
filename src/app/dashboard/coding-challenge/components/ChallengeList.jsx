
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export default function ChallengeList({ challenges, completedIds = [] }) {
    if (!challenges || challenges.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No challenges found for this category.</div>;
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
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group">
                            {isCompleted && (
                                <div className="absolute top-2 right-2 text-green-500">
                                    <CheckCircle2 className="h-5 w-5" />
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
                                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors font-playfair">
                                    {challenge.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {challenge.description ? challenge.description.split('\n')[2] : 'Solve this coding challenge.'}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
