import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function TopicRadarChart({ data }) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Topic Mastery</CardTitle>
                <CardDescription>Average score by topic</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.5}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
