"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Code, Database, PenTool, Settings } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { getUserEnrollments } from '@/lib/firestore_modules/enrollments';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PracticeSection = () => {
    const { user } = useAuth();
    const [recommendedModules, setRecommendedModules] = useState([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!user) return;
            try {
                const enrollments = await getUserEnrollments(user.uid);
                if (enrollments.length > 0) {
                    const modules = [];
                    // Check all enrollments
                    for (const enrollment of enrollments) {
                        const trackDoc = await getDoc(doc(db, 'tracks', enrollment.trackId));
                        if (trackDoc.exists()) {
                            const trackTitle = trackDoc.data().title;
                            // Map track title to module title
                            if (trackTitle.includes('Frontend')) modules.push('Technical - Frontend');
                            else if (trackTitle.includes('Backend')) modules.push('Technical - Backend');
                            else if (trackTitle.includes('UI/UX')) modules.push('Technical - UI/UX');
                        }
                    }
                    setRecommendedModules(modules);
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        };
        fetchEnrollments();
    }, [user]);

    const modules = [
        {
            title: "Behavioral",
            description: "Soft skills, culture fit, and intro questions.",
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            title: "Technical - Frontend",
            description: "React, DOM, CSS, and JavaScript fundamentals.",
            icon: Code,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Technical - Backend",
            description: "SQL, API Design, Node.js, and System Arch.",
            icon: Database,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Technical - UI/UX",
            description: "Design principles, user research, and prototyping.",
            icon: PenTool,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10"
        },
        {
            title: "Customize Interview",
            description: "Tailor the session to your specific needs.",
            icon: Settings,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ];
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4 font-playfair">Choose a Module</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module, index) => (
                    <Card key={index} className="hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
                        <CardHeader>
                            {recommendedModules.includes(module.title) && (
                                <div className="mb-2">
                                    <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${module.bgColor}`}>
                                    <module.icon className={`h-6 w-6 ${module.color}`} />
                                </div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base">
                                {module.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Start Interview</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PracticeSection;
