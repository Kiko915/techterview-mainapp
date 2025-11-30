import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Flame, Target, Activity } from 'lucide-react';

export default function OverviewCards({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 font-medium">Total XP</p>
                        <h3 className="text-3xl font-bold mt-1">{stats?.totalXP || 0}</h3>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-none shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-orange-100 font-medium">Current Streak</p>
                        <h3 className="text-3xl font-bold mt-1">{stats?.streak || 0} Days</h3>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium">Interviews</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.interviewsCompleted || 0}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Target className="w-6 h-6 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium">Challenges</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.challengesCompleted || 0}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                        <Activity className="w-6 h-6 text-green-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
