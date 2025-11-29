"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings, Sparkles } from 'lucide-react';

export default function CustomizeInterviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        targetRole: '',
        experienceLevel: 'Junior',
        focusAreas: '',
        questionType: 'Mixed'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const context = {
            targetRole: `${formData.targetRole} (${formData.experienceLevel})`,
            focusAreas: formData.focusAreas,
            questionType: formData.questionType,
            isCustom: true,
            resumeName: null // Will be uploaded in lobby if needed, or we can skip it for custom
        };

        localStorage.setItem('interviewContext', JSON.stringify(context));
        router.push('/dashboard/interview-lobby');
    };

    return (
        <div className="min-h-screen p-6 lg:p-12">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <Button
                        variant="ghost"
                        className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
                        onClick={() => router.push('/dashboard/mock-interviews')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900 font-playfair flex items-center gap-3">
                        <Settings className="w-8 h-8 text-blue-600" />
                        Customize Your Interview
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Tailor the AI interviewer to match your specific goals and target role.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Interview Configuration</CardTitle>
                            <CardDescription>
                                Define the parameters for your mock interview session.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="targetRole">Target Role / Topic</Label>
                                <Input
                                    id="targetRole"
                                    placeholder="e.g. Python Developer, Product Manager, System Design"
                                    value={formData.targetRole}
                                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experienceLevel">Experience Level</Label>
                                <Select
                                    value={formData.experienceLevel}
                                    onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Intern">Intern</SelectItem>
                                        <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                                        <SelectItem value="Mid-Level">Mid-Level (3-5 years)</SelectItem>
                                        <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                                        <SelectItem value="Lead">Lead / Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="questionType">Question Type</Label>
                                <Select
                                    value={formData.questionType}
                                    onValueChange={(value) => setFormData({ ...formData, questionType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technical">Technical Only</SelectItem>
                                        <SelectItem value="Behavioral">Behavioral Only</SelectItem>
                                        <SelectItem value="Mixed">Mixed (Technical & Behavioral)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="focusAreas">Specific Focus Areas (Optional)</Label>
                                <Textarea
                                    id="focusAreas"
                                    placeholder="e.g. Focus on React Hooks, Database Indexing, or Conflict Resolution. Leave empty for general questions."
                                    value={formData.focusAreas}
                                    onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                                {loading ? (
                                    <>Configuring AI...</>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Start Customized Interview
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
