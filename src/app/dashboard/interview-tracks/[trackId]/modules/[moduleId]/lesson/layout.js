"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import LessonSidebar from "./[lessonId]/components/LessonSidebar";
import { cn } from "@/lib/utils";
import { getTrackModules, getTrackById } from "../../../../utils";
import { useAuth } from "@/lib/useAuth";
import { getUserEnrollment } from "@/lib/firestore";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";

export default function LessonLayout({ children }) {
    const params = useParams();
    const router = useRouter();
    const { trackId, moduleId, lessonId } = params;
    const { user } = useAuth();
    const { updateEnrollment, getEnrollmentStatus } = useEnrollment();

    const [track, setTrack] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Get enrollment from context
    const { data: contextEnrollment } = getEnrollmentStatus(trackId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch basic data
                const [trackData, modulesData] = await Promise.all([
                    getTrackById(trackId),
                    getTrackModules(trackId)
                ]);

                setTrack(trackData);
                setModules(modulesData);

                // Fetch enrollment if user is logged in and not already in context
                if (user) {
                    // Always fetch fresh data on mount to ensure sync
                    const enrollmentData = await getUserEnrollment(user.uid, trackId);

                    if (!enrollmentData) {
                        toast.error("You must be enrolled to access this lesson.");
                        router.push(`/dashboard/interview-tracks/${trackId}`);
                        return;
                    }

                    updateEnrollment(trackId, true, enrollmentData);
                }

            } catch (error) {
                console.error("Error loading lesson layout data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [trackId, user, updateEnrollment, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!track || !modules.length) return null;

    return (
        <div className="flex h-full bg-background relative">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b bg-background shrink-0">
                    <span className="font-semibold truncate">
                        {modules.find(m => m.id === moduleId)?.lessons.find(l => l.id === lessonId)?.title}
                    </span>
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80">
                            <LessonSidebar
                                track={track}
                                modules={modules}
                                currentModuleId={moduleId}
                                currentLessonId={lessonId}
                                enrollment={contextEnrollment}
                                onNavigate={() => setIsSidebarOpen(false)}
                                isCollapsed={false}
                            />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Desktop Sidebar - Fixed/Scrollable independently */}
            <div
                className={cn(
                    "hidden md:block shrink-0 border-l transition-all duration-300 ease-in-out h-full relative",
                    isCollapsed ? "w-[80px]" : "w-80"
                )}
            >
                <LessonSidebar
                    track={track}
                    modules={modules}
                    currentModuleId={moduleId}
                    currentLessonId={lessonId}
                    enrollment={contextEnrollment}
                    isCollapsed={isCollapsed}
                />

                {/* Collapse Toggle Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -left-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md z-10 hover:bg-accent hidden md:flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
