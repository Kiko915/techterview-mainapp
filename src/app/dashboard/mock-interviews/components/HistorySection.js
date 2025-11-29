"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { getUserInterviews } from '@/lib/firestore_modules/interviews';

const HistorySection = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const data = await getUserInterviews(user.uid);
                setInterviews(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const getScoreColor = (score) => {
        if (!score) return "bg-slate-500";
        if (score >= 80) return "bg-green-500 hover:bg-green-600";
        if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
        return "bg-red-500 hover:bg-red-600";
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-playfair">Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-playfair">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground border-b">
                            <tr>
                                <th className="py-3 font-medium">Date</th>
                                <th className="py-3 font-medium">Topic</th>
                                <th className="py-3 font-medium">Duration</th>
                                <th className="py-3 font-medium">Score</th>
                                <th className="py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {interviews.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-muted-foreground">
                                        No interview sessions found. Start practicing!
                                    </td>
                                </tr>
                            ) : (
                                interviews.map((session) => (
                                    <tr key={session.id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="py-3">{formatDate(session.createdAt)}</td>
                                        <td className="py-3 font-medium">{session.targetRole || "General"}</td>
                                        <td className="py-3 text-muted-foreground">{formatDuration(session.duration)}</td>
                                        <td className="py-3">
                                            <Badge className={`${getScoreColor(session.feedback?.score)} text-white border-0`}>
                                                {session.feedback?.score ? `${session.feedback.score}%` : 'N/A'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => router.push(`/dashboard/interview/${session.id}/feedback`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Feedback
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default HistorySection;
