import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Trophy, Clock, Zap } from 'lucide-react';

const StatsSection = () => {
    const stats = [
        {
            title: "Total Sessions",
            value: "12",
            icon: Video,
            description: "Lifetime sessions",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Avg Score",
            value: "85%",
            icon: Trophy,
            description: "Across all modules",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10"
        },
        {
            title: "Time Spoken",
            value: "4h 20m",
            icon: Clock,
            description: "Total practice time",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Current Streak",
            value: "3 Days",
            icon: Zap,
            description: "Keep it up!",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsSection;
