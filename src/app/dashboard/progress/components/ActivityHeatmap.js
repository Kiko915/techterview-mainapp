import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function ActivityHeatmap({ data }) {
    const renderHeatmap = () => {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const weeks = [];
        let currentDate = new Date(oneYearAgo);

        // Align to Sunday
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());

        while (currentDate <= today) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const count = data[dateStr] || 0;
                let colorClass = "bg-slate-100"; // Default (0)
                if (count >= 1) colorClass = "bg-green-200";
                if (count >= 3) colorClass = "bg-green-400";
                if (count >= 5) colorClass = "bg-green-600";
                if (count >= 8) colorClass = "bg-green-800";

                week.push(
                    <div
                        key={dateStr}
                        className={`w-3 h-3 rounded-sm ${colorClass}`}
                        title={`${dateStr}: ${count} activities`}
                    />
                );
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(<div key={currentDate.toISOString()} className="flex flex-col gap-1">{week}</div>);
        }

        return (
            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks}
            </div>
        );
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    Activity Log
                </CardTitle>
                <CardDescription>Your daily contribution activity over the last year</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2 mb-2 text-xs text-slate-500 justify-end">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                    <span>More</span>
                </div>
                {renderHeatmap()}
            </CardContent>
        </Card>
    );
}
