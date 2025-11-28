"use client";

import AuthGuard from '@/components/AuthGuard';

export default function InterviewRoomLayout({ children }) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </AuthGuard>
    );
}
