import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function PerformanceChart({ data }) {
    return (
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your interview scores over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
