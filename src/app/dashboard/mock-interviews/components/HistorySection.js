import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const HistorySection = () => {
    const history = [
        {
            date: "Nov 24, 2025",
            topic: "Behavioral",
            duration: "15m 30s",
            score: 85,
        },
        {
            date: "Nov 22, 2025",
            topic: "Technical - Frontend",
            duration: "20m 10s",
            score: 72,
        },
        {
            date: "Nov 20, 2025",
            topic: "Technical - Backend",
            duration: "18m 45s",
            score: 92,
        },
        {
            date: "Nov 18, 2025",
            topic: "Behavioral",
            duration: "12m 00s",
            score: 45,
        }
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return "bg-green-500 hover:bg-green-600";
        if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
        return "bg-red-500 hover:bg-red-600";
    };

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
                            {history.map((session, index) => (
                                <tr key={index} className="group hover:bg-muted/50 transition-colors">
                                    <td className="py-3">{session.date}</td>
                                    <td className="py-3 font-medium">{session.topic}</td>
                                    <td className="py-3 text-muted-foreground">{session.duration}</td>
                                    <td className="py-3">
                                        <Badge className={`${getScoreColor(session.score)} text-white border-0`}>
                                            {session.score}%
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-right">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Eye className="w-4 h-4" />
                                            View Feedback
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default HistorySection;
