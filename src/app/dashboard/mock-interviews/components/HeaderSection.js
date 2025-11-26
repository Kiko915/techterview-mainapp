import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const HeaderSection = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-playfair">Mock Interviews</h1>
                <p className="text-muted-foreground mt-1">
                    Master your communication skills with AI-powered practice.
                </p>
            </div>
            <Button size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Start New Session
            </Button>
        </div>
    );
};

export default HeaderSection;
